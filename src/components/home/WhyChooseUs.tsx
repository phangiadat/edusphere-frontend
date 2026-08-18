import React from 'react';
import { Bot, MessageSquare, CreditCard, Award, ArrowRight } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="py-16 bg-white dark:bg-dark-surface border-y border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            TẠI SAO CHỌN EDUSPHERE?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tracking-tight">
            Trải Nghiệm Học Tập Công Nghệ Đỉnh Cao 2026
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 mt-3">
            Chúng tôi xóa bỏ rào cản học trực tuyến bằng cách kết hợp sức mạnh của Trợ lý AI, nhắn tin thời gian thực và quy trình thực hành thực chiến.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Card 1: AI Assistant (Large Span 2) */}
          <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white relative overflow-hidden shadow-xl flex flex-col justify-between group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/20 rounded-full blur-3xl group-hover:scale-125 transition duration-700"></div>
            
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-accent-cyan mb-6">
                <Bot className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent-cyan">
                ĐẶC QUYỀN ĐỘC QUYỀN
              </span>
              <h3 className="text-2xl font-bold mt-1">Trợ Lý AI Gemini 2.0 Thông Minh</h3>
              <p className="text-sm text-brand-100 mt-3 leading-relaxed">
                Không còn phải chờ đợi hỗ trợ! Trong từng bài học, Trợ lý AI sẵn sàng giải thích code, tóm tắt bài giảng và giải đáp thắc mắc của bạn tức thì 24/7.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-accent-cyan">
              <span>Tích hợp sẵn trong màn hình học</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition duration-200" />
            </div>
          </div>

          {/* Card 2: Realtime Chat 1-1 */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand-500 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 text-accent-cyan flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Chat 1-1 Realtime</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Kết nối trực tiếp qua Websocket với Giảng viên để được cố vấn, hỏi đáp bài tập bất cứ lúc nào.
              </p>
            </div>
            <div className="mt-4 text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1">
              Phản hồi nhanh chóng <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Assignment & Grading */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand-500 transition duration-300 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 text-accent-emerald flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Nộp & Chấm Bài Tập</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Thực hành thực tế sau từng chương. Nhận điểm số và phản hồi chi tiết (Feedback) từ Giảng viên.
              </p>
            </div>
            <div className="mt-4 text-xs font-bold text-accent-emerald flex items-center gap-1">
              Chất lượng đầu ra <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Stripe Payment */}
          <div className="md:col-span-3 lg:col-span-4 rounded-3xl p-6 bg-slate-50 dark:bg-dark-card border border-slate-200 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Thanh Toán Stripe Tự Động & Bảo Mật Quốc Tế</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Kích hoạt khóa học ngay lập tức sau khi chuyển khoản/thẻ VISA/MasterCard thành công.
                </p>
              </div>
            </div>

            <button className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-brand-600 text-white text-xs font-bold whitespace-nowrap hover:bg-brand-600 transition shadow">
              Tìm hiểu quy trình học
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
