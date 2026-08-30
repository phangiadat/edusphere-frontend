import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Save, UploadCloud, Info, RefreshCw } from 'lucide-react';
import type { CourseItem, CourseStatusType } from './CourseCard';
import { RichTextEditor } from '../../../../components/common/RichTextEditor/RichTextEditor';
import styles from './CourseFormModal.module.css';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: Partial<CourseItem>, file?: File | null) => void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCategoryName(initialData.categoryName || 'Lập trình Web');
      setPrice(initialData.price || 0);
      setStatus(initialData.status || 'DRAFT');
      setThumbnail(initialData.thumbnail || '');
      setDescription(initialData.description || '');
      setSelectedFile(null);
    } else {
      // Reset form for create new (Default to DRAFT)
      setTitle('');
      setCategoryName('Lập trình Web');
      setPrice(499000);
      setStatus('DRAFT');
      setThumbnail('');
      setDescription('');
      setSelectedFile(null);
    }
  }, [initialData, isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB = 5 * 1024 * 1024 bytes)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước file ảnh vượt quá 5MB. Vui lòng chọn file ảnh dung lượng nhỏ hơn!');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setThumbnail(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        id: initialData?.id,
        title,
        categoryName,
        price: Number(price),
        status,
        thumbnail:
          thumbnail ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        description,
      },
      selectedFile
    );
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
          
          {/* Info Banner explaining Course Status Workflow */}
          <div className={styles.noticeBanner}>
            <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className={styles.noticeText}>
              💡 <strong>Quy trình phê duyệt:</strong> Khóa học mới sẽ khởi tạo ở dạng <strong>Bản nháp (DRAFT)</strong>. Sau khi hoàn thiện nội dung, hãy chọn <strong>Chờ duyệt (PENDING)</strong> để gửi Admin kiểm duyệt mở bán.
            </p>
          </div>

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

          {/* Status Select Workflow (Instructor perspective) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái Khóa học *</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CourseStatusType)}
              className={styles.input}
            >
              <option value="DRAFT">📝 Bản nháp (DRAFT) - Đang biên soạn</option>
              <option value="PENDING">⏳ Chờ duyệt (PENDING) - Gửi Admin kiểm duyệt</option>
              {initialData?.status === 'PUBLISHED' && (
                <option value="PUBLISHED">✅ Đang bán (PUBLISHED - Đã được duyệt)</option>
              )}
            </select>
          </div>

          {/* Thumbnail File Upload / Cloudinary Preview Area */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Ảnh bìa Khóa học (Thumbnail)</label>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className={styles.fileInputHidden}
              onChange={handleFileChange}
            />

            {thumbnail ? (
              <div className={styles.previewBox}>
                <img src={thumbnail} alt="Thumbnail preview" className={styles.previewImage} />
                <button
                  type="button"
                  onClick={handleTriggerFileInput}
                  className={styles.changeImageBtn}
                >
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Tải ảnh khác</span>
                  </span>
                </button>
              </div>
            ) : (
              <div onClick={handleTriggerFileInput} className={styles.uploadZone}>
                <UploadCloud className={styles.uploadIcon} />
                <div className={styles.uploadText}>Kéo thả hoặc bấm để chọn ảnh từ máy tính</div>
                <div className={styles.uploadSubtext}>Hỗ trợ định dạng PNG, JPG, WEBP (Khuyên dùng tỷ lệ 16:9)</div>
              </div>
            )}
          </div>

          {/* Description RichTextEditor */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Mô tả chi tiết Khóa học (Rich Text Editor)</label>
            <RichTextEditor
              value={description}
              onChange={(val: string) => setDescription(val)}
              placeholder="Nhập mô tả tóm tắt nội dung chính khóa học mang lại cho học viên..."
              height={240}
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
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
