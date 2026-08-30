import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { BookOpen, LogIn, Loader2, ArrowLeft, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await login({ email, password });
      
      // Read stored user after login to check role
      const storedUser = localStorage.getItem('user_info');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && user.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (user && user.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      console.error('Lỗi đăng nhập:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string | string[] } } };
        const msg = responseError.response?.data?.message;
        if (Array.isArray(msg)) {
          setErrorMessage(msg.join(', '));
        } else if (typeof msg === 'string') {
          setErrorMessage(msg);
        } else {
          setErrorMessage('Email hoặc mật khẩu không chính xác!');
        }
      } else {
        setErrorMessage('Không thể kết nối đến hệ thống Backend!');
      }
    }
  };



  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        
        {/* Back link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại Trang chủ
          </button>
        </div>

        {/* Brand Header */}
        <div className={styles.brandHeader}>
          <div className={styles.brandLogo}>
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className={styles.title}>Đăng Nhập EduSphere</h1>
          <p className={styles.subtitle}>Cổng thông tin dành cho Quản trị viên, Giảng viên & Học viên</p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className={styles.formGroup}>
            <label className={styles.label}>Email đăng nhập</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ví dụ: admin@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <div className="flex items-center justify-between mb-1">
              <label className={styles.label}>Mật khẩu</label>
              <button
                type="button"
                onClick={() => toast('Vui lòng liên hệ Quản trị viên EduSphere để hỗ trợ khôi phục mật khẩu!', { icon: 'ℹ️' })}
                className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
              />
              <span>Ghi nhớ đăng nhập</span>
            </label>
          </div>

          <button type="submit" disabled={isLoading} className={styles.submitBtn}>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập hệ thống</span>
              </>
            )}
          </button>
        </form>

        {/* Signup redirection link */}
        <div className="mt-4 text-center text-xs text-slate-600 dark:text-slate-400">
          Chưa có tài khoản?{' '}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
          >
            Trở về trang chủ và chọn Đăng ký
          </button>
        </div>

      </div>
    </div>
  );
};
