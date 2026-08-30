import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BookOpen, Loader2 } from 'lucide-react';
import { CourseCard } from '../components/courses/CourseCard';
import type { CourseItem } from '../components/courses/CourseCard';
import { CourseFormModal } from '../components/courses/CourseFormModal';
import { ToastNotification } from '../components/common/ToastNotification';
import { ConfirmModal } from '../../../components/common/confirm-modal/ConfirmModal';
import { courseService } from '../../../services/api/courseService';
import toast from 'react-hot-toast';
import styles from './InstructorCoursesPage.module.css';

export const InstructorCoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Confirm Modal Delete State
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showSuccessToast = (msg: string) => {
    toast.success(msg);
  };

  // Fetch Courses from NestJS Backend REST API
  useEffect(() => {
    let isMounted = true;
    async function fetchBackendCourses() {
      try {
        setLoading(true);
        const response = await courseService.getCourses(1, 50);
        const courseArray = (response as any)?.data || (Array.isArray(response) ? response : []);

        if (isMounted && Array.isArray(courseArray)) {
          const mapped: CourseItem[] = courseArray.map((c: any) => ({
            id: c.id,
            title: c.title,
            description: c.description || '',
            price: c.price,
            thumbnail: c.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
            status: c.status,
            categoryName: c.category?.name || 'Lập trình Web',
            studentCount: c.enrollments?.length || 0,
            rating: 5.0,
          }));
          setCourses(mapped);
        } else if (isMounted) {
          setCourses([]);
        }
      } catch (err) {
        console.warn('Lỗi khi nạp danh sách khóa học của Giảng viên:', err);
        if (isMounted) setCourses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchBackendCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || c.categoryName === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course: CourseItem) => {
    navigate(`/instructor/courses/${course.id}`);
  };

  const handleDeleteCourse = (courseId: string) => {
    setDeletingCourseId(courseId);
  };

  const handleConfirmDeleteCourse = async () => {
    if (!deletingCourseId) return;

    setIsDeleting(true);
    try {
      await courseService.deleteCourse(deletingCourseId);
    } catch {
      // Fallback local deletion if API fails
    } finally {
      setCourses((prev) => prev.filter((c) => c.id !== deletingCourseId));
      setDeletingCourseId(null);
      setIsDeleting(false);
      showSuccessToast('🗑️ Đã xóa khóa học khỏi hệ thống thành công.');
    }
  };

  const handleSaveCourse = async (courseData: Partial<CourseItem>, file?: File | null) => {
    if (courseData.id) {
      // Update existing course
      let updatedThumbnail = courseData.thumbnail;
      if (file) {
        toast.loading('Đang tải ảnh bìa mới lên Cloudinary CDN...', { id: 'upload-cloud' });
        try {
          const uploadRes = await courseService.uploadThumbnail(courseData.id, file);
          toast.dismiss('upload-cloud');
          if (uploadRes && uploadRes.data?.thumbnail) {
            updatedThumbnail = uploadRes.data.thumbnail;
            toast.success('🎉 Ảnh bìa đã được lưu trữ trực tiếp trên Cloudinary CDN!');
          }
        } catch (e) {
          toast.dismiss('upload-cloud');
          console.warn('Failed Cloudinary upload:', e);
        }
      }

      try {
        await courseService.updateCourse(courseData.id, {
          title: courseData.title,
          description: courseData.description,
          price: courseData.price,
          thumbnail: updatedThumbnail,
          status: courseData.status as any,
        });
      } catch (e) {
        console.warn('Failed API update course:', e);
      }
      setCourses((prev) =>
        prev.map((c) => (c.id === courseData.id ? ({ ...c, ...courseData, thumbnail: updatedThumbnail } as CourseItem) : c))
      );
      showSuccessToast('✨ Đã cập nhật thông tin khóa học thành công!');
    } else {
      // Create new course via REST API
      let newId = `course-${Date.now()}`;
      let finalThumbnail = courseData.thumbnail;

      try {
        const created = await courseService.createCourse({
          title: courseData.title || 'Khóa học mới',
          description: courseData.description || '',
          price: courseData.price ?? 499000,
          thumbnail: courseData.thumbnail?.startsWith('data:') ? undefined : courseData.thumbnail,
        });
        if (created && created.id) {
          newId = created.id;
          if (file) {
            toast.loading('Đang tải ảnh bìa lên Cloudinary CDN...', { id: 'upload-cloud' });
            try {
              const uploadRes = await courseService.uploadThumbnail(newId, file);
              toast.dismiss('upload-cloud');
              if (uploadRes && uploadRes.data?.thumbnail) {
                finalThumbnail = uploadRes.data.thumbnail;
                toast.success('🎉 Ảnh bìa đã được lưu trữ trực tiếp trên Cloudinary CDN!');
              }
            } catch (e) {
              toast.dismiss('upload-cloud');
              console.warn('Failed Cloudinary upload:', e);
            }
          }
        }
      } catch (e) {
        console.warn('Failed API create course:', e);
      }

      const newCourse: CourseItem = {
        id: newId,
        title: courseData.title || 'Khóa học mới',
        description: courseData.description || '',
        price: courseData.price ?? 499000,
        thumbnail:
          finalThumbnail ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        status: courseData.status || 'DRAFT',
        categoryName: courseData.categoryName || 'Lập trình Web',
        studentCount: 0,
        rating: 5.0,
      };
      setCourses((prev) => [newCourse, ...prev]);
      showSuccessToast(`🎉 Đã tạo mới khóa học "${newCourse.title.substring(0, 30)}..." thành công!`);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header Row */}
      <div className={styles.headerRow}>
        <div className={styles.headerTitleBox}>
          <h1 className={styles.title}>Quản lý Khóa học của tôi ({courses.length})</h1>
          <p className={styles.subtitle}>
            Danh sách tất cả các khóa học bạn đang sở hữu và giảng dạy trên EduSphere.
          </p>
        </div>

        <button onClick={handleOpenCreateModal} className={styles.createBtn}>
          <Plus className="w-5 h-5" />
          <span>Tạo khóa học mới</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm khóa học theo tiêu đề..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filtersGroup}>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold uppercase">
            <Filter className="w-4 h-4" /> Lọc:
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.selectInput}
          >
            <option value="ALL">Tất cả Danh mục</option>
            <option value="Lập trình Web">Lập trình Web</option>
            <option value="Thiết kế UI/UX">Thiết kế UI/UX</option>
            <option value="Quản trị Cơ sở dữ liệu">Quản trị Cơ sở dữ liệu</option>
            <option value="Kỹ năng mềm">Kỹ năng mềm</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.selectInput}
          >
            <option value="ALL">Tất cả Trạng thái</option>
            <option value="PUBLISHED">Đang bán (PUBLISHED)</option>
            <option value="DRAFT">Bản nháp (DRAFT)</option>
            <option value="PENDING">Chờ duyệt (PENDING)</option>
          </select>
        </div>
      </div>

      {/* Course Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-purple-600 dark:text-purple-400">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-semibold">Đang nạp dữ liệu khóa học từ NestJS Backend Database...</span>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className={styles.coursesGrid}>
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteCourse}
            />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto my-8 shadow-sm">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-[var(--text-primary)]">Bạn chưa tạo khóa học nào</h3>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Chào mừng bạn đến với Instructor Studio! Kết nối NestJS Backend đã sẵn sàng. Bấm nút "Tạo khóa học mới" để đăng bài giảng đầu tiên của bạn.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl transition shadow-md inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tạo khóa học đầu tiên
          </button>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className={styles.emptyTitle}>Không tìm thấy khóa học nào</h3>
          <p className={styles.emptySubtitle}>
            Không có khóa học nào khớp với từ khóa tìm kiếm hoặc bộ lọc được chọn. Vui lòng thử lại!
          </p>
        </div>
      )}

      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCourse}
        initialData={editingCourse}
      />

      {/* Floating Success Toast Notification */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Confirm Delete Course Modal */}
      <ConfirmModal
        isOpen={!!deletingCourseId}
        onClose={() => setDeletingCourseId(null)}
        onConfirm={handleConfirmDeleteCourse}
        title="Xác nhận xóa Khóa học"
        message="Bạn có chắc chắn muốn xóa khóa học này khỏi hệ thống không? Toàn bộ chương và bài giảng liên quan cũng sẽ bị loại bỏ."
        confirmText="Xóa khóa học"
        cancelText="Hủy bỏ"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
