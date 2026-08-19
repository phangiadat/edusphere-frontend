import React from 'react';
import { DollarSign, Users, BookOpen, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import styles from './InstructorDashboardPage.module.css';

export const InstructorDashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.container}>
      {/* Top Banner Header */}
      <div className={styles.headerBanner}>
        <div className={styles.bannerBadge}>
          <Sparkles className="w-4 h-4" /> B2B SaaS Instructor Studio
        </div>
        <h1 className={styles.bannerTitle}>Welcome to Instructor Dashboard</h1>
        <p className={styles.bannerSubtitle}>
          Xin chào giảng viên{' '}
          <span className={styles.instructorHighlight}>
            {user?.fullName || 'Phan Gia Đạt'}
          </span>
          . Theo dõi chỉ số doanh thu, kết quả giảng dạy và tương tác học viên hôm nay.
        </p>
      </div>

      {/* Area 1: Overview KPI Stat Cards (4-Column Grid) */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Tổng doanh thu"
          value="$4,500"
          changeText="+12.5%"
          isPositive={true}
          icon={DollarSign}
          iconVariant="purple"
        />

        <StatCard
          title="Tổng học viên"
          value="1,240"
          changeText="+8.2%"
          isPositive={true}
          icon={Users}
          iconVariant="indigo"
        />

        <StatCard
          title="Khóa học đang mở"
          value="12"
          changeText="Active"
          isPositive={true}
          icon={BookOpen}
          iconVariant="amber"
        />

        <StatCard
          title="Đánh giá trung bình"
          value="4.8 / 5.0"
          changeText="310 lượt"
          isPositive={true}
          icon={Star}
          iconVariant="emerald"
        />
      </div>

      {/* Areas 2 & 3: Revenue Chart & Recent Activity (Responsive 2-Column Layout) */}
      <div className={styles.bottomGrid}>
        <RevenueChart />
        <RecentActivity />
      </div>
    </div>
  );
};
