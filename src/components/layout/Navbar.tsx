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
  Search,
  Code,
  Layout,
  Brain,
  Smartphone,
  Server,
  Briefcase,
  LogOut,
  Settings,
  GraduationCap,
  ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { NotificationDropdown } from '../common/NotificationDropdown/NotificationDropdown';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onNavigateCart?: () => void;
  onSelectCategory?: (categoryName: string) => void;
  onSearchCourse?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  darkMode, 
  onToggleDarkMode,
  onNavigateCart,
  onSelectCategory,
  onSearchCourse,
}) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cartCount, cartItems, totalPrice } = useCart();
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);

  const categories = [
    { name: 'Lập trình Web', icon: Code, count: '42 khóa' },
    { name: 'Thiết kế UI/UX', icon: Layout, count: '28 khóa' },
    { name: 'AI & Machine Learning', icon: Brain, count: '25 khóa' },
    { name: 'Lập trình Mobile', icon: Smartphone, count: '18 khóa' },
    { name: 'DevOps & Cloud', icon: Server, count: '15 khóa' },
    { name: 'Data Science & SQL', icon: Briefcase, count: '20 khóa' },
  ];

  const handleCartClick = () => {
    if (onNavigateCart) {
      onNavigateCart();
    } else {
      window.location.hash = '#cart';
    }
  };

  const handleCategoryItemClick = (catName: string) => {
    setIsCategoryOpen(false);
    if (onSelectCategory) {
      onSelectCategory(catName);
    }
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [navSearchQuery, setNavSearchQuery] = useState('');

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchCourse) {
      onSearchCourse(navSearchQuery);
    }
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--neutral-surface)] border-b border-[var(--border-color)] transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 focus:outline-none rounded-lg p-1 flex-shrink-0">
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
        <div className="hidden lg:flex items-center gap-4">
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
                    <div
                      key={idx}
                      onClick={() => handleCategoryItemClick(cat.name)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[var(--neutral-surface-hover)] transition group cursor-pointer"
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
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 🔍 Udemy Style Capsule Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md lg:max-w-lg mx-2 relative">
          <form onSubmit={handleNavSearchSubmit} className="w-full relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={navSearchQuery}
              onChange={(e) => setNavSearchQuery(e.target.value)}
              placeholder="Search for anything"
              className="w-full h-10 pl-11 pr-9 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/90 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
            />
            {navSearchQuery && (
              <button
                type="button"
                onClick={() => setNavSearchQuery('')}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Dark Mode Toggle */}
          <button 
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-[var(--neutral-surface-hover)] text-[var(--text-secondary)] transition"
            aria-label="Chuyển đổi giao diện sáng tối"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* 🔔 Notifications Dropdown */}
          <NotificationDropdown />

          {/* 🛒 Shopping Cart Icon with Badge */}
          <div 
            className="relative"
            onMouseEnter={() => setIsCartHovered(true)}
            onMouseLeave={() => setIsCartHovered(false)}
          >
            <button 
              onClick={handleCartClick}
              className="relative p-2 rounded-lg hover:bg-[var(--neutral-surface-hover)] text-[var(--text-primary)] transition flex items-center justify-center group"
              aria-label="Giỏ hàng"
            >
              <ShoppingCart className="w-5.5 h-5.5 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition" />
              
              {/* Cart Badge Count Pill */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-purple-600 text-white font-black text-[11px] h-5 min-w-5 px-1 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Cart Quick Preview Dropdown on Hover */}
            {isCartHovered && cartCount > 0 && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                  <span className="text-p2-bold text-[var(--text-primary)]">Giỏ hàng ({cartCount})</span>
                  <span className="text-caption-bold text-purple-600 dark:text-purple-400">
                    đ{totalPrice.toLocaleString('vi-VN')}
                  </span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {cartItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex gap-2.5 items-center">
                      <img src={item.thumbnail} alt={item.title} className="w-12 h-9 object-cover rounded-md flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-caption-bold text-[var(--text-primary)] truncate">{item.title}</p>
                        <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">đ{item.price.toLocaleString('vi-VN')}</p>
                      </div>
                    </div>
                  ))}
                  {cartCount > 3 && (
                    <p className="text-center text-[11px] text-[var(--text-muted)] italic">
                      và {cartCount - 3} khóa học khác...
                    </p>
                  )}
                </div>

                <button
                  onClick={handleCartClick}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-caption-bold rounded-xl transition shadow text-center block"
                >
                  Chuyển đến Giỏ hàng
                </button>
              </div>
            )}
          </div>

          {/* Notification Bell */}
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
                  {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="text-p2-bold text-[var(--text-primary)] hidden sm:inline-block max-w-[120px] truncate">
                  {user.fullName || user.name}
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

                  {user.role === 'INSTRUCTOR' && (
                    <a href="/instructor/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 border border-purple-200 dark:border-purple-800 my-1">
                      <Layout className="w-4 h-4" /> Kênh Giảng viên
                    </a>
                  )}

                  <a href="#cart" onClick={handleCartClick} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-medium text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]">
                    <ShoppingCart className="w-4 h-4 text-purple-600" /> Giỏ hàng ({cartCount})
                  </a>

                  <a href="#my-courses" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-medium text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]">
                    <GraduationCap className="w-4 h-4 text-[var(--primary-600)]" /> Khóa học của tôi
                  </a>

                  <a href="#settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-p2-medium text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)]">
                    <Settings className="w-4 h-4 text-[var(--text-secondary)]" /> Cài đặt tài khoản
                  </a>

                  <button
                    onClick={() => {
                      logout();
                      window.location.hash = '#home';
                      openAuthModal('login');
                    }}
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
          <a href="#cart" onClick={() => { setIsMobileMenuOpen(false); handleCartClick(); }} className="flex items-center justify-between text-p2-bold py-2 text-[var(--text-primary)]">
            <span>Giỏ hàng</span>
            <span className="bg-purple-600 text-white font-bold text-xs px-2 py-0.5 rounded-full">{cartCount}</span>
          </a>
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
