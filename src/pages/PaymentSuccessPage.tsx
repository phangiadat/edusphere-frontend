import React, { useEffect } from 'react';
import { CheckCircle2, PlayCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { paymentApi } from '../api/paymentApi';

interface PaymentSuccessPageProps {
  onNavigateMyCourses?: () => void;
  onNavigateHome?: () => void;
}

export const PaymentSuccessPage: React.FC<PaymentSuccessPageProps> = ({
  onNavigateMyCourses,
  onNavigateHome,
}) => {
  const { clearCart } = useCart();

  const searchParams = new URLSearchParams(window.location.search);
  const hashQuery = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
  const hashParams = new URLSearchParams(hashQuery);
  const sessionId = searchParams.get('session_id') || hashParams.get('session_id') || 'sub_stripe_mock_2026_demo';

  useEffect(() => {
    clearCart();

    const verifyEnrollment = async () => {
      if (sessionId && sessionId.startsWith('cs_')) {
        try {
          await paymentApi.verifySession(sessionId);
        } catch (err) {
          console.warn('Session verification error:', err);
        }
      }
    };

    verifyEnrollment();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[var(--neutral-bg)] transition-colors py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 text-center animate-in zoom-in-95 duration-200">
        
        {/* Success Icon Badge */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-100 dark:bg-emerald-950/60 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full text-caption-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 text-xs">
            GIAO DỊCH HOÀN TẤT
          </span>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Thanh Toán Thành Công!
          </h1>
          <p className="text-p2-regular text-[var(--text-secondary)] leading-relaxed">
            Chúc mừng bạn đã sở hữu khóa học. Hệ thống đã kích hoạt quyền truy cập trọn đời vào tài khoản của bạn.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[var(--neutral-bg)] border border-[var(--border-color)] rounded-2xl p-5 text-left space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)] text-caption-medium">
            <span className="text-[var(--text-muted)]">Mã giao dịch (Session ID):</span>
            <span className="font-mono font-semibold text-[var(--primary-600)] truncate max-w-[180px]">
              {sessionId}
            </span>
          </div>

          <div className="flex justify-between items-center text-caption-medium">
            <span className="text-[var(--text-muted)]">Trạng thái đơn hàng:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Đã xác nhận & Kích hoạt
            </span>
          </div>

          <div className="flex justify-between items-center text-caption-medium pt-1">
            <span className="text-[var(--text-muted)]">Cổng thanh toán:</span>
            <span className="font-semibold text-[var(--text-primary)]">Stripe Card Payment</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              if (onNavigateMyCourses) onNavigateMyCourses();
              else window.location.hash = '#my-courses';
            }}
            className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-p1-bold transition shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5" />
            <span>Vào học ngay trong "Khóa học của tôi"</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          <button
            onClick={() => {
              if (onNavigateHome) onNavigateHome();
              else window.location.hash = '#home';
            }}
            className="w-full py-3 rounded-xl border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--neutral-surface-hover)] text-p2-bold transition"
          >
            Quay lại trang chủ
          </button>
        </div>

      </div>
    </div>
  );
};
