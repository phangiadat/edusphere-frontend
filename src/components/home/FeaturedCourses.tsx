import React, { useState } from 'react';
import { Star, Clock, BookOpen, ArrowRight, Check } from 'lucide-react';
import type { Course } from '../../types';

export const FeaturedCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'rated' | 'new'>('all');

  const sampleCourses: Course[] = [
    {
      id: '1',
      title: 'Lập trình NestJS & Microservices từ Zero đến Production',
      category: 'Backend Development',
      instructor: {
        name: 'Phan Gia Đạt',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'Senior Backend Engineer',
      },
      rating: 4.9,
      reviewsCount: 240,
      studentsCount: 1850,
      price: 599000,
      originalPrice: 1299000,
      badge: 'Bán chạy',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
      lessonsCount: 68,
      duration: '32h 45m',
    },
    {
      id: '2',
      title: 'React 18 & Next.js 14 Ultimate Masterclass 2026',
      category: 'Frontend Development',
      instructor: {
        name: 'EduSphere Team',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        role: 'Fullstack Specialist',
      },
      rating: 4.8,
      reviewsCount: 185,
      studentsCount: 1420,
      price: 699000,
      originalPrice: 1499000,
      badge: 'Nổi bật',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
      lessonsCount: 84,
      duration: '45h 10m',
    },
    {
      id: '3',
      title: 'Thiết kế UI/UX Chuyên nghiệp với Figma & Design System 2026',
      category: 'UI/UX Design',
      instructor: {
        name: 'Minh Anh',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        role: 'Lead UI/UX Designer',
      },
      rating: 4.9,
      reviewsCount: 310,
      studentsCount: 2200,
      price: 499000,
      originalPrice: 999000,
      badge: 'Bán chạy',
      thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
      lessonsCount: 52,
      duration: '24h 15m',
    },
    {
      id: '4',
      title: 'Xây dựng Trợ lý AI với Gemini 2.0 API & LangChain Python',
      category: 'AI & Machine Learning',
      instructor: {
        name: 'Hoàng Nam',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        role: 'AI Engineer',
      },
      rating: 5.0,
      reviewsCount: 96,
      studentsCount: 890,
      price: 799000,
      originalPrice: 1599000,
      badge: 'Mới ra mắt',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
      lessonsCount: 45,
      duration: '28h 30m',
    },
    {
      id: '5',
      title: 'DevOps Thực chiến: Docker, Kubernetes, AWS & CI/CD',
      category: 'DevOps & Cloud',
      instructor: {
        name: 'Tuấn Anh',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        role: 'DevOps Architect',
      },
      rating: 4.8,
      reviewsCount: 142,
      studentsCount: 1100,
      price: 649000,
      originalPrice: 1399000,
      badge: 'Nổi bật',
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80',
      lessonsCount: 60,
      duration: '36h 00m',
    },
    {
      id: '6',
      title: 'Lập trình Mobile Đa nền tảng với React Native & Expo 2026',
      category: 'Mobile Development',
      instructor: {
        name: 'Đăng Khoa',
        avatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=120&q=80',
        role: 'Mobile Specialist',
      },
      rating: 4.7,
      reviewsCount: 88,
      studentsCount: 750,
      price: 549000,
      originalPrice: 1199000,
      badge: 'Giảm giá',
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
      lessonsCount: 50,
      duration: '30h 20m',
    },
  ];

  const formatVND = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  return (
    <section id="courses" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <span className="text-caption-bold text-[var(--primary-600)] uppercase tracking-widest block">
            KHOẢNG TRỜI TRI THỨC
          </span>
          <h2 className="text-h2-bold text-[var(--text-primary)] mt-1">
            Khóa Học Nổi Bật & Được Yêu Thích Nhất
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--neutral-surface-hover)] border border-[var(--border-color)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'all'
                ? 'bg-[var(--primary-600)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Tất cả khóa học
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'popular'
                ? 'bg-[var(--primary-600)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Bán chạy
          </button>
          <button
            onClick={() => setActiveTab('rated')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'rated'
                ? 'bg-[var(--primary-600)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Đánh giá cao
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'new'
                ? 'bg-[var(--primary-600)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Mới ra mắt
          </button>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleCourses.map((course) => (
          <div
            key={course.id}
            className="rounded-xl bg-[var(--neutral-surface)] border border-[var(--border-color)] overflow-hidden hover:border-[var(--primary-600)] transition duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />

                {/* Badge */}
                {course.badge && (
                  <span className="absolute top-3 left-3 bg-[var(--primary-600)] text-white text-caption-bold px-2.5 py-1 rounded-md">
                    {course.badge}
                  </span>
                )}

                {/* Quick Info Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-caption-medium text-white bg-slate-900/80 px-3 py-1.5 rounded-md">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-[var(--primary-300)]" /> {course.lessonsCount} bài học
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--primary-300)]" /> {course.duration}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 space-y-2.5">
                <div className="text-caption-bold text-[var(--primary-600)] uppercase">
                  {course.category}
                </div>

                <h3 className="text-h3-bold text-[var(--text-primary)] line-clamp-2 leading-snug">
                  {course.title}
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 pt-1">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="w-6 h-6 rounded-full object-cover border border-[var(--primary-600)]"
                  />
                  <div className="text-caption-medium text-[var(--text-secondary)]">
                    <span className="font-semibold text-[var(--text-primary)]">{course.instructor.name}</span> • {course.instructor.role}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-1 text-caption-bold">
                    <span className="text-[var(--semantic-warning)]">{course.rating}</span>
                    <div className="flex text-[var(--semantic-warning)]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[var(--text-muted)]">({course.reviewsCount})</span>
                  </div>

                  <span className="text-caption-medium text-[var(--text-muted)]">
                    {course.studentsCount.toLocaleString()} học viên
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing & CTA */}
            <div className="p-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
              <div>
                <div className="text-h3-bold text-[var(--text-primary)]">
                  {formatVND(course.price)}
                </div>
                {course.originalPrice && (
                  <div className="text-caption-regular text-[var(--text-muted)] line-through">
                    {formatVND(course.originalPrice)}
                  </div>
                )}
              </div>

              <button className="px-4 py-2 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-p2-bold transition flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Mua ngay
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All CTA */}
      <div className="mt-10 text-center">
        <button className="px-6 py-3 rounded-lg border border-[var(--border-color)] bg-[var(--neutral-surface)] text-p2-bold text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)] transition inline-flex items-center gap-2">
          Xem thêm khóa học khác <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
