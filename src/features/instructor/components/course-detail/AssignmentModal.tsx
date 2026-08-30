import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileCheck, Save } from 'lucide-react';
import type { AssignmentModel } from './AssignmentItem';
import { RichTextEditor } from '../../../../components/common/RichTextEditor/RichTextEditor';
import styles from './AssignmentModal.module.css';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignmentData: Partial<AssignmentModel>) => void;
  initialData?: AssignmentModel | null;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      // Format ISO string to datetime-local input string format (YYYY-MM-DDTHH:mm)
      if (initialData.dueDate) {
        try {
          const d = new Date(initialData.dueDate);
          if (!isNaN(d.getTime())) {
            const formatted = d.toISOString().slice(0, 16);
            setDueDate(formatted);
          } else {
            setDueDate(initialData.dueDate);
          }
        } catch {
          setDueDate(initialData.dueDate);
        }
      } else {
        setDueDate('');
      }
      setDescription(initialData.description || '');
    } else {
      // Default reset for creating new assignment
      setTitle('');
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      setDueDate(defaultDate.toISOString().slice(0, 16));
      setDescription('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      dueDate,
      description,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={styles.overlay}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
        {/* Header */}
        <div className={styles.header}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className={styles.title}>
              {initialData ? 'Chỉnh sửa Bài tập' : 'Tạo Bài tập Mới'}
            </h2>
          </div>

          <button onClick={onClose} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form id="assignment-form" onSubmit={handleSubmit} className={styles.body}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tiêu đề Bài tập *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Bài tập 1: Xây dựng Module Authentication chuẩn NestJS..."
              className={styles.input}
            />
          </div>

          {/* Due Date */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Hạn nộp bài (Hạn chót - Due Date)</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={styles.input}
            />
          </div>

          {/* Description TinyMCE RichTextEditor */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung & Yêu cầu Đề bài (Rich Text Editor)</label>
            <RichTextEditor
              value={description}
              onChange={(val: string) => setDescription(val)}
              placeholder="Soạn thảo yêu cầu chi tiết bài tập, tiêu chí chấm điểm, mã nguồn mẫu..."
              height={260}
            />
          </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Hủy bỏ
          </button>
          <button type="submit" form="assignment-form" className={styles.submitBtn}>
            <span className="flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Lưu thay đổi' : 'Tạo bài tập'}</span>
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
