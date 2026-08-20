import React from 'react';
import { FileCheck, ChevronUp, ChevronDown, Edit3, Trash2, Calendar } from 'lucide-react';
import styles from './AssignmentItem.module.css';

export interface AssignmentModel {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string or format string
  order?: number;
}

interface AssignmentItemProps {
  assignment: AssignmentModel;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export const AssignmentItem: React.FC<AssignmentItemProps> = ({
  assignment,
  index,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}) => {
  // Format Date string for display
  const formatDueDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  const formattedDate = formatDueDate(assignment.dueDate);

  return (
    <div className={styles.itemRow}>
      {/* Left: Icon + Title + DueDate Badge */}
      <div className={styles.leftGroup}>
        <div className={styles.iconBox}>
          <FileCheck className="w-3.5 h-3.5" />
        </div>

        <span className={styles.assignmentTitle} title={assignment.title}>
          [Bài tập {index + 1}] {assignment.title}
        </span>

        {formattedDate && (
          <span className={styles.dueDateBadge}>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Hạn nộp: {formattedDate}</span>
            </span>
          </span>
        )}
      </div>

      {/* Right: Reorder Arrows + Edit + Delete */}
      <div className={styles.rightGroup}>
        {/* Move Up */}
        <button
          disabled={isFirst}
          onClick={onMoveUp}
          className={styles.actionBtn}
          title="Di chuyển bài tập lên trên"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Move Down */}
        <button
          disabled={isLast}
          onClick={onMoveDown}
          className={styles.actionBtn}
          title="Di chuyển bài tập xuống dưới"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Edit Button */}
        <button onClick={onEdit} className={styles.actionBtn} title="Chỉnh sửa bài tập">
          <Edit3 className="w-3.5 h-3.5" />
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          className={`${styles.actionBtn} ${styles.deleteBtn}`}
          title="Xóa bài tập"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
