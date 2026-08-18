import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterModal: React.FC = () => {
  const { register, closeAuthModal, openAuthModal } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ fullName: fullName.trim(), email: email.trim(), password });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string | string[] } } };
        const msg = responseError.response?.data?.message;
        if (Array.isArray(msg)) {
          setErrorMessage(msg.join(', '));
        } else if (typeof msg === 'string') {
          setErrorMessage(msg);
        } else {
          setErrorMessage('Đăng ký thất bại. Email có thể đã tồn tại!');
        }
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ Backend!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--neutral-surface-hover)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <h2 className="text-h2-bold text-[var(--text-primary)]">Tạo Tài Khoản Mới</h2>
          <p className="text-p2-regular text-[var(--text-secondary)] mt-1">
            Bắt đầu hành trình nâng cao kỹ năng cùng EduSphere
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-p2-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Full Name */}
          <div>
            <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full pl-10 pr-4 py-2.5 text-p2-medium rounded-lg bg-[var(--neutral-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)]"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-p2-medium rounded-lg bg-[var(--neutral-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)]"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                className="w-full pl-10 pr-10 py-2.5 text-p2-medium rounded-lg bg-[var(--neutral-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input 
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="w-full pl-10 pr-4 py-2.5 text-p2-medium rounded-lg bg-[var(--neutral-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] active:scale-[0.99] disabled:opacity-50 text-white text-p2-bold transition flex items-center justify-center gap-2 shadow mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo tài khoản...</span>
              </>
            ) : (
              <span>Đăng ký ngay</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-5 text-center text-p2-regular text-[var(--text-secondary)]">
          Đã có tài khoản?{' '}
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="text-p2-bold text-[var(--primary-600)] hover:underline"
          >
            Đăng nhập ngay
          </button>
        </div>

      </div>
    </div>
  );
};
