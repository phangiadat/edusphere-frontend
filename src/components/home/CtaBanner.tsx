import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-slate-900 dark:bg-dark-card p-10 lg:p-16 overflow-hidden text-center text-white border border-slate-800 shadow-2xl">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/30 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-accent-cyan text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> BẮT ĐẦU HÀNH TRÌNH NGAY HÔM NAY
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Sẵn Sàng Nâng Tầm Sự Nghiệp Lập Trình Cùng <span className="bg-gradient-to-r from-brand-400 via-accent-cyan to-accent-emerald bg-clip-text text-transparent">EduSphere</span>?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal">
            Gia nhập cộng đồng 10.000+ lập trình viên. Học thực chiến, trải nghiệm AI Gemini hỗ trợ 24/7 và nhận chứng chỉ uy tín.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-600 active:scale-95 text-white font-extrabold text-sm shadow-xl hover:shadow-glow transition flex items-center gap-2 group">
              Tạo tài khoản học miễn phí <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <a 
              href="#courses"
              className="px-8 py-4 rounded-full border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-200 font-semibold text-sm transition"
            >
              Khám phá danh mục
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-accent-emerald" /> Cam kết chất lượng</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-accent-emerald" /> Hoàn tiền trong 30 ngày</span>
          </div>
        </div>

      </div>
    </section>
  );
};
