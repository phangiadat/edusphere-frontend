import React from 'react';
import { Video, FileText, ChevronUp, ChevronDown, Edit3, Trash2 } from 'lucide-react';
import styles from './LessonItem.module.css';

export interface LessonModel {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration?: number; // in minutes
  order: number;
  isPublished: boolean;
  isFreePreview: boolean;
}

interface LessonItemProps {
  lesson: LessonModel;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (updated: Partial<LessonModel>) => void;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const LessonItem: React.FC<LessonItemProps> = ({
  lesson,
  index,
  isFirst,
  isLast,
  onUpdate,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  return (
    <div className={styles.itemRow}>
      {/* Left: Icon + Title + Duration + Free Preview Badge */}
      <div className={styles.leftGroup}>
        <div className={styles.iconBox}>
          {lesson.videoUrl ? (
            <Video className="w-3.5 h-3.5" />
          ) : (
            <FileText className="w-3.5 h-3.5" />
          )}
        </div>

        <span className={styles.lessonTitle} title={lesson.title}>
          {index + 1}. {lesson.title}
        </span>

        {lesson.duration !== undefined && lesson.duration > 0 && (
          <span className={styles.durationBadge}>({lesson.duration} phút)</span>
        )}

        {lesson.isFreePreview && (
          <span className={styles.freePreviewBadge}>Free Preview</span>
        )}
      </div>

      {/* Right: Switch Toggle + Reorder Arrows + Edit + Delete */}
      <div className={styles.rightGroup}>
        {/* Switch Toggle for isPublished */}
        <label
          onClick={() => onUpdate({ isPublished: !lesson.isPublished })}
          className={styles.toggleLabel}
          title={lesson.isPublished ? 'Bài học đang công khai' : 'Bài học đang ẩn'}
        >
          <div
            className={`${styles.toggleSwitch} ${
              lesson.isPublished ? styles.toggleSwitchActive : ''
            }`}
          >
            <div
              className={`${styles.toggleDot} ${
                lesson.isPublished ? styles.toggleDotActive : ''
              }`}
            />
          </div>
          <span className="hidden md:inline">
            {lesson.isPublished ? 'Công khai' : 'Ẩn'}
          </span>
        </label>

        {/* Move Up */}
        <button
          disabled={isFirst}
          onClick={onMoveUp}
          className={styles.actionBtn}
          title="Di chuyển bài học lên trên"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Move Down */}
        <button
          disabled={isLast}
          onClick={onMoveDown}
          className={styles.actionBtn}
          title="Di chuyển bài học xuống dưới"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Edit Button */}
        <button onClick={onEdit} className={styles.actionBtn} title="Chỉnh sửa bài học">
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button onClick={onDelete} className={`${styles.actionBtn} ${styles.deleteBtn}`} title="Xóa bài học">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
