import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  PlayCircle, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  AlertCircle,
  FileText,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { paymentApi } from '../api/paymentApi';
import type { LearnCourseData, LearnLesson, CertificateData } from '../api/paymentApi';
import { CertificateModal } from '../components/course/CertificateModal';
import { AiAssistantDrawer } from '../components/common/ai/AiAssistantDrawer';

interface CourseLearnPageProps {
  courseId: string;
  onNavigateMyCourses?: () => void;
}

// Fallback demo course learn data if offline
const DEMO_LEARN_DATA: LearnCourseData = {
  course: {
    id: 'course-nestjs-masterclass',
    title: 'Lập trình NestJS & Microservices từ Zero đến Production',
    description: 'Khóa học thiết kế hệ thống Backend chuẩn Enterprise sử dụng NestJS, PostgreSQL, Prisma ORM, Redis Caching và Websockets.',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    instructor: {
      fullName: 'Phan Gia Đạt',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    chapters: [
      {
        id: 'ch-1',
        title: 'Chương 1: Tổng quan Kiến trúc & Khởi tạo Dự án NestJS',
        order: 1,
        lessons: [
          {
            id: 'l-1',
            title: '1. Overview về NestJS Architecture & Dependency Injection',
            duration: 650,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Nội dung kiến thức cơ bản về NestJS Module, Controller, Provider và cơ chế IoC Container.',
          },
          {
            id: 'l-2',
            title: '2. Cài đặt Nest CLI & Cấu trúc thư mục chuẩn Enterprise',
            duration: 920,
            order: 2,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Thực hành tạo project với npx nest new và tổ chức thư mục mô hình Clean Architecture.',
          },
          {
            id: 'l-3',
            title: '3. Thực hành viết Module, Controller và Service đầu tiên',
            duration: 1150,
            order: 3,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Xây dựng CRUD module hoàn chỉnh với Decorators @Get(), @Post(), @Body() và @Param().',
          },
        ],
      },
      {
        id: 'ch-2',
        title: 'Chương 2: Tích hợp Cơ sở Dữ liệu PostgreSQL với Prisma ORM',
        order: 2,
        lessons: [
          {
            id: 'l-4',
            title: '4. Thiết kế Database Schema chuẩn hóa với Prisma 6',
            duration: 1400,
            order: 1,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Khai báo các Models User, Course, Chapter, Lesson, Enrollment và chạy migration.',
          },
          {
            id: 'l-5',
            title: '5. Viết CRUD Operations & Global Exception Filter',
            duration: 1650,
            order: 2,
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            content: 'Tối ưu hóa phản hồi lỗi chuẩn với Global Exception Filter và Logging Interceptor.',
          },
        ],
      },
    ],
  },
  completedLessonIds: ['l-1'],
  progress: 20,
};

export const CourseLearnPage: React.FC<CourseLearnPageProps> = ({
  courseId,
  onNavigateMyCourses,
}) => {
  const [learnData, setLearnData] = useState<LearnCourseData | null>(null);
  const [activeLesson, setActiveLesson] = useState<LearnLesson | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMarking, setIsMarking] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes'>('overview');

  // Certificate Modal State
  const [isCertOpen, setIsCertOpen] = useState<boolean>(false);
  const [certData, setCertData] = useState<CertificateData | null>(null);

  // AI Assistant Drawer State
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchLearnData = async () => {
      setIsLoading(true);
      try {
        const data = await paymentApi.getCourseLearnData(courseId);
        setLearnData(data);
        setCompletedIds(data.completedLessonIds || []);
        setProgress(data.progress || 0);

        // Set initial active lesson
        const firstLesson = data.course?.chapters?.[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      } catch (err) {
        console.warn('Sử dụng dữ liệu học bài demo:', err);
        setLearnData(DEMO_LEARN_DATA);
        setCompletedIds(DEMO_LEARN_DATA.completedLessonIds);
        setProgress(DEMO_LEARN_DATA.progress);
        setActiveLesson(DEMO_LEARN_DATA.course.chapters[0].lessons[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearnData();
  }, [courseId]);

  // Handle Mark Lesson Complete
  const handleMarkComplete = async () => {
    if (!activeLesson) return;

    setIsMarking(true);
    try {
      const res = await paymentApi.markLessonComplete(activeLesson.id);
      
      if (!completedIds.includes(activeLesson.id)) {
        setCompletedIds((prev) => [...prev, activeLesson.id]);
      }
      setProgress(res.progress);

      // Auto advance to next lesson if available
      handleNextLesson();
    } catch (err) {
      console.warn('Lỗi đánh dấu bài học hoàn thành demo:', err);
      if (!completedIds.includes(activeLesson.id)) {
        const newCompleted = [...completedIds, activeLesson.id];
        setCompletedIds(newCompleted);
        const total = allLessons.length;
        const newProg = Math.round((newCompleted.length / total) * 100);
        setProgress(newProg);
      }
      handleNextLesson();
    } finally {
      setIsMarking(false);
    }
  };

  // Handle View Certificate
  const handleOpenCertificate = async () => {
    try {
      const cert = await paymentApi.getCertificateData(courseId);
      setCertData(cert);
    } catch (err) {
      setCertData({
        certificateId: `EDUSPHERE-CERT-${courseId.slice(0, 8).toUpperCase()}`,
        studentName: 'Học viên Xuất sắc',
        courseTitle: learnData?.course.title || 'Lập trình NestJS & Microservices',
        instructorName: learnData?.course.instructor.fullName || 'Phan Gia Đạt',
        issueDate: new Date().toISOString(),
        progress: 100,
      });
    }
    setIsCertOpen(true);
  };

  // Flatten all lessons list
  const allLessons: { lesson: LearnLesson; chapterTitle: string }[] = [];
  learnData?.course.chapters.forEach((ch) => {
    ch.lessons.forEach((l) => {
      allLessons.push({ lesson: l, chapterTitle: ch.title });
    });
  });

  const currentIndex = allLessons.findIndex((item) => item.lesson.id === activeLesson?.id);
  const prevItem = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextItem = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleNextLesson = () => {
    if (nextItem) {
      setActiveLesson(nextItem.lesson);
    }
  };

  const handlePrevLesson = () => {
    if (prevItem) {
      setActiveLesson(prevItem.lesson);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        <p className="text-p2-medium text-slate-300">Đang khởi tạo không gian bài học...</p>
      </div>
    );
  }

  if (!learnData || !activeLesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-h2-bold">Không thể tải không gian học tập</h2>
        <p className="text-p2-regular text-slate-400">Bạn chưa mua hoặc chưa được cấp quyền truy cập khóa học này.</p>
        <button
          onClick={() => {
            if (onNavigateMyCourses) onNavigateMyCourses();
            else window.location.hash = '#my-courses';
          }}
          className="px-6 py-3 bg-purple-600 rounded-xl text-white font-bold hover:bg-purple-700 transition"
        >
          Quay lại Khóa học của tôi
        </button>
      </div>
    );
  }

  const isCurrentCompleted = completedIds.includes(activeLesson.id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* 🧭 1. TOP HEADER NAVIGATION BAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 flex-shrink-0 z-30">
        
        {/* Left: Back to My Courses & Title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => {
              if (onNavigateMyCourses) onNavigateMyCourses();
              else window.location.hash = '#my-courses';
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold flex-shrink-0"
            title="Quay lại danh sách khóa học"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Khóa học của tôi</span>
          </button>

          <div className="min-w-0">
            <h1 className="text-p1-bold text-white truncate text-sm sm:text-base">
              {learnData.course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate hidden md:block">
              Giảng viên: <span className="text-purple-400 font-semibold">{learnData.course.instructor.fullName}</span>
            </p>
          </div>
        </div>

        {/* Right: Progress % Bar & Certificate Button */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* Progress Indicator */}
          <div className="hidden sm:flex flex-col items-end gap-1">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-400">Tiến độ bài học:</span>
              <span className="text-purple-400">{progress}%</span>
            </div>
            <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* AI Gemini 2.0 Assistant Button */}
          <button
            onClick={() => setIsAiDrawerOpen(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 shadow cursor-pointer"
            title="Mở Trợ lý AI Gemini 2.0"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Trợ lý AI Gemini 2.0</span>
          </button>

          {/* Certificate Button (Available at 100% or previewable) */}
          <button
            onClick={handleOpenCertificate}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow ${
              progress >= 100
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30'
            }`}
          >
            <Award className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>{progress >= 100 ? 'Nhận Chứng Chỉ ★' : 'Xem Chứng Chỉ'}</span>
          </button>

        </div>

      </header>

      {/* 🚀 2. MAIN LEARNING WORKSPACE (2-COLUMN RESPONSIVE LAYOUT) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* =========================================================================
           LEFT COLUMN: Primary Video Player Area & Lesson Details (70% Width)
           ========================================================================= */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          
          {/* Video Container (Aspect 16:9) */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center border-b border-slate-800 shadow-2xl">
            {activeLesson.videoUrl ? (
              activeLesson.videoUrl.includes('youtube.com') || activeLesson.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={activeLesson.videoUrl}
                  title={activeLesson.title}
                  className="w-full h-full border-none"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={activeLesson.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                ></video>
              )
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 text-slate-400 p-6 text-center">
                <PlayCircle className="w-16 h-16 text-purple-500 stroke-[1.5]" />
                <p className="text-p2-medium">Bài học này chưa có nội dung video trực tiếp.</p>
              </div>
            )}
          </div>

          {/* Action Bar & Lesson Info Below Video */}
          <div className="p-6 space-y-6">
            
            {/* Top Action Row: Lesson Title + Completion Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block">
                  BÀI HỌC HIỆN TẠI
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeLesson.title}
                </h2>
              </div>

              {/* Complete Action Button */}
              <button
                onClick={handleMarkComplete}
                disabled={isMarking}
                className={`px-6 py-3.5 rounded-xl font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 active:scale-95 ${
                  isCurrentCompleted
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                    : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20'
                }`}
              >
                {isMarking ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isCurrentCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    <span>Đã hoàn thành ✓</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Đánh dấu đã hoàn thành</span>
                  </>
                )}
              </button>
            </div>

            {/* Prev / Next Lesson Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrevLesson}
                disabled={!prevItem}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 text-xs font-bold"
              >
                <ChevronLeft className="w-4 h-4" /> Bài trước
              </button>

              <button
                onClick={handleNextLesson}
                disabled={!nextItem}
                className="px-5 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition flex items-center gap-1.5 text-xs font-bold"
              >
                Bài tiếp theo <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Lesson Tabs: Overview & Notes */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`pb-2 text-sm font-bold border-b-2 transition ${
                    activeTab === 'overview'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tổng quan bài học
                </button>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`pb-2 text-sm font-bold border-b-2 transition ${
                    activeTab === 'notes'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tài liệu & Ghi chú
                </button>
              </div>

              {activeTab === 'overview' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-slate-300 text-sm leading-relaxed">
                  <h4 className="font-bold text-white text-base">Tóm tắt nội dung:</h4>
                  <p>{activeLesson.content || 'Bài học bao gồm mã nguồn thực hành và kiến thức chuyên sâu về chủ đề.'}</p>
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 text-slate-300 text-sm">
                  <div className="flex items-center gap-2 text-purple-400 font-bold">
                    <FileText className="w-4 h-4" /> Tài liệu mã nguồn đính kèm
                  </div>
                  <p className="text-xs text-slate-400">Bạn có thể tải về file mã nguồn tham khảo được giảng viên chuẩn bị cho bài học này.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* =========================================================================
           RIGHT COLUMN: Chapter & Lesson Syllabus Accordion Sidebar (30% Width)
           ========================================================================= */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col flex-shrink-0 h-auto lg:h-full overflow-y-auto">
          
          <div className="p-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10 backdrop-blur flex items-center justify-between">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span>Nội dung khóa học</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {completedIds.length} / {allLessons.length} bài
            </span>
          </div>

          {/* Chapters & Lessons Accordion List */}
          <div className="divide-y divide-slate-800">
            {learnData.course.chapters.map((chapter) => (
              <div key={chapter.id} className="p-3 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
                  {chapter.title}
                </div>

                <div className="space-y-1">
                  {chapter.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLesson.id;
                    const isCompleted = completedIds.includes(lesson.id);

                    return (
                      <div
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition text-xs font-semibold ${
                          isActive
                            ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow'
                            : 'hover:bg-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
                          ) : (
                            <PlayCircle className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                          {Math.floor(lesson.duration / 60)}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* 📜 CERTIFICATE MODAL */}
      <CertificateModal
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        certificateData={certData}
      />

      {/* 🤖 GEMINI 2.0 AI ASSISTANT DRAWER */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        lessonId={activeLesson?.id}
        lessonTitle={activeLesson?.title}
      />

    </div>
  );
};
