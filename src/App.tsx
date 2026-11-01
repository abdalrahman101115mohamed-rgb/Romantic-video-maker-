import React, { useState } from 'react';
import { Header } from './components/Header';
import { VideoPreviewPlayer } from './components/VideoPreviewPlayer';
import { RomanticAlbumStudio } from './components/RomanticAlbumStudio';
import { RomanticPresetStudio } from './components/RomanticPresetStudio';
import { QuranStudio } from './components/QuranStudio';
import { ExportModal } from './components/ExportModal';
import { AiTextModal } from './components/AiTextModal';
import { AppMode, VideoProject } from './types';
import { ROMANTIC_AUDIO_TRACKS } from './data/romanticTemplates';
import { QURAN_AUDIO_OPTIONS, QURAN_VERSES } from './data/quranData';

import { audioEngine } from './utils/audioEngine';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('romantic_album');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Initial Romantic Album Project with "ما تيجي نركن الزعل"
  const [project, setProject] = useState<VideoProject>({
    id: 'proj_default',
    title: 'قصة عشقنا - ما تيجي نركن الزعل',
    mode: 'romantic_album',
    aspectRatio: '9:16',
    duration: 10,
    slides: [
      {
        id: 'slide_1',
        url: '/src/assets/images/romantic_sunset_silhouette_1793536480216.jpg',
        name: 'غروب البحر الرومانسي',
        duration: 5,
      },
      {
        id: 'slide_2',
        url: '/src/assets/images/romantic_roses_candlelight_1793536353040.jpg',
        name: 'ورود وشموع الحب',
        duration: 5,
      },
    ],
    overlayEffect: 'hearts',
    transition: 'zoom_in',
    primaryText: 'ما تيجي نركن الزعل على جنب ونقعد سوا.. ده الحب غالي ❤️',
    secondaryText: 'إهداء خاص لأغلى إنسان في حياتي 🌹',
    fontFamily: 'font-ruqaa',
    textAnimation: 'golden_shimmer',
    textColor: '#ffffff',
    textSize: 1.15,
    showRomanticFrame: true,
    showIslamicFrame: false,
    audioTrack: ROMANTIC_AUDIO_TRACKS[0], // ما تيجي نركن الزعل
    backgroundColor: '#0c0a09',
    filter: 'golden_hour',
  });

  const handleUpdateProject = (updates: Partial<VideoProject>) => {
    setProject((prev) => ({ ...prev, ...updates }));
  };

  const handleSelectMode = (newMode: AppMode) => {
    // 100% hard stop on any active audio to ensure total channel separation
    audioEngine.stopAll();
    setCurrentMode(newMode);

    if (newMode === 'quran') {
      const firstVerse = QURAN_VERSES[0];
      setProject((prev) => ({
        ...prev,
        mode: 'quran',
        title: firstVerse.surahName,
        primaryText: firstVerse.textUthmani,
        secondaryText: `${firstVerse.surahName} · ${firstVerse.ayahRange || ''} - ${firstVerse.reciterName}`,
        backgroundMediaUrl: '/src/assets/images/quran_prophet_mosque_madinah_1793538084160.jpg',
        slides: [],
        duration: firstVerse.recommendedDuration || 43,
        fontFamily: 'font-quran',
        overlayEffect: 'golden_dust',
        filter: 'golden_hour',
        showIslamicFrame: true,
        showRomanticFrame: false,
        audioTrack: {
          id: `reciter_${firstVerse.id}`,
          title: `${firstVerse.surahName} (${firstVerse.reciterName})`,
          artist: firstVerse.reciterName || 'مشاري العفاسي',
          type: 'quran_audio',
          audioUrl: firstVerse.reciterAudioUrl,
        },
      }));
    } else if (newMode === 'romantic_preset') {
      setProject((prev) => ({
        ...prev,
        mode: 'romantic_preset',
        title: 'رسالة حب خالدة',
        primaryText: 'في يدك عهدي، وفي قلبك موطني الذي لا أضل بعده أبداً 💍',
        secondaryText: 'إهداء خاص لأغلى إنسان في حياتي ✨',
        backgroundMediaUrl: '/src/assets/images/romantic_holding_hands_rings_1793538794071.jpg',
        slides: [],
        duration: 10,
        fontFamily: 'font-ruqaa',
        overlayEffect: 'golden_dust',
        filter: 'warm_vintage',
        showIslamicFrame: false,
        showRomanticFrame: true,
        audioTrack: ROMANTIC_AUDIO_TRACKS[0], // ما تيجي نركن الزعل
      }));
    } else {
      // romantic_album
      setProject((prev) => ({
        ...prev,
        mode: 'romantic_album',
        title: 'ألبوم الحب والذكريات',
        primaryText: 'معك، كل لحظة في العمر تصبح بداية لقصة عشق جديدة ❤️',
        secondaryText: 'أنت نبض الفؤاد وسر ابتسامتي في كل مساء 🌹',
        slides: [
          {
            id: 'slide_1',
            url: '/src/assets/images/romantic_sunset_silhouette_1793536480216.jpg',
            name: 'غروب البحر الرومانسي',
            duration: 5,
          },
          {
            id: 'slide_2',
            url: '/src/assets/images/romantic_roses_candlelight_1793536353040.jpg',
            name: 'ورود وشموع الحب',
            duration: 5,
          },
        ],
        backgroundMediaUrl: undefined,
        duration: 10,
        fontFamily: 'font-ruqaa',
        overlayEffect: 'hearts',
        filter: 'golden_hour',
        showIslamicFrame: false,
        showRomanticFrame: true,
        audioTrack: ROMANTIC_AUDIO_TRACKS[0],
      }));
    }
  };

  const handleApplyAiText = (primaryText: string, secondaryText?: string) => {
    handleUpdateProject({
      primaryText,
      ...(secondaryText ? { secondaryText } : {}),
    });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        onOpenExport={() => setIsExportModalOpen(true)}
      />

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Sticky Preview Player): 5 cols on lg */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 order-1 lg:order-2">
            <VideoPreviewPlayer
              project={project}
              onUpdateProject={handleUpdateProject}
              onOpenExport={() => setIsExportModalOpen(true)}
            />
          </div>

          {/* Right Column (Active Editor Tooling): 7 cols on lg */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col gap-6">
            {currentMode === 'romantic_album' && (
              <RomanticAlbumStudio
                project={project}
                onUpdateProject={handleUpdateProject}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            )}

            {currentMode === 'romantic_preset' && (
              <RomanticPresetStudio
                project={project}
                onUpdateProject={handleUpdateProject}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            )}

            {currentMode === 'quran' && (
              <QuranStudio
                project={project}
                onUpdateProject={handleUpdateProject}
                onOpenAiModal={() => setIsAiModalOpen(true)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
      />

      <AiTextModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        mode={currentMode}
        onApplyText={handleApplyAiText}
      />
    </div>
  );
}
