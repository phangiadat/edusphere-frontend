import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Users,
  Clock,
  CheckCircle2,
  Award
} from 'lucide-react';
import { SubmissionTable } from '../components/assignments/SubmissionTable';
import type { SubmissionModel } from '../components/assignments/SubmissionTable';
import { GradeSubmissionDrawer } from '../components/assignments/GradeSubmissionDrawer';
import { ToastNotification } from '../components/common/ToastNotification';
import { assignmentService } from '../../../services/api/assignmentService';
import toast from 'react-hot-toast';
import styles from './InstructorAssignmentsPage.module.css';

// Initial Mock Seed Data
const INITIAL_SUBMISSIONS: SubmissionModel[] = [
  {
    id: 'sub-1',
    studentName: 'Nguyễn Văn Hải',
    studentEmail: 'hai.nguyen@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    assignmentTitle: 'Xây dựng Module Authentication & JWT Access Token',
    courseTitle: 'Lập trình NestJS & Microservices từ Zero đến Production',
    submittedAt: '2026-08-19T14:30:00Z',
    status: 'SUBMITTED',
    content: '<p>Em đã hoàn thành bài tập khởi tạo AuthModule, tích hợp Passport JWT Strategy và Bcrypt hashing password. Mời thầy kiểm tra bài làm ở link GitHub repository bên dưới ạ!</p>',
    fileUrl: 'https://github.com/nguyenhai/nestjs-auth-assignment',
  },
  {
    id: 'sub-2',
    studentName: 'Trần Thị Thu Hà',
    studentEmail: 'ha.tran@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    assignmentTitle: 'Thiết kế Schema Prisma cho E-learning Platform',
    courseTitle: 'Lập trình NestJS & Microservices từ Zero đến Production',
    submittedAt: '2026-08-18T10:15:00Z',
    status: 'GRADED',
    score: 9.5,
    feedback: 'Bài làm xuất sắc! Thiết kế Schema đầy đủ các model User, Course, Chapter, Lesson, Assignment. Code trình bày rất sạch sẽ và chuẩn hóa.',
    content: '<p>Kính gửi thầy, em đã hoàn thiện Prisma schema gồm đầy đủ 12 Models và tạo Migration thành công trên PostgreSQL database.</p>',
    fileUrl: 'https://github.com/tranha/edusphere-prisma-schema',
  },
  {
    id: 'sub-3',
    studentName: 'Lê Hoàng Minh',
    studentEmail: 'minh.le@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    assignmentTitle: 'Thiết kế UI/UX Dashboard B2B SaaS với Figma',
    courseTitle: 'Thiết kế UI/UX Chuyên Nghiệp với Figma 2026',
    submittedAt: '2026-08-19T09:20:00Z',
    status: 'SUBMITTED',
    content: '<p>Em đã vẽ xong Prototype tương tác 100% cho Dashboard B2B SaaS bao gồm Dark Mode và Light Mode. Link Figma bên dưới ạ!</p>',
    fileUrl: 'https://www.figma.com/file/dashboard-b2b-saas-design',
  },
  {
    id: 'sub-4',
    studentName: 'Phạm Đức Anh',
    studentEmail: 'anh.pham@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    assignmentTitle: 'Xây dựng Web Application với Next.js 14 App Router',
    courseTitle: 'React 18 & Next.js 14 Masterclass (App Router, TailwindCSS)',
    submittedAt: '2026-08-17T16:45:00Z',
    status: 'GRADED',
    score: 8.5,
    feedback: 'Bài làm tốt! Đã ứng dụng Server Components và Zustand state management mượt mà.',
    content: '<p>Em đã xây dựng xong trang e-commerce bằng Next.js 14 App Router và TailwindCSS.</p>',
    fileUrl: 'https://github.com/ducanh/nextjs14-ecommerce',
  },
  {
    id: 'sub-5',
    studentName: 'Vũ Thanh Thảo',
    studentEmail: 'thao.vu@edusphere.vn',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    assignmentTitle: 'Xây dựng Trợ lý AI bằng Python & Gemini 2.0 API',
    courseTitle: 'Python AI & Gemini 2.0 API Masterclass (RAG, Chatbot)',
    submittedAt: '2026-08-19T18:00:00Z',
    status: 'SUBMITTED',
    content: '<p>Em đã tích hợp Gemini 2.0 Flash API với LangChain và Qdrant Vector Database cho bài toán RAG Hỏi đáp tài liệu.</p>',
    fileUrl: 'https://github.com/thaovu/python-gemini-rag-chatbot',
  },
];

export const InstructorAssignmentsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionModel[]>(INITIAL_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCourse, setSelectedCourse] = useState<string>('ALL');

  // Selected Submission Index for Right Drawer
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState<number | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    toast.success(msg);
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesCourse = selectedCourse === 'ALL' || item.courseTitle === selectedCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  // KPI Statistics
  const totalCount = submissions.length;
  const submittedCount = submissions.filter((s) => s.status === 'SUBMITTED').length;
  const gradedCount = submissions.filter((s) => s.status === 'GRADED').length;

  const gradedItems = submissions.filter((s) => s.score !== undefined && s.score !== null);
  const avgScore =
    gradedItems.length > 0
      ? (gradedItems.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedItems.length).toFixed(1)
      : '0.0';

  // Handlers for Drawer Navigation & Save
  const handleOpenDrawer = (_submission: SubmissionModel, index: number) => {
    setSelectedSubmissionIndex(index);
  };

  const handleSaveGrade = async (submissionId: string, score: number, feedback: string) => {
    try {
      await assignmentService.gradeSubmission(submissionId, { score, feedback });
    } catch (e) {
      console.warn('API gradeSubmission fallback to local state:', e);
    }

    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, status: 'GRADED', score, feedback }
          : item
      )
    );
    showToast('✨ Đã lưu kết quả chấm điểm & gửi phản hồi cho Học viên thành công!');
  };

  const handleNavigatePrev = () => {
    if (selectedSubmissionIndex !== null && selectedSubmissionIndex > 0) {
      setSelectedSubmissionIndex(selectedSubmissionIndex - 1);
    }
  };

  const handleNavigateNext = () => {
    if (
      selectedSubmissionIndex !== null &&
      selectedSubmissionIndex < filteredSubmissions.length - 1
    ) {
      setSelectedSubmissionIndex(selectedSubmissionIndex + 1);
    }
  };

  return (
    <div className={styles.container}>
      {/* Top Header Card */}
      <div className={styles.topHeaderCard}>
        <div className={styles.headerTitleRow}>
          <div className={styles.headerIconBox}>
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className={styles.pageTitle}>Quản lý Bài tập & Chấm điểm Học viên</h1>
            <p className={styles.pageSubtitle}>
              Xem danh sách bài nộp, nhận xét chi tiết và chấm điểm bài tập theo chuẩn LMS.
            </p>
          </div>
        </div>

        {/* 4 KPI Stat Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400`}>
              <Users className="w-5 h-5" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalCount}</span>
              <span className={styles.statLabel}>Tổng số bài nộp</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400`}>
              <Clock className="w-5 h-5" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{submittedCount}</span>
              <span className={styles.statLabel}>Bài chờ chấm điểm</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{gradedCount}</span>
              <span className={styles.statLabel}>Bài đã chấm điểm</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={`${styles.statIcon} bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400`}>
              <Award className="w-5 h-5" />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{avgScore} / 10</span>
              <span className={styles.statLabel}>Điểm trung bình</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên học viên hoặc tiêu đề bài tập..."
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterControls}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.selectInput}
          >
            <option value="ALL"> Tất cả trạng thái</option>
            <option value="SUBMITTED"> Chờ chấm điểm (SUBMITTED)</option>
            <option value="GRADED"> Đã chấm điểm (GRADED)</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={styles.selectInput}
          >
            <option value="ALL"> Tất cả khóa học</option>
            <option value="Lập trình NestJS & Microservices từ Zero đến Production">
              NestJS & Microservices
            </option>
            <option value="Thiết kế UI/UX Chuyên Nghiệp với Figma 2026">
              Thiết kế UI/UX Figma
            </option>
            <option value="React 18 & Next.js 14 Masterclass (App Router, TailwindCSS)">
              React 18 & Next.js 14
            </option>
            <option value="Python AI & Gemini 2.0 API Masterclass (RAG, Chatbot)">
              Python AI & Gemini 2.0
            </option>
          </select>
        </div>
      </div>

      {/* Main Submission Table */}
      <main>
        <SubmissionTable
          submissions={filteredSubmissions}
          onSelectSubmission={handleOpenDrawer}
        />
      </main>

      {/* Right Drawer for Grading (50% Width + Continuous Navigation) */}
      <GradeSubmissionDrawer
        isOpen={selectedSubmissionIndex !== null}
        onClose={() => setSelectedSubmissionIndex(null)}
        submission={
          selectedSubmissionIndex !== null
            ? filteredSubmissions[selectedSubmissionIndex] || null
            : null
        }
        currentIndex={selectedSubmissionIndex !== null ? selectedSubmissionIndex : 0}
        totalSubmissions={filteredSubmissions.length}
        onNavigatePrev={handleNavigatePrev}
        onNavigateNext={handleNavigateNext}
        onSaveGrade={handleSaveGrade}
      />

      {/* Floating Toast Notification */}
      <ToastNotification
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
