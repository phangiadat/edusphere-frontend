import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Settings, Layers } from 'lucide-react';
import { CourseSettingsTab } from '../components/course-detail/CourseSettingsTab';
import { CurriculumTab } from '../components/course-detail/CurriculumTab';
import type { CourseItem } from '../components/courses/CourseCard';
import type { ChapterModel } from '../components/course-detail/ChapterItem';
import { ToastNotification } from '../components/common/ToastNotification';
import styles from './InstructorCourseDetailPage.module.css';

// Initial Mock Chapters Data with Sample Lessons
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
        content: 'Tổng quan về kiến trúc Module, Controller, Provider và Dependency Injection trong NestJS.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 12,
        order: 1,
        isPublished: true,
        isFreePreview: true,
      },
      {
        id: 'l-nest-2',
        title: 'Khởi tạo Nest CLI & Cấu trúc thư mục chuẩn Enterprise',
        content: 'Hướng dẫn sử dụng @nestjs/cli để khởi tạo project và tổ chức folder chuẩn hóa.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 15,
        order: 2,
        isPublished: true,
        isFreePreview: true,
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
        content: 'Viết Prisma schema model cho User, Course, Chapter, Lesson và Migration.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 20,
        order: 1,
        isPublished: true,
        isFreePreview: false,
      },
      {
        id: 'l-nest-4',
        title: 'Viết CRUD Operations & Global Exception Filter',
        content: 'Tạo Service, Controller và xử lý Exception Filter toàn cục.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 25,
        order: 2,
        isPublished: true,
        isFreePreview: false,
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
        content: 'Mã hóa mật khẩu bằng bcryptjs và sinh JWT access token.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 18,
        order: 1,
        isPublished: true,
        isFreePreview: false,
      },
    ],
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
        content: 'Tạo NestJS WebSocket Gateway kết nối Socket.io client.',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration: 22,
        order: 1,
        isPublished: false,
        isFreePreview: false,
      },
    ],
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

  const handleUpdateCourseData = (updatedFields: Partial<CourseItem>) => {
    setCourseData((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleSaveAll = () => {
    showToast('✨ Đã lưu toàn bộ thay đổi thông tin và chương trình học thành công!');
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
          className={`${styles.tabBtn} ${
            activeTab === 'settings' ? styles.activeTabBtn : ''
          }`}
        >
          <Settings className="w-4.5 h-4.5" />
          <span>Tab 1: Cài đặt chung</span>
          {activeTab === 'settings' && <div className={styles.activeTabIndicator} />}
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`${styles.tabBtn} ${
            activeTab === 'curriculum' ? styles.activeTabBtn : ''
          }`}
        >
          <Layers className="w-4.5 h-4.5" />
          <span>Tab 2: Chương trình học</span>
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
