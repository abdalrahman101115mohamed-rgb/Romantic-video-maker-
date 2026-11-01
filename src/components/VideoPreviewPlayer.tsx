import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Download, Share2 } from 'lucide-react';
import { VideoProject, AspectRatio } from '../types';
import { canvasRenderer } from '../utils/canvasRenderer';
import { audioEngine } from '../utils/audioEngine';

interface VideoPreviewPlayerProps {
  project: VideoProject;
  onUpdateProject: (updates: Partial<VideoProject>) => void;
  onOpenExport: () => void;
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  project,
  onUpdateProject,
  onOpenExport,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Resolution dimensions
  const getDimensions = (ratio: AspectRatio) => {
    switch (ratio) {
      case '1:1':
        return { width: 720, height: 720 };
      case '16:9':
        return { width: 1280, height: 720 };
      case '9:16':
      default:
        return { width: 720, height: 1280 };
    }
  };

  const { width, height } = getDimensions(project.aspectRatio);

  const projectRef = useRef(project);
  projectRef.current = project;

  // Preload images whenever slides or background change
  useEffect(() => {
    const urls = project.slides.map((s) => s.url);
    if (project.backgroundMediaUrl) urls.push(project.backgroundMediaUrl);
    canvasRenderer.preloadImages(urls).then(() => {
      drawCurrentFrame(currentTime);
    });
  }, [project.slides, project.backgroundMediaUrl]);

  // Update particles on effect change
  useEffect(() => {
    canvasRenderer.initParticles(project.overlayEffect, width, height);
  }, [project.overlayEffect, width, height]);

  // Handle Audio track and Mode change - STRICT ISOLATION
  useEffect(() => {
    // Immediately stop any currently playing sound
    audioEngine.stopAll();
    setIsPlaying(false);
    setCurrentTime(0);
    audioEngine.setTrack(project.audioTrack);
  }, [project.audioTrack.id, project.mode]);

  const drawCurrentFrame = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvasRenderer.render(ctx, projectRef.current, time, width, height);
  };

  // Playback loop - ONLY triggered by isPlaying and duration
  useEffect(() => {
    if (isPlaying) {
      audioEngine.play();
      lastTimeRef.current = performance.now();

      const loop = (now: number) => {
        const delta = (now - lastTimeRef.current) / 1000;
        lastTimeRef.current = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= projectRef.current.duration) {
            // Loop back to start
            return 0;
          }
          drawCurrentFrame(next);
          return next;
        });

        animFrameRef.current = requestAnimationFrame(loop);
      };

      animFrameRef.current = requestAnimationFrame(loop);
    } else {
      audioEngine.stopAll();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      drawCurrentFrame(currentTime);
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, project.duration, width, height]);

  // Re-render when current project props change while paused
  useEffect(() => {
    if (!isPlaying) {
      drawCurrentFrame(currentTime);
    }
  }, [project, currentTime]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    drawCurrentFrame(newTime);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    audioEngine.setVolume(next ? 0 : 0.8);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Determine aspect ratio container class
  const getContainerAspect = () => {
    if (project.aspectRatio === '9:16') return 'aspect-[9/16] max-h-[580px]';
    if (project.aspectRatio === '1:1') return 'aspect-square max-h-[480px]';
    return 'aspect-video max-h-[440px]';
  };

  return (
    <div className="flex flex-col items-center bg-neutral-900/60 rounded-2xl border border-neutral-800/80 p-4 lg:p-6 w-full shadow-xl">
      {/* Aspect Ratio bar */}
      <div className="flex items-center justify-between w-full mb-3 gap-2">
        <span className="text-xs font-semibold text-neutral-400">أبعاد الفيديو:</span>
        <div className="flex items-center gap-1.5 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
          <button
            onClick={() => onUpdateProject({ aspectRatio: '9:16' })}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              project.aspectRatio === '9:16'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            9:16 تيك توك وريلز
          </button>
          <button
            onClick={() => onUpdateProject({ aspectRatio: '1:1' })}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              project.aspectRatio === '1:1'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            1:1 مربع
          </button>
          <button
            onClick={() => onUpdateProject({ aspectRatio: '16:9' })}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              project.aspectRatio === '16:9'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            16:9 أفقي
          </button>
        </div>
      </div>

      {/* Video Viewport Stage */}
      <div className="relative w-full flex items-center justify-center bg-black/80 rounded-xl overflow-hidden border border-neutral-800/90 shadow-2xl">
        <div className={`relative ${getContainerAspect()} w-auto flex items-center justify-center`}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
          />

          {/* Quick Play overlay when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-6 h-6 fill-white translate-x-[-1px]" />
            </button>
          )}

          {/* Badge indicator on top-right */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-white/90 border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>معاينة حية فائقة الدقة</span>
          </div>
        </div>
      </div>

      {/* Media Controls Bar */}
      <div className="w-full mt-4 flex flex-col gap-2.5">
        {/* Timeline Slider */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-neutral-400 tabular-nums w-10 text-left">
            {formatSeconds(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={project.duration}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-rose-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono text-neutral-400 tabular-nums w-10 text-right">
            {formatSeconds(project.duration)}
          </span>
        </div>

        {/* Background Lighting Control (أضواء وسطوع الخلفية) */}
        <div className="flex items-center justify-between bg-neutral-950/80 rounded-xl px-3 py-2 border border-neutral-800 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <span className="text-amber-400">💡</span>
            <span className="font-medium">إضاءة وسطوع الخلفية:</span>
            <span className="text-neutral-400 font-mono text-[11px]">
              {Math.round((project.backgroundBrightness ?? 1.0) * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-2 w-48">
            <span className="text-[10px] text-neutral-500">خافت</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.05}
              value={project.backgroundBrightness ?? 1.0}
              onChange={(e) => onUpdateProject({ backgroundBrightness: parseFloat(e.target.value) })}
              className="flex-1 accent-amber-500 h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-neutral-500">مضيء</span>

            {(project.backgroundBrightness ?? 1.0) !== 1.0 && (
              <button
                onClick={() => onUpdateProject({ backgroundBrightness: 1.0 })}
                className="text-[10px] text-amber-400/80 hover:text-amber-300 px-1 py-0.5"
                title="إعادة للوضع الطبيعي"
              >
                تلقائي
              </button>
            )}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors active:scale-95 flex items-center justify-center"
              title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-xl bg-neutral-800 text-white hover:bg-neutral-700 transition-colors active:scale-95 flex items-center justify-center"
              title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="text-xs text-neutral-400 truncate max-w-[180px]">
              {project.audioTrack.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenExport}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 rounded-xl hover:from-rose-500 hover:to-amber-500 shadow-md shadow-rose-950/40 transition-all active:scale-[0.98]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تنزيل ومشاركة الفيديو</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
