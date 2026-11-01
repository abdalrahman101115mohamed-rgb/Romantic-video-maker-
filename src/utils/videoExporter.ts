import { VideoProject } from '../types';
import { canvasRenderer } from './canvasRenderer';
import { audioEngine } from './audioEngine';

export interface ExportProgress {
  percentage: number;
  currentSecond: number;
  totalSeconds: number;
  status: 'preparing' | 'rendering' | 'encoding' | 'completed' | 'error';
  errorMessage?: string;
}

export class VideoExporter {
  public async exportVideo(
    project: VideoProject,
    onProgress: (progress: ExportProgress) => void
  ): Promise<{ blob: Blob; file: File; url: string }> {
    onProgress({
      percentage: 5,
      currentSecond: 0,
      totalSeconds: project.duration,
      status: 'preparing',
    });

    // 1. Determine resolution based on aspect ratio
    let width = 720;
    let height = 1280;
    if (project.aspectRatio === '1:1') {
      width = 720;
      height = 720;
    } else if (project.aspectRatio === '16:9') {
      width = 1280;
      height = 720;
    }

    // 2. Preload all slide images
    const imageUrls = project.slides.map((s) => s.url);
    if (project.backgroundMediaUrl) imageUrls.push(project.backgroundMediaUrl);
    await canvasRenderer.preloadImages(imageUrls);

    // 3. Setup export offscreen canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // 4. Setup Audio & MediaRecorder
    await audioEngine.setTrack(project.audioTrack);
    const audioDest = audioEngine.getAudioStreamDestination();

    const videoStream = canvas.captureStream(30); // 30 FPS
    const combinedStream = new MediaStream();

    videoStream.getVideoTracks().forEach((track) => combinedStream.addTrack(track));
    if (audioDest && audioDest.stream.getAudioTracks().length > 0) {
      audioDest.stream.getAudioTracks().forEach((track) => combinedStream.addTrack(track));
    }

    // Determine supported mimeType
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/mp4';
      }
    }

    const recordedChunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType: MediaRecorder.isTypeSupported(mimeType) ? mimeType : undefined,
      videoBitsPerSecond: 3000000, // 3 Mbps high quality
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    return new Promise(async (resolve, reject) => {
      mediaRecorder.onstop = () => {
        audioEngine.stopAll();
        const blob = new Blob(recordedChunks, { type: mimeType });
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const fileName = `${project.mode === 'quran' ? 'فيديو_قرآني' : 'فيديو_رومانسي'}_${Date.now()}.${extension}`;
        const file = new File([blob], fileName, { type: mimeType });
        const url = URL.createObjectURL(blob);

        onProgress({
          percentage: 100,
          currentSecond: project.duration,
          totalSeconds: project.duration,
          status: 'completed',
        });

        resolve({ blob, file, url });
      };

      mediaRecorder.onerror = (event) => {
        audioEngine.stopAll();
        reject(event);
      };

      // Start recording
      mediaRecorder.start(100);
      await audioEngine.play();

      const totalDuration = project.duration;
      const fps = 30;
      const totalFrames = totalDuration * fps;
      let frame = 0;

      const renderNextFrame = () => {
        if (frame > totalFrames) {
          onProgress({
            percentage: 95,
            currentSecond: totalDuration,
            totalSeconds: totalDuration,
            status: 'encoding',
          });
          mediaRecorder.stop();
          return;
        }

        const currentTime = (frame / fps);
        canvasRenderer.render(ctx, project, currentTime, width, height);

        const pct = Math.min(95, Math.floor((frame / totalFrames) * 90) + 5);
        onProgress({
          percentage: pct,
          currentSecond: Math.floor(currentTime),
          totalSeconds: totalDuration,
          status: 'rendering',
        });

        frame++;
        requestAnimationFrame(renderNextFrame);
      };

      renderNextFrame();
    });
  }

  public downloadVideo(url: string, filename: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  public async shareNative(file: File, title: string, text: string): Promise<boolean> {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: title,
          text: text,
        });
        return true;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Native share error:', err);
        }
        return false;
      }
    }
    return false;
  }
}

export const videoExporter = new VideoExporter();
