import React from 'react';
import { FileCheck, CheckCircle2, Clock, Inbox } from 'lucide-react';
import styles from './SubmissionTable.module.css';

export interface SubmissionModel {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  assignmentTitle: string;
  courseTitle: string;
  submittedAt: string;
  status: 'SUBMITTED' | 'GRADED';
  score?: number | null;
  content?: string;
  fileUrl?: string;
  feedback?: string;
}

interface SubmissionTableProps {
  submissions: SubmissionModel[];
  onSelectSubmission: (submission: SubmissionModel, index: number) => void;
}

export const SubmissionTable: React.FC<SubmissionTableProps> = ({
  submissions,
  onSelectSubmission,
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.tableCard}>
      {submissions.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th className={styles.th}>Học viên</th>
                <th className={styles.th}>Bài tập & Khóa học</th>
                <th className={styles.th}>Thời gian nộp</th>
                <th className={styles.th}>Trạng thái</th>
                <th className={styles.th}>Điểm số</th>
                <th className={styles.th} style={{ textAlign: 'right' }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((item, index) => (
                <tr key={item.id} className={styles.tr}>
                  {/* Student Info */}
                  <td className={styles.td}>
                    <div className={styles.studentGroup}>
                      <img
                        src={item.studentAvatar}
                        alt={item.studentName}
                        className={styles.avatar}
                      />
                      <div className={styles.studentInfo}>
                        <span className={styles.studentName}>{item.studentName}</span>
                        <span className={styles.studentEmail}>{item.studentEmail}</span>
                      </div>
                    </div>
                  </td>

                  {/* Assignment & Course */}
                  <td className={styles.td}>
                    <div className={styles.assignmentGroup}>
                      <span className={styles.assignmentTitle}>{item.assignmentTitle}</span>
                      <span className={styles.courseTitle}>{item.courseTitle}</span>
                    </div>
                  </td>

                  {/* Submitted Date */}
                  <td className={styles.td}>
                    <span className="text-xs text-slate-500 font-medium">
                      {formatDate(item.submittedAt)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className={styles.td}>
                    {item.status === 'GRADED' ? (
                      <span className={`${styles.statusBadge} ${styles.statusGraded}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã chấm điểm</span>
                      </span>
                    ) : (
                      <span className={`${styles.statusBadge} ${styles.statusSubmitted}`}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>Chờ chấm điểm</span>
                      </span>
                    )}
                  </td>

                  {/* Score */}
                  <td className={styles.td}>
                    {item.score !== undefined && item.score !== null ? (
                      <span className={styles.scoreText}>{item.score.toFixed(1)} / 10</span>
                    ) : (
                      <span className={styles.scoreEmpty}>Chưa chấm</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className={styles.td} style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onSelectSubmission(item, index)}
                      className={styles.gradeBtn}
                    >
                      <FileCheck className="w-3.5 h-3.5" />
                      <span>{item.status === 'GRADED' ? 'Xem & Sửa điểm' : 'Chấm điểm'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Inbox className="w-10 h-10 text-purple-500" />
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Không có bài nộp nào khớp với điều kiện lọc
          </div>
          <div className="text-xs text-slate-500">
            Vui lòng thử chọn lại khóa học hoặc trạng thái khác.
          </div>
        </div>
      )}
    </div>
  );
};
