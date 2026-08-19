import React from 'react';
import { Users, GraduationCap, Star, DollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import styles from './InstructorDashboardPage.module.css';

export const InstructorDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      {/* Welcome Banner Card */}
      <div className={styles.welcomeCard}>
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-widest mb-1">
          <Sparkles className="w-4 h-4" /> Instructor Management Studio
        </div>
        <h1 className={styles.welcomeTitle}>Welcome to Instructor Dashboard</h1>
        <p className={styles.welcomeSubtitle}>
          Xin chào giảng viên <span className="font-bold text-white underline">{user?.fullName || 'Phan Gia Đạt'}</span>. Hệ thống đã sẵn sàng cho hoạt động quản lý khóa học và giảng dạy!
        </p>
      </div>

      {/* Stats Cards Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.statIcon} bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400`}>
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className={styles.statVal}>1,850</div>
            <div className={styles.statLabel}>Tổng học viên</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400`}>
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className={styles.statVal}>8</div>
            <div className={styles.statLabel}>Khóa học đang mở</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400`}>
            <Star className="w-6 h-6" />
          </div>
          <div>
            <div className={styles.statVal}>4.9 / 5.0</div>
            <div className={styles.statLabel}>Đánh giá trung bình</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.statIcon} bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400`}>
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className={styles.statVal}>48.5M ₫</div>
            <div className={styles.statLabel}>Doanh thu tháng này</div>
          </div>
        </div>
      </div>
    </div>
  );
};
