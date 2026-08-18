import React from 'react';
import { 
  Code2, 
  Layout, 
  BrainCircuit, 
  Smartphone, 
  Server, 
  BarChart3, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const categories = [
    {
      id: 'web',
      name: 'Lập trình Web',
      coursesCount: 42,
      icon: Code2,
      description: 'NestJS, React, Node.js, Next.js, Vue, TailwindCSS',
      badgeColor: 'bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400',
    },
    {
      id: 'ui-ux',
      name: 'Thiết kế UI/UX',
      coursesCount: 28,
      icon: Layout,
      description: 'Figma, Design System, Wireframing, UX Research',
      badgeColor: 'bg-accent-cyan/10 text-accent-cyan',
    },
    {
      id: 'ai-ml',
      name: 'AI & Machine Learning',
      coursesCount: 25,
      icon: BrainCircuit,
      description: 'Python, Prompt Engineering, Gemini AI, LangChain',
      badgeColor: 'bg-accent-emerald/10 text-accent-emerald',
    },
    {
      id: 'mobile',
      name: 'Lập trình Mobile',
      coursesCount: 18,
      icon: Smartphone,
      description: 'React Native, Flutter, iOS Swift, Android Kotlin',
      badgeColor: 'bg-amber-500/10 text-amber-500',
    },
    {
      id: 'devops',
      name: 'DevOps & Cloud',
      coursesCount: 15,
      icon: Server,
      description: 'Docker, Kubernetes, AWS, CI/CD Pipelines, Nginx',
      badgeColor: 'bg-rose-500/10 text-rose-500',
    },
    {
      id: 'data',
      name: 'Data Science & SQL',
      coursesCount: 20,
      icon: BarChart3,
      description: 'PostgreSQL, Prisma, MongoDB, Data Analytics',
      badgeColor: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      id: 'security',
      name: 'Cyber Security',
      coursesCount: 12,
      icon: ShieldCheck,
      description: 'Web Security, JWT, OAuth2, Ethical Hacking',
      badgeColor: 'bg-teal-500/10 text-teal-500',
    },
  ];

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
            DANH MỤC CHỦ ĐỀ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Khám phá theo Lĩnh vực Bạn Yêu thích
          </h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          Hàng trăm khóa học được phân loại khoa học theo xu hướng công nghệ mới nhất 2026.
        </p>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <a
              key={cat.id}
              href={`#category-${cat.id}`}
              className="group relative p-6 rounded-2xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border hover:border-brand-500 dark:hover:border-brand-500 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3.5 rounded-2xl ${cat.badgeColor} transition group-hover:scale-110 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-dark-card text-slate-600 dark:text-slate-400">
                    {cat.coursesCount} khóa
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition flex items-center justify-between">
                  {cat.name}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-500" />
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};
