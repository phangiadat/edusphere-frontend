import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  Check, 
  Plus,
  FileCheck
} from 'lucide-react';
import { LessonItem } from './LessonItem';
import type { LessonModel } from './LessonItem';
import { AssignmentItem } from './AssignmentItem';
import type { AssignmentModel } from './AssignmentItem';
import styles from './ChapterItem.module.css';

export interface ChapterModel {
  id: string;
  title: string;
  order: number;
  isPublished: boolean;
  lessons: LessonModel[];
  assignments: AssignmentModel[];
}

interface ChapterItemProps {
  chapter: ChapterModel;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: Partial<ChapterModel>) => void;
  onDelete: (chapterId: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;

  // Handlers for Lesson CRUD
  onOpenAddLesson: (chapterId: string) => void;
  onOpenEditLesson: (chapterId: string, lesson: LessonModel) => void;
  onUpdateLesson: (chapterId: string, lessonId: string, updated: Partial<LessonModel>) => void;
  onDeleteLesson: (chapterId: string, lessonId: string) => void;
  onMoveLessonUp: (chapterId: string, lessonIndex: number) => void;
  onMoveLessonDown: (chapterId: string, lessonIndex: number) => void;

  // Handlers for Assignment CRUD
  onOpenAddAssignment: (chapterId: string) => void;
  onOpenEditAssignment: (chapterId: string, assignment: AssignmentModel) => void;
  onDeleteAssignment: (chapterId: string, assignmentId: string) => void;
  onMoveAssignmentUp: (chapterId: string, assignmentIndex: number) => void;
  onMoveAssignmentDown: (chapterId: string, assignmentIndex: number) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  index,
  isFirst,
  isLast,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onOpenAddLesson,
  onOpenEditLesson,
  onUpdateLesson,
  onDeleteLesson,
  onMoveLessonUp,
  onMoveLessonDown,
  onOpenAddAssignment,
  onOpenEditAssignment,
  onDeleteAssignment,
  onMoveAssignmentUp,
  onMoveAssignmentDown,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(chapter.title);

  const handleSaveInlineTitle = () => {
    if (titleInput.trim()) {
      onUpdate({ title: titleInput.trim() });
    }
    setIsEditing(false);
  };

  const totalItemsCount = (chapter.lessons?.length || 0) + (chapter.assignments?.length || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={styles.accordionWrapper}
    >
      {/* Header Row */}
      <div className={styles.accordionHeader}>
        {/* Left Group */}
        <div className={styles.leftGroup}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`${styles.expandBtn} ${
              isExpanded ? styles.expandBtnRotated : ''
            }`}
            title={isExpanded ? 'Đóng chương này' : 'Mở rộng chương này'}
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <GripVertical className={styles.gripIcon} />
          <span className={styles.orderBadge}>Chương {index + 1}</span>

          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveInlineTitle()}
                className={styles.inlineInput}
                autoFocus
              />
              <button onClick={handleSaveInlineTitle} className={styles.saveInlineBtn}>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Lưu</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className={styles.chapterTitle} title={chapter.title}>
                {chapter.title}
              </span>
              <span className="text-xs text-slate-400 font-semibold flex-shrink-0">
                ({chapter.lessons?.length || 0} bài học • {chapter.assignments?.length || 0} bài tập)
              </span>
            </div>
          )}
        </div>

        {/* Right Group: Action Controls */}
        <div className={styles.rightGroup}>
          {/* Switch Toggle for isPublished */}
          <label
            onClick={() => onUpdate({ isPublished: !chapter.isPublished })}
            className={styles.toggleLabel}
            title={chapter.isPublished ? 'Chương đang công khai' : 'Chương đang ẩn'}
          >
            <div
              className={`${styles.toggleSwitch} ${
                chapter.isPublished ? styles.toggleSwitchActive : ''
              }`}
            >
              <div
                className={`${styles.toggleDot} ${
                  chapter.isPublished ? styles.toggleDotActive : ''
                }`}
              />
            </div>
            <span className="hidden sm:inline">
              {chapter.isPublished ? 'Công khai' : 'Ẩn'}
            </span>
          </label>

          {/* Move Up Arrow */}
          <button
            disabled={isFirst}
            onClick={() => onMoveUp(index)}
            className={styles.actionBtn}
            title="Di chuyển chương lên trên"
          >
            <ChevronUp className="w-4 h-4" />
          </button>

          {/* Move Down Arrow */}
          <button
            disabled={isLast}
            onClick={() => onMoveDown(index)}
            className={styles.actionBtn}
            title="Di chuyển chương xuống dưới"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Edit Title Button */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={styles.actionBtn}
            title="Sửa tên chương"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Chapter Button */}
          <button
            onClick={() => onDelete(chapter.id)}
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            title="Xóa chương này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accordion Body (Animated Height) */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
            className={styles.accordionBody}
          >
            {/* Render Lessons */}
            {chapter.lessons && chapter.lessons.length > 0 && (
              chapter.lessons.map((lesson, lessonIdx) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  index={lessonIdx}
                  isFirst={lessonIdx === 0}
                  isLast={lessonIdx === chapter.lessons.length - 1}
                  onUpdate={(updated) => onUpdateLesson(chapter.id, lesson.id, updated)}
                  onEdit={() => onOpenEditLesson(chapter.id, lesson)}
                  onDelete={() => onDeleteLesson(chapter.id, lesson.id)}
                  onMoveUp={() => onMoveLessonUp(chapter.id, lessonIdx)}
                  onMoveDown={() => onMoveLessonDown(chapter.id, lessonIdx)}
                />
              ))
            )}

            {/* Render Assignments */}
            {chapter.assignments && chapter.assignments.length > 0 && (
              chapter.assignments.map((assignment, assignIdx) => (
                <AssignmentItem
                  key={assignment.id}
                  assignment={assignment}
                  index={assignIdx}
                  isFirst={assignIdx === 0}
                  isLast={assignIdx === chapter.assignments.length - 1}
                  onEdit={() => onOpenEditAssignment(chapter.id, assignment)}
                  onDelete={() => onDeleteAssignment(chapter.id, assignment.id)}
                  onMoveUp={() => onMoveAssignmentUp(chapter.id, assignIdx)}
                  onMoveDown={() => onMoveAssignmentDown(chapter.id, assignIdx)}
                />
              ))
            )}

            {totalItemsCount === 0 && (
              <div className={styles.emptyLessons}>
                Chưa có bài học hoặc bài tập nào trong Chương này. Hãy bấm các nút bên dưới để thêm nội dung!
              </div>
            )}

            {/* Action Buttons Row: + Thêm Bài học & + Thêm Bài tập */}
            <div className={styles.actionButtonsRow}>
              <button
                onClick={() => onOpenAddLesson(chapter.id)}
                className={styles.addLessonBtn}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Bài học</span>
              </button>

              <button
                onClick={() => onOpenAddAssignment(chapter.id)}
                className={styles.addAssignmentBtn}
              >
                <FileCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Thêm Bài tập</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
