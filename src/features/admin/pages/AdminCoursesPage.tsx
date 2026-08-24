import React, { useState, useEffect } from 'react';
import { 
  BookOpenCheck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Eye 
} from 'lucide-react';
import { adminService } from '../../../services/api/adminService';
import type { AdminPendingCourseItem } from '../../../services/api/adminService';
import toast from 'react-hot-toast';

export const AdminCoursesPage: React.FC = () => {
  const [pendingCourses, setPendingCourses] = useState<AdminPendingCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Reject Modal state
  const [selectedCourseForReject, setSelectedCourseForReject] = useState<AdminPendingCourseItem | null>(null);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPendingCourses = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getPendingCourses();
      setPendingCourses(res);
    } catch (err) {
      console.warn('Lỗi nạp danh sách khóa học chờ duyệt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingCourses();
  }, []);

  const handleApproveCourse = async (course: AdminPendingCourseItem) => {
    try {
      await adminService.reviewCourse(course.id, 'PUBLISHED');
      toast.success(`Đã phê duyệt xuất bản khóa học: ${course.title}`);
      fetchPendingCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể phê duyệt khóa học');
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedCourseForReject) return;
    setIsSubmitting(true);
    try {
      await adminService.reviewCourse(selectedCourseForReject.id, 'REJECTED', rejectFeedback);
      toast.success(`Đã từ chối xuất bản khóa học: ${selectedCourseForReject.title}`);
      setSelectedCourseForReject(null);
      setRejectFeedback('');
      fetchPendingCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể gửi phản hồi từ chối');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Duyệt & Thẩm định Khóa học
        </h1>
        <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
          Kiểm duyệt nội dung bài giảng do Giảng viên đăng ký xuất bản lên nền tảng
        </p>
      </div>

      {/* Pending Courses Container */}
      <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-[var(--text-primary)]">Hàng chờ duyệt xuất bản</h3>
          </div>
          <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full">
            {pendingCourses.length} Khóa học chờ xử lý
          </span>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto" />
            <p className="text-sm font-medium text-[var(--text-secondary)]">Đang tải danh sách chờ duyệt...</p>
          </div>
        ) : pendingCourses.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto opacity-70" />
            <h3 className="font-extrabold text-base text-[var(--text-primary)]">Không có khóa học nào chờ duyệt</h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Tất cả khóa học do Giảng viên đăng ký đều đã được thẩm định xong.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingCourses.map((c) => (
              <div
                key={c.id}
                className="bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl overflow-hidden p-5 flex flex-col justify-between space-y-4 shadow-xs"
              >
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200">
                    <img
                      src={c.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'}
                      alt={c.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-2.5 py-1 rounded-md">
                      {c.price ? `${c.price.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-[var(--text-primary)] leading-snug line-clamp-2">
                      {c.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Giảng viên: <strong className="text-[var(--text-primary)]">{c.instructor?.fullName}</strong>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-3">
                  <button
                    onClick={() => { window.location.hash = `#course/${c.id}`; }}
                    className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] hover:border-purple-500 text-xs font-bold text-[var(--text-primary)] transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-500" />
                    <span>Xem thử</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCourseForReject(c)}
                      className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Từ chối</span>
                    </button>

                    <button
                      onClick={() => handleApproveCourse(c)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Phê duyệt</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Feedback Modal */}
      {selectedCourseForReject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Từ chối Phê duyệt Khóa học</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Vui lòng nhập lý do từ chối để gửi phản hồi cho Giảng viên <strong className="text-[var(--text-primary)]">{selectedCourseForReject.instructor?.fullName}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase">Lý do từ chối:</label>
              <textarea
                rows={4}
                value={rejectFeedback}
                onChange={(e) => setRejectFeedback(e.target.value)}
                placeholder="VD: Video bài học tập 2 bị mờ tiếng, tiêu đề khóa học chưa chuẩn..."
                className="w-full p-3 bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-xl text-sm text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedCourseForReject(null)}
                className="px-4 py-2 bg-[var(--neutral-bg)] text-xs font-bold text-[var(--text-secondary)] rounded-xl hover:text-[var(--text-primary)] transition"
              >
                Hủy bỏ
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Gửi phản hồi Từ chối</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
