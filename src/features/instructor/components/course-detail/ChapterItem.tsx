import React, { useState } from 'react';
import { 
  GripVertical, 
  ChevronUp, 
  ChevronDown, 
  Edit3, 
  Trash2, 
  Check 
} from 'lucide-react';
import styles from './ChapterItem.module.css';

export interface ChapterModel {
  id: string;
  title: string;
  order: number;
  isPublished: boolean;
  lessonCount?: number;
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
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(chapter.title);

  const handleSaveInlineTitle = () => {
    if (titleInput.trim()) {
      onUpdate({ title: titleInput.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div className={styles.itemRow}>
      {/* Left: Drag Icon + Order Badge + Title */}
      <div className={styles.leftGroup}>
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
          <span className={styles.chapterTitle} title={chapter.title}>
            {chapter.title}
          </span>
        )}
      </div>

      {/* Right: Switch Toggle + Order Arrows + Edit + Delete */}
      <div className={styles.rightGroup}>
        {/* Switch Toggle for isPublished */}
        <label
          onClick={() => onUpdate({ isPublished: !chapter.isPublished })}
          className={styles.toggleLabel}
          title={chapter.isPublished ? 'Đã công khai' : 'Đang ẩn'}
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
          title="Di chuyển lên trên"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* Move Down Arrow */}
        <button
          disabled={isLast}
          onClick={() => onMoveDown(index)}
          className={styles.actionBtn}
          title="Di chuyển xuống dưới"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        {/* Edit Button */}
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={styles.actionBtn}
          title="Sửa tên chương"
        >
          <Edit3 className="w-4 h-4" />
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(chapter.id)}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          title="Xóa chương này"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
