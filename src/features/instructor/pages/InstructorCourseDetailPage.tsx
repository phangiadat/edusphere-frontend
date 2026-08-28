import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Settings, Layers } from 'lucide-react';
import { CourseSettingsTab } from '../components/course-detail/CourseSettingsTab';
import { CurriculumTab } from '../components/course-detail/CurriculumTab';
import type { CourseItem } from '../components/courses/CourseCard';
import type { ChapterModel } from '../components/course-detail/ChapterItem';
import { ToastNotification } from '../components/common/ToastNotification';
import { courseService } from '../../../services/api/courseService';
import toast from 'react-hot-toast';
import styles from './InstructorCourseDetailPage.module.css';

export const InstructorCourseDetailPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  // Active Tab State: 'settings' (Cài đặt chung) | 'curriculum' (Chương trình học)
  const [activeTab, setActiveTab] = useState<'settings' | 'curriculum'>('settings');

  // Course Data State
  const [courseData, setCourseData] = useState<CourseItem>({
    id: courseId || '',
    title: 'Khóa học chưa đặt tên',
    description: '',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    status: 'DRAFT',
    categoryName: 'Lập trình Web',
    studentCount: 0,
    rating: 5.0,
  });

  // Chapters Data State
  const [chapters, setChapters] = useState<ChapterModel[]>([]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    toast.success(msg);
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
            rating: 5.0,
          });

          const rawChapters = data.chapters || [];
          const mappedChapters: ChapterModel[] = rawChapters.map((ch: any) => ({
            id: ch.id,
            title: ch.title,
            order: ch.order,
            isPublished: ch.isPublished ?? true,
            lessons: (ch.lessons || []).map((l: any) => ({
              id: l.id,
              title: l.title,
              content: l.content || '',
              videoUrl: l.videoUrl || '',
              duration: l.duration || 10,
              order: l.order,
              isPublished: l.isPublished ?? true,
              isFreePreview: l.isFreePreview ?? false,
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
      } catch (err) {
        console.warn('Lỗi khi nạp chi tiết khóa học từ Backend API:', err);
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
    if (!courseId) return;

    try {
      // 1. Update basic information
      await courseService.updateCourse(courseId, {
        title: courseData.title,
        description: courseData.description,
        price: courseData.price,
        thumbnail: courseData.thumbnail,
        status: courseData.status as any,
      });

      // 2. If status is set to PENDING, trigger submitForReview endpoint
      if (courseData.status === 'PENDING') {
        try {
          await courseService.submitForReview(courseId);
        } catch (subErr: any) {
          const message =
            subErr?.response?.data?.message ||
            'Không thể gửi duyệt khóa học. Lưu ý khóa học phải có ít nhất 1 bài giảng!';
          toast.error(message);
          return;
        }
      }

      toast.success('🎉 Đã lưu toàn bộ cấu hình và cập nhật trạng thái khóa học!');
    } catch (e: any) {
      const message = e?.response?.data?.message || 'Không thể lưu thay đổi thông tin khóa học';
      toast.error(message);
    }
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
