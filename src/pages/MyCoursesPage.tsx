import React, { useEffect, useState } from 'react';
import { PlayCircle, BookOpen, Award, Loader2 } from 'lucide-react';
import { paymentApi } from '../api/paymentApi';
import type { MyCourseItem } from '../api/paymentApi';
import { useAuth } from '../context/AuthContext';

interface MyCoursesPageProps {
  onNavigateToCourse?: (courseId: string) => void;
  onNavigateHome?: () => void;
}

export const MyCoursesPage: React.FC<MyCoursesPageProps> = ({
  onNavigateToCourse,
  onNavigateHome,
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [courses, setCourses] = useState<MyCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      if (!isAuthenticated) {
        setIsLoading(false);
        setCourses([]);
        return;
      }
      setIsLoading(true);
      try {
        const res: any = await paymentApi.getMyCourses();
        const list = Array.isArray(res) ? res : (res?.data || []);
        setCourses(list);
      } catch (err) {
        console.warn('Lỗi nạp danh sách Khóa học của tôi:', err);
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyCourses();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-6">
        <BookOpen className="w-12 h-12 text-purple-600" />
        <h2 className="text-h2-bold text-[var(--text-primary)]">Vui lòng đăng nhập</h2>
        <p className="text-p2-regular text-[var(--text-secondary)] max-w-md">
          Bạn cần đăng nhập tài khoản để xem danh sách các khóa học đã mua và theo dõi tiến độ học tập.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-3 bg-purple-600 text-white text-p2-bold rounded-xl shadow-md hover:bg-purple-700 transition"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-p2-medium text-[var(--text-secondary)]">Đang tải danh sách khóa học đã mua...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--neutral-bg)] transition-colors py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Khóa học của tôi
          </h1>
          <p className="text-p1-bold text-[var(--text-secondary)] mt-2">
            Theo dõi tiến độ và tiếp tục bài học của bạn
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center space-y-6 max-w-xl mx-auto my-8">
            <BookOpen className="w-12 h-12 text-[var(--text-muted)] mx-auto" />
            <h3 className="text-h3-bold text-[var(--text-primary)]">Bạn chưa sở hữu khóa học nào</h3>
            <p className="text-p2-regular text-[var(--text-secondary)]">
              Hãy chọn cho mình một khóa học yêu thích và bắt đầu hành trình chinh phục tri thức mới.
            </p>
            <button
              onClick={onNavigateHome}
              className="px-6 py-3 bg-purple-600 text-white font-bold rounded-xl shadow hover:bg-purple-700 transition"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((item) => (
              <div
                key={item.enrollmentId}
                className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-purple-400 dark:hover:border-purple-700 transition shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Course Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-slate-100 border-b border-[var(--border-color)]">
                    <img
                      src={item.course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80'}
                      alt={item.course.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-emerald-400" /> Quyền trọn đời
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-p1-bold text-[var(--text-primary)] line-clamp-2 leading-snug">
                      {item.course.title}
                    </h3>

                    <div className="flex items-center gap-2 text-caption-medium text-[var(--text-secondary)]">
                      <img
                        src={item.course.instructor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                        alt={item.course.instructor.fullName}
                        className="w-5 h-5 rounded-full object-cover border border-purple-500"
                      />
                      <span>Giảng viên: <strong className="text-[var(--text-primary)]">{item.course.instructor.fullName}</strong></span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-caption-bold text-xs">
                        <span className="text-[var(--text-secondary)]">Tiến độ hoàn thành</span>
                        <span className="text-purple-600 dark:text-purple-400">{item.progress}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Learning Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => {
                      if (onNavigateToCourse) onNavigateToCourse(item.course.id);
                      else window.location.hash = `#course/${item.course.id}`;
                    }}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-p2-bold transition flex items-center justify-center gap-2 shadow-md"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>Tiếp tục bài học</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
