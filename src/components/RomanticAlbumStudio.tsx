import React, { useRef } from 'react';
import {
  Upload,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Music,
  Heart,
  Sparkles,
  Type,
  Wand2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  VideoProject,
  PhotoSlide,
  ParticleEffect,
  TransitionType,
  ArabicFontFamily,
  TextAnimationType,
  AudioTrack,
} from '../types';
import { ROMANTIC_AUDIO_TRACKS, ROMANTIC_LOVE_QUOTES } from '../data/romanticTemplates';

interface RomanticAlbumStudioProps {
  project: VideoProject;
  onUpdateProject: (updates: Partial<VideoProject>) => void;
  onOpenAiModal: () => void;
}

const QUICK_ROMANTIC_SAMPLES = [
  { id: 'starlit_beach', name: 'شاطئ العشاق', url: '/src/assets/images/romantic_starlit_beach_walk_1793539056169.jpg' },
  { id: 'candlelight_dinner', name: 'عشاء الشموع', url: '/src/assets/images/romantic_candlelight_dinner_flowers_1793539069327.jpg' },
  { id: 'holding_hands', name: 'تشابك الأيدي والعهد', url: '/src/assets/images/romantic_holding_hands_rings_1793538794071.jpg' },
  { id: 'paris_night', name: 'أمسية باريس', url: '/src/assets/images/romantic_paris_night_lights_1793538794609.jpg' },
  { id: 'rain_umbrella', name: 'مظلة المطر', url: '/src/assets/images/romantic_rain_umbrella_glow_1793538795221.jpg' },
  { id: 'sunset_beach', name: 'غروب البحر', url: '/src/assets/images/romantic_sunset_silhouette_1793536480216.jpg' },
  { id: 'roses_candles', name: 'ورود الحب', url: '/src/assets/images/romantic_roses_candlelight_1793536353040.jpg' },
];

export const RomanticAlbumStudio: React.FC<RomanticAlbumStudioProps> = ({
  project,
  onUpdateProject,
  onOpenAiModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddPresetSlide = (url: string, name: string) => {
    const newSlide: PhotoSlide = {
      id: `preset_slide_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      url,
      name,
      duration: 3.5,
    };
    const updatedSlides = [...project.slides, newSlide];
    const totalDuration = updatedSlides.reduce((acc, curr) => acc + curr.duration, 0);
    onUpdateProject({
      slides: updatedSlides,
      duration: Math.max(8, totalDuration),
    });
  };

  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newSlides: PhotoSlide[] = files.map((file, idx) => ({
      id: `photo_${Date.now()}_${idx}`,
      url: URL.createObjectURL(file),
      name: file.name,
      duration: 3.5,
    }));

    const updatedSlides = [...project.slides, ...newSlides];
    const totalDuration = updatedSlides.reduce((acc, curr) => acc + curr.duration, 0);

    onUpdateProject({
      slides: updatedSlides,
      duration: Math.max(8, totalDuration),
    });
  };

  const handleRemoveSlide = (slideId: string) => {
    const updated = project.slides.filter((s) => s.id !== slideId);
    const totalDuration = updated.reduce((acc, curr) => acc + curr.duration, 0);
    onUpdateProject({
      slides: updated,
      duration: Math.max(6, totalDuration),
    });
  };

  const handleMoveSlide = (idx: number, direction: 'up' | 'down') => {
    const slides = [...project.slides];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const temp = slides[idx];
    slides[idx] = slides[targetIdx];
    slides[targetIdx] = temp;
    onUpdateProject({ slides });
  };

  const handleSlideDuration = (slideId: string, duration: number) => {
    const updated = project.slides.map((s) =>
      s.id === slideId ? { ...s, duration: Math.max(1, duration) } : s
    );
    const totalDuration = updated.reduce((acc, curr) => acc + curr.duration, 0);
    onUpdateProject({
      slides: updated,
      duration: totalDuration,
    });
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const trackUrl = URL.createObjectURL(file);
    const customTrack: AudioTrack = {
      id: `custom_${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'موسيقى من جهازي',
      type: 'custom_upload',
      audioUrl: trackUrl,
    };
    onUpdateProject({ audioTrack: customTrack });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Quick Steps Guide */}
      <div className="bg-gradient-to-r from-rose-950/40 via-neutral-900 to-rose-950/40 rounded-2xl border border-rose-800/40 p-3.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-600 text-white font-bold flex items-center justify-center text-[11px]">1</span>
          <span className="font-semibold text-white">اختر صور الألبوم</span>
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

      {/* 1. Photo Upload & Slides Section */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-white">صور ألبومك الشخصي</h2>
            <span className="text-xs text-neutral-400">
              ({project.slides.length} صور مضافة)
            </span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-950/40 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة صور جديدة</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleUploadPhotos}
          />
        </div>

        {project.slides.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-neutral-700/80 hover:border-rose-500/80 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-neutral-950/40 group"
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-white mb-1">
              اضغط هنا لاختيار صور من هاتفك أو جهازك
            </p>
            <p className="text-xs text-neutral-400">
              يمكنك اختيار صور متعددة لدمجها في فيديو رومانسي واحد مع تأثيرات احترافية
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {project.slides.map((slide, idx) => (
              <div
                key={slide.id}
                className="relative group bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 shadow-md flex flex-col"
              >
                <div className="relative aspect-[3/4] w-full bg-neutral-900 overflow-hidden">
                  <img
                    src={slide.url}
                    alt={slide.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-[10px] text-white px-2 py-0.5 rounded-md font-mono">
                    #{idx + 1}
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    {idx > 0 && (
                      <button
                        onClick={() => handleMoveSlide(idx, 'up')}
                        className="p-1.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700"
                        title="تحريك للأمام"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < project.slides.length - 1 && (
                      <button
                        onClick={() => handleMoveSlide(idx, 'down')}
                        className="p-1.5 rounded-lg bg-neutral-800 text-white hover:bg-neutral-700"
                        title="تحريك للخلف"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveSlide(slide.id)}
                      className="p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2 flex items-center justify-between gap-1 text-[11px] text-neutral-400 bg-neutral-950">
                  <span>المدة:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      step={0.5}
                      value={slide.duration}
                      onChange={(e) => handleSlideDuration(slide.id, parseFloat(e.target.value) || 3)}
                      className="w-12 bg-neutral-800 text-white text-center rounded px-1 py-0.5 border border-neutral-700 font-mono text-xs"
                    />
                    <span>ثانية</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Add Romantic High-Res Photos */}
        <div className="mt-4 pt-3.5 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-neutral-300">
              أو أضف لقطات رومانسية عالية الدقة لألبومك بنقرة واحدة:
            </span>
            <span className="text-[11px] text-rose-400 font-medium">7 لقطات مميزة جاهزة</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
            {QUICK_ROMANTIC_SAMPLES.map((sample) => (
              <button
                key={sample.id}
                onClick={() => handleAddPresetSlide(sample.url, sample.name)}
                className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-neutral-800 hover:border-rose-500 group transition-all"
                title={`إضافة ${sample.name}`}
              >
                <img
                  src={sample.url}
                  alt={sample.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex flex-col items-center justify-center p-1 text-center transition-all">
                  <Plus className="w-5 h-5 text-white drop-shadow mb-0.5" />
                  <span className="text-[9px] text-white/90 font-medium line-clamp-1 leading-tight">
                    {sample.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Romantic Dedication Text & Typography */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Type className="w-5 h-5 text-rose-500" />
            <h2 className="text-base font-bold text-white">كلمات الحب والإهداء</h2>
          </div>

          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>كتابة بالذكاء الاصطناعي</span>
          </button>
        </div>

        {/* Text Input */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              نص الإهداء الرومانسي (يظهر في منتصف الفيديو):
            </label>
            <textarea
              rows={2}
              value={project.primaryText}
              onChange={(e) => onUpdateProject({ primaryText: e.target.value })}
              placeholder="اكتب رسالة حبك أو اختر من العبارات المقترحة أدناه..."
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 p-3 text-sm focus:outline-none focus:border-rose-500 leading-relaxed"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1 block">
              اسم الحبيب / تاريخ الذكرى (سطر إضافي):
            </label>
            <input
              type="text"
              value={project.secondaryText || ''}
              onChange={(e) => onUpdateProject({ secondaryText: e.target.value })}
              placeholder="مثال: إلى حبيبتي نور · ذكرى زواجنا السعيد"
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Quick Quotes Library */}
          <div className="mt-1">
            <span className="text-xs text-neutral-400 mb-2 block">
              أو اختر عبارة جاهزة من روائع كلمات الحب:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto">
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

        {/* Font Family and Animation style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-neutral-800">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              نوع الخط العربي الأنيق:
            </label>
            <select
              value={project.fontFamily}
              onChange={(e) => onUpdateProject({ fontFamily: e.target.value as ArabicFontFamily })}
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="font-amiri">الخط الأميري (كلاسيكي راقي)</option>
              <option value="font-ruqaa">خط الرقعة (عاطفي شاعري)</option>
              <option value="font-cairo">خط كايرو (عصري جذاب)</option>
              <option value="font-tajawal">خط تجوال (ناعم ومنسق)</option>
              <option value="font-kufi">خط الكوفي (هندسي متميز)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              طريقة حركة النص:
            </label>
            <select
              value={project.textAnimation}
              onChange={(e) =>
                onUpdateProject({ textAnimation: e.target.value as TextAnimationType })
              }
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="golden_shimmer">بريق ذهبي براق (Golden Shimmer)</option>
              <option value="floating_fade">تلاشي وانسياب ناعم (Floating Fade)</option>
              <option value="glow_pulse">نبض وتوهج شاعري (Glow Pulse)</option>
            </select>
          </div>
        </div>
      </section>

      {/* 3. Romantic Effects & Music */}
      <section className="bg-neutral-900/70 rounded-2xl border border-neutral-800 p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-rose-500" />
          <h2 className="text-base font-bold text-white">المؤثرات الرومانسية والموسيقى</h2>
        </div>

        {/* Visual Effects */}
        <div className="mb-5">
          <label className="text-xs font-semibold text-neutral-300 mb-2 block">
            المؤثرات البصرية المتحركة:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'hearts', label: 'قلوب متطايرة', icon: Heart },
              { id: 'rose_petals', label: 'بتلات الورد', icon: Sparkles },
              { id: 'sparkles', label: 'بريق وبوكيه', icon: Sparkles },
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
        </div>

        {/* Transitions & Frame */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
              حركة الانتقال بين الصور:
            </label>
            <select
              value={project.transition}
              onChange={(e) => onUpdateProject({ transition: e.target.value as TransitionType })}
              className="w-full bg-neutral-950 text-white rounded-xl border border-neutral-800 px-3 py-2 text-xs focus:outline-none focus:border-rose-500"
            >
              <option value="zoom_in">تكبير سينمائي (Ken Burns Zoom In)</option>
              <option value="zoom_out">تصغير سينمائي (Ken Burns Zoom Out)</option>
              <option value="crossfade">تلاشي ناعم متداخل (Crossfade)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
              <input
                type="checkbox"
                checked={project.showRomanticFrame || false}
                onChange={(e) => onUpdateProject({ showRomanticFrame: e.target.checked })}
                className="accent-rose-600 rounded"
              />
              <span className="text-xs font-medium text-neutral-300">
                إضافة إطار قلوب وزخرفة رومانسية
              </span>
            </label>
          </div>
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
              onClick={() => audioInputRef.current?.click()}
              className="text-xs text-rose-400 hover:text-rose-300 font-bold underline flex items-center gap-1"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع أغنية MP3 من جهازي</span>
            </button>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleCustomAudioUpload}
            />
          </div>

          <p className="text-[11px] text-neutral-400 mb-3">
            اختر أغنية من القائمة المجهزة بإيقاع رومانسي عصري، أو اضغط زر الرفع لاختيار نسختك المفضلة من الهاتف:
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
                onClick={() => audioInputRef.current?.click()}
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
