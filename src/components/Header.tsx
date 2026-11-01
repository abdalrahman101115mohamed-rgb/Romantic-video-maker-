import React from 'react';
import { Heart, Sparkles, BookOpen, Film, Video } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenExport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-950/40">
            <Film className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
            استوديو الإبداع
          </span>
        </div>

        {/* Zone 2: Navigation Links / Modes */}
        <nav className="flex items-center gap-2 p-1 bg-neutral-900/90 rounded-xl border border-neutral-800">
          <button
            onClick={() => onSelectMode('romantic_album')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'romantic_album'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/50'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>ألبوم الصور الرومانسي</span>
          </button>

          <button
            onClick={() => onSelectMode('romantic_preset')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'romantic_preset'
                ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/50'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>قوالب بدون صورك</span>
          </button>

          <button
            onClick={() => onSelectMode('quran')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              currentMode === 'quran'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>فيديوهات القرآن الكريم</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 rounded-lg hover:from-rose-500 hover:to-amber-500 shadow-md shadow-rose-950/40 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            <Video className="w-4 h-4" />
            <span>تصدير ومشاركة</span>
          </button>
        </div>
      </div>
    </header>
  );
};
