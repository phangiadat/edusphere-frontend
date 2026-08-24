import React, { useState } from 'react';
import { 
  Home, 
  BookOpen, 
  Search, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  HelpCircle,
  AlertTriangle 
} from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome?: () => void;
  onSearchCourse?: (query: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onSearchCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    if (onSearchCourse) {
      onSearchCourse(searchQuery);
    } else {
      window.location.hash = '#home';
    }
  };

  const handleGoHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.hash = '#home';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--neutral-bg)] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
      
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-8 relative z-10">
        
        {/* Floating 404 Visual Icon & Badge */}
        <div className="relative inline-block">
          <div className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-1 shadow-2xl animate-bounce duration-1000">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center text-white">
              <Compass className="w-14 h-14 sm:w-18 sm:h-18 text-purple-400 animate-spin duration-3000" />
            </div>
          </div>

          <div className="absolute -top-3 -right-3 px-3 py-1 bg-amber-400 text-slate-900 text-xs font-black rounded-full shadow-lg flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 fill-slate-900" />
            <span>404 NOT FOUND</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            Trang bạn tìm kiếm không tồn tại!
          </h2>
          <p className="text-p1-bold text-[var(--text-secondary)] max-w-xl mx-auto leading-relaxed">
            Đường dẫn có thể đã bị đổi tên, tạm ẩn hoặc không còn tồn tại trên hệ thống EduSphere. Đừng lo lắng, hãy thử tìm kiếm khóa học bên dưới!
          </p>
        </div>

        {/* Search Bar Input */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="max-w-lg mx-auto flex items-center gap-2 p-2 bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl shadow-lg"
        >
          <div className="relative flex-1 flex items-center pl-3">
            <Search className="w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm khóa học NestJS, React, UI/UX..."
              className="w-full pl-2.5 pr-4 py-2 bg-transparent text-p2-medium text-[var(--text-primary)] focus:outline-none placeholder:text-[var(--text-muted)]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Tìm kiếm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Action Buttons Grid */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={handleGoHome}
            className="px-6 py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-p2-bold rounded-xl shadow-lg transition flex items-center gap-2 group active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Trở về Trang chủ</span>
          </button>

          <button
            onClick={() => {
              window.location.hash = '#home';
              setTimeout(() => {
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-6 py-3.5 bg-[var(--neutral-surface)] border border-[var(--border-color)] hover:border-purple-500 text-[var(--text-primary)] font-extrabold text-p2-bold rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <BookOpen className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span>Khám phá Tất cả Khóa học</span>
          </button>
        </div>

        {/* Helpful Tips Section */}
        <div className="pt-8 border-t border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-4 rounded-xl bg-[var(--neutral-surface)] border border-[var(--border-color)] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Khóa học Nổi bật
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Hàng trăm khóa học chất lượng chuẩn Enterprise.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--neutral-surface)] border border-[var(--border-color)] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              <Compass className="w-4 h-4" /> Lộ trình bài bản
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Lộ trình từ Zero đến Production bài bản.</p>
          </div>

          <div className="p-4 rounded-xl bg-[var(--neutral-surface)] border border-[var(--border-color)] space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" /> Hỗ trợ 24/7
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Kênh chat hỗ trợ trực tiếp với Giảng viên.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
