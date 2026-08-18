import React, { useState } from 'react';
import { 
  BookOpen, 
  Bell, 
  Moon, 
  Sun, 
  User as UserIcon, 
  ChevronDown, 
  Menu, 
  X,
  Code,
  Layout,
  Brain,
  Smartphone,
  Server,
  Briefcase,
  LogOut,
  Settings,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, onToggleDarkMode }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    { name: 'Lập trình Web', icon: Code, count: '42 khóa' },
    { name: 'UI/UX Design', icon: Layout, count: '18 khóa' },
    { name: 'AI & Machine Learning', icon: Brain, count: '25 khóa' },
    { name: 'Lập trình Mobile', icon: Smartphone, count: '15 khóa' },
    { name: 'DevOps & Cloud', icon: Server, count: '12 khóa' },
    { name: 'Kinh doanh & Marketing', icon: Briefcase, count: '20 khóa' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--neutral-surface)] border-b border-[var(--border-color)] transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 focus:outline-none rounded-lg p-1 flex-shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-600)] flex items-center justify-center text-white font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-h3-bold text-[var(--text-primary)]">
              EduSphere
            </span>
            <span className="text-caption-bold text-[var(--primary-600)] -mt-1 tracking-wider uppercase text-[9px]">
              Academy
            </span>
          </div>
        </a>

        {/* Categories Dropdown & Nav Links */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              onBlur={() => setTimeout(() => setIsCategoryOpen(false), 200)}
              className="flex items-center gap-1.5 text-p2-bold text-[var(--text-primary)] hover:text-[var(--primary-600)] py-2 px-3 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition"
            >
              <span>Danh mục</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--neutral-surface)] rounded-xl border border-[var(--border-color)] p-2 z-50 shadow-md animate-in fade-in duration-150">
                {categories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <a
                      key={idx}
                      href="#"
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[var(--primary-50)] text-[var(--primary-600)] dark:bg-slate-800 dark:text-[var(--primary-300)]">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-p2-medium text-[var(--text-primary)] group-hover:text-[var(--primary-600)]">
                          {cat.name}
                        </span>
                      </div>
                      <span className="text-caption-regular text-[var(--text-muted)]">{cat.count}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <a href="#courses" className="text-p2-bold text-[var(--text-primary)] hover:text-[var(--primary-600)] py-2 px-3 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition">
            Khóa học
          </a>
          <a href="#why-us" className="text-p2-bold text-[var(--text-primary)] hover:text-[var(--primary-600)] py-2 px-3 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition">
            Tính năng AI
          </a>
          <a href="#instructors" className="text-p2-bold text-[var(--text-primary)] hover:text-[var(--primary-600)] py-2 px-3 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition">
            Giảng viên
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-[var(--neutral-surface-hover)] text-[var(--text-secondary)] transition"
            aria-label="Chuyển đổi giao diện sáng tối"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            className="relative p-2 rounded-lg hover:bg-[var(--neutral-surface-hover)] text-[var(--text-secondary)] transition"
            aria-label="Thông báo"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--semantic-error)]"></span>
          </button>

          {/* Logged In User Dropdown or Auth Buttons */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                onBlur={() => setTimeout(() => setIsUserMenuOpen(false), 200)}
                className="flex items-center gap-2 p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--neutral-surface-hover)] transition"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--primary-600)] text-white font-bold text-sm flex items-center justify-center">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-p2-bold text-[var(--text-primary)] hidden sm:inline-block max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>

              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-xl shadow-xl p-2 z-50 animate-in fade-in duration-150 space-y-1">
                  <div className="px-3 py-2 border-b border-[var(--border-color)]">
                    <p className="text-p2-bold text-[var(--text-primary)] truncate">{user.name}</p>
                    <p className="text-caption-regular text-[var(--text-muted)] truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--primary-50)] text-[var(--primary-600)] uppercase">
                      {user.role}
                    </span>
                  </div>

                  <a href="#my-courses" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-medium text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]">
                    <GraduationCap className="w-4 h-4 text-[var(--primary-600)]" /> Khóa học của tôi
                  </a>

                  <a href="#settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-medium text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]">
                    <Settings className="w-4 h-4 text-[var(--text-secondary)]" /> Cài đặt tài khoản
                  </a>

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openAuthModal('login')}
                className="hidden sm:inline-flex items-center gap-2 text-p2-bold px-4 py-2 rounded-lg text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)] transition border border-[var(--border-color)]"
              >
                <UserIcon className="w-4 h-4" />
                Đăng nhập
              </button>

              <button 
                onClick={() => openAuthModal('register')}
                className="inline-flex items-center gap-2 text-p2-bold px-4 py-2 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white transition shadow-sm"
              >
                Đăng ký
              </button>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--neutral-surface-hover)] text-[var(--text-primary)] transition"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[var(--neutral-surface)] border-b border-[var(--border-color)] px-4 py-4 space-y-3">
          <a href="#courses" className="block text-p2-bold py-2 text-[var(--text-primary)]">Khóa học</a>
          <a href="#why-us" className="block text-p2-bold py-2 text-[var(--text-primary)]">Tính năng AI</a>
          <a href="#instructors" className="block text-p2-bold py-2 text-[var(--text-primary)]">Giảng viên</a>
          {!isAuthenticated && (
            <div className="pt-3 border-t border-[var(--border-color)] flex items-center gap-3">
              <button 
                onClick={() => openAuthModal('login')}
                className="flex-1 text-center py-2.5 rounded-lg border border-[var(--border-color)] text-p2-bold"
              >
                Đăng nhập
              </button>
              <button 
                onClick={() => openAuthModal('register')}
                className="flex-1 text-center py-2.5 rounded-lg bg-[var(--primary-600)] text-white text-p2-bold"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
