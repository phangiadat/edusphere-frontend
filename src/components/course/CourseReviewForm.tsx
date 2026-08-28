import React, { useState } from 'react';
import { Star, Send, Loader2, MessageSquarePlus, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewApi } from '../../api/reviewApi';
import { useAuth } from '../../hooks/useAuth';
import styles from './CourseReviewForm.module.css';

interface CourseReviewFormProps {
  courseId: string;
  isEnrolled?: boolean;
  onReviewSubmitted?: () => void;
  existingReview?: {
    rating: number;
    comment: string;
  } | null;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Rất tệ (1/5 ⭐)',
  2: 'Cần cải thiện (2/5 ⭐)',
  3: 'Bình thường (3/5 ⭐)',
  4: 'Tốt (4/5 ⭐)',
  5: 'Tuyệt vời! (5/5 ⭐)',
};

export const CourseReviewForm: React.FC<CourseReviewFormProps> = ({
  courseId,
  isEnrolled = false,
  onReviewSubmitted,
  existingReview = null,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const activeRating = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để viết đánh giá!');
      openAuthModal('login');
      return;
    }

    if (!isEnrolled) {
      toast.error('Bạn cần phải sở hữu khóa học này mới được phép gửi đánh giá!');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá/nhận xét!');
      return;
    }

    if (comment.trim().length < 5) {
      toast.error('Nhận xét phải có ít nhất 5 ký tự!');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Đang gửi đánh giá của bạn...');

    try {
      await reviewApi.createOrUpdateReview(courseId, {
        rating,
        comment: comment.trim(),
      });

      toast.success(existingReview ? 'Đã cập nhật đánh giá thành công!' : 'Cảm ơn bạn đã gửi đánh giá!', { id: toastId });
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại sau!';
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.notEnrolledBox}>
          <AlertCircle className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <p className="font-semibold text-[var(--text-primary)]">Đăng nhập để viết đánh giá</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1 mb-3">
            Chia sẻ trải nghiệm học tập của bạn giúp cộng đồng học viên EduSphere phát triển hơn.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (!isEnrolled) {
    return (
      <div className={styles.container}>
        <div className={styles.notEnrolledBox}>
          <AlertCircle className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <p className="font-semibold text-[var(--text-primary)]">Đánh giá dành cho Học viên sở hữu khóa học</p>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Bạn cần đăng ký khóa học này để có thể viết nhận xét và chấm điểm sao bài giảng.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>
        <MessageSquarePlus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        {existingReview ? 'Chỉnh sửa đánh giá của bạn' : 'Viết đánh giá & nhận xét của bạn'}
      </h4>
      <p className={styles.subtitle}>
        Cảm nghĩ của bạn về bài giảng, tài liệu và giảng viên như thế nào?
      </p>

      <form onSubmit={handleSubmit}>
        {/* Star Rating Interactive Selector */}
        <div className={styles.starRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={styles.starBtn}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              title={`${star} sao`}
            >
              <Star
                className={`${styles.starIcon} ${
                  star <= activeRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
          <span className={styles.ratingLabel}>{RATING_LABELS[activeRating]}</span>
        </div>

        {/* Comment Textarea */}
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ nhận xét chi tiết về nội dung bài giảng, chất lượng hỗ trợ hoặc ấn tượng của bạn..."
          className={styles.textarea}
        />

        <div className={styles.actions}>
          <span className={styles.hint}>Nhận xét của bạn sẽ được hiển thị công khai.</span>
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className={styles.submitBtn}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang gửi...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{existingReview ? 'Cập nhật nhận xét' : 'Gửi đánh giá'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
