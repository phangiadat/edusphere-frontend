import React, { useState, useEffect } from 'react';
import { X, BookOpen, Save } from 'lucide-react';
import type { CourseItem, CourseStatusType } from './CourseCard';
import styles from './CourseFormModal.module.css';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Partial<CourseItem>) => void;
  initialData?: CourseItem | null;
}

const CATEGORIES_LIST = [
  'Lập trình Web',
  'Thiết kế UI/UX',
  'AI & Machine Learning',
  'Lập trình Mobile',
  'DevOps & Cloud',
  'Data Science & SQL',
  'PostgreSQL Database',
  'Cyber Security',
];

export const CourseFormModal: React.FC<CourseFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [categoryName, setCategoryName] = useState('Lập trình Web');
  const [price, setPrice] = useState<number>(599000);
  const [status, setStatus] = useState<CourseStatusType>('DRAFT');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategoryName(initialData.categoryName || 'Lập trình Web');
      setPrice(initialData.price || 0);
      setStatus(initialData.status || 'DRAFT');
      setThumbnail(initialData.thumbnail || '');
      setDescription(initialData.description || '');
    } else {
      // Reset form for create new
      setTitle('');
      setCategoryName('Lập trình Web');
      setPrice(499000);
      setStatus('DRAFT');
      setThumbnail('');
      setDescription('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      categoryName,
      price: Number(price),
      status,
      thumbnail:
        thumbnail ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      description,
    });
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modalCard}>
        {/* Header */}
        <div className={styles.header}>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className={styles.title}>
              {initialData ? 'Chỉnh sửa Khóa học' : 'Tạo Khóa học Mới'}
            </h2>
          </div>

          <button onClick={onClose} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form id="course-form" onSubmit={handleSubmit} className={styles.body}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tiêu đề Khóa học *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Lập trình NestJS & Microservices từ Zero..."
              className={styles.input}
            />
          </div>

          {/* Grid: Category & Price */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Danh mục Khóa học *</label>
              <select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className={styles.input}
              >
                {CATEGORIES_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Giá bán (VNĐ) *</label>
              <input
                type="number"
                min="0"
                step="10000"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="VD: 599000 (Nhập 0 cho miễn phí)"
                className={styles.input}
              />
            </div>
          </div>

          {/* Grid: Status & Thumbnail */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Trạng thái Xuất bản *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatusType)}
                className={styles.input}
              >
                <option value="DRAFT">Bản nháp (DRAFT)</option>
                <option value="PUBLISHED">Đang bán (PUBLISHED)</option>
                <option value="PENDING">Chờ duyệt (PENDING)</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>URL Ảnh bìa (Thumbnail)</label>
              <input
                type="url"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className={styles.input}
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả tóm tắt Khóa học</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả tóm tắt nội dung chính khóa học mang lại cho học viên..."
              className={styles.textarea}
            />
          </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Hủy bỏ
          </button>
          <button type="submit" form="course-form" className={styles.submitBtn}>
            <span className="flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Lưu cập nhật' : 'Tạo khóa học'}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
