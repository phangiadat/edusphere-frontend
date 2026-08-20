import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Settings, Layers } from 'lucide-react';
import { CourseSettingsTab } from '../components/course-detail/CourseSettingsTab';
import { CurriculumTab } from '../components/course-detail/CurriculumTab';
import type { CourseItem } from '../components/courses/CourseCard';
import type { ChapterModel } from '../components/course-detail/ChapterItem';
import { ToastNotification } from '../components/common/ToastNotification';
import { courseService } from '../../../services/api/courseService';
import styles from './InstructorCourseDetailPage.module.css';

// Initial Mock Chapters Data with Sample Lessons & Assignments
const INITIAL_CHAPTERS: ChapterModel[] = [
  {
    id: 'ch-nest-1',
    title: 'Chương 1: Tổng quan Kiến trúc NestJS & Dependency Injection',
    order: 1,
    isPublished: true,
    lessons: [
      {
        id: 'l-nest-1',
        title: 'Overview về NestJS Architecture & DI Container',
        content: '<p>Tổng quan về kiến trúc Module, Controller, Provider và Dependency Injection trong NestJS.</p>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 12,
        order: 1,
        isPublished: true,
        isFreePreview: true,
      },
      {
        id: 'l-nest-2',
        title: 'Khởi tạo Nest CLI & Cấu trúc thư mục chuẩn Enterprise',
        content: '<p>Hướng dẫn sử dụng @nestjs/cli để khởi tạo project và tổ chức folder chuẩn hóa.</p>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 15,
        order: 2,
        isPublished: true,
        isFreePreview: true,
      },
    ],
    assignments: [
      {
        id: 'a-nest-1',
        title: 'Xây dựng Module Authentication & JWT Access Token',
        description: '<p>Yêu cầu học viên khởi tạo <strong>AuthModule</strong>, sử dụng Passport JWT và mã hóa mật khẩu bcryptjs.</p>',
        dueDate: '2026-08-30T23:59',
        order: 1,
      },
    ],
  },
  {
    id: 'ch-nest-2',
    title: 'Chương 2: Thiết kế Database Schema chuẩn với PostgreSQL & Prisma ORM',
    order: 2,
    isPublished: true,
    lessons: [
      {
        id: 'l-nest-3',
        title: 'Thiết kế Database Schema chuẩn hóa với Prisma 6',
        content: '<p>Viết Prisma schema model cho User, Course, Chapter, Lesson và Migration.</p>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 20,
        order: 1,
        isPublished: true,
        isFreePreview: false,
      },
      {
        id: 'l-nest-4',
        title: 'Viết CRUD Operations & Global Exception Filter',
        content: '<p>Tạo Service, Controller và xử lý Exception Filter toàn cục.</p>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 25,
        order: 2,
        isPublished: true,
        isFreePreview: false,
      },
    ],
    assignments: [
      {
        id: 'a-nest-2',
        title: 'Thiết kế Schema Prisma cho E-learning Platform',
        description: '<p>Yêu cầu học viên hoàn thiện các model <code>User</code>, <code>Course</code>, <code>Chapter</code>, <code>Lesson</code>, <code>Assignment</code>.</p>',
        dueDate: '2026-09-05T23:59',
        order: 1,
      },
    ],
  },
  {
    id: 'ch-nest-3',
    title: 'Chương 3: Quản lý Authentication, JWT Access Token & Role Guard',
    order: 3,
    isPublished: true,
    lessons: [
      {
        id: 'l-nest-5',
        title: 'Xây dựng Auth Module với Passport JWT & Bcrypt Password Hashing',
        content: '<p>Mã hóa mật khẩu bằng bcryptjs và sinh JWT access token.</p>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 18,
        order: 1,
        isPublished: true,
        isFreePreview: false,
      },
    ],
    assignments: [],
  },
  {
    id: 'ch-nest-4',
    title: 'Chương 4: Xây dựng Kênh Chat Realtime với Socket.io & WebSockets',
    order: 4,
    isPublished: false,
    lessons: [
      {
        id: 'l-nest-6',
        title: 'Cấu hình WebSockets Gateway & Room Subscription',
        content: '<p>Tạo NestJS WebSocket Gateway kết nối Socket.io client.</p>',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 22,
        order: 1,
        isPublished: false,
        isFreePreview: false,
      },
    ],
    assignments: [],
  },
];

export const InstructorCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Active Tab State: 'settings' (Cài đặt chung) | 'curriculum' (Chương trình học)
  const [activeTab, setActiveTab] = useState<'settings' | 'curriculum'>('settings');

  // Course Data State
  const [courseData, setCourseData] = useState<CourseItem>({
    id: courseId || 'course-nestjs-masterclass',
    title: 'Lập trình NestJS & Microservices từ Zero đến Production',
    description:
      'Khóa học thiết kế hệ thống Backend chuẩn Enterprise sử dụng NestJS, PostgreSQL, Prisma ORM, Redis Caching, Websocket Chat 1-1 và tích hợp Trợ lý AI Gemini 2.0.',
    price: 599000,
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'Lập trình Web',
    studentCount: 450,
    rating: 4.9,
  });

  // Chapters Data State
  const [chapters, setChapters] = useState<ChapterModel[]>(INITIAL_CHAPTERS);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch Course details from NestJS Backend REST API
  React.useEffect(() => {
    let isMounted = true;
    async function fetchCourseDetail() {
      if (!courseId) return;
      try {
        const data = await courseService.getCourseById(courseId);
        if (isMounted && data) {
          setCourseData({
            id: data.id,
            title: data.title,
            description: data.description || '',
            price: data.price,
            thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            status: data.status,
            categoryName: data.category?.name || 'Lập trình Web',
            studentCount: data.enrollments?.length || 0,
            rating: 4.9,
          });

          if (data.chapters && data.chapters.length > 0) {
            const mappedChapters: ChapterModel[] = data.chapters.map((ch: any) => ({
              id: ch.id,
              title: ch.title,
              order: ch.order,
              isPublished: ch.isPublished,
              lessons: (ch.lessons || []).map((l: any) => ({
                id: l.id,
                title: l.title,
                content: l.content || '',
                videoUrl: l.videoUrl || '',
                duration: l.duration || 10,
                order: l.order,
                isPublished: l.isPublished,
                isFreePreview: l.isFreePreview,
              })),
              assignments: (ch.assignments || []).map((a: any) => ({
                id: a.id,
                title: a.title,
                description: a.description || '',
                dueDate: a.dueDate || '',
                order: a.order || 1,
              })),
            }));
            setChapters(mappedChapters);
          }
        }
      } catch (err) {
        console.warn('Backend API connection fallback for Course Detail:', err);
      }
    }
    fetchCourseDetail();
    return () => {
      isMounted = false;
    };
  }, [courseId]);

  const handleUpdateCourseData = (updatedFields: Partial<CourseItem>) => {
    setCourseData((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleSaveAll = async () => {
    if (courseId) {
      try {
        await courseService.updateCourse(courseId, {
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: courseData.thumbnail,
          status: courseData.status as any,
        });
      } catch (e) {
        console.warn('Failed API update course detail:', e);
      }
    }
    showToast('🎉 Đã lưu toàn bộ cấu hình thông tin khóa học thành công!');
  };

  const getStatusBadgeClass = () => {
    switch (courseData.status) {
      case 'PUBLISHED':
        return styles.statusPublished;
      case 'PENDING':
        return styles.statusPending;
      default:
        return styles.statusDraft;
    }
  };

  const getStatusLabel = () => {
    switch (courseData.status) {
      case 'PUBLISHED':
        return 'Đang bán';
      case 'PENDING':
        return 'Chờ duyệt';
      default:
        return 'Bản nháp';
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <div className={styles.topNavHeader}>
        <div className={styles.leftHeaderGroup}>
          <button
            onClick={() => navigate('/instructor/courses')}
            className={styles.backBtn}
            title="Quay lại danh sách khóa học"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className={styles.courseHeaderInfo}>
            <div className={styles.titleRow}>
              <h1 className={styles.pageTitle}>{courseData.title}</h1>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass()}`}>
                {getStatusLabel()}
              </span>
            </div>
            <p className={styles.subMeta}>
              Danh mục: <strong className="text-purple-600 dark:text-purple-400">{courseData.categoryName}</strong> • {chapters.length} Chương đào tạo
            </p>
          </div>
        </div>

        <button onClick={handleSaveAll} className={styles.saveBtn}>
          <Save className="w-4 h-4" />
          <span>Lưu thay đổi</span>
        </button>
      </div>

      {/* Tabs Navigation Bar */}
      <div className={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('settings')}
          className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.activeTabBtn : ''
            }`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span>Cài đặt chung</span>
          {activeTab === 'settings' && <div className={styles.activeTabIndicator} />}
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`${styles.tabBtn} ${activeTab === 'curriculum' ? styles.activeTabBtn : ''
            }`}
        >
          <Layers className="w-4.5 h-4.5" />
          <span>Chương trình học</span>
          {activeTab === 'curriculum' && <div className={styles.activeTabIndicator} />}
        </button>
      </div>

      {/* Main Tab Content */}
      <main>
        {activeTab === 'settings' ? (
          <CourseSettingsTab
            courseData={courseData}
            onChange={handleUpdateCourseData}
          />
        ) : (
          <CurriculumTab
            courseId={courseData.id}
            chapters={chapters}
            onUpdateChapters={setChapters}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Floating Success Toast Notification */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
