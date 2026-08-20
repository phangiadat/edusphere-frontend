import React, { useState, useEffect } from 'react';
import { X, Video, VideoOff, Save, Info } from 'lucide-react';
import type { LessonModel } from './LessonItem';
import styles from './LessonModal.module.css';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lessonData: Partial<LessonModel>) => void;
  initialData?: LessonModel | null;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(10);
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDuration(initialData.duration || 10);
      setIsFreePreview(initialData.isFreePreview || false);
      setIsPublished(initialData.isPublished ?? true);
      setContent(initialData.content || '');
      setVideoUrl(initialData.videoUrl || '');
    } else {
      // Reset for create new lesson
      setTitle('');
      setDuration(12);
      setIsFreePreview(false);
      setIsPublished(true);
      setContent('');
      setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Helper to parse and convert Youtube URL to Embed iframe URL
  const getEmbedVideoUrl = (url: string): string | null => {
    if (!url) return null;
    const trimmed = url.trim();

    // Regexp for Youtube URLs
    const youtubeRegExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = trimmed.match(youtubeRegExp);

    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }

    // Direct HTTP/HTTPS Video Embed link
    if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) {
      return trimmed;
    }

    return null;
  };

  const embedUrl = getEmbedVideoUrl(videoUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title,
      duration: Number(duration),
      isFreePreview,
      isPublished,
      content,
      videoUrl,
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
              <Video className="w-5 h-5" />
            </div>
            <h2 className={styles.title}>
              {initialData ? 'Chỉnh sửa Bài học' : 'Tạo Bài học Mới'}
            </h2>
          </div>

          <button onClick={onClose} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form id="lesson-form" onSubmit={handleSubmit} className={styles.body}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Tiêu đề Bài học *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: 1. Overview về NestJS Architecture..."
              className={styles.input}
            />
          </div>

          {/* Grid: Duration & Switches */}
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Thời lượng (Phút) *</label>
              <input
                type="number"
                min="1"
                required
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                placeholder="VD: 12"
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Cấu hình Quyền & Hiển thị</label>
              <div className={styles.switchesRow}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isFreePreview}
                    onChange={(e) => setIsFreePreview(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Học thử miễn phí (Free Preview)</span>
                </label>

                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Công khai bài học</span>
                </label>
              </div>
            </div>
          </div>

          {/* Video URL & Resilient Preview Player */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Đường dẫn Video bài giảng (Youtube / MP4 URL)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="VD: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              className={styles.input}
            />

            {/* Video Player Preview / Resilient Error Fallback Box */}
            <div className={styles.videoPreviewContainer}>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                <Info className="w-3.5 h-3.5 text-purple-600" />
                <span>Khung xem trước trình phát Video (Player Preview):</span>
              </div>

              <div className={styles.videoBox}>
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    title="Video Player Preview"
                    className={styles.videoIframe}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className={styles.videoPlaceholder}>
                    <VideoOff className="w-8 h-8 text-slate-400" />
                    <p className={styles.placeholderText}>
                      URL Video chưa hợp lệ hoặc không hỗ trợ xem trước.
                      <br />
                      <span className="text-xs text-slate-400 font-normal">
                        (Hỗ trợ dán link Youtube chuẩn: youtube.com/watch?v=... hoặc link MP4)
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content / Lecture Notes */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Nội dung / Ghi chú bài giảng (Ghi chú chữ)</label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung bài đọc, mã nguồn mẫu hoặc ghi chú tóm tắt bài giảng cho học viên..."
              className={styles.textarea}
            />
          </div>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Hủy bỏ
          </button>
          <button type="submit" form="lesson-form" className={styles.submitBtn}>
            <span className="flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              <span>{initialData ? 'Lưu thay đổi' : 'Tạo bài học'}</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
