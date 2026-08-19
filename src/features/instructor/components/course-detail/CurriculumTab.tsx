import React, { useState } from 'react';
import { Plus, Layers } from 'lucide-react';
import { ChapterItem } from './ChapterItem';
import type { ChapterModel } from './ChapterItem';
import styles from './CurriculumTab.module.css';

interface CurriculumTabProps {
  courseId: string;
  chapters: ChapterModel[];
  onUpdateChapters: (updatedChapters: ChapterModel[]) => void;
  onShowToast: (msg: string) => void;
}

export const CurriculumTab: React.FC<CurriculumTabProps> = ({
  chapters,
  onUpdateChapters,
  onShowToast,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    const newChapter: ChapterModel = {
      id: `ch-${Date.now()}`,
      title: newChapterTitle.trim(),
      order: chapters.length + 1,
      isPublished: true,
      lessonCount: 0,
    };

    onUpdateChapters([...chapters, newChapter]);
    setNewChapterTitle('');
    setIsAdding(false);
    onShowToast(`🎉 Đã thêm mới "${newChapter.title}" thành công!`);
  };

  const handleUpdateChapter = (chapterId: string, updatedFields: Partial<ChapterModel>) => {
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
    if (window.confirm('Bạn có chắc chắn muốn xóa Chương này không?')) {
      const filtered = chapters
        .filter((ch) => ch.id !== chapterId)
        .map((ch, idx) => ({ ...ch, order: idx + 1 }));
      onUpdateChapters(filtered);
      onShowToast('🗑️ Đã xóa Chương khỏi danh sách.');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newChapters = [...chapters];
    const temp = newChapters[index - 1];
    newChapters[index - 1] = newChapters[index];
    newChapters[index] = temp;

    // Recalculate order values
    const reordered = newChapters.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    onUpdateChapters(reordered);
    onShowToast('⬆️ Đã di chuyển Chương lên trên.');
  };

  const handleMoveDown = (index: number) => {
    if (index === chapters.length - 1) return;
    const newChapters = [...chapters];
    const temp = newChapters[index + 1];
    newChapters[index + 1] = newChapters[index];
    newChapters[index] = temp;

    // Recalculate order values
    const reordered = newChapters.map((ch, idx) => ({ ...ch, order: idx + 1 }));
    onUpdateChapters(reordered);
    onShowToast('⬇️ Đã di chuyển Chương xuống dưới.');
  };

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.titleBox}>
          <h2 className={styles.title}>Chương trình đào tạo (Curriculum)</h2>
          <p className={styles.subtitle}>
            Quản lý và sắp xếp cấu trúc các Chương trong khóa học.
          </p>
        </div>

        <button onClick={() => setIsAdding(true)} className={styles.addChapterBtn}>
          <Plus className="w-4 h-4" />
          <span>Thêm Chương mới</span>
        </button>
      </div>

      {/* Add New Chapter Inline Card */}
      {isAdding && (
        <form onSubmit={handleAddChapter} className={styles.addCard}>
          <div className={styles.addLabel}>Tên Chương mới *</div>
          <div className={styles.addInputRow}>
            <input
              type="text"
              required
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              placeholder="VD: Chương 3: Quản lý Authentication & JWT Access Token"
              className={styles.addInput}
              autoFocus
            />
            <button type="submit" className={styles.confirmAddBtn}>
              Tạo Chương
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className={styles.cancelAddBtn}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Chapter Accordion Headers List */}
      {chapters.length > 0 ? (
        <div className={styles.chapterList}>
          {chapters.map((chapter, idx) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              index={idx}
              isFirst={idx === 0}
              isLast={idx === chapters.length - 1}
              onUpdate={(updated) => handleUpdateChapter(chapter.id, updated)}
              onDelete={handleDeleteChapter}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          ))}
        </div>
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
    </div>
  );
};
