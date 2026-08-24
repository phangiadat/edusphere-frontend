import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  Clock, 
  BookOpen, 
  ShoppingCart, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  X, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import type { Course } from '../../types';
import { useCart } from '../../context/CartContext';
import { courseApi } from '../../api/courseApi';
import { CourseHoverCard } from './CourseHoverCard';

interface FeaturedCoursesProps {
  selectedCategory?: string | null;
  onClearCategoryFilter?: () => void;
  searchQuery?: string;
}

const DEMO_COURSES: Course[] = [
  {
    id: 'course-nestjs-masterclass',
    title: 'Lập trình NestJS & Microservices từ Zero đến Production',
    category: 'Lập trình Web',
    instructor: {
      name: 'Phan Gia Đạt',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Senior Backend Engineer',
    },
    rating: 4.9,
    reviewsCount: 240,
    studentsCount: 1850,
    price: 599000,
    badge: 'Bán chạy',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 68,
    duration: '32h 45m',
  },
  {
    id: 'course-react-18-masterclass',
    title: 'React 18 & Next.js 14 Ultimate Masterclass 2026',
    category: 'Lập trình Web',
    instructor: {
      name: 'EduSphere Team',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'Fullstack Specialist',
    },
    rating: 4.8,
    reviewsCount: 185,
    studentsCount: 1420,
    price: 699000,
    badge: 'Nổi bật',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 84,
    duration: '45h 10m',
  },
  {
    id: 'course-uiux-figma',
    title: 'Thiết kế UI/UX Chuyên nghiệp với Figma & Design System 2026',
    category: 'Thiết kế UI/UX',
    instructor: {
      name: 'Minh Anh',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      role: 'Lead UI/UX Designer',
    },
    rating: 4.9,
    reviewsCount: 310,
    studentsCount: 2200,
    price: 499000,
    badge: 'Bán chạy',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 52,
    duration: '24h 15m',
  },
  {
    id: 'course-ai-gemini',
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
    badge: 'Mới ra mắt',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 45,
    duration: '28h 30m',
  },
  {
    id: 'course-devops-docker',
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
    badge: 'Nổi bật',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 60,
    duration: '36h 00m',
  },
  {
    id: 'course-mobile-react-native',
    title: 'Lập trình Mobile Đa nền tảng với React Native & Expo 2026',
    category: 'Lập trình Mobile',
    instructor: {
      name: 'Đăng Khoa',
      avatar: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=120&q=80',
      role: 'Mobile Specialist',
    },
    rating: 4.7,
    reviewsCount: 88,
    studentsCount: 750,
    price: 549000,
    badge: 'Nổi bật',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 50,
    duration: '30h 20m',
  },
  {
    id: 'course-postgres-prisma',
    title: 'Thành thạo PostgreSQL Database & Prisma ORM cho Web Developer',
    category: 'Data Science & SQL',
    instructor: {
      name: 'Phan Gia Đạt',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'Database Expert',
    },
    rating: 4.9,
    reviewsCount: 115,
    studentsCount: 940,
    price: 499000,
    badge: 'Mới ra mắt',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 40,
    duration: '22h 10m',
  },
  {
    id: 'course-cyber-security',
    title: 'Web Security Masterclass: JWT, OAuth2, XSS & CSRF Prevention',
    category: 'Cyber Security',
    instructor: {
      name: 'Trần Bảo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      role: 'Security Specialist',
    },
    rating: 4.8,
    reviewsCount: 74,
    studentsCount: 610,
    price: 599000,
    badge: 'Nổi bật',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
    lessonsCount: 38,
    duration: '20h 45m',
  },
];

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  selectedCategory,
  onClearCategoryFilter,
  searchQuery = '',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'popular' | 'rated' | 'new'>('all');
  const [page, setPage] = useState<number>(1);
  const limit = 6;
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState<number>(DEMO_COURSES.length);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addToCart, isInCart } = useCart();

  // Udemy-style Hover Popover State
  const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<any>(null);

  const handleMouseEnter = (courseId: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredCourseId(courseId);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredCourseId(null);
  };

  // Fetch courses whenever page, selectedCategory, searchQuery, or activeTab changes
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const searchTerm = searchQuery || selectedCategory || '';
        const res = await courseApi.getPublicCourses({
          page,
          limit,
          search: searchTerm || undefined,
        });

        if (res && Array.isArray(res.data)) {
          const mappedCourses: Course[] = res.data.map((c: any) => ({
            id: c.id,
            title: c.title,
            category: c.category?.name || selectedCategory || 'Lập trình Web',
            instructor: {
              name: c.instructor?.fullName || 'Phan Gia Đạt',
              avatar: c.instructor?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
              role: 'Giảng viên EduSphere',
            },
            rating: 4.9,
            reviewsCount: 150,
            studentsCount: 1200,
            price: c.price,
            thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
            lessonsCount: 45,
            duration: '25h 00m',
          }));

          if (activeTab === 'popular') {
            mappedCourses.sort((a, b) => b.studentsCount - a.studentsCount);
          } else if (activeTab === 'rated') {
            mappedCourses.sort((a, b) => b.rating - a.rating);
          }

          setCourses(mappedCourses);
          setTotalCourses(res.meta?.total ?? mappedCourses.length);
        } else {
          setCourses([]);
          setTotalCourses(0);
        }
      } catch (err) {
        console.warn('Lỗi khi nạp khóa học từ API Backend:', err);
        setCourses([]);
        setTotalCourses(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [page, selectedCategory, searchQuery, activeTab]);

  // Reset to page 1 whenever filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery, activeTab]);

  const totalPages = Math.ceil(totalCourses / limit) || 1;

  const getPaginationRange = (currentPage: number, total: number): (number | string)[] => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', total);
    } else if (currentPage >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', total);
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      const coursesElement = document.getElementById('courses');
      if (coursesElement) {
        coursesElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const formatVND = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const handleAddToCart = (course: Course) => {
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

  const handleBuyNow = (course: Course) => {
    handleAddToCart(course);
    window.location.hash = '#cart';
  };

  return (
    <section id="courses" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className="space-y-1">
          <span className="text-caption-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
            KHOẢNG TRỜI TRI THỨC
          </span>
          <h2 className="text-h2-bold text-[var(--text-primary)]">
            Danh Sách Khóa Học EduSphere
          </h2>
          
          {/* Active Category Filter Tag */}
          {selectedCategory && (
            <div className="pt-2 flex items-center gap-2">
              <span className="text-caption-medium text-[var(--text-muted)]">Đang lọc theo danh mục:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-caption-bold border border-purple-300 dark:border-purple-800">
                <Filter className="w-3.5 h-3.5" />
                {selectedCategory}
                <button
                  onClick={onClearCategoryFilter}
                  className="p-0.5 hover:bg-purple-200 dark:hover:bg-purple-900 rounded-full transition ml-1"
                  title="Xóa bộ lọc danh mục"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-[var(--neutral-surface-hover)] border border-[var(--border-color)] overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'all'
                ? 'bg-purple-600 text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Tất cả khóa học
          </button>
          <button
            onClick={() => setActiveTab('popular')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'popular'
                ? 'bg-purple-600 text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Bán chạy
          </button>
          <button
            onClick={() => setActiveTab('rated')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'rated'
                ? 'bg-purple-600 text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Đánh giá cao
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-2 rounded-lg text-p2-bold transition whitespace-nowrap ${activeTab === 'new'
                ? 'bg-purple-600 text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
          >
            Mới ra mắt
          </button>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-p2-medium text-[var(--text-secondary)]">Đang tải danh sách khóa học...</p>
        </div>
      ) : courses.length === 0 ? (
        /* Empty Filter / Search Result State */
        <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-8 shadow-sm">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-h3-bold text-[var(--text-primary)]">
            Không tìm thấy khóa học phù hợp trong Cơ sở dữ liệu
          </h3>
          <p className="text-p2-regular text-[var(--text-secondary)]">
            {searchQuery
              ? `Không có kết quả nào khớp với từ khóa tìm kiếm "${searchQuery}" từ Database.`
              : selectedCategory
              ? `Chưa có khóa học nào thuộc danh mục "${selectedCategory}".`
              : 'Hiện chưa có khóa học nào trên hệ thống.'}
          </p>
          {(selectedCategory || searchQuery) && onClearCategoryFilter && (
            <button
              onClick={onClearCategoryFilter}
              className="px-5 py-2.5 bg-purple-600 text-white text-p2-bold rounded-xl hover:bg-purple-700 transition"
            >
              Xem tất cả khóa học
            </button>
          )}
        </div>
      ) : (
        /* Courses Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => {
            const inCart = isInCart(course.id);
            const isHovered = hoveredCourseId === course.id;
            return (
              <div
                key={course.id}
                onMouseEnter={() => handleMouseEnter(course.id)}
                onMouseLeave={handleMouseLeave}
                className="relative rounded-xl bg-[var(--neutral-surface)] border border-[var(--border-color)] overflow-visible hover:border-purple-500 transition duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Container */}
                  <div 
                    onClick={() => { window.location.hash = `#course/${course.id}`; }}
                    className="relative aspect-video overflow-hidden cursor-pointer group bg-slate-100 rounded-t-xl"
                  >
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />

                    {/* Badge */}
                    {course.badge && (
                      <span className="absolute top-3 left-3 bg-purple-600 text-white text-caption-bold px-2.5 py-1 rounded-md">
                        {course.badge}
                      </span>
                    )}

                    {/* Quick Info Overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-caption-medium text-white bg-slate-900/80 px-3 py-1.5 rounded-md">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-purple-300" /> {course.lessonsCount} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-purple-300" /> {course.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-4 space-y-2.5">
                    <div className="text-caption-bold text-purple-600 dark:text-purple-400 uppercase">
                      {course.category}
                    </div>

                    <h3 
                      onClick={() => { window.location.hash = `#course/${course.id}`; }}
                      className="text-h3-bold text-[var(--text-primary)] hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer line-clamp-2 leading-snug"
                    >
                      {course.title}
                    </h3>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 pt-1">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-6 h-6 rounded-full object-cover border border-purple-500"
                      />
                      <div className="text-caption-medium text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">{course.instructor.name}</span> • {course.instructor.role}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-color)]">
                      <div className="flex items-center gap-1 text-caption-bold">
                        <span className="text-amber-500">{course.rating}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current text-amber-400" />
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
                <div className="p-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-h3-bold text-[var(--text-primary)]">
                      {formatVND(course.price)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(course)}
                      className={`p-2 rounded-lg border transition ${
                        inCart
                          ? 'bg-purple-100 dark:bg-purple-950 border-purple-400 text-purple-600 dark:text-purple-300'
                          : 'border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]'
                      }`}
                      title={inCart ? 'Đã có trong giỏ hàng' : 'Thêm vào giỏ hàng'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleBuyNow(course)}
                      className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-p2-bold transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Mua ngay
                    </button>
                  </div>
                </div>

                {/* Udemy Style Floating Course Hover Popover Card */}
                {isHovered && (
                  <div className="hidden lg:block">
                    <CourseHoverCard
                      course={course}
                      position={index % 3 === 2 ? 'left' : 'right'}
                      onNavigateDetail={() => { window.location.hash = `#course/${course.id}`; }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* FULL PAGINATION CONTROLS BAR */}
      {!isLoading && totalCourses > 0 && (
        <div className="mt-12 pt-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-caption-medium text-[var(--text-secondary)]">
            Hiển thị <strong className="text-[var(--text-primary)]">{Math.min((page - 1) * limit + 1, totalCourses)}</strong> - <strong className="text-[var(--text-primary)]">{Math.min(page * limit, totalCourses)}</strong> trong số <strong className="text-[var(--text-primary)]">{totalCourses}</strong> khóa học (Trang {page} / {totalPages})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-purple-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-p2-bold"
            >
              <ChevronLeft className="w-4 h-4" /> Trước
            </button>

            {/* Page Number Pills */}
            <div className="flex items-center gap-1">
              {getPaginationRange(page, totalPages).map((item, idx) => {
                if (typeof item === 'string') {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="w-8 h-10 flex items-center justify-center text-p2-bold text-[var(--text-muted)] select-none"
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    className={`w-10 h-10 rounded-xl text-p2-bold transition ${
                      page === item
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="p-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-purple-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 text-p2-bold"
            >
              Sau <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
