import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  PlayCircle, 
  Star, 
  Users, 
  CheckCircle2,
  BookOpen 
} from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses?: () => void;
  onSearchCourse?: (query: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onSearchCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Auto-complete course suggestions
  const suggestions = [
    { title: 'Lập trình NestJS & Microservices', category: 'Lập trình Web', price: '599.000₫' },
    { title: 'React 18 & Next.js 14 Masterclass', category: 'Lập trình Web', price: '699.000₫' },
    { title: 'Thiết kế UI/UX với Figma 2026', category: 'Thiết kế UI/UX', price: '499.000₫' },
    { title: 'Python AI & Gemini 2.0 API', category: 'AI & Machine Learning', price: '799.000₫' },
  ].filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSearchCourse) {
      onSearchCourse(searchQuery);
    }
    const coursesElement = document.getElementById('courses');
    if (coursesElement) {
      coursesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreClick = () => {
    if (onExploreCourses) {
      onExploreCourses();
    }
    const coursesElement = document.getElementById('courses');
    if (coursesElement) {
      coursesElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-purple-50/60 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-b border-[var(--border-color)]">
      
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/10 dark:bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            
            {/* Top AI Highlight Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--primary-50)] dark:bg-slate-800/80 border border-[var(--primary-200)] dark:border-slate-700 text-[var(--primary-600)] dark:text-[var(--primary-300)] text-caption-bold"
            >
              <Sparkles className="w-4 h-4 text-[var(--primary-600)]" />
              <span>Nền tảng E-Learning Tích hợp AI Gemini & Chat Realtime 2026</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.45 }}
              className="text-h1-bold text-[var(--text-primary)]"
            >
              Học Kỹ Năng Thực Chiến. <br />
              <span className="text-[var(--primary-600)]">
                Xây Dựng Tương Lai
              </span> Cùng EduSphere
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.45 }}
              className="text-p1-regular text-[var(--text-secondary)] max-w-xl"
            >
              Trải nghiệm học lập trình & công nghệ chuẩn quốc tế. Tích hợp Trợ lý AI giải đáp 24/7, Chat 1-1 với Giảng viên và nộp bài tập chấm điểm tự động.
            </motion.p>

            {/* ==================================================================
               THANH TÌM KIẾM TRUNG TÂM DUY NHẤT (PROMINENT CENTER SEARCH BAR)
               ================================================================== */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-2 max-w-xl relative"
            >
              <form onSubmit={handleSearchSubmit} className={`relative flex items-center bg-white dark:bg-slate-900 border ${isSearchFocused ? 'border-purple-600 ring-2 ring-purple-500/20 shadow-md' : 'border-slate-300 dark:border-slate-700 hover:border-slate-400'} rounded-full p-1.5 transition-all duration-200`}>
                
                <Search className="w-5 h-5 ml-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search for anything"
                  className="w-full px-3 py-2 text-sm bg-transparent border-none focus:outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />

                <button type="submit" className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition flex items-center gap-1.5 flex-shrink-0 mr-0.5 shadow-sm active:scale-95">
                  <span>Tìm kiếm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-2 text-left animate-in fade-in duration-150">
                  <div className="text-caption-bold text-[var(--text-muted)] px-3 py-1.5 uppercase">
                    Gợi ý khóa học phù hợp ({suggestions.length})
                  </div>
                  {suggestions.length > 0 ? (
                    suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setSearchQuery(item.title);
                          handleSearchSubmit();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[var(--primary-600)]" />
                          <div>
                            <div className="text-p2-bold text-[var(--text-primary)]">{item.title}</div>
                            <div className="text-caption-regular text-[var(--text-secondary)]">{item.category}</div>
                          </div>
                        </div>
                        <span className="text-p2-bold text-[var(--primary-600)]">{item.price}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-p2-regular text-[var(--text-muted)] text-center">
                      Không tìm thấy khóa học khớp từ khóa "{searchQuery}"
                    </div>
                  )}
                </div>
              )}

              {/* Quick Topic Badges */}
              <div className="flex items-center gap-2 mt-3 text-caption-medium text-[var(--text-secondary)] flex-wrap">
                <span className="text-[var(--text-muted)]">Phổ biến:</span>
                {['NestJS', 'React 18', 'Thiết kế UI/UX', 'AI'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setSearchQuery(topic);
                      if (onSearchCourse) onSearchCourse(topic);
                      const coursesElement = document.getElementById('courses');
                      if (coursesElement) coursesElement.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 rounded-md bg-[var(--neutral-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-600)] hover:text-[var(--primary-600)] transition text-xs font-semibold"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button 
                onClick={handleExploreClick}
                className="px-6 py-3 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-p2-bold transition flex items-center gap-2 shadow-md active:scale-95"
              >
                <span>Khám phá khóa học</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a 
                href="#why-us" 
                className="px-6 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--neutral-surface)] hover:bg-[var(--neutral-surface-hover)] text-[var(--text-primary)] text-p2-bold transition flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-[var(--primary-600)]" /> 
                Trải nghiệm AI Demo
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className="pt-2 flex items-center gap-6 text-caption-medium text-[var(--text-secondary)] flex-wrap">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--semantic-success)]" /> Học trọn đời
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--semantic-success)]" /> Thanh toán Stripe
              </span>
              <span className="flex items-center gap-1.5">
              </span>
            </div>

          </motion.div>

          {/* Right Column: Clean Solid Course Preview Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <div className="rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] p-4">
              
              {/* Thumbnail */}
              <div 
                onClick={() => { window.location.hash = '#course/course-nestjs-masterclass'; }}
                className="relative aspect-video rounded-xl overflow-hidden mb-4 cursor-pointer group"
              >
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" 
                  alt="Course Preview" 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                />
                <span className="absolute top-3 left-3 bg-[var(--primary-600)] text-white text-caption-bold px-2.5 py-1 rounded-md">
                  HOT COURSE 2026
                </span>
                <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary-600)] text-white flex items-center justify-center">
                    <PlayCircle className="w-6 h-6 ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Card Meta */}
              <div className="space-y-3 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-caption-bold text-[var(--primary-600)] uppercase">
                    BACKEND DEVELOPMENT
                  </span>
                  <div className="flex items-center gap-1 text-[var(--semantic-warning)] text-caption-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (240 đánh giá)
                  </div>
                </div>

                <h3 
                  onClick={() => { window.location.hash = '#course/course-nestjs-masterclass'; }}
                  className="text-h3-bold text-[var(--text-primary)] hover:text-purple-600 cursor-pointer line-clamp-1"
                >
                  Lập trình NestJS & Microservices từ Zero đến Production
                </h3>

                {/* Sub Features Inside Card */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--neutral-bg)]">
                    <Sparkles className="w-4 h-4 text-[var(--primary-600)]" />
                    <div>
                      <div className="text-caption-bold text-[var(--text-primary)]">AI Gemini 2.0</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Hỗ trợ 24/7</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--neutral-bg)]">
                    <Users className="w-4 h-4 text-[var(--semantic-info)]" />
                    <div>
                      <div className="text-caption-bold text-[var(--text-primary)]">+10.000 Học viên</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Đang theo học</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[var(--primary-600)] flex items-center justify-center text-white text-caption-bold">
                      Đ
                    </div>
                    <span className="text-p2-medium text-[var(--text-primary)]">Phan Gia Đạt</span>
                  </div>

                  <span className="text-h3-bold text-[var(--primary-600)]">
                    599.000₫
                  </span>
                </div>

              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
