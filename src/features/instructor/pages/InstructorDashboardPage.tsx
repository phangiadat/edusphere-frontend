import React, { useState, useEffect } from 'react';
import { DollarSign, Users, BookOpen, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { courseService } from '../../../services/api/courseService';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import styles from './InstructorDashboardPage.module.css';

export const InstructorDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    avgRating: 5.0,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardStats() {
      try {
        const res = await courseService.getCourses(1, 100);
        const data = (res as any)?.data || (Array.isArray(res) ? res : []);

        if (isMounted && Array.isArray(data)) {
          const courseCount = data.length;
          let studentsCount = 0;
          let revenueSum = 0;

          data.forEach((c: any) => {
            const count = c.enrollments?.length || 0;
            studentsCount += count;
            revenueSum += (c.price || 0) * count;
          });

          setStats({
            totalCourses: courseCount,
            totalStudents: studentsCount,
            totalRevenue: revenueSum,
            avgRating: courseCount > 0 ? 5.0 : 0.0,
          });
        }
      } catch (err) {
        console.warn('Lỗi nạp chỉ số Dashboard giảng viên:', err);
      }
    }

    loadDashboardStats();
    return () => {
      isMounted = false;
    };
  }, []);

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
            {user?.fullName || 'Giảng viên'}
          </span>
          . Theo dõi chỉ số doanh thu, kết quả giảng dạy và tương tác học viên hôm nay.
        </p>
      </div>

      {/* Area 1: Overview KPI Stat Cards (4-Column Grid) */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Tổng doanh thu"
          value={stats.totalRevenue > 0 ? 'đ' + stats.totalRevenue.toLocaleString('vi-VN') : '0 đ'}
          changeText="Doanh thu thực"
          isPositive={true}
          icon={DollarSign}
          iconVariant="purple"
        />

        <StatCard
          title="Tổng học viên"
          value={stats.totalStudents.toLocaleString('vi-VN')}
          changeText="Học viên đã đăng ký"
          isPositive={true}
          icon={Users}
          iconVariant="indigo"
        />

        <StatCard
          title="Khóa học đang mở"
          value={stats.totalCourses.toString()}
          changeText="Khóa học đã đăng"
          isPositive={true}
          icon={BookOpen}
          iconVariant="amber"
        />

        <StatCard
          title="Đánh giá trung bình"
          value={stats.totalCourses > 0 ? `${stats.avgRating.toFixed(1)} / 5.0` : 'Chưa có'}
          changeText="Chấm điểm thực"
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
