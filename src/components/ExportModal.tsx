import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Share2,
  Check,
  Copy,
  Sparkles,
  MessageCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { VideoProject } from '../types';
import { videoExporter, ExportProgress } from '../utils/videoExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: VideoProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [progress, setProgress] = useState<ExportProgress>({
    percentage: 0,
    currentSecond: 0,
    totalSeconds: project.duration,
    status: 'preparing',
  });
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedFile, setExportedFile] = useState<File | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [sharedNativeStatus, setSharedNativeStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startExport();
    } else {
      // Cleanup
      if (exportedVideoUrl) {
        URL.revokeObjectURL(exportedVideoUrl);
        setExportedVideoUrl(null);
      }
      setExportedFile(null);
      setProgress({
        percentage: 0,
        currentSecond: 0,
        totalSeconds: project.duration,
        status: 'preparing',
      });
    }
  }, [isOpen]);

  const startExport = async () => {
    try {
      const result = await videoExporter.exportVideo(project, (p) => {
        setProgress(p);
      });
      setExportedVideoUrl(result.url);
      setExportedFile(result.file);
    } catch (err) {
      console.error('Export failed:', err);
      setProgress((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: 'حدث خطأ أثناء معالجة وتصدير الفيديو، يرجى المحاولة مجدداً.',
      }));
    }
  };

  const handleDownload = () => {
    if (!exportedVideoUrl || !exportedFile) return;
    videoExporter.downloadVideo(exportedVideoUrl, exportedFile.name);
  };

  const generateSocialCaption = () => {
    if (project.mode === 'quran') {
      return `✨ تلاوة خاشعة وآيات بينات:\n"${project.primaryText}"\n${project.secondaryText || ''}\n\n#قرآن_كريم #تلاوة_خاشعة #راحة_نفسية #إسلاميات #اكسبلور #ريلز_قرآني`;
    }
    return `❤️ إهداء خاص من القلب:\n"${project.primaryText}"\n${project.secondaryText || ''}\n\n#حب #رومانسية #عشق #فيديو_رومانسي #ذكرى_سعيدة #اكسبلور #ريلز`;
  };

  const handleCopyCaption = () => {
    const text = generateSocialCaption();
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const handleNativeShare = async () => {
    if (!exportedFile) return;
    const text = generateSocialCaption();
    const success = await videoExporter.shareNative(
      exportedFile,
      project.title || 'فيديو مميز',
      text
    );
    if (success) {
      setSharedNativeStatus('تم فتح قائمة المشاركة بنجاح!');
      setTimeout(() => setSharedNativeStatus(null), 3000);
    }
  };

  // Direct Social Links
  const shareToWhatsApp = () => {
    const text = encodeURIComponent(generateSocialCaption());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareToTelegram = () => {
    const text = encodeURIComponent(generateSocialCaption());
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${text}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(generateSocialCaption());
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                تصدير وتنزيل ومشاركة الفيديو
              </h3>
              <p className="text-[11px] text-neutral-400">
                {project.mode === 'quran' ? 'فيديو قرآني عالي الدقة' : 'فيديو رومانسي احترافي'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
          {progress.status !== 'completed' && progress.status !== 'error' ? (
            /* Rendering Progress State */
            <div className="w-full flex flex-col items-center justify-center py-8">
              <div className="relative w-28 h-28 flex items-center justify-center mb-5">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-neutral-800"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-rose-500 transition-all duration-300 ease-out"
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * progress.percentage) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold font-mono text-white tabular-nums">
                    {progress.percentage}%
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {progress.currentSecond}s / {progress.totalSeconds}s
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-1.5">
                {progress.status === 'preparing' && 'جاري تحضير المقاطع والمؤثرات...'}
                {progress.status === 'rendering' && 'جاري معالجة الفيديو بجودة عالية...'}
                {progress.status === 'encoding' && 'جاري ضغط وترميز ملف الفيديو...'}
              </h4>
              <p className="text-xs text-neutral-400 text-center max-w-sm">
                يتم دمج الصور والمؤثرات البصرية وتنسيق الخطوط العربية مع الصوت بدقة فائقة.
              </p>
            </div>
          ) : progress.status === 'error' ? (
            /* Error State */
            <div className="py-8 text-center flex flex-col items-center">
              <p className="text-sm text-red-400 mb-4">{progress.errorMessage}</p>
              <button
                onClick={startExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          ) : (
            /* Completed Ready State */
            <div className="w-full flex flex-col items-center gap-5">
              {/* Video Player */}
              {exportedVideoUrl && (
                <div className="w-full max-w-[280px] aspect-[9/16] bg-black rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl relative">
                  <video
                    src={exportedVideoUrl}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Main Download CTA (To Phone) */}
              <div className="w-full flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.98]"
                >
                  <Download className="w-5 h-5" />
                  <span>تنزيل الفيديو وحفظه على الهاتف / الجهاز</span>
                </button>

                {/* Native Share button */}
                <button
                  onClick={handleNativeShare}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-950/40 transition-all active:scale-[0.98]"
                >
                  <Share2 className="w-4 h-4" />
                  <span>مشاركة مباشرة عبر تطبيقات الهاتف (Share)</span>
                </button>
                {sharedNativeStatus && (
                  <p className="text-center text-xs text-emerald-400 font-medium">
                    {sharedNativeStatus}
                  </p>
                )}
              </div>

              {/* Social Media Platforms Icons */}
              <div className="w-full pt-4 border-t border-neutral-800">
                <span className="text-xs font-semibold text-neutral-300 mb-2.5 block text-center">
                  أو شارك فوراً عبر المنصات التالية:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={shareToWhatsApp}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-950 hover:bg-emerald-950/40 border border-neutral-800 hover:border-emerald-600 text-emerald-400 text-[11px] font-medium transition-all"
                  >
                    <MessageCircle className="w-5 h-5 mb-1" />
                    <span>واتساب</span>
                  </button>

                  <button
                    onClick={handleCopyCaption}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-white text-[11px] font-medium transition-all"
                  >
                    <span className="text-base font-bold mb-0.5">TikTok</span>
                    <span>تيك توك</span>
                  </button>

                  <button
                    onClick={handleCopyCaption}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-950 hover:bg-rose-950/30 border border-neutral-800 hover:border-rose-500 text-rose-400 text-[11px] font-medium transition-all"
                  >
                    <span className="text-base font-bold mb-0.5">IG</span>
                    <span>انستغرام</span>
                  </button>

                  <button
                    onClick={shareToTelegram}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-neutral-950 hover:bg-sky-950/40 border border-neutral-800 hover:border-sky-500 text-sky-400 text-[11px] font-medium transition-all"
                  >
                    <Share2 className="w-5 h-5 mb-1" />
                    <span>تيليجرام</span>
                  </button>
                </div>
              </div>

              {/* Video Caption & Hashtags box */}
              <div className="w-full p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 text-xs">
                <div className="truncate text-neutral-300">
                  <span className="font-semibold text-white ml-1">الوصف والهاشتاجات:</span>
                  <span className="text-neutral-400 truncate">
                    {project.primaryText}
                  </span>
                </div>
                <button
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs shrink-0 transition-colors"
                >
                  {copiedCaption ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ النص</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
