import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Star, 
  MessageSquare, 
  Loader2,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { courseApi } from '../api/courseApi';
import { reviewApi } from '../api/reviewApi';
import type { ReviewItem, ReviewStatsResponse } from '../api/reviewApi';
import { CourseReviewForm } from '../components/course/CourseReviewForm';
import { paymentApi } from '../api/paymentApi';
import { useAuth } from '../context/AuthContext';
import { CourseDetailHero } from '../components/course/CourseDetailHero';
import { SyllabusAccordion } from '../components/course/SyllabusAccordion';
import type { ChapterData, LessonData } from '../components/course/SyllabusAccordion';
import { CoursePurchaseSidebar } from '../components/course/CoursePurchaseSidebar';
import { VideoPreviewModal } from '../components/course/VideoPreviewModal';
import { useCart } from '../context/CartContext';

interface CourseDetailPageProps {
  courseId?: string;
  onNavigateCart?: () => void;
  onNavigateHome?: () => void;
}

// Fallback dictionary for all 8 distinct courses
const ALL_DEMO_COURSES_DETAIL: Record<string, any> = {
  'course-nestjs-masterclass': {
    id: 'course-nestjs-masterclass',
    title: 'Lập trình NestJS & Microservices từ Zero đến Production',
    description: 'Khóa học thiết kế hệ thống Backend chuẩn Enterprise sử dụng NestJS, PostgreSQL, Prisma ORM, Redis Caching, Websocket Chat 1-1 và tích hợp Trợ lý AI Gemini 2.0.',
    price: 599000,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Phan Gia Đạt',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Backend Engineer & NestJS Master Architect với hơn 6 năm kinh nghiệm thiết kế hệ thống Microservices.',
    },
    category: { name: 'Lập trình Backend' },
    chapters: [
      {
        id: 'ch-nest-1',
        title: 'Chương 1: Tổng quan Kiến trúc & Khởi tạo Dự án NestJS',
        order: 1,
        lessons: [
          { id: 'l-nest-1', title: '1. Overview về NestJS Architecture & Dependency Injection', duration: 650, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-nest-2', title: '2. Cài đặt Nest CLI & Cấu trúc thư mục chuẩn Enterprise', duration: 920, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'ch-nest-2',
        title: 'Chương 2: Tích hợp Cơ sở Dữ liệu PostgreSQL với Prisma ORM',
        order: 2,
        lessons: [
          { id: 'l-nest-3', title: '3. Thiết kế Database Schema chuẩn hóa với Prisma 6', duration: 1400, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-nest-4', title: '4. Viết CRUD Operations & Global Exception Filter', duration: 1650, isFreePreview: false },
        ],
      },
    ],
  },
  'course-react-18-masterclass': {
    id: 'course-react-18-masterclass',
    title: 'React 18 & Next.js 14 Ultimate Masterclass 2026',
    description: 'Làm chủ Server Components, App Router, TailwindCSS v4 và tích hợp Cổng thanh toán Stripe tự động qua Webhook.',
    price: 699000,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Minh Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Fullstack Specialist & React Next.js Lead Developer.',
    },
    category: { name: 'Lập trình Frontend' },
    chapters: [
      {
        id: 'ch-react-1',
        title: 'Chương 1: Nền tảng React 18 & Concurrent Features',
        order: 1,
        lessons: [
          { id: 'l-react-1', title: '1. Tổng quan React 18: useTransition & Suspense', duration: 800, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-react-2', title: '2. Quản lý trạng thái ứng dụng với Zustand & React Context', duration: 1100, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'ch-react-2',
        title: 'Chương 2: Kiến trúc Next.js 14 App Router',
        order: 2,
        lessons: [
          { id: 'l-react-3', title: '3. Server Components vs Client Components trong Next.js', duration: 1350, isFreePreview: false },
          { id: 'l-react-4', title: '4. Tích hợp Cổng thanh toán Stripe & Webhook Handler', duration: 1750, isFreePreview: false },
        ],
      },
    ],
  },
  'course-uiux-figma': {
    id: 'course-uiux-figma',
    title: 'Thiết kế UI/UX Chuyên nghiệp với Figma & Design System 2026',
    description: 'Quy trình nghiên cứu trải nghiệm người dùng, xây dựng Design Tokens, Auto Layout 5.0, Component Variants và Prototype ứng dụng thực tế.',
    price: 499000,
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Minh Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      bio: 'Lead UI/UX Designer với hơn 7 năm kinh nghiệm thiết kế sản phẩm số.',
    },
    category: { name: 'Thiết kế UI/UX' },
    chapters: [
      {
        id: 'ch-uiux-1',
        title: 'Chương 1: Tư duy UX Research & Wireframing',
        order: 1,
        lessons: [
          { id: 'l-uiux-1', title: '1. Nguyên lý Thiết kế Giao diện Người dùng & UX Laws', duration: 750, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-uiux-2', title: '2. Làm chủ Figma: Auto Layout, Smart Animate & Component Set', duration: 1200, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
        ],
      },
      {
        id: 'ch-uiux-2',
        title: 'Chương 2: Xây dựng Enterprise Design System',
        order: 2,
        lessons: [
          { id: 'l-uiux-3', title: '3. Thiết lập Design Tokens (Colors, Typography, Spacing Grid)', duration: 1450, isFreePreview: false },
        ],
      },
    ],
  },
  'course-ai-gemini': {
    id: 'course-ai-gemini',
    title: 'Xây dựng Trợ lý AI với Gemini 2.0 API & LangChain Python',
    description: 'Hướng dẫn lập trình ứng dụng AI thực chiến: RAG (Retrieval-Augmented Generation), Prompt Engineering, Function Calling và kết nối Vector Database.',
    price: 799000,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Hoàng Nam',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      bio: 'AI Engineer & Generative AI Specialist.',
    },
    category: { name: 'AI & Machine Learning' },
    chapters: [
      {
        id: 'ch-ai-1',
        title: 'Chương 1: Giới thiệu Gemini 2.0 API & LLMs',
        order: 1,
        lessons: [
          { id: 'l-ai-1', title: '1. Khởi tạo Gemini 2.0 SDK với Python LangChain', duration: 850, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-ai-2', title: '2. Kỹ thuật Prompt Engineering & System Instructions', duration: 1300, isFreePreview: false },
        ],
      },
    ],
  },
  'course-devops-docker': {
    id: 'course-devops-docker',
    title: 'DevOps Thực chiến: Docker, Kubernetes, AWS & CI/CD',
    description: 'Đóng gói ứng dụng Microservices với Docker, vận hành cụm Kubernetes trên AWS EKS, viết Pipeline GitHub Actions tự động Deploy Production.',
    price: 649000,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Tuấn Anh',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      bio: 'DevOps Architect & Cloud Infrastructure Specialist.',
    },
    category: { name: 'DevOps & Cloud' },
    chapters: [
      {
        id: 'ch-devops-1',
        title: 'Chương 1: Containerization với Docker & Docker Compose',
        order: 1,
        lessons: [
          { id: 'l-devops-1', title: '1. Đóng gói ứng dụng NestJS & PostgreSQL với Dockerfile Multi-stage', duration: 900, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-devops-2', title: '2. Khởi tạo CI/CD Pipeline tự động chạy Unit Test và Deploy EC2', duration: 1700, isFreePreview: false },
        ],
      },
    ],
  },
  'course-mobile-react-native': {
    id: 'course-mobile-react-native',
    title: 'Lập trình Mobile Đa nền tảng với React Native & Expo 2026',
    description: 'Xây dựng ứng dụng di động iOS và Android từ một bộ mã nguồn TypeScript duy nhất. Kết nối Push Notifications, Camera API và Offline Storage.',
    price: 549000,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Đăng Khoa',
      avatarUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=300&q=80',
      bio: 'Mobile Specialist & React Native Architect.',
    },
    category: { name: 'Lập trình Mobile' },
    chapters: [
      {
        id: 'ch-mobile-1',
        title: 'Chương 1: Khởi đầu với Expo Router & Native UI',
        order: 1,
        lessons: [
          { id: 'l-mobile-1', title: '1. Giới thiệu React Native, Expo SDK 51 & Cấu trúc dự án Mobile', duration: 800, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-mobile-2', title: '2. Điều hướng màn hình mượt mà với Expo Router & Bottom Tabs', duration: 1150, isFreePreview: false },
        ],
      },
    ],
  },
  'course-postgres-prisma': {
    id: 'course-postgres-prisma',
    title: 'Thành thạo PostgreSQL Database & Prisma ORM cho Web Developer',
    description: 'Tối ưu chỉ mục Indexing, Query Optimization, Connection Pooling, Transaction Locks và thiết kế cơ sở dữ liệu lớn đáp ứng triệu người dùng.',
    price: 499000,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Phan Gia Đạt',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Senior Backend Engineer & Database Architect.',
    },
    category: { name: 'Data Science & SQL' },
    chapters: [
      {
        id: 'ch-postgres-1',
        title: 'Chương 1: Tối ưu SQL Truy vấn & PostgreSQL Indexing',
        order: 1,
        lessons: [
          { id: 'l-postgres-1', title: '1. Phân tích truy vấn SQL với EXPLAIN ANALYZE & B-Tree Indexing', duration: 950, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-postgres-2', title: '2. Quản lý Transactions & Isolation Levels trong Prisma ORM', duration: 1400, isFreePreview: false },
        ],
      },
    ],
  },
  'course-cyber-security': {
    id: 'course-cyber-security',
    title: 'Web Security Masterclass: JWT, OAuth2, XSS & CSRF Prevention',
    description: 'Phương pháp bảo mật hệ thống toàn diện: Phòng chống SQL Injection, XSS, CSRF, cấu hình Helmet HTTP Headers, Rate Limiting chống DDoS.',
    price: 599000,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Trần Bảo',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      bio: 'Security Specialist & Ethical Hacker.',
    },
    category: { name: 'Cyber Security' },
    chapters: [
      {
        id: 'ch-sec-1',
        title: 'Chương 1: Các lỗ hổng bảo mật Web phổ biến (OWASP Top 10)',
        order: 1,
        lessons: [
          { id: 'l-sec-1', title: '1. Phân tích đòn tấn công XSS, CSRF & Cookie SameSite', duration: 880, isFreePreview: true, videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
          { id: 'l-sec-2', title: '2. Cấu hình Throttler Rate Limiting với Redis chống Spam & DDoS', duration: 1350, isFreePreview: false },
        ],
      },
    ],
  },
};

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ 
  courseId = 'course-nestjs-masterclass',
  onNavigateCart,
  onNavigateHome,
}) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Reviews & Rating State
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStatsResponse | null>(null);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(false);

  const { addToCart, isInCart } = useCart();

  // Video Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState<LessonData | null>(null);

  const fetchReviewsAndStats = async () => {
    try {
      const [revRes, statsRes] = await Promise.all([
        reviewApi.getCourseReviews(courseId),
        reviewApi.getCourseStats(courseId),
      ]);
      if (revRes && revRes.data) {
        setReviews(revRes.data);
      }
      if (statsRes) {
        setReviewStats(statsRes);
      }
    } catch (err) {
      console.warn('Lỗi khi nạp đánh giá từ Backend:', err);
    }
  };

  useEffect(() => {
    // Scroll to top immediately when course detail mounts or courseId changes
    window.scrollTo({ top: 0, behavior: 'instant' });

    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await courseApi.getCourseDetailPublic(courseId);
        if (data && data.title) {
          setCourse(data);
        } else {
          setCourse(ALL_DEMO_COURSES_DETAIL[courseId] || ALL_DEMO_COURSES_DETAIL['course-nestjs-masterclass']);
        }
      } catch (err) {
        console.warn(`Lỗi/Dùng dữ liệu demo khóa học (${courseId}):`, err);
        setCourse(ALL_DEMO_COURSES_DETAIL[courseId] || ALL_DEMO_COURSES_DETAIL['course-nestjs-masterclass']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
    fetchReviewsAndStats();

    // Check enrollment status
    const checkEnrollment = async () => {
      if (!user) {
        setIsEnrolled(false);
        return;
      }
      try {
        const res: any = await paymentApi.getMyCourses();
        const list = Array.isArray(res) ? res : (res?.data || []);
        const found = list.some((c: any) => c.id === courseId || c.courseId === courseId);
        setIsEnrolled(!!found);
      } catch {
        setIsEnrolled(false);
      }
    };

    checkEnrollment();
  }, [courseId, user]);

  // Open Preview Modal for specific lesson
  const handleOpenLessonPreview = (lesson: LessonData) => {
    setActivePreviewLesson(lesson);
    setIsPreviewOpen(true);
  };

  // Open Main Course Preview Modal
  const handleOpenMainPreview = () => {
    const firstPreviewable = course?.chapters
      ?.flatMap((ch: any) => ch.lessons)
      ?.find((l: any) => l.isFreePreview);

    if (firstPreviewable) {
      setActivePreviewLesson(firstPreviewable);
    } else {
      setActivePreviewLesson({
        id: 'main-preview',
        title: course?.title || 'Xem trước khóa học',
        duration: 300,
        isFreePreview: true,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      });
    }
    setIsPreviewOpen(true);
  };

  const handleAddToCart = () => {
    if (!course) return;
    addToCart({
      id: course.id || courseId,
      title: course.title,
      instructorName: course.instructor?.fullName || 'Giảng viên EduSphere',
      rating: 4.9,
      ratingsCount: 142,
      totalHours: '32 total hours',
      lecturesCount: 68,
      level: 'All Levels',
      price: course.price || 599000,
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      isUpdatedRecently: true,
      isPremium: true,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (onNavigateCart) {
      onNavigateCart();
    } else {
      window.location.hash = '#cart';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-600)]" />
        <p className="text-p2-medium text-[var(--text-secondary)]">Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-h3-bold text-[var(--text-primary)]">Không tìm thấy khóa học</h3>
        <p className="text-p2-regular text-[var(--text-secondary)]">Khóa học này không tồn tại hoặc đã bị ẩn.</p>
      </div>
    );
  }

  const chapters: ChapterData[] = course.chapters || [];
  const instructor = course.instructor || { fullName: 'Phan Gia Đạt' };
  const isAlreadyInCart = isInCart(course.id);

  return (
    <div className="min-h-screen bg-[var(--neutral-bg)] transition-colors">
      
      {/* 0. Top Navigation Breadcrumb Bar */}
      <div className="bg-[var(--neutral-surface)] border-b border-[var(--border-color)] py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.hash = '#home';
            }}
            className="inline-flex items-center gap-2 text-p2-bold text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition hover:underline group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Quay lại Trang chủ / Danh sách khóa học</span>
          </button>

          <div className="text-caption-medium text-[var(--text-muted)] hidden sm:block">
            Trang chủ &gt; Khóa học &gt; <span className="text-[var(--text-primary)] font-semibold truncate max-w-[240px] inline-block align-bottom">{course.title}</span>
          </div>
        </div>
      </div>

      {/* 1. Header Hero Banner */}
      <CourseDetailHero
        title={course.title}
        description={course.description}
        categoryName={course.category?.name || 'Lập trình Backend'}
        instructorName={instructor.fullName}
        rating={4.9}
        reviewCount={reviews.length || 142}
        studentCount={1280}
      />

      {/* 2. Main Content Body (3-Column Layout: Left 68%, Right Sticky 32%) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (68% = 8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* What you'll learn card */}
            <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
              <h3 className="text-h3-bold text-[var(--text-primary)]">
                Bạn sẽ học được gì trong khóa học này?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-p2-regular text-[var(--text-primary)]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Làm chủ toàn bộ kiến thức và ứng dụng thực chiến trong dự án thực tế</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Xây dựng kiến trúc mô hình chuẩn Enterprise đáp ứng quy mô lớn</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Tối ưu hóa hiệu năng, bảo mật và quy trình phát triển chuyên nghiệp</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Được cấp Chứng chỉ Hoàn thành khóa học EduSphere Verified</span>
                </div>
              </div>
            </div>

            {/* Course Syllabus Accordion Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-h2-bold text-[var(--text-primary)]">
                  Nội dung khóa học (Syllabus)
                </h3>
                <span className="text-caption-medium text-[var(--text-muted)]">
                  {chapters.length} Chương • {chapters.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)} Bài học
                </span>
              </div>

              <SyllabusAccordion
                chapters={chapters}
                onOpenPreview={handleOpenLessonPreview}
              />
            </div>

            {/* Instructor Info Box */}
            <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
              <h3 className="text-h3-bold text-[var(--text-primary)]">Giảng viên hướng dẫn</h3>
              <div className="flex items-start gap-4">
                <img
                  src={instructor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={instructor.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                />
                <div className="space-y-1">
                  <h4 className="text-p1-bold text-[var(--text-primary)]">{instructor.fullName}</h4>
                  <p className="text-caption-medium text-purple-600 dark:text-purple-400">Chuyên gia đào tạo EduSphere Academy</p>
                  <p className="text-p2-regular text-[var(--text-secondary)] pt-1">{instructor.bio || 'Hơn 6 năm kinh nghiệm giảng dạy và phát triển sản phẩm công nghệ.'}</p>
                </div>
              </div>
            </div>

            {/* Student Reviews & Rating Form Section */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--border-color)]">
                <div>
                  <h3 className="text-h2-bold text-[var(--text-primary)]">
                    Đánh giá từ Học viên ({reviewStats?.totalReviews ?? reviews.length})
                  </h3>
                  {reviewStats && reviewStats.totalReviews > 0 ? (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-black text-amber-500">{reviewStats.averageRating}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.round(reviewStats.averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-[var(--text-secondary)]">({reviewStats.totalReviews} lượt đánh giá)</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] mt-1">Khóa học chưa có lượt đánh giá nào.</p>
                  )}
                </div>
              </div>

              {/* Review Submission Form Component */}
              <CourseReviewForm
                courseId={courseId}
                isEnrolled={isEnrolled}
                existingReview={reviews.find((r) => r.userId === user?.id)}
                onReviewSubmitted={fetchReviewsAndStats}
              />

              {/* Reviews List */}
              <div className="space-y-3">
                {reviews.length > 0 ? (
                  reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                            alt="Student Avatar"
                            className="w-10 h-10 rounded-full object-cover border border-purple-500"
                          />
                          <div>
                            <p className="text-p2-bold text-[var(--text-primary)]">{rev.user?.fullName || 'Học viên EduSphere'}</p>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="text-caption-regular text-[var(--text-muted)]">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                        </span>
                      </div>

                      <p className="text-p2-regular text-[var(--text-primary)] italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-p2-regular text-[var(--text-muted)] bg-[var(--neutral-surface)] rounded-xl border border-[var(--border-color)]">
                    <MessageSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    Chưa có đánh giá nào cho khóa học này. Hãy tham gia học và là người đầu tiên chia sẻ nhận xét!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (32% = 4 cols) Sticky Sidebar */}
          <div className="lg:col-span-4">
            <CoursePurchaseSidebar
              thumbnail={course.thumbnail}
              price={course.price || 599000}
              onOpenMainPreview={handleOpenMainPreview}
              onBuyNow={handleBuyNow}
              onAddToCart={handleAddToCart}
              isInCart={isAlreadyInCart}
              onGoToCart={onNavigateCart || (() => { window.location.hash = '#cart'; })}
            />
          </div>

        </div>
      </div>

      {/* 3. Video Preview Modal */}
      <VideoPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        videoUrl={activePreviewLesson?.videoUrl}
        lessonTitle={activePreviewLesson?.title}
        courseTitle={course?.title}
      />

    </div>
  );
};
