import React from 'react';
import { Play, ShoppingCart, ShieldCheck, Smartphone, Award, Infinity, FileText, CheckCircle2, ArrowRight, Loader2, CreditCard } from 'lucide-react';

interface CoursePurchaseSidebarProps {
  thumbnail?: string | null;
  price: number;
  onOpenMainPreview: () => void;
  onBuyNow: () => void;
  onAddToCart: () => void;
  isInCart?: boolean;
  onGoToCart?: () => void;
  isBuyingNow?: boolean;
}

export const CoursePurchaseSidebar: React.FC<CoursePurchaseSidebarProps> = ({
  thumbnail,
  price,
  onOpenMainPreview,
  onBuyNow,
  onAddToCart,
  isInCart = false,
  onGoToCart,
  isBuyingNow = false,
}) => {
  const formattedPrice = price.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl shadow-xl p-4 sm:p-6 space-y-6 sticky top-20">
      
      {/* Thumbnail with Play Overlay Button */}
      <div 
        onClick={onOpenMainPreview}
        className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer border border-[var(--border-color)] shadow-inner"
      >
        <img
          src={thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
          alt="Course Preview Thumbnail"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 group-hover:bg-white text-[var(--primary-600)] flex items-center justify-center shadow-lg group-hover:scale-110 transition">
            <Play className="w-6 h-6 fill-[var(--primary-600)] ml-1" />
          </div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center text-caption-bold text-white drop-shadow-md">
          Xem bản trình chiếu xem trước
        </div>
      </div>

      {/* Pricing Section */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-h2-bold text-[var(--text-primary)]">{formattedPrice}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {isInCart ? (
          <button
            onClick={onGoToCart}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-p2-bold transition flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>Đã có trong giỏ hàng — Chuyển đến giỏ hàng</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        ) : (
          <button
            onClick={onAddToCart}
            className="w-full py-3.5 rounded-xl bg-[var(--primary-600)] hover:bg-[var(--primary-700)] text-white text-p2-bold transition flex items-center justify-center gap-2 shadow-md active:scale-[0.99]"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Thêm vào giỏ hàng</span>
          </button>
        )}

        <button
          onClick={onBuyNow}
          disabled={isBuyingNow}
          className="w-full py-3.5 rounded-xl border-2 border-[var(--primary-600)] text-[var(--primary-600)] dark:text-white hover:bg-[var(--primary-50)] dark:hover:bg-slate-800 text-p2-bold transition active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
        >
          {isBuyingNow ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[var(--primary-600)]" />
              <span>Đang kết nối Stripe...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Thanh toán ngay với Stripe</span>
            </>
          )}
        </button>
      </div>

      {/* Guarantee & Features */}
      <div className="space-y-3 pt-3 border-t border-[var(--border-color)] text-p2-medium text-[var(--text-secondary)]">
        <div className="flex items-center gap-2 text-caption-medium text-[var(--text-muted)] justify-center">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Cam kết hoàn tiền trong 30 ngày nếu không hài lòng</span>
        </div>

        <div className="space-y-2.5 pt-2">
          <h4 className="text-caption-bold text-[var(--text-primary)] uppercase tracking-wider">
            Khóa học bao gồm:
          </h4>

          <div className="flex items-center gap-3">
            <Infinity className="w-4 h-4 text-[var(--primary-600)] flex-shrink-0" />
            <span>Quyền truy cập trọn đời</span>
          </div>

          <div className="flex items-center gap-3">
            <Smartphone className="w-4 h-4 text-[var(--primary-600)] flex-shrink-0" />
            <span>Truy cập trên điện thoại và TV</span>
          </div>

          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-[var(--primary-600)] flex-shrink-0" />
            <span>8 bài tập thực hành & tài liệu mã nguồn</span>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-4 h-4 text-[var(--primary-600)] flex-shrink-0" />
            <span>Chứng nhận hoàn thành khóa học</span>
          </div>
        </div>
      </div>

    </div>
  );
};
