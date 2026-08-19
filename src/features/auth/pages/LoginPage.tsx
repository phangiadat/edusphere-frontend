import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, LogIn, Loader2, ArrowLeft } from 'lucide-react';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      await login({ email, password });
      
      // Read stored user after login to check role
      const storedUser = localStorage.getItem('user_info');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && user.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      setErrorMessage(
        err?.response?.data?.message || 'Email hoặc mật khẩu không chính xác!'
      );
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123456');
    try {
      await login({ email: demoEmail, password: '123456' });
      const storedUser = localStorage.getItem('user_info');
      const user = storedUser ? JSON.parse(storedUser) : null;

      if (user && user.role === 'INSTRUCTOR') {
        navigate('/instructor/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err: any) {
      setErrorMessage('Không thể đăng nhập bằng tài khoản mẫu.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.authCard}>
        
        {/* Back link */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition"
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
          <p className={styles.subtitle}>Cổng thông tin dành cho Giảng viên & Học viên</p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className={styles.errorBanner}>
            {errorMessage}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email đăng nhập</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ví dụ: dat.phan@edusphere.vn"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mật khẩu</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
            />
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

        {/* Quick Instructor Account Login */}
        <div className={styles.quickAccounts}>
          <div className={styles.quickLabel}>Tài khoản thử nghiệm Giảng viên (Instructor):</div>
          
          <button
            type="button"
            onClick={() => handleQuickLogin('dat.phan@edusphere.vn')}
            className={styles.quickBtn}
          >
            <span>👨‍🏫 dat.phan@edusphere.vn (Phan Gia Đạt)</span>
            <span className="text-purple-600 font-mono text-xs">Mật khẩu: 123456</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('minh.anh@edusphere.vn')}
            className={styles.quickBtn}
          >
            <span>👩‍🏫 minh.anh@edusphere.vn (Minh Anh)</span>
            <span className="text-purple-600 font-mono text-xs">Mật khẩu: 123456</span>
          </button>
        </div>

      </div>
    </div>
  );
};
