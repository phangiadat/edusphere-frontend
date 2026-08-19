import React from 'react';
import { X, Award, ShieldCheck, Printer, CheckCircle2, Sparkles } from 'lucide-react';
import type { CertificateData } from '../../api/paymentApi';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificateData: CertificateData | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  certificateData,
}) => {
  if (!isOpen || !certificateData) return null;

  const formattedDate = certificateData.issueDate
    ? new Date(certificateData.issueDate).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '18 tháng 08, 2026';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-200 dark:border-purple-900/50 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Actions Header (Hidden in Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Chứng chỉ Tốt nghiệp EduSphere Verified</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>In / Tải PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
           CERTIFICATE PRINTABLE CANVAS BODY
           ========================================================================= */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-gradient-to-br from-purple-50/40 via-white to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30">
          
          {/* Decorative Outer Border */}
          <div className="relative p-6 sm:p-10 border-4 border-double border-amber-400/80 dark:border-amber-500/60 rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-xl space-y-6 text-center">
            
            {/* Watermark Seal Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <Award className="w-96 h-96 text-purple-600" />
            </div>

            {/* Header Logos & Title */}
            <div className="space-y-3 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-bold tracking-widest uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                EduSphere Official Certificate
              </div>

              <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 dark:text-amber-300 tracking-wider uppercase">
                CHỨNG CHỈ HOÀN THÀNH
              </h1>
              <p className="text-xs sm:text-sm font-sans tracking-widest text-slate-500 dark:text-slate-400 uppercase font-semibold">
                CERTIFICATE OF COMPLETION
              </p>
            </div>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"></div>

            {/* Student Name */}
            <div className="space-y-2 relative">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
                Chứng nhận học viên / This is to certify that
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-purple-700 dark:text-purple-300 tracking-tight underline underline-offset-8 decoration-amber-400">
                {certificateData.studentName}
              </h2>
            </div>

            {/* Course Title */}
            <div className="space-y-2 max-w-2xl mx-auto relative">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 italic">
                Đã hoàn thành xuất sắc 100% nội dung & bài tập khóa học:
              </p>
              <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                "{certificateData.courseTitle}"
              </h3>
            </div>

            {/* Signatures & Seal Bar */}
            <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end border-t border-amber-200 dark:border-amber-900/50 text-xs relative">
              
              {/* Left Signature: Instructor */}
              <div className="space-y-1 text-center sm:text-left">
                <div className="h-10 font-serif italic text-purple-600 dark:text-purple-400 text-lg font-bold">
                  {certificateData.instructorName}
                </div>
                <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-bold text-slate-800 dark:text-slate-200">
                  {certificateData.instructorName}
                </div>
                <div className="text-[11px] text-slate-500">Giảng viên Chuyên môn</div>
              </div>

              {/* Center Seal */}
              <div className="flex flex-col items-center justify-center space-y-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg border-2 border-white">
                  <ShieldCheck className="w-9 h-9 stroke-[2.5]" />
                </div>
                <div className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED ACCREDITED
                </div>
              </div>

              {/* Right Signature: Academic Director */}
              <div className="space-y-1 text-center sm:text-right">
                <div className="h-10 font-serif italic text-purple-600 dark:text-purple-400 text-lg font-bold">
                  EduSphere Academic Board
                </div>
                <div className="border-t border-slate-300 dark:border-slate-700 pt-1 font-bold text-slate-800 dark:text-slate-200">
                  Hội đồng Đào tạo EduSphere
                </div>
                <div className="text-[11px] text-slate-500">Giám đốc Học thuật</div>
              </div>

            </div>

            {/* Certificate ID & Date Footer */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800 gap-2">
              <div>
                Ngày cấp / Date: <strong className="text-slate-700 dark:text-slate-300">{formattedDate}</strong>
              </div>
              <div className="font-mono text-purple-600 dark:text-purple-400 font-bold">
                ID: {certificateData.certificateId}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
