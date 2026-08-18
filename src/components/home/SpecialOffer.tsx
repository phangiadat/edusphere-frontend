import React from 'react';
import { Bot, MessageSquare, CreditCard, Award, ArrowRight } from 'lucide-react';

export const SpecialOffer: React.FC = () => {
  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-[var(--primary-600)] p-8 lg:p-12 text-white">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading & Backend Feature List */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-caption-bold uppercase tracking-widest text-slate-200 block">
              TÍNH NĂNG ĐÃ KÍCH HOẠT TRÊN THỰC TẾ
            </span>

            <h2 className="text-h1-bold leading-tight">
              Hệ Thống Học Tập Tương Tác Thời Gian Thực 2026
            </h2>

            <p className="text-p1-regular text-slate-200 max-w-lg">
              EduSphere không chỉ bán video bài giảng. Chúng tôi cung cấp giải pháp toàn diện được tích hợp trực tiếp từ Backend NestJS:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10">
                <Bot className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-p2-bold">Trợ Lý AI Gemini</div>
                  <div className="text-caption-regular text-slate-200">Hỗ trợ trả lời DTO & bài học 24/7</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10">
                <MessageSquare className="w-5 h-5 text-cyan-300 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-p2-bold">Chat 1-1 Realtime</div>
                  <div className="text-caption-regular text-slate-200">Websocket Gateway kết nối tức thì</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10">
                <CreditCard className="w-5 h-5 text-emerald-300 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-p2-bold">Thanh Toán Stripe</div>
                  <div className="text-caption-regular text-slate-200">Tự động kích hoạt qua Webhook</div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/10">
                <Award className="w-5 h-5 text-rose-300 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-p2-bold">Chấm Bài Tập</div>
                  <div className="text-caption-regular text-slate-200">Nộp bài & nhận Feedback điểm số</div>
                </div>
              </div>
            </div>

            <div className="pt-3">
              <a 
                href="#courses"
                className="px-6 py-3 rounded-lg bg-white text-[var(--primary-700)] font-p2-bold hover:bg-slate-100 transition inline-flex items-center gap-2"
              >
                Bắt đầu học ngay <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: Code/API Architecture Preview */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-slate-900 text-slate-100 p-5 font-mono text-caption-regular border border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>edusphere-backend/src</span>
                <span className="text-[10px] text-emerald-400">● NestJS Connected</span>
              </div>
              <div className="text-purple-400">@WebSocketGateway()</div>
              <div><span className="text-blue-400">export class</span> ChatGateway &#123;</div>
              <div className="pl-4 text-emerald-400">// Realtime 1-1 Chat & Notifications</div>
              <div className="pl-4 text-amber-300">@SubscribeMessage('sendMessage')</div>
              <div className="pl-4">handleMessage(client, payload) &#123;...&#125;</div>
              <div>&#125;</div>
              <div className="pt-2 text-purple-400">@Controller('ai')</div>
              <div><span className="text-blue-400">export class</span> AiController &#123;</div>
              <div className="pl-4 text-amber-300">@Post('ask')</div>
              <div className="pl-4">askQuestion(@Body() dto) &#123;...&#125;</div>
              <div>&#125;</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
