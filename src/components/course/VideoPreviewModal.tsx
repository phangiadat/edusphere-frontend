import React from 'react';
import { X, PlayCircle, Lock } from 'lucide-react';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string | null;
  lessonTitle?: string;
  courseTitle?: string;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  lessonTitle,
  courseTitle,
}) => {
  if (!isOpen) return null;

  // Convert standard youtube link to embed if needed
  const getEmbedUrl = (url?: string | null) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--neutral-bg)]">
          <div>
            <span className="text-caption-bold text-[var(--primary-600)] uppercase block">
              XEM TRƯỚC BÀI HỌC MIỄN PHÍ
            </span>
            <h3 className="text-p1-bold text-[var(--text-primary)] line-clamp-1">
              {lessonTitle || courseTitle || 'Xem trước khóa học'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--neutral-surface-hover)] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Area */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {videoUrl ? (
            <iframe
              src={getEmbedUrl(videoUrl)}
              title={lessonTitle || 'Lesson Video Preview'}
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="text-center text-white space-y-2 p-6">
              <Lock className="w-10 h-10 text-[var(--primary-400)] mx-auto" />
              <p className="text-p1-bold">Video bài học này chưa có bản xem trước</p>
              <p className="text-caption-regular text-slate-400">Vui lòng đăng ký khóa học để học toàn bộ bài giảng này.</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-[var(--neutral-surface)] flex items-center justify-between text-caption-medium text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-[var(--primary-600)]" />
            <span>Đang phát bản xem trước chất lượng cao HD</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--primary-600)] text-white text-p2-bold hover:bg-[var(--primary-700)] transition"
          >
            Đóng Player
          </button>
        </div>

      </div>
    </div>
  );
};
