import React, { useState } from 'react';
import { Mail, Lock, X, Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';

export const ForgotPasswordModal: React.FC = () => {
  const { closeAuthModal, openAuthModal } = useAuth();
  
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Step 1: Request Password Reset Token
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Vui lòng nhập Email của bạn.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.forgotPassword({ email });
      setSuccessMessage(res.message || 'Mã xác nhận khôi phục đã được gửi về Email của bạn!');
      setStep('reset');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string } } };
        setErrorMessage(responseError.response?.data?.message || 'Không tìm thấy tài khoản với Email này!');
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ Backend!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Confirm Reset Password with Token
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!token.trim() || !newPassword.trim()) {
      setErrorMessage('Vui lòng nhập Mã xác nhận và Mật khẩu mới.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.resetPassword({ token, newPassword });
      setSuccessMessage(res.message || 'Đặt lại mật khẩu thành công!');
      setStep('success');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const responseError = err as { response?: { data?: { message?: string } } };
        setErrorMessage(responseError.response?.data?.message || 'Mã xác nhận không hợp lệ hoặc đã hết hạn!');
      } else {
        setErrorMessage('Không thể kết nối đến máy chủ Backend!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--neutral-surface-hover)] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <h2 className="text-h2-bold text-[var(--text-primary)]">
            {step === 'request' && 'Quên Mật Khẩu'}
            {step === 'reset' && 'Nhập Mã Khôi Phục'}
            {step === 'success' && 'Hoàn Tất Khôi Phục'}
          </h2>
          <p className="text-p2-regular text-[var(--text-secondary)] mt-1">
            {step === 'request' && 'Nhập email để nhận hướng dẫn khôi phục mật khẩu'}
            {step === 'reset' && 'Nhập mã token nhận được từ Email và mật khẩu mới'}
            {step === 'success' && 'Mật khẩu của bạn đã được cập nhật thành công'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-p2-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && step !== 'success' && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-p2-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: Request Token Form */}
        {step === 'request' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <div>
              <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
                Email tài khoản
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] active:scale-[0.99] disabled:opacity-50 text-white text-p2-bold transition flex items-center justify-center gap-2 shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang gửi mã...</span>
                </>
              ) : (
                <span>Gửi mã xác nhận</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Confirm Reset Form */}
        {step === 'reset' && (
          <form onSubmit={handleConfirmReset} className="space-y-4">
            <div>
              <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
                Mã xác nhận (Token / Code)
              </label>
              <input 
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Nhập mã token từ Email"
                className="w-full px-4 py-2.5 text-p2-medium rounded-lg bg-[var(--neutral-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)] font-mono"
              />
            </div>

            <div>
              <label className="block text-caption-bold text-[var(--text-primary)] mb-1">
                Mật khẩu mới
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input 
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                  className="w-full pl-10 pr-4 py-2.5 text-p2-medium rounded-lg bg-[var(--neutral-bg)] border border-[var(--border-color)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-600)]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-[var(--primary-600)] hover:bg-[var(--primary-700)] active:scale-[0.99] disabled:opacity-50 text-white text-p2-bold transition flex items-center justify-center gap-2 shadow"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đổi mật khẩu...</span>
                </>
              ) : (
                <span>Xác nhận mật khẩu mới</span>
              )}
            </button>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-p2-medium text-[var(--text-primary)]">
              Bạn có thể sử dụng mật khẩu mới để đăng nhập ngay bây giờ.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="w-full py-3 rounded-lg bg-[var(--primary-600)] text-white text-p2-bold hover:bg-[var(--primary-700)] transition"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {/* Back Link */}
        {step !== 'success' && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 text-p2-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="w-4 h-4" /> Quay lại đăng nhập
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
