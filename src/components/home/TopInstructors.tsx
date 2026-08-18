import React from 'react';
import { Star, BookOpen, Users, Award } from 'lucide-react';
import type { Instructor } from '../../types';

export const TopInstructors: React.FC = () => {
  const instructors: Instructor[] = [
    {
      id: '1',
      name: 'Phan Gia Đạt',
      title: 'Senior Backend Engineer & NestJS Expert',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      coursesCount: 8,
      studentsCount: 5200,
      rating: 4.9,
      bio: 'Chuyên gia thiết kế hệ thống Microservices, NestJS, Prisma và Redis với hơn 6 năm kinh nghiệm.',
    },
    {
      id: '2',
      name: 'Minh Anh',
      title: 'Lead UI/UX Designer at TechCorp',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      coursesCount: 5,
      studentsCount: 3800,
      rating: 4.9,
      bio: 'Hơn 8 năm giảng dạy thiết kế giao diện Figma, Design System và nghiên cứu hành vi người dùng.',
    },
    {
      id: '3',
      name: 'Hoàng Nam',
      title: 'AI Solutions Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      coursesCount: 6,
      studentsCount: 2900,
      rating: 5.0,
      bio: 'Chuyên gia ứng dụng AI Gemini, OpenAI API và xây dựng các hệ thống tự động hóa thông minh.',
    },
    {
      id: '4',
      name: 'Tuấn Anh',
      title: 'DevOps & Cloud Specialist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      coursesCount: 4,
      studentsCount: 2100,
      rating: 4.8,
      bio: 'Chuyên gia hạ tầng Docker, Kubernetes, AWS Cloud và quy trình triển khai phần mềm CI/CD.',
    },
  ];

  return (
    <section id="instructors" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
          ĐỘI NGŨ GIẢNG VIÊN
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Học Trực Tiếp Từ Các Chuyên Gia Hàng Đầu
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Đội ngũ giảng viên giàu kinh nghiệm thực chiến từ các tập đoàn công nghệ lớn.
        </p>
      </div>

      {/* Instructors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {instructors.map((inst) => (
          <div 
            key={inst.id}
            className="group rounded-3xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 text-center flex flex-col justify-between"
          >
            <div>
              {/* Avatar Container */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <img 
                  src={inst.avatar} 
                  alt={inst.name} 
                  className="w-full h-full rounded-full object-cover border-2 border-brand-500 shadow-md group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-0 right-0 bg-amber-500 text-white p-1 rounded-full text-[10px] shadow" title="Top Verified Instructor">
                  <Award className="w-3.5 h-3.5" />
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {inst.name}
              </h3>
              
              <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1 line-clamp-1">
                {inst.title}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2">
                {inst.bio}
              </p>
            </div>

            {/* Stats & CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-dark-border">
              <div className="flex items-center justify-around text-xs text-slate-600 dark:text-slate-400 mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" /> {inst.rating}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-brand-500" /> {inst.coursesCount} khóa
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-accent-cyan" /> {inst.studentsCount.toLocaleString()}
                </span>
              </div>

              <button className="w-full py-2 rounded-xl border border-slate-200 dark:border-dark-border text-xs font-semibold text-slate-800 dark:text-slate-200 hover:bg-brand-600 hover:text-white dark:hover:bg-brand-600 transition">
                Xem khóa học
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
