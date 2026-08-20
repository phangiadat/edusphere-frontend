import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Paperclip, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import type { SubmissionModel } from './SubmissionTable';
import styles from './GradeSubmissionDrawer.module.css';

interface GradeSubmissionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  submission: SubmissionModel | null;
  currentIndex: number;
  totalSubmissions: number;
  onNavigatePrev: () => void;
  onNavigateNext: () => void;
  onSaveGrade: (submissionId: string, score: number, feedback: string) => void;
}

export const GradeSubmissionDrawer: React.FC<GradeSubmissionDrawerProps> = ({
  isOpen,
  onClose,
  submission,
  currentIndex,
  totalSubmissions,
  onNavigatePrev,
  onNavigateNext,
  onSaveGrade,
}) => {
  const [scoreInput, setScoreInput] = useState<string>('8.5');
  const [feedbackInput, setFeedbackInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (submission) {
      setScoreInput(
        submission.score !== undefined && submission.score !== null
          ? String(submission.score)
          : '8.5'
      );
      setFeedbackInput(submission.feedback || '');
      setErrorMsg(null);
    }
  }, [submission, isOpen]);

  if (!isOpen || !submission) return null;

  const handleScoreChange = (val: string) => {
    setScoreInput(val);
    const num = parseFloat(val);
    if (isNaN(num) || num < 0 || num > 10) {
      setErrorMsg('Vui lòng nhập điểm số hợp lệ từ 0.0 đến 10.0');
    } else {
      setErrorMsg(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const scoreVal = parseFloat(scoreInput);
    if (isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      setErrorMsg('Vui lòng nhập điểm số hợp lệ từ 0.0 đến 10.0');
      return;
    }

    onSaveGrade(submission.id, scoreVal, feedbackInput);
  };

  const handleSaveAndNext = (e: React.FormEvent) => {
    handleSave(e);
    if (currentIndex < totalSubmissions - 1) {
      onNavigateNext();
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.drawerCard}>
        {/* Header with Continuous Navigation */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <img
              src={submission.studentAvatar}
              alt={submission.studentName}
              className={styles.studentAvatar}
            />
            <div className={styles.headerTitleBox}>
              <h2 className={styles.headerStudentName}>{submission.studentName}</h2>
              <p className={styles.headerAssignmentName}>{submission.assignmentTitle}</p>
            </div>
          </div>

          {/* Continuous Navigation Controls */}
          <div className={styles.headerRightNav}>
            <span className={styles.navCounter}>
              Bài {currentIndex + 1} / {totalSubmissions}
            </span>

            <button
              disabled={currentIndex === 0}
              onClick={onNavigatePrev}
              className={styles.navBtn}
              title="Bài nộp trước đó"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              disabled={currentIndex === totalSubmissions - 1}
              onClick={onNavigateNext}
              className={styles.navBtn}
              title="Chấm bài tiếp theo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button onClick={onClose} className={styles.closeBtn} title="Đóng cửa sổ">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <form id="grade-form" onSubmit={handleSave} className={styles.body}>
          {/* Submission View: Content & File Attachment */}
          <div className={styles.sectionBox}>
            <div className={styles.sectionLabel}>
              <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Nội dung bài làm của Học viên:</span>
            </div>

            <div className={styles.contentCard}>
              {submission.content ? (
                <div
                  dangerouslySetInnerHTML={{ __html: submission.content }}
                  className="prose dark:prose-invert max-w-none text-sm"
                />
              ) : (
                <p className="text-slate-400 italic">Học viên không gửi nội dung văn bản.</p>
              )}
            </div>
          </div>

          {/* Attachment File / Link */}
          {submission.fileUrl && (
            <div className={styles.sectionBox}>
              <div className={styles.sectionLabel}>
                <Paperclip className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>File bài làm / Đính kèm:</span>
              </div>

              <div className={styles.attachmentCard}>
                <div className={styles.attachmentLeft}>
                  <Paperclip className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                  <span className={styles.attachmentTitle} title={submission.fileUrl}>
                    {submission.fileUrl}
                  </span>
                </div>

                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.downloadBtn}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở bài làm</span>
                </a>
              </div>
            </div>
          )}

          {/* Grading Section */}
          <div className={styles.gradingGrid}>
            {/* Score Input */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Điểm số (Thang điểm 0.0 - 10.0) *</span>
                </span>
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                value={scoreInput}
                onChange={(e) => handleScoreChange(e.target.value)}
                placeholder="VD: 8.5"
                className={styles.scoreInput}
              />
              {errorMsg && (
                <span className={styles.errorText}>
                  <AlertCircle className="w-3.5 h-3.5 inline mr-1" />
                  {errorMsg}
                </span>
              )}
            </div>

            {/* Feedback Input */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Nhận xét & Phản hồi của Giảng viên</span>
                </span>
              </label>
              <textarea
                rows={4}
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                placeholder="Nhập lời nhận xét chi tiết, khen ngợi hoặc hướng dẫn học viên cải thiện bài làm..."
                className={styles.textarea}
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Hủy bỏ
          </button>

          {currentIndex < totalSubmissions - 1 ? (
            <button type="button" onClick={handleSaveAndNext} className={styles.saveBtn}>
              Lưu & Chấm bài tiếp theo ➔
            </button>
          ) : (
            <button type="submit" form="grade-form" className={styles.saveBtn}>
              Lưu kết quả chấm điểm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
