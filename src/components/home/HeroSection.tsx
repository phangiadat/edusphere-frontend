import React, { useState } from 'react';
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

export const HeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Auto-complete course suggestions
  const suggestions = [
    { title: 'Lập trình NestJS & Microservices', category: 'Backend Development', price: '599.000₫' },
    { title: 'React 18 & Next.js 14 Masterclass', category: 'Frontend Development', price: '699.000₫' },
    { title: 'Thiết kế UI/UX với Figma 2026', category: 'UI/UX Design', price: '499.000₫' },
    { title: 'Python AI & Gemini 2.0 API', category: 'AI & Machine Learning', price: '799.000₫' },
  ].filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-12 lg:py-20 bg-[var(--neutral-bg)] border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, PROMINENT CENTER SEARCH BOX & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Top AI Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[var(--primary-50)] dark:bg-slate-800/80 border border-[var(--primary-200)] dark:border-slate-700 text-[var(--primary-600)] dark:text-[var(--primary-300)] text-caption-bold">
              <Sparkles className="w-4 h-4 text-[var(--primary-600)]" />
              <span>Nền tảng E-Learning Tích hợp AI Gemini & Chat Realtime 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-h1-bold text-[var(--text-primary)]">
              Học Kỹ Năng Thực Chiến. <br />
              <span className="text-[var(--primary-600)]">
                Xây Dựng Tương Lai
              </span> Cùng EduSphere
            </h1>

            {/* Subtitle */}
            <p className="text-p1-regular text-[var(--text-secondary)] max-w-xl">
              Trải nghiệm học lập trình & công nghệ chuẩn quốc tế. Tích hợp Trợ lý AI giải đáp 24/7, Chat 1-1 với Giảng viên và nộp bài tập chấm điểm tự động.
            </p>

            {/* ==================================================================
               THANH TÌM KIẾM TRUNG TÂM DUY NHẤT (PROMINENT CENTER SEARCH BAR)
               ================================================================== */}
            <div className="pt-2 max-w-xl relative">
              <div className={`relative flex items-center bg-[var(--neutral-surface)] border-2 ${isSearchFocused ? 'border-[var(--primary-600)] shadow-sm' : 'border-[var(--border-color-strong)]'} rounded-xl p-1.5 transition-all`}>
                
                <Search className="w-5 h-5 ml-3 text-[var(--primary-600)] flex-shrink-0" />
                
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Bạn muốn học gì hôm nay? (VD: NestJS, React, AI...)"
                  className="w-full px-3 py-2 text-p1-medium bg-transparent border-none focus:outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />

                <button className="px-6 py-2.5 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-p2-bold transition flex items-center gap-1.5 flex-shrink-0">
                  <span>Tìm kiếm</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 p-2 text-left animate-in fade-in duration-150">
                  <div className="text-caption-bold text-[var(--text-muted)] px-3 py-1.5 uppercase">
                    Gợi ý khóa học phù hợp ({suggestions.length})
                  </div>
                  {suggestions.length > 0 ? (
                    suggestions.map((item, idx) => (
                      <a
                        key={idx}
                        href="#courses"
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-[var(--primary-600)]" />
                          <div>
                            <div className="text-p2-bold text-[var(--text-primary)]">{item.title}</div>
                            <div className="text-caption-regular text-[var(--text-secondary)]">{item.category}</div>
                          </div>
                        </div>
                        <span className="text-p2-bold text-[var(--primary-600)]">{item.price}</span>
                      </a>
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
                <button onClick={() => setSearchQuery('NestJS')} className="px-2.5 py-1 rounded-md bg-[var(--neutral-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-600)] hover:text-[var(--primary-600)] transition">
                  NestJS
                </button>
                <button onClick={() => setSearchQuery('React')} className="px-2.5 py-1 rounded-md bg-[var(--neutral-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-600)] hover:text-[var(--primary-600)] transition">
                  React 18
                </button>
                <button onClick={() => setSearchQuery('Figma')} className="px-2.5 py-1 rounded-md bg-[var(--neutral-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-600)] hover:text-[var(--primary-600)] transition">
                  UI/UX Figma
                </button>
                <button onClick={() => setSearchQuery('AI')} className="px-2.5 py-1 rounded-md bg-[var(--neutral-surface)] border border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary-600)] hover:text-[var(--primary-600)] transition">
                  Python AI
                </button>
              </div>
            </div>

            {/* Dual CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a 
                href="#courses" 
                className="px-6 py-3 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-p2-bold transition flex items-center gap-2"
              >
                Khám phá khóa học 
                <ArrowRight className="w-4 h-4" />
              </a>

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
                <CheckCircle2 className="w-4 h-4 text-[var(--semantic-success)]" /> Nộp bài & Cấp chứng chỉ
              </span>
            </div>

          </div>

          {/* Right Column: Clean Solid Course Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] p-4">
              
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" 
                  alt="Course Preview" 
                  className="w-full h-full object-cover" 
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

                <h3 className="text-h3-bold text-[var(--text-primary)] line-clamp-1">
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
          </div>

        </div>
      </div>
    </section>
  );
};
