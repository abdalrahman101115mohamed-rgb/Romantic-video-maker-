import React, { useRef } from 'react';
import { Sparkles, Heart, Wand2, Music, Type, Image as ImageIcon, Check } from 'lucide-react';
import { VideoProject, ParticleEffect, ArabicFontFamily, TextAnimationType } from '../types';
import { ROMANTIC_TEMPLATES, ROMANTIC_AUDIO_TRACKS, ROMANTIC_LOVE_QUOTES } from '../data/romanticTemplates';

interface RomanticPresetStudioProps {
  project: VideoProject;
  onUpdateProject: (updates: Partial<VideoProject>) => void;
  onOpenAiModal: () => void;
}

export const RomanticPresetStudio: React.FC<RomanticPresetStudioProps> = ({
  project,
  onUpdateProject,
  onOpenAiModal,
}) => {
  const customBgInputRef = useRef<HTMLInputElement | null>(null);
  const customAudioInputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectTemplate = (template: (typeof ROMANTIC_TEMPLATES)[0]) => {
    onUpdateProject({
      backgroundMediaUrl: template.imageUrl,
      primaryText: template.defaultText,
      secondaryText: template.defaultSecondary,
      fontFamily: template.suggestedFont,
      overlayEffect: template.suggestedEffect,
      filter: template.filter,
      slides: [], // Clear personal album slides so it uses backgroundMediaUrl
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
    onUpdateProject({
      audioTrack: {
        id: `custom_song_${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, ''),
        artist: 'أغنية من جهازي',
        type: 'custom_upload',
        audioUrl: url,
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quick Steps Guide */}
      <div className="bg-gradient-to-r from-rose-950/40 via-neutral-900 to-rose-950/40 rounded-2xl border border-rose-800/40 p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[11px]">1</span>
          <span className="font-semibold text-white">اختر المشهد الرومانسي</span>
        </div>
        <span className="text-neutral-600">←</span>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-600/80 text-white font-bold flex items-center justify-center text-[11px]">2</span>
          <span className="font-semibold text-white">اختر الأغنية أو ارفع MP3</span>
        </div>
        <span className="text-neutral-600">←</span>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-[11px]">3</span>
          <span className="font-semibold text-white">تصدير وتنزيل</span>
        </div>
      </div>

      {/* 1. Curated Romantic Scenes & Templates */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-white">
              مشاهد رومانسية سينمائية جاهزة
            </h2>
          </div>

          <button
            onClick={() => customBgInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-all"
          >
            <ImageIcon className="w-4 h-4" />
            <span>أو اختر صورة من جهازك</span>
          </button>
          <input
            ref={customBgInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomBgUpload}
          />
        </div>

        <p className="text-xs text-neutral-400 mb-4">
          أنشئ فيديو رومانسي فاخر فوراً بدون الحاجة لرفع صور شخصية، فقط اختر قالباً مناسباً وعدّل الكلمات:
        </p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ROMANTIC_TEMPLATES.map((tmpl) => {
            const isSelected = project.backgroundMediaUrl === tmpl.imageUrl;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleSelectTemplate(tmpl)}
                className={`group relative rounded-xl overflow-hidden border p-3 flex gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-rose-950/30 border-rose-500 shadow-lg shadow-rose-950/40 ring-1 ring-rose-500/50'
                    : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-neutral-900 shrink-0 relative">
                  <img
                    src={tmpl.imageUrl}
                    alt={tmpl.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-rose-600/30 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="text-xs font-bold text-white mb-1 group-hover:text-rose-400 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>

                  <span className="text-[10px] text-rose-300 font-medium mt-2">
                    اضغط لتطبيق القالب والكلمات ✦
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Personalized Names & Love Message */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-white">تخصيص الأسماء والرسالة</h2>
          </div>

          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>كتابة بالذكاء الاصطناعي</span>
          </button>
        </div>

        <div className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              نص الرسالة أو الشعر الرومانسي:
            </label>
            <textarea
              rows={2}
              value={project.primaryText}
              onChange={(e) => onUpdateProject({ primaryText: e.target.value })}
              placeholder="اكتب رسالة الحب هنا..."
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 p-3 text-sm focus:outline-none focus:border-rose-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              اسمك واسم الشريك / المناسبة:
            </label>
            <input
              type="text"
              value={project.secondaryText || ''}
              onChange={(e) => onUpdateProject({ secondaryText: e.target.value })}
              placeholder="مثال: من محمد إلى سارة · ذكرى خطوبتنا"
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Quick Quotes */}
          <div className="mt-1">
            <span className="text-xs text-neutral-400 mb-2 block">
              اقتراحات سريعة لكلمات العشق:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto">
              {ROMANTIC_LOVE_QUOTES.map((quote, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => onUpdateProject({ primaryText: quote })}
                  className="px-2.5 py-1 rounded-lg bg-neutral-950 hover:bg-rose-950/40 text-neutral-300 hover:text-rose-200 border border-neutral-800 hover:border-rose-800/60 text-xs transition-colors truncate max-w-full text-right"
                >
                  {quote}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Font & Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-800">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              نوع الخط العربي:
            </label>
            <select
              value={project.fontFamily}
              onChange={(e) => onUpdateProject({ fontFamily: e.target.value as ArabicFontFamily })}
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="font-amiri">الخط الأميري (كلاسيكي وأصيل)</option>
              <option value="font-ruqaa">خط الرقعة (عاطفي شاعري)</option>
              <option value="font-cairo">خط كايرو (عصري جذاب)</option>
              <option value="font-tajawal">خط تجوال (أنيق وواضح)</option>
              <option value="font-kufi">خط الكوفي (هندسي متميز)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              حركة وتأثير النص:
            </label>
            <select
              value={project.textAnimation}
              onChange={(e) =>
                onUpdateProject({ textAnimation: e.target.value as TextAnimationType })
              }
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="golden_shimmer">بريق ذهبي براق</option>
              <option value="floating_fade">تلاشي وانسياب ناعم</option>
              <option value="glow_pulse">توهج شاعري مستمر</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Music & Effects */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-bold text-white">المؤثرات والموسيقى</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {[
            { id: 'hearts', label: 'قلوب متطايرة', icon: Heart },
            { id: 'rose_petals', label: 'بتلات الورد', icon: Sparkles },
            { id: 'sparkles', label: 'بريق نجوم', icon: Sparkles },
            { id: 'golden_dust', label: 'غبار ذهبي', icon: Sparkles },
          ].map((eff) => (
            <button
              key={eff.id}
              onClick={() => onUpdateProject({ overlayEffect: eff.id as ParticleEffect })}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                project.overlayEffect === eff.id
                  ? 'bg-rose-600/20 text-rose-300 border-rose-500 shadow-sm'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
              }`}
            >
              <eff.icon className="w-3.5 h-3.5" />
              <span>{eff.label}</span>
            </button>
          ))}
        </div>

        {/* Romantic Songs Selection */}
        <div className="pt-4 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Music className="w-4 h-4 text-rose-500" />
              <label className="text-xs font-semibold text-neutral-300">
                أشهر الأغاني الرومانسية (ما تيجي نركن الزعل، أنت الحظ، وغيرها):
              </label>
            </div>

            <button
              onClick={() => customAudioInputRef.current?.click()}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold underline flex items-center gap-1"
            >
              <span>رفع أغنية MP3 من جهازي</span>
            </button>
            <input
              ref={customAudioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleCustomAudioUpload}
            />
          </div>

          <p className="text-[11px] text-neutral-400 mb-3">
            اختر أغنية تحبها مع كلمات الأغنية المعبرة، أو ارفع نسختك الخاصة من هاتفك:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ROMANTIC_AUDIO_TRACKS.map((track) => {
              const isSelected = project.audioTrack.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => onUpdateProject({ audioTrack: track })}
                  className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-md ring-1 ring-rose-500/50'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{track.coverEmoji || '🎵'}</span>
                      <p className="text-xs font-bold text-white">{track.title}</p>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-medium">
                        الأغنية الحالية
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-neutral-400 mb-1.5">{track.artist}</p>

                  {track.lyricsSnippet && (
                    <p className="text-[10px] text-rose-300/80 italic bg-rose-950/30 p-1.5 rounded-lg border border-rose-900/30">
                      "{track.lyricsSnippet}"
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {project.audioTrack.type === 'custom_upload' && (
            <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/60 text-xs text-rose-200 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-rose-400" />
                <div>
                  <p className="font-bold">أغنيتك المرفوعة: {project.audioTrack.title}</p>
                  <p className="text-[10px] text-neutral-400">جاهزة وتعمل في الفيديو والتصدير</p>
                </div>
              </div>
              <button
                onClick={() => customAudioInputRef.current?.click()}
                className="text-[11px] underline text-rose-300 hover:text-white"
              >
                تغيير
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
