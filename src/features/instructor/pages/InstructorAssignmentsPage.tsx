import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Clock,
  CheckCircle2,
  Award
} from 'lucide-react';
import { SubmissionTable } from '../components/assignments/SubmissionTable';
import type { SubmissionModel } from '../components/assignments/SubmissionTable';
import { GradeSubmissionDrawer } from '../components/assignments/GradeSubmissionDrawer';
import { ToastNotification } from '../components/common/ToastNotification';
import { courseService } from '../../../services/api/courseService';
import toast from 'react-hot-toast';
import styles from './InstructorAssignmentsPage.module.css';

export const InstructorAssignmentsPage: React.FC = () => {
  const [submissions, setSubmissions] = useState<SubmissionModel[]>([]);
  const [instructorCourses, setInstructorCourses] = useState<{ id: string; title: string }[]>([]);
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

  // Fetch Instructor Real Courses for Filter Dropdown
  React.useEffect(() => {
    let isMounted = true;
    async function loadInstructorCourses() {
      try {
        const res = await courseService.getCourses(1, 100);
        const data = (res as any)?.data || (Array.isArray(res) ? res : []);
        if (isMounted && Array.isArray(data)) {
          setInstructorCourses(data.map((c: any) => ({ id: c.id, title: c.title })));
        }
      } catch (err) {
        console.warn('Lỗi nạp danh sách khóa học giảng viên:', err);
      }
    }
    loadInstructorCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Submissions
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    const matchesCourse = selectedCourse === 'ALL' || item.courseTitle === selectedCourse;
    return matchesSearch && matchesStatus && matchesCourse;
  });

  const totalCount = submissions.length;
  const submittedCount = submissions.filter((s) => s.status === 'SUBMITTED').length;
  const gradedCount = submissions.filter((s) => s.status === 'GRADED').length;

  const gradedItems = submissions.filter((s) => s.score !== undefined && s.score !== null);
  const avgScore =
    gradedItems.length > 0
      ? (
          gradedItems.reduce((acc, curr) => acc + (curr.score || 0), 0) / gradedItems.length
        ).toFixed(1)
      : '0.0';

  const handleOpenDrawer = (_submission: SubmissionModel, index: number) => {
    setSelectedSubmissionIndex(index);
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

  const handleSaveGrade = (submissionId: string, score: number, feedback: string) => {
    setSubmissions((prev) =>
      prev.map((item) =>
        item.id === submissionId
          ? { ...item, score, feedback, status: 'GRADED' as const }
          : item
      )
    );
    showToast(`🎉 Đã lưu kết quả chấm điểm (${score} điểm) cho học viên thành công!`);
  };

  return (
    <div className={styles.container}>
      {/* Header Title */}
      <div className={styles.headerRow}>
        <div>
          <h1 className={styles.title}>Quản lý Bài tập & Bài nộp</h1>
          <p className={styles.subtitle}>
            Chấm điểm, nhận xét và theo dõi tiến độ hoàn thành bài tập của học viên.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards (4-Column Layout) */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconBoxPurple}>
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className={styles.statLabel}>Tổng bài nộp</div>
            <div className={styles.statValue}>{totalCount}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBoxAmber}>
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className={styles.statLabel}>Chờ chấm điểm</div>
            <div className={styles.statValue}>{submittedCount}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBoxEmerald}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className={styles.statLabel}>Đã hoàn tất chấm</div>
            <div className={styles.statValue}>{gradedCount}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconBoxIndigo}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className={styles.statLabel}>Điểm trung bình</div>
            <div className={styles.statValue}>{avgScore} / 10</div>
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
            placeholder="Tìm theo tên học viên hoặc tên bài tập..."
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
            <option value="SUBMITTED"> Chờ chấm điểm</option>
            <option value="GRADED"> Đã chấm điểm</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className={styles.selectInput}
          >
            <option value="ALL"> Tất cả khóa học</option>
            {instructorCourses.map((course) => (
              <option key={course.id} value={course.title}>
                {course.title}
              </option>
            ))}
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
