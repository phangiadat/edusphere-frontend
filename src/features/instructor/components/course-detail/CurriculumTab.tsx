import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Layers } from 'lucide-react';
import { ChapterItem } from './ChapterItem';
import type { ChapterModel } from './ChapterItem';
import { LessonModal } from './LessonModal';
import type { LessonModel } from './LessonItem';
import { AssignmentModal } from './AssignmentModal';
import type { AssignmentModel } from './AssignmentItem';
import { ConfirmModal } from '../../../../components/common/confirm-modal/ConfirmModal';
import { chapterService } from '../../../../services/api/chapterService';
import { lessonService } from '../../../../services/api/lessonService';
import { assignmentService } from '../../../../services/api/assignmentService';
import styles from './CurriculumTab.module.css';

interface CurriculumTabProps {
  courseId: string;
  chapters: ChapterModel[];
  onUpdateChapters: (updatedChapters: ChapterModel[]) => void;
  onShowToast: (msg: string) => void;
}

const listContainerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const CurriculumTab: React.FC<CurriculumTabProps> = ({
  courseId,
  chapters,
  onUpdateChapters,
  onShowToast,
}) => {
  // Inline Add Chapter state
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  // Single LessonModal state
  const [activeLessonModal, setActiveLessonModal] = useState<{
    chapterId: string;
    lesson: LessonModel | null;
  } | null>(null);

  // Single AssignmentModal state
  const [activeAssignmentModal, setActiveAssignmentModal] = useState<{
    chapterId: string;
    assignment: AssignmentModel | null;
  } | null>(null);

  // Confirm Modal Delete Target State
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<{
    type: 'CHAPTER' | 'LESSON' | 'ASSIGNMENT';
    chapterId: string;
    itemId?: string;
    title?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ==========================================
  // CHAPTER HANDLERS
  // ==========================================
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    let createdId = `ch-${Date.now()}`;
    try {
      const created = await chapterService.createChapter({
        title: newChapterTitle.trim(),
        order: chapters.length + 1,
        courseId,
      });
      if (created?.id) createdId = created.id;
    } catch (err) {
      console.warn('API createChapter fallback to local state:', err);
    }

    const newChapter: ChapterModel = {
      id: createdId,
      title: newChapterTitle.trim(),
      order: chapters.length + 1,
      isPublished: true,
      lessons: [],
      assignments: [],
    };

    onUpdateChapters([...chapters, newChapter]);
    setNewChapterTitle('');
    setIsAddingChapter(false);
    onShowToast(`🎉 Đã thêm mới "${newChapter.title}" thành công!`);
  };

  const handleUpdateChapter = async (chapterId: string, updatedFields: Partial<ChapterModel>) => {
    try {
      await chapterService.updateChapter(chapterId, {
        title: updatedFields.title,
        order: updatedFields.order,
        isPublished: updatedFields.isPublished,
      });
    } catch (err) {
      console.warn('API updateChapter fallback to local state:', err);
    }

    const updated = chapters.map((ch) =>
      ch.id === chapterId ? { ...ch, ...updatedFields } : ch
    );
    onUpdateChapters(updated);
    if (updatedFields.isPublished !== undefined) {
      onShowToast(
        updatedFields.isPublished
          ? '✅ Đã công khai Chương học.'
          : '🔒 Đã chuyển Chương học sang dạng Ẩn.'
      );
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    setConfirmDeleteTarget({ type: 'CHAPTER', chapterId, title: 'Chương học' });
  };

  const handleMoveChapterUp = (index: number) => {
    if (index === 0) return;
    const newChapters = [...chapters];
    const temp = newChapters[index - 1];
    newChapters[index - 1] = newChapters[index];
    newChapters[index] = temp;

    const reordered = newChapters.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    onUpdateChapters(reordered);
    onShowToast('⬆️ Đã di chuyển Chương lên trên.');
  };

  const handleMoveChapterDown = (index: number) => {
    if (index === chapters.length - 1) return;
    const newChapters = [...chapters];
    const temp = newChapters[index + 1];
    newChapters[index + 1] = newChapters[index];
    newChapters[index] = temp;

    const reordered = newChapters.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    onUpdateChapters(reordered);
    onShowToast('⬇️ Đã di chuyển Chương xuống dưới.');
  };

  // ==========================================
  // LESSON HANDLERS (Lifted State Up)
  // ==========================================
  const handleOpenAddLesson = (chapterId: string) => {
    setActiveLessonModal({ chapterId, lesson: null });
  };

  const handleOpenEditLesson = (chapterId: string, lesson: LessonModel) => {
    setActiveLessonModal({ chapterId, lesson });
  };

  const handleSaveLesson = async (lessonData: Partial<LessonModel>) => {
    if (!activeLessonModal) return;

    const { chapterId } = activeLessonModal;
    const isEdit = !!lessonData.id;
    let savedLessonId = lessonData.id || `l-${Date.now()}`;

    try {
      if (isEdit && lessonData.id) {
        await lessonService.updateLesson(lessonData.id, {
          title: lessonData.title,
          content: lessonData.content,
          videoUrl: lessonData.videoUrl,
          duration: lessonData.duration,
          isPublished: lessonData.isPublished,
          isFreePreview: lessonData.isFreePreview,
        });
      } else {
        const created = await lessonService.createLesson({
          title: lessonData.title || 'Bài học mới',
          content: lessonData.content || '',
          videoUrl: lessonData.videoUrl || '',
          duration: lessonData.duration || 10,
          isPublished: lessonData.isPublished ?? true,
          isFreePreview: lessonData.isFreePreview ?? false,
          chapterId,
        });
        if (created?.id) savedLessonId = created.id;
      }
    } catch (err) {
      console.warn('API lesson save fallback to local state:', err);
    }

    const updatedChapters = chapters.map((chapter) => {
      if (chapter.id !== chapterId) return chapter;

      const currentLessons = chapter.lessons || [];

      if (isEdit) {
        const updatedLessons = currentLessons.map((l) =>
          l.id === lessonData.id ? ({ ...l, ...lessonData } as LessonModel) : l
        );
        return { ...chapter, lessons: updatedLessons };
      } else {
        const newLesson: LessonModel = {
          id: savedLessonId,
          title: lessonData.title || 'Bài học mới',
          content: lessonData.content || '',
          videoUrl: lessonData.videoUrl || '',
          duration: lessonData.duration || 10,
          order: currentLessons.length + 1,
          isPublished: lessonData.isPublished ?? true,
          isFreePreview: lessonData.isFreePreview ?? false,
        };
        return { ...chapter, lessons: [...currentLessons, newLesson] };
      }
    });

    onUpdateChapters(updatedChapters);
    setActiveLessonModal(null);
    onShowToast(
      isEdit
        ? '✨ Đã cập nhật bài học thành công!'
        : '🎉 Đã thêm bài học mới vào Chương thành công!'
    );
  };

  const handleUpdateLessonItem = async (
    chapterId: string,
    lessonId: string,
    updatedFields: Partial<LessonModel>
  ) => {
    try {
      await lessonService.updateLesson(lessonId, {
        title: updatedFields.title,
        content: updatedFields.content,
        videoUrl: updatedFields.videoUrl,
        duration: updatedFields.duration,
        isPublished: updatedFields.isPublished,
        isFreePreview: updatedFields.isFreePreview,
      });
    } catch (err) {
      console.warn('API updateLessonItem fallback to local state:', err);
    }

    const updatedChapters = chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const updatedLessons = ch.lessons.map((l) =>
        l.id === lessonId ? { ...l, ...updatedFields } : l
      );
      return { ...ch, lessons: updatedLessons };
    });

    onUpdateChapters(updatedChapters);
    if (updatedFields.isPublished !== undefined) {
      onShowToast(
        updatedFields.isPublished
          ? '✅ Đã công khai bài học.'
          : '🔒 Đã chuyển bài học sang dạng Ẩn.'
      );
    }
  };

  const handleDeleteLesson = (chapterId: string, lessonId: string) => {
    setConfirmDeleteTarget({ type: 'LESSON', chapterId, itemId: lessonId, title: 'Bài học' });
  };

  const handleMoveLessonUp = (chapterId: string, lessonIndex: number) => {
    if (lessonIndex === 0) return;
    const updatedChapters = chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;

      const newLessons = [...ch.lessons];
      const temp = newLessons[lessonIndex - 1];
      newLessons[lessonIndex - 1] = newLessons[lessonIndex];
      newLessons[lessonIndex] = temp;

      const reordered = newLessons.map((l, idx) => ({ ...l, order: idx + 1 }));
      return { ...ch, lessons: reordered };
    });

    onUpdateChapters(updatedChapters);
    onShowToast('⬆️ Đã di chuyển bài học lên trên.');
  };

  const handleMoveLessonDown = (chapterId: string, lessonIndex: number) => {
    const updatedChapters = chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      if (lessonIndex === ch.lessons.length - 1) return ch;

      const newLessons = [...ch.lessons];
      const temp = newLessons[lessonIndex + 1];
      newLessons[lessonIndex + 1] = newLessons[lessonIndex];
      newLessons[lessonIndex] = temp;

      const reordered = newLessons.map((l, idx) => ({ ...l, order: idx + 1 }));
      return { ...ch, lessons: reordered };
    });

    onUpdateChapters(updatedChapters);
    onShowToast('⬇️ Đã di chuyển bài học xuống dưới.');
  };

  // ==========================================
  // ASSIGNMENT HANDLERS (Lifted State Up)
  // ==========================================
  const handleOpenAddAssignment = (chapterId: string) => {
    setActiveAssignmentModal({ chapterId, assignment: null });
  };

  const handleOpenEditAssignment = (chapterId: string, assignment: AssignmentModel) => {
    setActiveAssignmentModal({ chapterId, assignment });
  };

  const handleSaveAssignment = async (assignmentData: Partial<AssignmentModel>) => {
    if (!activeAssignmentModal) return;

    const { chapterId } = activeAssignmentModal;
    const isEdit = !!assignmentData.id;
    let savedAssignmentId = assignmentData.id || `a-${Date.now()}`;

    try {
      if (!isEdit) {
        const created = await assignmentService.createAssignment({
          title: assignmentData.title || 'Bài tập mới',
          description: assignmentData.description || '',
          dueDate: assignmentData.dueDate || '',
          chapterId,
        });
        if (created?.id) savedAssignmentId = created.id;
      }
    } catch (err) {
      console.warn('API createAssignment fallback to local state:', err);
    }

    const updatedChapters = chapters.map((chapter) => {
      if (chapter.id !== chapterId) return chapter;

      const currentAssignments = chapter.assignments || [];

      if (isEdit) {
        const updatedAssignments = currentAssignments.map((a) =>
          a.id === assignmentData.id ? ({ ...a, ...assignmentData } as AssignmentModel) : a
        );
        return { ...chapter, assignments: updatedAssignments };
      } else {
        const newAssignment: AssignmentModel = {
          id: savedAssignmentId,
          title: assignmentData.title || 'Bài tập mới',
          description: assignmentData.description || '',
          dueDate: assignmentData.dueDate || '',
          order: currentAssignments.length + 1,
        };
        return { ...chapter, assignments: [...currentAssignments, newAssignment] };
      }
    });

    onUpdateChapters(updatedChapters);
    setActiveAssignmentModal(null);
    onShowToast(
      isEdit
        ? '✨ Đã cập nhật bài tập thành công!'
        : '🎉 Đã thêm bài tập mới vào Chương thành công!'
    );
  };

  const handleDeleteAssignment = (chapterId: string, assignmentId: string) => {
    setConfirmDeleteTarget({ type: 'ASSIGNMENT', chapterId, itemId: assignmentId, title: 'Bài tập' });
  };

  const handleConfirmDeleteTarget = async () => {
    if (!confirmDeleteTarget) return;
    const { type, chapterId, itemId } = confirmDeleteTarget;

    setIsDeleting(true);
    try {
      if (type === 'CHAPTER') {
        try {
          await chapterService.deleteChapter(chapterId);
        } catch (err) {
          console.warn('API deleteChapter fallback:', err);
        }
        const filtered = chapters
          .filter((ch) => ch.id !== chapterId)
          .map((ch, idx) => ({ ...ch, order: idx + 1 }));
        onUpdateChapters(filtered);
        onShowToast('🗑️ Đã xóa Chương khỏi danh sách.');
      } else if (type === 'LESSON' && itemId) {
        try {
          await lessonService.deleteLesson(itemId);
        } catch (err) {
          console.warn('API deleteLesson fallback:', err);
        }
        const updatedChapters = chapters.map((ch) => {
          if (ch.id !== chapterId) return ch;
          const filteredLessons = ch.lessons
            .filter((l) => l.id !== itemId)
            .map((l, idx) => ({ ...l, order: idx + 1 }));
          return { ...ch, lessons: filteredLessons };
        });
        onUpdateChapters(updatedChapters);
        onShowToast('🗑️ Đã xóa bài học khỏi Chương.');
      } else if (type === 'ASSIGNMENT' && itemId) {
        const updatedChapters = chapters.map((ch) => {
          if (ch.id !== chapterId) return ch;
          const filteredAssignments = (ch.assignments || [])
            .filter((a) => a.id !== itemId)
            .map((a, idx) => ({ ...a, order: idx + 1 }));
          return { ...ch, assignments: filteredAssignments };
        });
        onUpdateChapters(updatedChapters);
        onShowToast('🗑️ Đã xóa bài tập khỏi Chương.');
      }
    } finally {
      setIsDeleting(false);
      setConfirmDeleteTarget(null);
    }
  };

  const handleMoveAssignmentUp = (chapterId: string, assignmentIndex: number) => {
    if (assignmentIndex === 0) return;
    const updatedChapters = chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;

      const newAssignments = [...(ch.assignments || [])];
      const temp = newAssignments[assignmentIndex - 1];
      newAssignments[assignmentIndex - 1] = newAssignments[assignmentIndex];
      newAssignments[assignmentIndex] = temp;

      const reordered = newAssignments.map((a, idx) => ({ ...a, order: idx + 1 }));
      return { ...ch, assignments: reordered };
    });

    onUpdateChapters(updatedChapters);
    onShowToast('⬆️ Đã di chuyển bài tập lên trên.');
  };

  const handleMoveAssignmentDown = (chapterId: string, assignmentIndex: number) => {
    const updatedChapters = chapters.map((ch) => {
      if (ch.id !== chapterId) return ch;
      const currentAssignments = ch.assignments || [];
      if (assignmentIndex === currentAssignments.length - 1) return ch;

      const newAssignments = [...currentAssignments];
      const temp = newAssignments[assignmentIndex + 1];
      newAssignments[assignmentIndex + 1] = newAssignments[assignmentIndex];
      newAssignments[assignmentIndex] = temp;

      const reordered = newAssignments.map((a, idx) => ({ ...a, order: idx + 1 }));
      return { ...ch, assignments: reordered };
    });

    onUpdateChapters(updatedChapters);
    onShowToast('⬇️ Đã di chuyển bài tập xuống dưới.');
  };

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleBox}>
          <h2 className={styles.title}>Chương trình đào tạo (Curriculum)</h2>
          <p className={styles.subtitle}>
            Quản lý, sắp xếp và biên soạn chi tiết các Chương, Bài học & Bài tập trong khóa học.
          </p>
        </div>

        <button onClick={() => setIsAddingChapter(true)} className={styles.addChapterBtn}>
          <Plus className="w-4 h-4" />
          <span>Thêm Chương mới</span>
        </button>
      </div>

      {/* Add New Chapter Inline Card */}
      {isAddingChapter && (
        <form onSubmit={handleAddChapter} className={styles.addCard}>
          <div className={styles.addLabel}>Tên Chương mới *</div>
          <div className={styles.addInputRow}>
            <input
              type="text"
              required
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="VD: Chương 5: Deploy Production trên AWS EC2 & Docker"
              className={styles.addInput}
              autoFocus
            />
            <button type="submit" className={styles.confirmAddBtn}>
              Tạo Chương
            </button>
            <button
              type="button"
              onClick={() => setIsAddingChapter(false)}
              className={styles.cancelAddBtn}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Chapter Accordion List */}
      {chapters.length > 0 ? (
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          animate="show"
          className={styles.chapterList}
        >
          {chapters.map((chapter, idx) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              index={idx}
              isFirst={idx === 0}
              isLast={idx === chapters.length - 1}
              onUpdate={(updated) => handleUpdateChapter(chapter.id, updated)}
              onDelete={handleDeleteChapter}
              onMoveUp={handleMoveChapterUp}
              onMoveDown={handleMoveChapterDown}
              onOpenAddLesson={handleOpenAddLesson}
              onOpenEditLesson={handleOpenEditLesson}
              onUpdateLesson={handleUpdateLessonItem}
              onDeleteLesson={handleDeleteLesson}
              onMoveLessonUp={handleMoveLessonUp}
              onMoveLessonDown={handleMoveLessonDown}
              onOpenAddAssignment={handleOpenAddAssignment}
              onOpenEditAssignment={handleOpenEditAssignment}
              onDeleteAssignment={handleDeleteAssignment}
              onMoveAssignmentUp={handleMoveAssignmentUp}
              onMoveAssignmentDown={handleMoveAssignmentDown}
            />
          ))}
        </motion.div>
      ) : (
        <div className={styles.emptyState}>
          <Layers className="w-8 h-8 text-purple-500" />
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Chưa có Chương nào trong khóa học này
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Bấm nút "+ Thêm Chương mới" ở góc phải trên để bắt đầu xây dựng nội dung.
            </div>
          </div>
        </div>
      )}

      {/* Single LessonModal instance (Lifted State Up) */}
      <LessonModal
        isOpen={!!activeLessonModal}
        onClose={() => setActiveLessonModal(null)}
        onSave={handleSaveLesson}
        initialData={activeLessonModal?.lesson}
      />

      {/* Single AssignmentModal instance (Lifted State Up) */}
      <AssignmentModal
        isOpen={!!activeAssignmentModal}
        onClose={() => setActiveAssignmentModal(null)}
        onSave={handleSaveAssignment}
        initialData={activeAssignmentModal?.assignment}
      />

      {/* Confirm Delete Chapter / Lesson / Assignment Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteTarget}
        onClose={() => setConfirmDeleteTarget(null)}
        onConfirm={handleConfirmDeleteTarget}
        title={`Xác nhận xóa ${confirmDeleteTarget?.title || 'mục'}`}
        message={`Bạn có chắc chắn muốn xóa ${confirmDeleteTarget?.title?.toLowerCase() || 'mục này'} khỏi chương trình học không? Thao tác này không thể hoàn tác.`}
        confirmText="Xóa ngay"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
