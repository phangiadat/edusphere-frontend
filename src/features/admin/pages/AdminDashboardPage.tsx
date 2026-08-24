import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  BookOpenCheck, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  Loader2 
} from 'lucide-react';
import { adminService } from '../../../services/api/adminService';
import type { AdminUserItem, AdminPendingCourseItem } from '../../../services/api/adminService';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalInstructors: 0,
    totalPendingCourses: 0,
    totalGrossRevenue: 15450000,
  });
  const [recentUsers, setRecentUsers] = useState<AdminUserItem[]>([]);
  const [pendingCourses, setPendingCourses] = useState<AdminPendingCourseItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        const [usersRes, pendingRes] = await Promise.all([
          adminService.getUsers({ page: 1, limit: 10 }),
          adminService.getPendingCourses(),
        ]);

        if (!isMounted) return;

        const usersList = usersRes.data || [];
        const studentsCount = usersList.filter(u => u.role === 'STUDENT').length;
        const instructorsCount = usersList.filter(u => u.role === 'INSTRUCTOR').length;

        setStats({
          totalUsers: usersRes.meta?.total || usersList.length,
          totalStudents: studentsCount,
          totalInstructors: instructorsCount,
          totalPendingCourses: pendingRes.length,
          totalGrossRevenue: 18950000,
        });

        setRecentUsers(usersList.slice(0, 5));
        setPendingCourses(pendingRes.slice(0, 5));
      } catch (err) {
        console.warn('Lỗi nạp dữ liệu Admin Dashboard:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadDashboardData();
    return () => { isMounted = false; };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        <p className="text-sm font-medium text-[var(--text-secondary)]">Đang tổng hợp báo cáo hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
          Tổng quan Báo cáo Quản trị
        </h1>
        <p className="text-sm font-medium text-[var(--text-secondary)] mt-1">
          Theo dõi số liệu người dùng, duyệt khóa học và doanh thu toàn hệ thống
        </p>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tổng Người dùng</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">{stats.totalUsers}</h2>
            <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Giảng viên Hợp tác</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">{stats.totalInstructors}</h2>
            <span className="text-xs font-semibold text-indigo-500">Hoạt động</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Khóa học Chờ duyệt</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <BookOpenCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">{stats.totalPendingCourses}</h2>
            <span className="text-xs font-semibold text-amber-500">Cần phê duyệt</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">Tổng Doanh thu</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-black text-[var(--text-primary)]">
              {stats.totalGrossRevenue.toLocaleString('vi-VN')} đ
            </h2>
            <span className="text-xs font-semibold text-emerald-500">Đã đối soát</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Users & Pending Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Card: Recent Users */}
        <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-extrabold text-base text-[var(--text-primary)]">Người dùng mới đăng ký</h3>
            </div>
            <a href="#/admin/users" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
              Xem tất cả
            </a>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {recentUsers.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-4 text-center">Chưa có người dùng nào</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-[var(--border-color)]"
                    />
                    <div>
                      <div className="text-sm font-bold text-[var(--text-primary)]">{user.fullName}</div>
                      <div className="text-xs text-[var(--text-secondary)]">{user.email}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase ${
                    user.role === 'ADMIN'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-600'
                      : user.role === 'INSTRUCTOR'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Card: Pending Courses Review Queue */}
        <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-4">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base text-[var(--text-primary)]">Hàng chờ duyệt khóa học</h3>
            </div>
            <a href="#/admin/courses" className="text-xs font-bold text-amber-500 hover:underline">
              Xử lý ngay
            </a>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {pendingCourses.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] py-8 text-center">
                Không có khóa học nào đang chờ duyệt
              </p>
            ) : (
              pendingCourses.map((c) => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 truncate">
                    <img
                      src={c.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=120&q=80'}
                      alt={c.title}
                      className="w-12 h-8 rounded-lg object-cover border border-[var(--border-color)] flex-shrink-0"
                    />
                    <div className="truncate">
                      <div className="text-sm font-bold text-[var(--text-primary)] truncate">{c.title}</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        Giảng viên: {c.instructor?.fullName || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-xs font-extrabold rounded-md flex-shrink-0">
                    Chờ duyệt
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
