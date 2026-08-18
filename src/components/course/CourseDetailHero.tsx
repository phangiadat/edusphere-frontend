import React from 'react';
import { Star, Globe, Clock, Award, Users, ChevronRight } from 'lucide-react';

interface CourseDetailHeroProps {
  title: string;
  description?: string;
  categoryName?: string;
  instructorName?: string;
  rating?: number;
  reviewCount?: number;
  studentCount?: number;
  updatedAt?: string;
}

export const CourseDetailHero: React.FC<CourseDetailHeroProps> = ({
  title,
  description,
  categoryName = 'Lập trình Web',
  instructorName = 'Giảng viên EduSphere',
  rating = 4.9,
  reviewCount = 142,
  studentCount = 1280,
  updatedAt = '08/2026',
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 py-8 lg:py-12 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-caption-medium text-slate-400 mb-4 overflow-x-auto">
          <a href="/" className="hover:text-white transition">Trang chủ</a>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <a href="#courses" className="hover:text-white transition">{categoryName}</a>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-slate-200 truncate">{title}</span>
        </nav>

        <div className="max-w-3xl space-y-4">
          {/* Main Course Title */}
          <h1 className="text-h1-bold text-white leading-tight">
            {title}
          </h1>

          {/* Subtitle / Short Description */}
          {description && (
            <p className="text-p1-regular text-slate-300 leading-relaxed">
              {description}
            </p>
          )}

          {/* Badges & Rating Stats */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-p2-medium">
            
            {/* Bestseller Badge */}
            <span className="px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 text-caption-bold uppercase tracking-wider">
              Bán chạy nhất
            </span>

            {/* Rating Stars */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-amber-400">{rating.toFixed(1)}</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <a href="#reviews" className="text-indigo-300 hover:underline text-caption-medium">
                ({reviewCount} đánh giá)
              </a>
            </div>

            {/* Enrolled Students */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{studentCount.toLocaleString()} học viên</span>
            </div>
          </div>

          {/* Instructor & Metadata */}
          <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-p2-medium text-slate-300">
            <div>
              Tạo bởi <span className="text-indigo-300 font-bold underline cursor-pointer">{instructorName}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Cập nhật mới nhất {updatedAt}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-slate-400" />
              <span>Tiếng Việt</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-slate-400" />
              <span>Có Phụ đề HD</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
