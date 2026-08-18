import React from 'react';
import { Star, Quote } from 'lucide-react';
import type { Testimonial } from '../../types';

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Nguyễn Văn Hải',
      role: 'Frontend Developer at FPT Software',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      courseTitle: 'Khóa học NestJS Microservices',
      rating: 5,
      content: 'Khóa học NestJS chất lượng nhất mình từng học. Giảng viên Đạt hướng dẫn cực kỳ kỹ lưỡng, hỗ trợ 1-1 qua chat mượt mà và Trợ lý AI Gemini trả lời thắc mắc tức thì.',
    },
    {
      id: '2',
      name: 'Trần Thị Thu Hà',
      role: 'Product Designer at VNG',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      courseTitle: 'Figma & Design System 2026',
      rating: 5,
      content: 'Kiến thức thiết kế UI/UX rất thực chiến. Bài tập được chấm chi tiết giúp mình cải thiện tư duy Design System rõ rệt và tự tin đi phỏng vấn.',
    },
    {
      id: '3',
      name: 'Lê Hoàng Minh',
      role: 'Junior Fullstack Engineer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      courseTitle: 'React 18 & Next.js 14 Masterclass',
      rating: 5,
      content: 'Giao diện mượt mà, thanh toán Stripe cực nhanh. Sau khi đăng ký là học được ngay. Tính năng nộp bài tập rất hay giúp duy trì động lực học hàng ngày.',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-dark-surface border-y border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            HỌC VIÊN NÓI GÌ VỀ EDUSPHERE?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Hơn 10.000 Học Viên Đã Thay Đổi Sự Nghiệp
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Đánh giá chân thực từ những học viên đang làm việc tại các tập đoàn công nghệ.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div 
              key={item.id}
              className="rounded-3xl bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border p-6 hover:shadow-xl transition duration-300 flex flex-col justify-between relative group"
            >
              <Quote className="w-8 h-8 text-brand-500/20 absolute top-6 right-6" />

              <div>
                {/* Rating */}
                <div className="flex text-amber-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{item.content}"
                </p>
              </div>

              {/* User Info */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-dark-border flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-brand-500" 
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                  <p className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 mt-0.5">{item.courseTitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
