export type AppMode = 'romantic_album' | 'romantic_preset' | 'quran';

export type AspectRatio = '9:16' | '1:1' | '16:9';

export type TransitionType = 'crossfade' | 'zoom_in' | 'zoom_out' | 'slide_left' | 'blur_fade';

export type ParticleEffect = 'hearts' | 'rose_petals' | 'sparkles' | 'rain' | 'golden_dust' | 'none';

export type TextAnimationType = 'word_by_word' | 'golden_shimmer' | 'floating_fade' | 'typewriter' | 'glow_pulse';

export type ArabicFontFamily =
  | 'font-amiri'
  | 'font-ruqaa'
  | 'font-kufi'
  | 'font-quran'
  | 'font-cairo'
  | 'font-tajawal';

export interface PhotoSlide {
  id: string;
  url: string;
  name: string;
  caption?: string;
  duration: number; // in seconds
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  type: 'arabic_song' | 'synth_nature' | 'quran_audio' | 'custom_upload';
  synthStyle?: 'arabic_beat' | 'romantic_pop' | 'rain' | 'dawn';
  audioUrl?: string;
  lyricsSnippet?: string;
  coverEmoji?: string;
}

export interface QuranVerse {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber?: number;
  ayahRange?: string;
  textUthmani: string;
  translationOrTafseer?: string;
  reciterAudioUrl?: string;
  reciterName?: string;
  themeTag?: string;
  recommendedDuration: number;
}

export interface VideoProject {
  id: string;
  title: string;
  mode: AppMode;
  aspectRatio: AspectRatio;
  duration: number; // total duration in seconds
  slides: PhotoSlide[];
  overlayEffect: ParticleEffect;
  transition: TransitionType;
  primaryText: string;
  secondaryText?: string;
  fontFamily: ArabicFontFamily;
  textAnimation: TextAnimationType;
  textColor: string;
  textSize: number; // relative size 1-3
  showIslamicFrame?: boolean;
  showRomanticFrame?: boolean;
  audioTrack: AudioTrack;
  backgroundMediaUrl?: string; // used for preset or quran modes
  backgroundColor: string;
  filter: 'none' | 'warm_vintage' | 'cinematic_mood' | 'golden_hour' | 'noir' | 'dreamy';
  backgroundBrightness?: number; // 0.6 to 1.4 for background lighting control
}

export interface SocialShareTarget {
  id: string;
  name: string;
  icon: string;
  color: string;
  shareUrlTemplate?: (url: string, text: string) => string;
}
