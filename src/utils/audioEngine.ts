import { AudioTrack } from '../types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private destNode: MediaStreamAudioDestinationNode | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private audioElement: HTMLAudioElement | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private synthIntervalId: any = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeNoiseNodes: AudioNode[] = [];
  private currentTrack: AudioTrack | null = null;

  constructor() {
    // Initialized on user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.destNode = this.ctx.createMediaStreamDestination();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      this.masterGain.connect(this.destNode);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAudioStreamDestination(): MediaStreamAudioDestinationNode | null {
    this.initContext();
    return this.destNode;
  }

  /**
   * Hard stop: Immediately halts ANY sound, kills oscillators, noise, HTML audio, and intervals.
   * Completely isolates sound channels so Quran and Romantic audio never overlap!
   */
  public stopAll() {
    this.isPlaying = false;

    // 1. Clear intervals
    if (this.synthIntervalId) {
      clearInterval(this.synthIntervalId);
      this.synthIntervalId = null;
    }

    // 2. Kill all active oscillators immediately
    for (const osc of this.activeOscillators) {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // already stopped
      }
    }
    this.activeOscillators = [];

    // 3. Kill any active noise sources
    for (const node of this.activeNoiseNodes) {
      try {
        (node as any).stop?.();
        node.disconnect();
      } catch (e) {
        // ignore
      }
    }
    this.activeNoiseNodes = [];

    // 4. Force stop HTML Audio Element
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement.removeAttribute('src');
    }
  }

  public async setTrack(track: AudioTrack) {
    this.stopAll();
    this.currentTrack = track;
  }

  public async play() {
    this.initContext();
    if (!this.ctx || !this.currentTrack) return;

    // Ensure clean state before starting
    this.stopAll();
    this.isPlaying = true;

    // Check if track has an audioUrl (e.g. Quran recitation from CDN or user custom uploaded song)
    if (this.currentTrack.audioUrl) {
      this.playHtmlAudio(this.currentTrack.audioUrl);
      return;
    }

    // Otherwise play the specific synthesizer style
    const style = this.currentTrack.synthStyle || 'arabic_beat';
    if (style === 'rain') {
      this.startRainSynth();
    } else if (style === 'dawn') {
      this.startAmbientPad();
    } else {
      this.startArabicRomanticBeat(style);
    }
  }

  public pause() {
    this.stopAll();
  }

  public stop() {
    this.stopAll();
  }

  public setVolume(val: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, val)), this.ctx.currentTime);
    }
  }

  private playHtmlAudio(url: string) {
    if (!this.ctx || !this.masterGain) return;

    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.crossOrigin = 'anonymous';
      this.audioElement.loop = true;
      try {
        this.sourceNode = this.ctx.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.masterGain);
      } catch (e) {
        console.warn('AudioElement connection note:', e);
      }
    }

    let targetSrc = url;
    if (url.startsWith('http') && !url.includes(window.location.host) && !url.includes('everyayah.com')) {
      targetSrc = `/api/audio-proxy?url=${encodeURIComponent(url)}`;
    }

    if (this.audioElement.src !== targetSrc) {
      this.audioElement.src = targetSrc;
    }
    this.audioElement.currentTime = 0;
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Audio playback restricted:', err);
      });
    }
  }

  /**
   * Plays a rhythmic Arabic Romantic Pop Beat with percussion, bassline, and warm oriental melody
   * Designed specifically for Arabic hit song vibes like "ما تيجي نركن الزعل"
   */
  private startArabicRomanticBeat(style: string) {
    if (!this.ctx || !this.masterGain) return;

    // Arabic Kurd / Bayati Romantic progression in D Minor / G Minor
    // Warm, emotional, modern Arabic pop sound
    const chords = [
      [146.83, 220.00, 261.63, 349.23], // Dm7
      [130.81, 196.00, 246.94, 329.63], // Cmaj
      [116.54, 174.61, 220.00, 293.66], // Bbmaj
      [130.81, 164.81, 196.00, 246.94], // Am7
    ];

    const bassNotes = [73.42, 65.41, 58.27, 55.0]; // D1, C1, Bb0, A0
    const melodyPhrases = [
      [293.66, 329.63, 349.23, 392.00, 349.23], // D4, E4, F4, G4, F4
      [329.63, 293.66, 261.63, 293.66, 329.63], // E4, D4, C4, D4, E4
      [349.23, 392.00, 440.00, 392.00, 349.23], // F4, G4, A4, G4, F4
      [329.63, 293.66, 246.94, 220.00, 246.94], // E4, D4, B3, A3, B3
    ];

    let beatStep = 0;

    const playBar = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const chord = chords[beatStep % chords.length];
      const bass = bassNotes[beatStep % bassNotes.length];
      const melody = melodyPhrases[beatStep % melodyPhrases.length];

      // 1. Kick Drum (rhythm pulse for modern romantic pop)
      this.playKick(now);
      this.playKick(now + 1.0);

      // 2. Soft Snare / Rimshot on 2 & 4
      this.playSnare(now + 0.5);
      this.playSnare(now + 1.5);

      // 3. Sub Bass
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(bass, now);
      bassGain.gain.setValueAtTime(0.22, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      bassOsc.start(now);
      bassOsc.stop(now + 2.0);
      this.activeOscillators.push(bassOsc);

      // 4. Warm Pad Chords (Rhodes & Strings)
      chord.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();
        const filter = this.ctx!.createBiquadFilter();

        osc.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, now);

        noteGain.gain.setValueAtTime(0.01, now);
        noteGain.gain.linearRampToValueAtTime(0.07, now + 0.15);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.9);

        osc.frequency.setValueAtTime(freq, now);
        osc.connect(filter);
        filter.connect(noteGain);
        noteGain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + 2.0);
        this.activeOscillators.push(osc);
      });

      // 5. Emotional Lead Melody (Arabic Flute/Violin tone)
      melody.forEach((pitch, pIdx) => {
        const noteTime = now + pIdx * 0.38;
        const melOsc = this.ctx!.createOscillator();
        const melGain = this.ctx!.createGain();
        const melFilter = this.ctx!.createBiquadFilter();

        melOsc.type = 'triangle';
        melFilter.type = 'lowpass';
        melFilter.frequency.setValueAtTime(1600, noteTime);

        melGain.gain.setValueAtTime(0.01, noteTime);
        melGain.gain.linearRampToValueAtTime(0.12, noteTime + 0.05);
        melGain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);

        melOsc.frequency.setValueAtTime(pitch, noteTime);
        melOsc.connect(melFilter);
        melFilter.connect(melGain);
        melGain.connect(this.masterGain!);

        melOsc.start(noteTime);
        melOsc.stop(noteTime + 0.38);
        this.activeOscillators.push(melOsc);
      });

      beatStep++;
    };

    playBar();
    this.synthIntervalId = setInterval(playBar, 2000);
  }

  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.25);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.25);
    this.activeOscillators.push(osc);
  }

  private playSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;
    // Tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + 0.15);
    this.activeOscillators.push(osc);
  }

  private startRainSynth() {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNoiseNodes.push(whiteNoise);
  }

  private startAmbientPad() {
    if (!this.ctx || !this.masterGain) return;
    const freqs = [130.81, 196.0, 261.63, 329.63];
    freqs.forEach((f) => {
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx!.currentTime);
      g.gain.setValueAtTime(0.04, this.ctx!.currentTime);
      osc.connect(g);
      g.connect(this.masterGain!);
      osc.start();
      this.activeOscillators.push(osc);
    });
  }
}

export const audioEngine = new AudioEngine();
