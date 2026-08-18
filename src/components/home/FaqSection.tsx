import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { FaqItem } from '../../types';

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('1');

  const faqs: FaqItem[] = [
    {
      id: '1',
      question: 'Sau khi hoàn thành khóa học tôi có nhận được Chứng chỉ không?',
      answer: 'Có! Khi bạn hoàn thành 100% tất cả bài học và nộp đầy đủ bài tập đạt chuẩn, hệ thống EduSphere sẽ tự động xuất Chứng chỉ Điện tử (Digital Certificate) với mã xác thực riêng có thể đính kèm vào CV và LinkedIn.',
    },
    {
      id: '2',
      question: 'Hệ thống thanh toán qua Stripe hỗ trợ các hình thức nào?',
      answer: 'EduSphere tích hợp cổng thanh toán Stripe quốc tế bảo mật, hỗ trợ thẻ tín dụng/ghi nợ (VISA, MasterCard, JCB) và chuyển khoản trực tiếp. Khóa học được kích hoạt tự động 100% ngay sau khi giao dịch thành công.',
    },
    {
      id: '3',
      question: 'Trợ lý AI Gemini 2.0 hoạt động như thế nào trong bài học?',
      answer: 'Mỗi bài học tích hợp sẵn ô chat AI Gemini. Bạn có thể hỏi bất cứ thắc mắc nào về bài giảng, giải thích dòng code chưa hiểu hoặc nhờ AI viết ví dụ mẫu. Trợ lý AI hoạt động 24/7 tức thì.',
    },
    {
      id: '4',
      question: 'Tôi có thể tương tác trực tiếp với Giảng viên không?',
      answer: 'Có! EduSphere cung cấp tính năng Chat 1-1 Realtime theo thời gian thực qua Websocket. Bạn có thể nhắn tin riêng với giảng viên phụ trách khóa học để hỏi đáp kiến thức hoặc nhờ cố vấn định hướng bài tập.',
    },
    {
      id: '5',
      question: 'Khóa học có giới hạn thời gian truy cập không?',
      answer: 'Không. Bạn chỉ cần đăng ký một lần duy nhất và sẽ có quyền truy cập trọn đời (Lifetime Access) vào toàn bộ video bài giảng, tài liệu đính kèm và các bản cập nhật nội dung mới trong tương lai.',
    },
  ];

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
          <HelpCircle className="w-3.5 h-3.5" /> GÓC GIẢI ĐÁP
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Câu Hỏi Thường Gặp (FAQ)
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Mọi thắc mắc của bạn về quy trình học tập và thanh toán tại EduSphere
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div 
              key={faq.id}
              className="rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border overflow-hidden transition-all shadow-sm hover:border-brand-500/50"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition focus:outline-none"
                aria-expanded={isOpen}
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-dark-border pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
