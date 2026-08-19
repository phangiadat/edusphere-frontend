import React, { useEffect, useState } from 'react';
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
import { categoryApi } from '../../api/categoryApi';
import type { CategoryItem } from '../../api/categoryApi';

interface CategoriesSectionProps {
  onSelectCategory?: (categoryName: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<any[]>([
    {
      id: 'cat-web',
      name: 'Lập trình Web',
      coursesCount: 42,
      icon: Code2,
      description: 'NestJS, React, Node.js, Next.js, Vue, TailwindCSS',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    {
      id: 'cat-uiux',
      name: 'Thiết kế UI/UX',
      coursesCount: 28,
      icon: Layout,
      description: 'Figma, Design System, Wireframing, UX Research',
      badgeColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
    },
    {
      id: 'cat-ai',
      name: 'AI & Machine Learning',
      coursesCount: 25,
      icon: BrainCircuit,
      description: 'Python, Prompt Engineering, Gemini AI, LangChain',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    },
    {
      id: 'cat-mobile',
      name: 'Lập trình Mobile',
      coursesCount: 18,
      icon: Smartphone,
      description: 'React Native, Flutter, iOS Swift, Android Kotlin',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
    },
    {
      id: 'cat-devops',
      name: 'DevOps & Cloud',
      coursesCount: 15,
      icon: Server,
      description: 'Docker, Kubernetes, AWS, CI/CD Pipelines, Nginx',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
    {
      id: 'cat-data',
      name: 'Data Science & SQL',
      coursesCount: 20,
      icon: BarChart3,
      description: 'PostgreSQL, Prisma, MongoDB, Data Analytics',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    {
      id: 'cat-security',
      name: 'Cyber Security',
      coursesCount: 12,
      icon: ShieldCheck,
      description: 'Web Security, JWT, OAuth2, Ethical Hacking',
      badgeColor: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
    },
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const dbCategories: CategoryItem[] = await categoryApi.getCategories();
        if (dbCategories && dbCategories.length > 0) {
          // Merge real DB count if available
          const merged = categories.map((cat) => {
            const matched = dbCategories.find(
              (c) => c.name.toLowerCase() === cat.name.toLowerCase()
            );
            if (matched && matched._count) {
              return { ...cat, coursesCount: matched._count.courses || cat.coursesCount };
            }
            return cat;
          });
          setCategories(merged);
        }
      } catch (err) {
        console.warn('Dùng danh mục mặc định:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
    }
    // Scroll to #courses section
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
            DANH MỤC CHỦ ĐỀ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mt-1">
            Khám phá theo Lĩnh vực Bạn Yêu thích
          </h2>
        </div>
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          Nhấp vào bất kỳ danh mục nào để xem ngay tất cả các khóa học thuộc lĩnh vực đó.
        </p>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="group relative p-6 rounded-2xl bg-[var(--neutral-surface)] border border-[var(--border-color)] hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3.5 rounded-2xl ${cat.badgeColor} transition group-hover:scale-110 duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--text-secondary)]">
                    {cat.coursesCount} khóa
                  </span>
                </div>

                <h3 className="font-bold text-base text-[var(--text-primary)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition flex items-center justify-between">
                  {cat.name}
                  <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500" />
                </h3>

                <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
