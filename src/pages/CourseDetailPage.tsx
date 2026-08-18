import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Star, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { courseApi } from '../api/courseApi';
import { CourseDetailHero } from '../components/course/CourseDetailHero';
import { SyllabusAccordion } from '../components/course/SyllabusAccordion';
import type { ChapterData, LessonData } from '../components/course/SyllabusAccordion';
import { CoursePurchaseSidebar } from '../components/course/CoursePurchaseSidebar';
import { VideoPreviewModal } from '../components/course/VideoPreviewModal';

interface CourseDetailPageProps {
  courseId?: string;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ 
  courseId = 'course-nestjs-masterclass' 
}) => {
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Video Preview Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState<LessonData | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await courseApi.getCourseDetailPublic(courseId);
        setCourse(data);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết khóa học:', err);
        // Fallback demo seed data if network offline
        setCourse({
          id: 'course-nestjs-masterclass',
          title: 'Lập trình NestJS & Microservices từ Zero đến Production',
          description: 'Khóa học thiết kế hệ thống Backend chuẩn Enterprise sử dụng NestJS, PostgreSQL, Prisma ORM, Redis Caching, Websocket Chat 1-1 và tích hợp Trợ lý AI Gemini 2.0.',
          price: 599000,
          thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
          instructor: {
            fullName: 'Phan Gia Đạt',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            bio: 'Senior Backend Engineer & NestJS Master Architect với hơn 6 năm kinh nghiệm thiết kế hệ thống Microservices.',
          },
          category: { name: 'Lập trình Backend' },
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
                  isFreePreview: true,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                {
                  id: 'l-2',
                  title: '2. Cài đặt Nest CLI & Cấu trúc thư mục chuẩn Enterprise',
                  duration: 920,
                  isFreePreview: true,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                {
                  id: 'l-3',
                  title: '3. Thực hành viết Module, Controller và Service đầu tiên',
                  duration: 1150,
                  isFreePreview: false,
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
                  isFreePreview: true,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                {
                  id: 'l-5',
                  title: '5. Viết CRUD Operations & Global Exception Filter',
                  duration: 1650,
                  isFreePreview: false,
                },
              ],
            },
          ],
          reviews: [
            {
              id: 'rev-1',
              rating: 5,
              comment: 'Khóa học NestJS cực kỳ hay và thực tế! Nút xem trước giúp mình đánh giá được chất lượng video trước khi mua.',
              user: {
                fullName: 'Nguyễn Văn Hải',
                avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
              },
              createdAt: '2026-08-15',
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Open Preview Modal for specific lesson
  const handleOpenLessonPreview = (lesson: LessonData) => {
    setActivePreviewLesson(lesson);
    setIsPreviewOpen(true);
  };

  // Open Main Course Preview Modal
  const handleOpenMainPreview = () => {
    // Find first previewable lesson
    const firstPreviewable = course?.chapters
      ?.flatMap((ch: any) => ch.lessons)
      ?.find((l: any) => l.isFreePreview);

    if (firstPreviewable) {
      setActivePreviewLesson(firstPreviewable);
    } else {
      setActivePreviewLesson({
        id: 'main-preview',
        title: course?.title || 'Xem trước khóa học',
        duration: 300,
        isFreePreview: true,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      });
    }
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--primary-600)]" />
        <p className="text-p2-medium text-[var(--text-secondary)]">Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 p-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <h3 className="text-h3-bold text-[var(--text-primary)]">Không tìm thấy khóa học</h3>
        <p className="text-p2-regular text-[var(--text-secondary)]">Khóa học này không tồn tại hoặc đã bị ẩn.</p>
      </div>
    );
  }

  const chapters: ChapterData[] = course.chapters || [];
  const instructor = course.instructor || { fullName: 'Phan Gia Đạt' };
  const reviews = course.reviews || [];

  return (
    <div className="min-h-screen bg-[var(--neutral-bg)] transition-colors">
      
      {/* 1. Header Hero Banner */}
      <CourseDetailHero
        title={course.title}
        description={course.description}
        categoryName={course.category?.name || 'Lập trình Backend'}
        instructorName={instructor.fullName}
        rating={4.9}
        reviewCount={reviews.length || 142}
        studentCount={1280}
      />

      {/* 2. Main Page Layout (68% Content / 32% Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
          
          {/* LEFT COLUMN (68% = 8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* A. What You'll Learn Box */}
            <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-h3-bold text-[var(--text-primary)]">
                Bạn sẽ học được gì trong khóa học này?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {[
                  'Nắm vững kiến trúc NestJS, Dependency Injection & IoC Container',
                  'Thiết kế CSDL PostgreSQL & ORM Prisma 6 chuẩn Enterprise',
                  'Bảo mật API với JWT Access Token & Refresh Token Rotation',
                  'Xây dựng hệ thống Chat Realtime 1-1 với Websocket Socket.IO',
                  'Tích hợp Cổng thanh toán Stripe tự động qua Webhook',
                  'Tích hợp Trợ lý AI Gemini 2.0 tạo lộ trình & tự động chấm bài',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[var(--primary-600)] flex-shrink-0 mt-0.5" />
                    <span className="text-p2-medium text-[var(--text-primary)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* B. Syllabus Accordion Section */}
            <div className="space-y-4">
              <h3 className="text-h2-bold text-[var(--text-primary)]">
                Nội dung khóa học
              </h3>

              <SyllabusAccordion
                chapters={chapters}
                onOpenPreview={handleOpenLessonPreview}
              />
            </div>

            {/* C. Requirements Section */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-h3-bold text-[var(--text-primary)]">
                Yêu cầu đầu vào
              </h3>
              <ul className="list-disc list-inside space-y-2 text-p2-medium text-[var(--text-secondary)]">
                <li>Kiến thức căn bản về JavaScript (ES6+) và TypeScript.</li>
                <li>Máy tính cài sẵn Node.js (phiên bản v18 trở lên) và VS Code.</li>
                <li>Tâm thế chủ động thực hành viết code qua từng chương bài học.</li>
              </ul>
            </div>

            {/* D. Description Section */}
            <div className="space-y-3 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-h3-bold text-[var(--text-primary)]">
                Mô tả chi tiết khóa học
              </h3>
              <div className="text-p2-regular text-[var(--text-secondary)] space-y-3 leading-relaxed">
                <p>
                  Khóa học <strong>{course.title}</strong> được thiết kế theo lộ trình thực chiến nhất dành cho các lập trình viên muốn nâng cao tư duy thiết kế hệ thống Backend quy mô lớn.
                </p>
                <p>
                  Trong suốt khóa học, bạn sẽ không chỉ dừng lại ở các lý thuyết cơ bản mà sẽ trực tiếp tự tay viết từng dòng code để hoàn thiện một hệ thống bán khóa học hoàn chỉnh bao gồm REST API, Caching Redis, Socket.IO Chat và Trợ lý AI.
                </p>
              </div>
            </div>

            {/* E. Instructor Bio Section */}
            <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
              <h3 className="text-h3-bold text-[var(--text-primary)]">
                Giảng viên hướng dẫn
              </h3>

              <div className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5">
                <img
                  src={instructor.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={instructor.fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-[var(--primary-600)] flex-shrink-0"
                />

                <div className="space-y-2 flex-1">
                  <div>
                    <h4 className="text-p1-bold text-[var(--text-primary)]">{instructor.fullName}</h4>
                    <p className="text-caption-bold text-[var(--primary-600)]">Senior Backend Engineer & NestJS Master Architect</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-caption-medium text-[var(--text-secondary)]">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>4.9 Đánh giá giảng viên</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-[var(--primary-600)]" />
                      <span>12 Khóa học</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-[var(--primary-600)]" />
                      <span>15,400+ Học viên</span>
                    </div>
                  </div>

                  <p className="text-p2-regular text-[var(--text-secondary)] pt-1">
                    {instructor.bio || 'Hơn 6 năm kinh nghiệm giảng dạy và thiết kế hệ thống Microservices chuẩn Enterprise cho các tập đoàn công nghệ hàng đầu.'}
                  </p>
                </div>
              </div>
            </div>

            {/* F. Student Reviews Section */}
            <div className="space-y-6 pt-4 border-t border-[var(--border-color)]" id="reviews">
              <h3 className="text-h3-bold text-[var(--text-primary)]">
                Đánh giá từ học viên
              </h3>

              <div className="space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((rev: any) => (
                    <div key={rev.id} className="bg-[var(--neutral-surface)] border border-[var(--border-color)] rounded-xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.user?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                            alt="Student Avatar"
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div>
                            <p className="text-p2-bold text-[var(--text-primary)]">{rev.user?.fullName || 'Học viên ẩn danh'}</p>
                            <div className="flex text-amber-400">
                              {[...Array(rev.rating || 5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              ))}
                            </div>
                          </div>
                        </div>

                        <span className="text-caption-regular text-[var(--text-muted)]">
                          {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('vi-VN') : 'Mới đây'}
                        </span>
                      </div>

                      <p className="text-p2-regular text-[var(--text-primary)] italic">
                        "{rev.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-p2-regular text-[var(--text-muted)] bg-[var(--neutral-surface)] rounded-xl border border-[var(--border-color)]">
                    <MessageSquare className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2" />
                    Chưa có đánh giá nào cho khóa học này. Hãy là người đầu tiên tham gia và đánh giá!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN (32% = 4 cols) Sticky Sidebar */}
          <div className="lg:col-span-4">
            <CoursePurchaseSidebar
              thumbnail={course.thumbnail}
              price={course.price || 599000}
              originalPrice={1200000}
              onOpenMainPreview={handleOpenMainPreview}
              onBuyNow={() => alert('Chuyển hướng đến Cổng thanh toán Stripe...')}
              onAddToCart={() => alert('Đã thêm khóa học vào giỏ hàng!')}
            />
          </div>

        </div>
      </div>

      {/* 3. Video Preview Modal */}
      <VideoPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        videoUrl={activePreviewLesson?.videoUrl}
        lessonTitle={activePreviewLesson?.title}
        courseTitle={course?.title}
      />

    </div>
  );
};
