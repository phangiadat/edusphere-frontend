import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  BookOpenCheck, 
  FolderTree, 
  DollarSign,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Tổng quan Báo cáo', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Quản lý Người dùng', path: '/admin/users', icon: Users },
    { label: 'Duyệt Khóa học', path: '/admin/courses', icon: BookOpenCheck },
    { label: 'Quản lý Danh mục', path: '/admin/categories', icon: FolderTree },
    { label: 'Tài chính & Doanh thu', path: '/admin/finance', icon: DollarSign },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 flex-shrink-0 z-30">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight leading-none">EduSphere</h1>
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest block mt-1">
              ADMIN PORTAL
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 space-y-6">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3 px-3">
              QUẢN TRỊ HỆ THỐNG
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                        isActive
                          ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button
          onClick={() => { window.location.href = '/#home'; }}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về trang chủ Học viên</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất Quản trị</span>
        </button>
      </div>
    </aside>
  );
};
