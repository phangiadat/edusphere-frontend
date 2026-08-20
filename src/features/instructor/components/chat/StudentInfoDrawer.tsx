import React from 'react';
import { X, BookOpen, Calendar, Mail, Award } from 'lucide-react';
import type { ConversationItemModel } from './ConversationList';
import styles from './StudentInfoDrawer.module.css';

interface StudentInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  student: ConversationItemModel | null;
}

export const StudentInfoDrawer: React.FC<StudentInfoDrawerProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!isOpen || !student) return null;

  const progressPercent = 65; // Mock student progress

  return (
    <div className={styles.overlay}>
      <div className={styles.drawerCard}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>Hồ sơ Học viên</h3>
          <button onClick={onClose} className={styles.closeBtn}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <img
            src={student.studentAvatar}
            alt={student.studentName}
            className={styles.avatar}
          />
          <div>
            <h4 className={styles.studentName}>{student.studentName}</h4>
            <p className={styles.studentEmail}>
              <Mail className="w-3.5 h-3.5 inline mr-1" />
              {student.studentEmail}
            </p>
          </div>

          {/* Enrolled Course Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <BookOpen className="w-3.5 h-3.5 inline mr-1 text-purple-600" />
                Khóa học đã đăng ký:
              </span>
              <span className={styles.infoValue}>
                {student.courseTitle || 'Lập trình NestJS & Microservices từ Zero đến Production'}
              </span>
            </div>

            <div className={styles.infoRow}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Tiến độ bài học:</span>
                <span className="text-purple-600 dark:text-purple-400">{progressPercent}%</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                Ngày đăng ký:
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                15/08/2026
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>
                <Award className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                Bài tập đã hoàn thành:
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                2 / 3 Bài tập
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
