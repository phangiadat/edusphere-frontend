import React from 'react';
import { Check, ShoppingCart, Clock } from 'lucide-react';
import type { Course } from '../../types';
import { useCart } from '../../context/CartContext';

interface CourseHoverCardProps {
  course: Course;
  position: 'left' | 'right';
  onNavigateDetail: () => void;
}

export const CourseHoverCard: React.FC<CourseHoverCardProps> = ({
  course,
  position,
  onNavigateDetail,
}) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(course.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: course.id,
      title: course.title,
      instructorName: course.instructor.name,
      rating: course.rating,
      ratingsCount: course.reviewsCount,
      totalHours: course.duration,
      lecturesCount: course.lessonsCount,
      level: 'All Levels',
      price: course.price,
      thumbnail: course.thumbnail,
      badge: course.badge,
    });
  };

  const handleGoToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.hash = '#cart';
  };

  // Generate 3 course highlights based on category/title
  const highlights = [
    `Khóa học cung cấp đầy đủ công cụ & tư duy chuyên sâu về ${course.category}.`,
    `Hiểu rõ bản chất kiến trúc hệ thống và làm chủ các kỹ năng cốt lõi.`,
    `Thực hành viết mã nguồn thực tế, tự tay triển khai dự án Production.`,
  ];

  return (
    <div
      className={`absolute top-0 z-50 w-80 sm:w-96 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 animate-in fade-in zoom-in-95 ${
        position === 'left'
          ? 'right-full mr-3'
          : 'left-full ml-3'
      }`}
      style={{
        filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15))',
      }}
    >
      {/* Caret / Arrow Indicator (Udemy Style) */}
      <div
        className={`absolute top-8 w-3.5 h-3.5 bg-white dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-800 transform rotate-45 ${
          position === 'left'
            ? '-right-2 border-t border-r border-l-0 border-b-0'
            : '-left-2 border-t-0 border-r-0 border-l border-b'
        }`}
      />

      <div className="space-y-4 relative z-10 text-left">
        {/* 1. Course Title */}
        <h3
          onClick={onNavigateDetail}
          className="text-p1-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer leading-snug"
        >
          {course.title}
        </h3>

        {/* 2. Badges & Last Updated */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {course.badge && (
            <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold px-2.5 py-0.5 rounded text-[11px] tracking-wide">
              {course.badge}
            </span>
          )}
          <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
            Cập nhật Tháng 08/2026
          </span>
        </div>

        {/* 3. Duration & Level Meta */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-purple-500" /> {course.duration} tổng số giờ
          </span>
          <span>•</span>
          <span>Tất cả trình độ</span>
          <span>•</span>
          <span>Phụ đề HD</span>
        </div>

        {/* 4. Short Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {course.title} — Lộ trình đào tạo chuyên sâu giúp bạn nâng cao kỹ năng lập trình, làm chủ kiến trúc sản phẩm và bứt phá sự nghiệp.
        </p>

        {/* 5. Key Highlights (3 Checkmarks) */}
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          {highlights.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200">
              <Check className="w-4 h-4 text-slate-900 dark:text-white flex-shrink-0 mt-0.5 stroke-[2.5]" />
              <span className="leading-snug">{item}</span>
            </div>
          ))}
        </div>

        {/* 6. Udemy Full-Width Action Button */}
        <div className="pt-2">
          {inCart ? (
            <button
              onClick={handleGoToCart}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-700 text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Đã có trong giỏ - Đến Giỏ hàng</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
