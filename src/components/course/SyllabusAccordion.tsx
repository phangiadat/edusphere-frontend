import React, { useState } from 'react';
import { ChevronDown, PlayCircle, Lock, Eye } from 'lucide-react';

export interface LessonData {
  id: string;
  title: string;
  duration: number; // in seconds
  isFreePreview: boolean;
  videoUrl?: string | null;
}

export interface ChapterData {
  id: string;
  title: string;
  order: number;
  lessons: LessonData[];
}

interface SyllabusAccordionProps {
  chapters: ChapterData[];
  onOpenPreview: (lesson: LessonData) => void;
}

export const SyllabusAccordion: React.FC<SyllabusAccordionProps> = ({ chapters, onOpenPreview }) => {
  // Store expanded chapter IDs
  const [expandedChapterIds, setExpandedChapterIds] = useState<string[]>(
    chapters.length > 0 ? [chapters[0].id] : []
  );

  const toggleChapter = (chapterId: string) => {
    setExpandedChapterIds((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const expandAll = () => {
    setExpandedChapterIds(chapters.map((c) => c.id));
  };

  const collapseAll = () => {
    setExpandedChapterIds([]);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalLessons = chapters.reduce((acc, ch) => acc + (ch.lessons?.length || 0), 0);
  const totalDurationSeconds = chapters.reduce(
    (acc, ch) => acc + (ch.lessons?.reduce((lAcc, l) => lAcc + l.duration, 0) || 0),
    0
  );
  const totalHours = Math.floor(totalDurationSeconds / 3600);
  const totalMins = Math.floor((totalDurationSeconds % 3600) / 60);

  return (
    <div className="space-y-4">
      {/* Meta Stats & Toggle Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-p2-regular text-[var(--text-secondary)]">
        <div>
          <span className="font-bold text-[var(--text-primary)]">{chapters.length} chương</span> •{' '}
          <span className="font-bold text-[var(--text-primary)]">{totalLessons} bài học</span> •{' '}
          <span>Thời lượng {totalHours > 0 ? `${totalHours} giờ ` : ''}{totalMins} phút</span>
        </div>

        <button
          onClick={expandedChapterIds.length === chapters.length ? collapseAll : expandAll}
          className="text-caption-bold text-[var(--primary-600)] hover:underline self-start sm:self-auto"
        >
          {expandedChapterIds.length === chapters.length ? 'Thu gọn tất cả chương' : 'Mở rộng tất cả chương'}
        </button>
      </div>

      {/* Chapters Accordion */}
      <div className="border border-[var(--border-color)] rounded-xl divide-y divide-[var(--border-color)] overflow-hidden bg-[var(--neutral-surface)]">
        {chapters.map((chapter) => {
          const isExpanded = expandedChapterIds.includes(chapter.id);
          const chapterLessons = chapter.lessons || [];
          const chapterDurationSecs = chapterLessons.reduce((acc, l) => acc + l.duration, 0);

          return (
            <div key={chapter.id} className="transition">
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--neutral-surface-hover)] transition focus:outline-none"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-200 ${
                      isExpanded ? 'rotate-180 text-[var(--primary-600)]' : ''
                    }`}
                  />
                  <h4 className="text-p1-bold text-[var(--text-primary)]">
                    {chapter.title}
                  </h4>
                </div>

                <div className="text-caption-medium text-[var(--text-secondary)] flex items-center gap-3">
                  <span>{chapterLessons.length} bài học</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">{formatDuration(chapterDurationSecs)}</span>
                </div>
              </button>

              {/* Lessons List inside Chapter */}
              {isExpanded && (
                <div className="bg-[var(--neutral-bg)] divide-y divide-[var(--border-color)]/60">
                  {chapterLessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-[var(--neutral-surface-hover)] transition group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {lesson.isFreePreview ? (
                          <PlayCircle className="w-4 h-4 text-[var(--primary-600)] flex-shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
                        )}

                        <span className="text-p2-medium text-[var(--text-primary)] truncate">
                          {lesson.title}
                        </span>
                      </div>

                      {/* Right Lesson Meta & PREVIEW BUTTON */}
                      <div className="flex items-center gap-4 flex-shrink-0">
                        {lesson.isFreePreview && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenPreview(lesson);
                            }}
                            className="inline-flex items-center gap-1 text-caption-bold px-2.5 py-1 rounded bg-[var(--primary-50)] text-[var(--primary-600)] dark:bg-slate-800 dark:text-[var(--primary-300)] hover:bg-[var(--primary-600)] hover:text-white transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem trước</span>
                          </button>
                        )}

                        <span className="text-caption-regular text-[var(--text-muted)] font-mono">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
