import React, { useState } from 'react';
import { Plus, Search, Filter, BookOpen } from 'lucide-react';
import { CourseCard } from '../components/courses/CourseCard';
import type { CourseItem } from '../components/courses/CourseCard';
import { CourseFormModal } from '../components/courses/CourseFormModal';
import styles from './InstructorCoursesPage.module.css';

// Initial Seed Data matching Database Schema
const INITIAL_COURSES: CourseItem[] = [
  {
    id: 'course-nestjs-masterclass',
    title: 'Lập trình NestJS & Microservices từ Zero đến Production',
    description: 'Khóa học thiết kế hệ thống Backend chuẩn Enterprise sử dụng NestJS, PostgreSQL, Prisma ORM, Redis Caching, Websocket Chat 1-1 và tích hợp Trợ lý AI Gemini 2.0.',
    price: 599000,
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'Lập trình Web',
    studentCount: 450,
    rating: 4.9,
  },
  {
    id: 'course-react-18-masterclass',
    title: 'React 18 & Next.js 14 Masterclass (App Router, TailwindCSS)',
    description: 'Xây dựng Web Application chuẩn Production với React 18, Next.js 14 App Router, Server Components, State Management với Zustand và TailwindCSS.',
    price: 699000,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'Lập trình Web',
    studentCount: 380,
    rating: 4.8,
  },
  {
    id: 'course-figma-uiux-2026',
    title: 'Thiết kế UI/UX Chuyên Nghiệp với Figma 2026',
    description: 'Nắm vững quy trình thiết kế UI/UX chuẩn B2B SaaS, Design System, Auto Layout 5.0, Component Variants và Prototype tương tác cao.',
    price: 499000,
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'Thiết kế UI/UX',
    studentCount: 290,
    rating: 4.9,
  },
  {
    id: 'course-python-ai-gemini',
    title: 'Python AI & Gemini 2.0 API Masterclass (RAG, Chatbot)',
    description: 'Xây dựng ứng dụng Trợ lý AI thông minh bằng Python, LangChain, LlamaIndex, Vector Database Qdrant và Google Gemini 2.0 Flash API.',
    price: 799000,
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'AI & Machine Learning',
    studentCount: 210,
    rating: 5.0,
  },
  {
    id: 'course-devops-docker-k8s',
    title: 'Docker, Kubernetes & DevOps CI/CD Pipeline Masterclass',
    description: 'Làm chủ Containerization với Docker, Orchestration với Kubernetes, CI/CD Pipeline với GitHub Actions & ArgoCD triển khai AWS Cloud.',
    price: 649000,
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'DevOps & Cloud',
    studentCount: 160,
    rating: 4.7,
  },
  {
    id: 'course-flutter-mobile',
    title: 'Lập trình Mobile Cross-Platform với Flutter 3.x & Firebase',
    description: 'Phát triển ứng dụng di động iOS & Android từ một codebase duy nhất với Flutter 3, State Management Bloc và Backend Firebase.',
    price: 549000,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    categoryName: 'Lập trình Mobile',
    studentCount: 140,
    rating: 4.8,
  },
  {
    id: 'course-postgresql-mastery',
    title: 'PostgreSQL & Database Architecture Masterclass',
    description: 'Thiết kế cơ sở dữ liệu quan hệ tối ưu, Indexing B-Tree, Partitioning, Query Optimization và Backup Recovery trong PostgreSQL.',
    price: 450000,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    status: 'DRAFT',
    categoryName: 'PostgreSQL Database',
    studentCount: 0,
    rating: 0,
  },
  {
    id: 'course-cyber-security',
    title: 'Cyber Security & Ethical Hacking Masterclass 2026',
    description: 'Kiểm thử bảo mật Web Application, OWASP Top 10, Network Hacking, Penetration Testing và phòng chống tấn công DDoS.',
    price: 899000,
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    status: 'PENDING',
    categoryName: 'Cyber Security',
    studentCount: 0,
    rating: 0,
  },
];

export const InstructorCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

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
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khóa học này không?')) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    }
  };

  const handleSaveCourse = (courseData: Partial<CourseItem>) => {
    if (courseData.id) {
      // Update existing course
      setCourses((prev) =>
        prev.map((c) => (c.id === courseData.id ? ({ ...c, ...courseData } as CourseItem) : c))
      );
    } else {
      // Create new course
      const newCourse: CourseItem = {
        id: `course-${Date.now()}`,
        title: courseData.title || 'Khóa học mới',
        description: courseData.description || '',
        price: courseData.price ?? 499000,
        thumbnail:
          courseData.thumbnail ||
          'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        status: courseData.status || 'DRAFT',
        categoryName: courseData.categoryName || 'Lập trình Web',
        studentCount: 0,
        rating: 5.0,
      };
      setCourses((prev) => [newCourse, ...prev]);
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
            <option value="AI & Machine Learning">AI & Machine Learning</option>
            <option value="Lập trình Mobile">Lập trình Mobile</option>
            <option value="DevOps & Cloud">DevOps & Cloud</option>
            <option value="PostgreSQL Database">PostgreSQL Database</option>
            <option value="Cyber Security">Cyber Security</option>
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
      {filteredCourses.length > 0 ? (
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
    </div>
  );
};
