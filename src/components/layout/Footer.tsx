import React from 'react';
import { BookOpen, Send, Globe, Share2, MessageCircle, Code } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[var(--neutral-surface)] border-t border-[var(--border-color)] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[var(--border-color)]">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
                EduSphere
              </span>
            </div>

            <p className="text-sm text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Nền tảng đào tạo công nghệ & bán khóa học trực tuyến tích hợp Trợ lý AI Gemini 2.0, Chat 1-1 Realtime và thanh toán tự động Stripe.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-[var(--neutral-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-purple-600 hover:text-white transition" title="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[var(--neutral-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-purple-600 hover:text-white transition" title="Cộng đồng">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[var(--neutral-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-purple-600 hover:text-white transition" title="Mã nguồn">
                <Code className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[var(--neutral-bg)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-purple-600 hover:text-white transition" title="Chia sẻ">
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular Courses */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Khóa Học Hot
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Lập trình NestJS Masterclass</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">React 18 & Next.js 14</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Thiết kế UI/UX Figma</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Python AI & Gemini API</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">DevOps Docker & Kubernetes</a></li>
            </ul>
          </div>

          {/* Column 3: Platform Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Về EduSphere
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Giới thiệu nền tảng</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Đội ngũ Giảng viên</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Chứng chỉ hoàn thành</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Trở thành Giảng viên</a></li>
              <li><a href="#" className="hover:text-brand-600 dark:hover:text-brand-400 transition">Tuyển dụng</a></li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Nhận Ưu Đãi
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đăng ký email để nhận mã giảm giá và thông tin khóa học mới nhất.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Nhập email của bạn..." 
                className="w-full pl-3 pr-10 py-2 text-xs rounded-xl bg-slate-100 dark:bg-dark-card border border-slate-200 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 EduSphere Academy. All rights reserved. Designed with Senior UI/UX Principles.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Điều khoản sử dụng</a>
            <a href="#" className="hover:underline">Chính sách bảo mật</a>
            <a href="#" className="hover:underline">Bảo mật thanh toán Stripe</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
