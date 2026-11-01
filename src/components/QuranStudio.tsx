import React, { useRef } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  Type,
  Check,
  CloudRain,
  Image as ImageIcon,
  Wand2,
} from 'lucide-react';
import {
  VideoProject,
  QuranVerse,
  ArabicFontFamily,
  TextAnimationType,
  ParticleEffect,
  AudioTrack,
} from '../types';
import { QURAN_VERSES, QURAN_BACKGROUNDS, QURAN_AUDIO_OPTIONS } from '../data/quranData';

interface QuranStudioProps {
  project: VideoProject;
  onUpdateProject: (updates: Partial<VideoProject>) => void;
  onOpenAiModal: () => void;
}

export const QuranStudio: React.FC<QuranStudioProps> = ({
  project,
  onUpdateProject,
  onOpenAiModal,
}) => {
  const customBgInputRef = useRef<HTMLInputElement | null>(null);
  const customAudioInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectVerse = (verse: QuranVerse) => {
    let audioTrack = project.audioTrack;
    if (verse.reciterAudioUrl) {
      audioTrack = {
        id: `reciter_${verse.id}`,
        title: `${verse.surahName} (${verse.reciterName || 'تلاوة كاملة'})`,
        artist: verse.reciterName || 'قارئ مختار',
        type: 'quran_audio',
        audioUrl: verse.reciterAudioUrl,
      };
    }

    const ayahInfo = verse.ayahRange || (verse.ayahNumber ? `آية ${verse.ayahNumber}` : 'كاملة');

    onUpdateProject({
      primaryText: verse.textUthmani,
      secondaryText: `${verse.surahName} · ${ayahInfo} - ${verse.reciterName || ''}`,
      title: verse.surahName,
      audioTrack: audioTrack,
      duration: verse.recommendedDuration || 25,
    });
  };

  const handleSelectBackground = (bg: (typeof QURAN_BACKGROUNDS)[0]) => {
    onUpdateProject({
      backgroundMediaUrl: bg.imageUrl,
      filter: bg.filter,
      overlayEffect: bg.suggestedEffect,
      slides: [],
    });
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    onUpdateProject({
      backgroundMediaUrl: url,
      slides: [],
    });
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const customAudio: AudioTrack = {
      id: `custom_quran_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'تلاوة من جهازي',
      type: 'custom_upload',
      audioUrl: url,
    };
    onUpdateProject({ audioTrack: customAudio });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quick Steps Guide */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-emerald-950/40 rounded-2xl border border-emerald-800/40 p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">1</span>
          <span className="font-semibold text-white">اختر السورة والتلاوة</span>
        </div>
        <span className="text-neutral-600">←</span>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-600/80 text-white font-bold flex items-center justify-center text-[11px]">2</span>
          <span className="font-semibold text-white">اختر المشهد والخط</span>
        </div>
        <span className="text-neutral-600">←</span>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[11px]">3</span>
          <span className="font-semibold text-white">تصدير وتنزيل</span>
        </div>
      </div>

      {/* 1. Curated Verses Selection & Custom Input */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-white">
              تلاوات كاملة مطابقة للنص 100%
            </h2>
          </div>

          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>تأملات وخواطر إيمانية</span>
          </button>
        </div>

        <p className="text-xs text-neutral-400 mb-3">
          اختر سورة أو آية؛ سيتم تشغيل التلاوة الصوتية الكاملة المطابقة للنص المعروض بالفيديو حتى النهاية دون توقف:
        </p>

        {/* Verses Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto mb-4 pr-1">
          {QURAN_VERSES.map((verse) => {
            const isSelected = project.primaryText === verse.textUthmani;
            return (
              <div
                key={verse.id}
                onClick={() => handleSelectVerse(verse)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-950/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/50'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-emerald-400">
                      {verse.surahName} {verse.ayahRange ? `(${verse.ayahRange})` : `(الآية ${verse.ayahNumber})`}
                    </span>
                    <span className="text-[10px] bg-emerald-900/50 text-emerald-300 px-2 py-0.5 rounded-md font-medium border border-emerald-700/40">
                      تلاوة كاملة
                    </span>
                  </div>

                  <p className="text-sm font-quran text-white leading-relaxed line-clamp-3">
                    {verse.textUthmani}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
                  <span className="text-amber-200/90 font-medium">
                    🎙️ {verse.reciterName}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {verse.recommendedDuration}ثانية
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Verse Text Area */}
        <div className="flex flex-col gap-3 pt-3 border-t border-neutral-800">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              نص الآية الكريمة أو الدعاء (بالتشكيل):
            </label>
            <textarea
              rows={3}
              value={project.primaryText}
              onChange={(e) => onUpdateProject({ primaryText: e.target.value })}
              placeholder="اكتب أو الصق نص الآية القرآنية الكريمة هنا مع التشكيل..."
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 p-3 text-sm focus:outline-none focus:border-emerald-500 leading-relaxed font-quran"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                اسم السورة ورقم الآية:
              </label>
              <input
                type="text"
                value={project.secondaryText || ''}
                onChange={(e) => onUpdateProject({ secondaryText: e.target.value })}
                placeholder="مثال: سورة الكهف · آية ١٠"
                className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 mb-1 block">
                عنوان التصميم / السورة في الإطار العلوي:
              </label>
              <input
                type="text"
                value={project.title || ''}
                onChange={(e) => onUpdateProject({ title: e.target.value })}
                placeholder="مثال: سورة الكهف"
                className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Arabic Calligraphy Fonts & Typography Animations */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-white">
            الخطوط العربية الأنيقة وتأثيرات النصوص المتحركة
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              نوع الخط العربي للتصميم القرآني:
            </label>
            <select
              value={project.fontFamily}
              onChange={(e) => onUpdateProject({ fontFamily: e.target.value as ArabicFontFamily })}
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="font-quran">خط النسخ القرآني العثماني (Scheherazade New)</option>
              <option value="font-amiri">الخط الأميري الملكي (Amiri)</option>
              <option value="font-ruqaa">خط الرقعة الفني (Aref Ruqaa)</option>
              <option value="font-kufi">الخط الكوفي الأنيق (Reem Kufi)</option>
              <option value="font-cairo">خط كايرو المعاصر (Cairo)</option>
              <option value="font-tajawal">خط تجوال المتزن (Tajawal)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              طريقة حركة النص النوراني:
            </label>
            <select
              value={project.textAnimation}
              onChange={(e) =>
                onUpdateProject({ textAnimation: e.target.value as TextAnimationType })
              }
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2.5 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="golden_shimmer">بريق ذهبي نوراني (Golden Shimmer)</option>
              <option value="floating_fade">تلاشي وانسياب هادئ (Floating Fade)</option>
              <option value="glow_pulse">نبض وتوهج إيماني (Glow Pulse)</option>
            </select>
          </div>
        </div>

        {/* Islamic Frame Toggle */}
        <div className="mt-4 pt-3 border-t border-neutral-800">
          <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <input
              type="checkbox"
              checked={project.showIslamicFrame !== false}
              onChange={(e) => onUpdateProject({ showIslamicFrame: e.target.checked })}
              className="accent-emerald-600 rounded"
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">
                تفعيل الإطار الإسلامي المذهب وزخرفة البسملة
              </span>
              <span className="text-[11px] text-neutral-400">
                يعرض «بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ» والزخارف الإسلامية الذهبية مع اسم السورة
              </span>
            </div>
          </label>
        </div>
      </section>

      {/* 3. Spiritual Backgrounds & Ambient Effects */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-white">
              الخلفيات الروحانية والمؤثرات
            </h2>
          </div>

          <button
            onClick={() => customBgInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>اختيار صورة من جهازي</span>
          </button>
          <input
            ref={customBgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomBgUpload}
          />
        </div>

        {/* Backgrounds Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          {QURAN_BACKGROUNDS.map((bg) => {
            const isSelected = project.backgroundMediaUrl === bg.imageUrl;
            return (
              <div
                key={bg.id}
                onClick={() => handleSelectBackground(bg)}
                className={`relative rounded-xl overflow-hidden border cursor-pointer group flex flex-col ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="aspect-[9/14] w-full bg-neutral-950 overflow-hidden relative">
                  <img
                    src={bg.imageUrl}
                    alt={bg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-2 bg-neutral-950 text-center">
                  <p className="text-[11px] font-bold text-white truncate">{bg.name}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Particles */}
        <div>
          <label className="text-xs font-semibold text-neutral-300 mb-2 block">
            المؤثرات الروحانية المتحركة:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'golden_dust', label: 'غبار ذهبي نوراني', icon: Sparkles },
              { id: 'rain', label: 'رذاذ مطر هادئ', icon: CloudRain },
              { id: 'sparkles', label: 'بريق سماء', icon: Sparkles },
              { id: 'none', label: 'بدون مؤثر', icon: Sparkles },
            ].map((eff) => (
              <button
                key={eff.id}
                onClick={() => onUpdateProject({ overlayEffect: eff.id as ParticleEffect })}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  project.overlayEffect === eff.id
                    ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <eff.icon className="w-3.5 h-3.5" />
                <span>{eff.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Reciters & Audio Recitations */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-500" />
            <h2 className="text-base font-bold text-white">
              التلاوات القرآنية وأصوات القراء
            </h2>
          </div>

          <button
            onClick={() => customAudioInputRef.current?.click()}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium underline"
          >
            رفع تلاوة صوتية من جهازي
          </button>
          <input
            ref={customAudioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={handleCustomAudioUpload}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {QURAN_AUDIO_OPTIONS.map((track) => (
            <button
              key={track.id}
              onClick={() => onUpdateProject({ audioTrack: track })}
              className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between ${
                project.audioTrack.id === track.id
                  ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              <div>
                <p className="text-xs font-bold">{track.title}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{track.artist}</p>
              </div>
              {project.audioTrack.id === track.id && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>

        {project.audioTrack.type === 'custom_upload' && (
          <div className="mt-2.5 p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-emerald-300 flex items-center justify-between">
            <span>التلاوة الخاصة: {project.audioTrack.title}</span>
            <span className="text-[10px] text-neutral-400">(تم تحميلها)</span>
          </div>
        )}
      </section>
    </div>
  );
};
