import React from 'react';
import { BookOpen, Users, Award, Bot } from 'lucide-react';

export const StatsBar: React.FC = () => {
  const stats = [
    {
      icon: BookOpen,
      count: '150+',
      label: 'Khóa học chất lượng',
      sublabel: 'Đa dạng chủ đề Lập trình & Tech',
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950/60',
    },
    {
      icon: Users,
      count: '10.000+',
      label: 'Học viên active',
      sublabel: 'Đang theo học hàng ngày',
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/10',
    },
    {
      icon: Award,
      count: '98%',
      label: 'Tỷ lệ hài lòng',
      sublabel: 'Đánh giá 5 sao từ cộng đồng',
      color: 'text-accent-emerald',
      bg: 'bg-accent-emerald/10',
    },
    {
      icon: Bot,
      count: '24/7',
      label: 'Hỗ trợ AI & Giảng viên',
      sublabel: 'Giải đáp tức thì mọi thắc mắc',
      color: 'text-accent-amber',
      bg: 'bg-amber-500/10',
    },
  ];

  return (
    <section className="py-10 bg-white dark:bg-dark-surface border-y border-slate-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-dark-card/50 transition">
                <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {stat.count}
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
                    {stat.sublabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
