import { VideoProject, ParticleEffect } from '../types';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  scale?: number;
}

export class CanvasRenderer {
  private particles: Particle[] = [];
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private maxParticles = 40;

  constructor() {
    this.initParticles('hearts', 720, 1280);
  }

  public async preloadImages(urls: string[]): Promise<void> {
    const promises = urls.map((url) => {
      if (!url) return Promise.resolve();
      if (this.imageCache.has(url)) return Promise.resolve();

      return new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          this.imageCache.set(url, img);
          resolve();
        };
        img.onerror = () => {
          console.warn('Failed to load image for canvas:', url);
          resolve(); // do not block
        };
        img.src = url;
      });
    });

    await Promise.all(promises);
  }

  public initParticles(effect: ParticleEffect, width: number, height: number) {
    this.particles = [];
    if (effect === 'none') return;

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: effect === 'rain' ? 8 + Math.random() * 12 : 12 + Math.random() * 24,
        speedY: effect === 'rain' ? 8 + Math.random() * 10 : -(0.6 + Math.random() * 1.8),
        speedX: effect === 'rain' ? 0.8 : (Math.random() - 0.5) * 1.2,
        opacity: 0.3 + Math.random() * 0.7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.04,
      });
    }
  }

  public render(
    ctx: CanvasRenderingContext2D,
    project: VideoProject,
    currentTime: number,
    width: number,
    height: number
  ) {
    ctx.save();
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Background / Current Slide
    this.drawSlideBackground(ctx, project, currentTime, width, height);

    // 2. Apply Cinematic Filter
    this.applyColorFilter(ctx, project.filter, width, height);

    // 3. Draw Particles (Hearts / Rose petals / Sparkles / Rain)
    if (project.overlayEffect !== 'none') {
      this.drawParticles(ctx, project.overlayEffect, width, height);
    }

    // 4. Draw Frames (Islamic or Romantic)
    if (project.mode === 'quran' && project.showIslamicFrame !== false) {
      this.drawIslamicFrame(ctx, width, height, project.title);
    } else if (project.showRomanticFrame) {
      this.drawRomanticFrame(ctx, width, height);
    }

    // 5. Draw Animated Typography
    this.drawAnimatedText(ctx, project, currentTime, width, height);

    ctx.restore();
  }

  private drawSlideBackground(
    ctx: CanvasRenderingContext2D,
    project: VideoProject,
    currentTime: number,
    width: number,
    height: number
  ) {
    const slides = project.slides.length > 0
      ? project.slides
      : project.backgroundMediaUrl
      ? [{ id: 'bg', url: project.backgroundMediaUrl, name: 'Background', duration: project.duration }]
      : [];

    if (slides.length === 0) {
      // Solid/gradient background fallback
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      return;
    }

    // Find current slide and transition
    let accumulatedTime = 0;
    let currentSlideIdx = 0;
    let slideStartTime = 0;

    for (let i = 0; i < slides.length; i++) {
      const dur = slides[i].duration || 4;
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + dur) {
        currentSlideIdx = i;
        slideStartTime = accumulatedTime;
        break;
      }
      accumulatedTime += dur;
      if (i === slides.length - 1) {
        currentSlideIdx = i;
        slideStartTime = accumulatedTime - dur;
      }
    }

    const currentSlide = slides[currentSlideIdx];
    const nextSlideIdx = (currentSlideIdx + 1) % slides.length;
    const nextSlide = slides[nextSlideIdx];

    const slideProgress = (currentTime - slideStartTime) / (currentSlide.duration || 4);
    const transitionDuration = 0.8; // seconds
    const timeRemaining = (currentSlide.duration || 4) - (currentTime - slideStartTime);
    const inTransition = timeRemaining < transitionDuration && slides.length > 1;

    // Draw base slide with Ken Burns effect
    const curImg = this.imageCache.get(currentSlide.url);
    const brightnessVal = project.backgroundBrightness ?? 1.0;

    if (curImg) {
      let scale = 1.0;
      let transX = 0;
      let transY = 0;

      if (project.transition === 'zoom_in') {
        scale = 1.0 + slideProgress * 0.12;
      } else if (project.transition === 'zoom_out') {
        scale = 1.15 - slideProgress * 0.12;
      } else {
        // Subtle ambient Ken Burns
        scale = 1.03 + Math.sin(slideProgress * Math.PI) * 0.05;
        transX = (slideProgress - 0.5) * 20;
      }

      ctx.save();
      ctx.filter = `brightness(${brightnessVal})`;
      ctx.translate(width / 2 + transX, height / 2 + transY);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);

      this.drawImageCover(ctx, curImg, 0, 0, width, height);
      ctx.restore();
    } else {
      // Fallback elegant dark backdrop
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, width, height);
    }

    // Handle transition to next slide if crossfading
    if (inTransition) {
      const nextImg = this.imageCache.get(nextSlide.url);
      if (nextImg) {
        const transProgress = 1 - timeRemaining / transitionDuration;
        ctx.save();
        ctx.filter = `brightness(${brightnessVal})`;
        ctx.globalAlpha = transProgress;
        this.drawImageCover(ctx, nextImg, 0, 0, width, height);
        ctx.restore();
      }
    }

    // Ambient contrast overlay scrim (adjusted with brightness)
    const scrim = ctx.createLinearGradient(0, 0, 0, height);
    scrim.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
    scrim.addColorStop(0.3, 'rgba(0, 0, 0, 0.18)');
    scrim.addColorStop(0.7, 'rgba(0, 0, 0, 0.32)');
    scrim.addColorStop(1, 'rgba(0, 0, 0, 0.68)');
    ctx.fillStyle = scrim;
    ctx.fillRect(0, 0, width, height);

    // Center radial ambient glow (إضاءة وتوهج الخلفية)
    const glow = ctx.createRadialGradient(
      width / 2, height / 2, width * 0.08,
      width / 2, height / 2, width * 0.65
    );
    if (project.mode === 'quran') {
      glow.addColorStop(0, 'rgba(245, 158, 11, 0.28)'); // نور إيماني ذهبي دافئ
      glow.addColorStop(0.5, 'rgba(245, 158, 11, 0.08)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      glow.addColorStop(0, 'rgba(244, 63, 94, 0.25)'); // ضوء الشموع والورد
      glow.addColorStop(0.5, 'rgba(251, 146, 60, 0.08)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);
  }

  private drawImageCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    const imgRatio = img.width / img.height;
    const canvasRatio = w / h;
    let renderW = w;
    let renderH = h;
    let renderX = x;
    let renderY = y;

    if (imgRatio > canvasRatio) {
      renderW = h * imgRatio;
      renderX = x + (w - renderW) / 2;
    } else {
      renderH = w / imgRatio;
      renderY = y + (h - renderH) / 2;
    }

    ctx.drawImage(img, renderX, renderY, renderW, renderH);
  }

  private applyColorFilter(
    ctx: CanvasRenderingContext2D,
    filter: VideoProject['filter'],
    width: number,
    height: number
  ) {
    if (filter === 'none') return;

    ctx.save();
    if (filter === 'golden_hour') {
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = 'rgba(245, 158, 11, 0.28)';
      ctx.fillRect(0, 0, width, height);
    } else if (filter === 'warm_vintage') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = 'rgba(254, 215, 170, 0.22)';
      ctx.fillRect(0, 0, width, height);

      // Vignette
      const vig = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.75);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
    } else if (filter === 'cinematic_mood') {
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = 'rgba(15, 23, 42, 0.3)';
      ctx.fillRect(0, 0, width, height);
    } else if (filter === 'dreamy') {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(251, 113, 133, 0.15)';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, effect: ParticleEffect, width: number, height: number) {
    ctx.save();

    for (const p of this.particles) {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      // Wrap around bounds
      if (p.y < -30) {
        p.y = height + 20;
        p.x = Math.random() * width;
      } else if (p.y > height + 30) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x < -30) p.x = width + 20;
      if (p.x > width + 30) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      if (effect === 'hearts') {
        this.drawHeartShape(ctx, p.size);
      } else if (effect === 'rose_petals') {
        this.drawPetalShape(ctx, p.size);
      } else if (effect === 'sparkles' || effect === 'golden_dust') {
        this.drawSparkleShape(ctx, p.size, effect === 'golden_dust');
      } else if (effect === 'rain') {
        this.drawRainDrop(ctx, p.size);
      }

      ctx.restore();
    }

    ctx.restore();
  }

  private drawHeartShape(ctx: CanvasRenderingContext2D, size: number) {
    const s = size / 24;
    ctx.fillStyle = 'rgba(244, 63, 94, 0.85)';
    ctx.shadowColor = 'rgba(244, 63, 94, 0.6)';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-12 * s, -12 * s, -24 * s, 6 * s, 0, 24 * s);
    ctx.bezierCurveTo(24 * s, 6 * s, 12 * s, -12 * s, 0, 0);
    ctx.fill();
  }

  private drawPetalShape(ctx: CanvasRenderingContext2D, size: number) {
    const s = size / 20;
    const grad = ctx.createLinearGradient(-10 * s, -15 * s, 10 * s, 15 * s);
    grad.addColorStop(0, 'rgba(225, 29, 72, 0.9)');
    grad.addColorStop(1, 'rgba(159, 18, 57, 0.85)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10 * s, 18 * s, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawSparkleShape(ctx: CanvasRenderingContext2D, size: number, isGold: boolean) {
    const radius = size * 0.4;
    ctx.fillStyle = isGold ? 'rgba(251, 191, 36, 0.9)' : 'rgba(255, 255, 255, 0.9)';
    ctx.shadowColor = isGold ? 'rgba(245, 158, 11, 0.8)' : 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // 4-point cross star
    ctx.strokeStyle = isGold ? 'rgba(253, 230, 138, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, 0);
    ctx.lineTo(size * 0.8, 0);
    ctx.moveTo(0, -size * 0.8);
    ctx.lineTo(0, size * 0.8);
    ctx.stroke();
  }

  private drawRainDrop(ctx: CanvasRenderingContext2D, size: number) {
    ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size * 0.3, size);
    ctx.stroke();
  }

  private drawIslamicFrame(ctx: CanvasRenderingContext2D, width: number, height: number, surahName?: string) {
    ctx.save();
    const margin = 28;
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.55)'; // Gold
    ctx.lineWidth = 1.5;

    // Outer border
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Inner subtle border
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.strokeRect(margin + 6, margin + 6, width - (margin + 6) * 2, height - (margin + 6) * 2);

    // Decorative Islamic corners
    const cSize = 20;
    const corners = [
      [margin + 6, margin + 6],
      [width - margin - 6, margin + 6],
      [margin + 6, height - margin - 6],
      [width - margin - 6, height - margin - 6],
    ];

    corners.forEach(([cx, cy]) => {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Islamic Header (Bismillah)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = 'rgba(253, 230, 138, 0.9)';
    ctx.font = '22px "Scheherazade New", serif';
    ctx.fillText('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', width / 2, margin + 18);

    // Decorative divider line under Bismillah
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.beginPath();
    ctx.moveTo(width / 2 - 80, margin + 48);
    ctx.lineTo(width / 2 + 80, margin + 48);
    ctx.stroke();

    // Surah badge at bottom
    if (surahName) {
      ctx.font = '16px "Cairo", sans-serif';
      ctx.fillStyle = 'rgba(253, 230, 138, 0.85)';
      ctx.fillText(`﴿ ${surahName} ﴾`, width / 2, height - margin - 35);
    }

    ctx.restore();
  }

  private drawRomanticFrame(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.save();
    const margin = 26;
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

    // Corner hearts
    ctx.fillStyle = 'rgba(244, 63, 94, 0.7)';
    const corners = [
      [margin, margin],
      [width - margin, margin],
      [margin, height - margin],
      [width - margin, height - margin],
    ];

    corners.forEach(([cx, cy]) => {
      ctx.save();
      ctx.translate(cx, cy);
      this.drawHeartShape(ctx, 14);
      ctx.restore();
    });

    ctx.restore();
  }

  private drawAnimatedText(
    ctx: CanvasRenderingContext2D,
    project: VideoProject,
    currentTime: number,
    width: number,
    height: number
  ) {
    if (!project.primaryText) return;

    ctx.save();
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    // Map font family
    let fontFamilyName = '"Scheherazade New", serif';
    if (project.fontFamily === 'font-amiri') fontFamilyName = '"Amiri", serif';
    if (project.fontFamily === 'font-ruqaa') fontFamilyName = '"Aref Ruqaa", cursive';
    if (project.fontFamily === 'font-kufi') fontFamilyName = '"Reem Kufi", sans-serif';
    if (project.fontFamily === 'font-cairo') fontFamilyName = '"Cairo", sans-serif';
    if (project.fontFamily === 'font-tajawal') fontFamilyName = '"Tajawal", sans-serif';

    let rawBase = 28;
    if (project.primaryText.length > 260) rawBase = 20;
    else if (project.primaryText.length > 140) rawBase = 23;
    const baseSize = rawBase * (project.textSize || 1.1);
    ctx.font = `600 ${baseSize}px ${fontFamilyName}`;

    // Word wrapping
    const maxTextWidth = width * 0.82;
    const words = project.primaryText.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const w of words) {
      const testLine = currentLine ? `${currentLine} ${w}` : w;
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxTextWidth && currentLine) {
        lines.push(currentLine);
        currentLine = w;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);

    // Center Y calculation
    const lineHeight = baseSize * 1.55;
    const totalBlockHeight = lines.length * lineHeight;
    const startY = height / 2 - totalBlockHeight / 2 + (project.secondaryText ? -20 : 0);

    // Draw soft subtle dark vignette card behind text for maximum legibility on any image
    ctx.save();
    const padX = 24;
    const padY = 20;
    const cardW = Math.min(width * 0.88, maxTextWidth + padX * 2);
    const cardH = totalBlockHeight + padY * 2 + (project.secondaryText ? 52 : 0);
    const cardX = (width - cardW) / 2;
    const cardY = startY - padY - 6;

    ctx.fillStyle = project.mode === 'quran' ? 'rgba(0, 0, 0, 0.46)' : 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();

    // Subtle golden/rose border outline on card
    ctx.strokeStyle = project.mode === 'quran' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(244, 63, 94, 0.20)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Text Animation calculation
    const animType = project.textAnimation || 'golden_shimmer';
    let textAlpha = 1.0;
    let scaleMultiplier = 1.0;

    if (animType === 'floating_fade') {
      textAlpha = 0.85 + Math.sin(currentTime * 2) * 0.15;
    } else if (animType === 'glow_pulse') {
      scaleMultiplier = 1.0 + Math.sin(currentTime * 3) * 0.02;
    }

    // Shadow & glow
    ctx.shadowColor = project.mode === 'quran' ? 'rgba(245, 158, 11, 0.75)' : 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = project.mode === 'quran' ? 14 : 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 2;

    // Draw lines
    lines.forEach((line, idx) => {
      const lineY = startY + idx * lineHeight;

      ctx.save();
      ctx.globalAlpha = textAlpha;

      if (animType === 'golden_shimmer' || project.mode === 'quran') {
        const textGrad = ctx.createLinearGradient(width * 0.2, lineY - 20, width * 0.8, lineY + 20);
        textGrad.addColorStop(0, '#fef08a');
        textGrad.addColorStop(0.5, '#ffffff');
        textGrad.addColorStop(1, '#fde047');
        ctx.fillStyle = textGrad;
      } else {
        ctx.fillStyle = project.textColor || '#ffffff';
      }

      ctx.fillText(line, width / 2, lineY);

      // Subtle stroke for clarity
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.strokeText(line, width / 2, lineY);

      ctx.restore();
    });

    // Draw secondary text (if exists, e.g. partner name or translation/theme)
    if (project.secondaryText) {
      const secY = startY + lines.length * lineHeight + 20;
      ctx.font = `500 ${Math.max(16, baseSize * 0.55)}px "Tajawal", sans-serif`;
      ctx.fillStyle = project.mode === 'quran' ? 'rgba(253, 230, 138, 0.88)' : 'rgba(254, 205, 211, 0.92)';
      ctx.shadowBlur = 6;
      ctx.fillText(project.secondaryText, width / 2, secY);
    }

    ctx.restore();
  }
}

export const canvasRenderer = new CanvasRenderer();
