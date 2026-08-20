import React, { useRef } from 'react';
import { UploadCloud, RefreshCw } from 'lucide-react';
import type { CourseItem, CourseStatusType } from '../courses/CourseCard';
import { RichTextEditor } from '../../../../components/common/RichTextEditor/RichTextEditor';
import styles from './CourseSettingsTab.module.css';

interface CourseSettingsTabProps {
  courseData: CourseItem;
  onChange: (updated: Partial<CourseItem>) => void;
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

export const CourseSettingsTab: React.FC<CourseSettingsTabProps> = ({
  courseData,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          onChange({ thumbnail: reader.result as string });
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

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Thông tin chung của Khóa học</h2>
        <p className={styles.sectionSubtitle}>
          Cập nhật các thông số cơ bản hiển thị trên trang chủ và kết quả tìm kiếm cho học viên.
        </p>
      </div>

      {/* Title */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Tiêu đề Khóa học *</label>
        <input
          type="text"
          required
          value={courseData.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="VD: Lập trình NestJS & Microservices..."
          className={styles.input}
        />
      </div>

      {/* Grid: Category & Price */}
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Danh mục Khóa học *</label>
          <select
            value={courseData.categoryName}
            onChange={(e) => onChange({ categoryName: e.target.value })}
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
            value={courseData.price}
            onChange={(e) => onChange({ price: Number(e.target.value) })}
            placeholder="VD: 599000"
            className={styles.input}
          />
        </div>
      </div>

      {/* Status */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Trạng thái Khóa học *</label>
        <select
          value={courseData.status}
          onChange={(e) => onChange({ status: e.target.value as CourseStatusType })}
          className={styles.input}
        >
          <option value="DRAFT">📝 Bản nháp (DRAFT) - Đang biên soạn</option>
          <option value="PENDING">⏳ Chờ duyệt (PENDING) - Gửi Admin kiểm duyệt</option>
          {courseData.status === 'PUBLISHED' && (
            <option value="PUBLISHED">✅ Đang bán (PUBLISHED - Đã được duyệt)</option>
          )}
        </select>
      </div>

      {/* Thumbnail Upload Area */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Ảnh bìa Khóa học (Thumbnail)</label>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className={styles.fileInputHidden}
          onChange={handleFileChange}
        />

        {courseData.thumbnail ? (
          <div className={styles.previewBox}>
            <img src={courseData.thumbnail} alt={courseData.title} className={styles.previewImage} />
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
            <div className={styles.uploadSubtext}>Hỗ trợ định dạng PNG, JPG, WEBP (Tỷ lệ 16:9)</div>
          </div>
        )}
      </div>

      {/* Description RichTextEditor */}
      <div className={styles.formGroup}>
        <label className={styles.label}>Mô tả chi tiết Khóa học (Rich Text Editor)</label>
        <RichTextEditor
          value={courseData.description || ''}
          onChange={(content) => onChange({ description: content })}
          placeholder="Soạn thảo mô tả khóa học phong phú với định dạng HTML..."
          height={260}
        />
      </div>
    </div>
  );
};
