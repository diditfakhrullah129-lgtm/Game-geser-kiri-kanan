export class MotionDetector {
  private videoEl: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private prevFrameData: Uint8ClampedArray | null = null;
  private animFrameId: number | null = null;
  private isRunning: boolean = false;
  private onUpdate: ((data: { energyA: number; energyB: number; detectedSide: 'A' | 'B' | 'neutral' }) => void) | null = null;

  private smoothA: number = 0;
  private smoothB: number = 0;
  private width: number = 64;
  private height: number = 36;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  public start(
    videoElement: HTMLVideoElement,
    callback: (data: { energyA: number; energyB: number; detectedSide: 'A' | 'B' | 'neutral' }) => void
  ) {
    this.stop();
    this.videoEl = videoElement;
    this.onUpdate = callback;
    this.isRunning = true;
    this.prevFrameData = null;
    this.smoothA = 0;
    this.smoothB = 0;
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.prevFrameData = null;
  }

  private loop = () => {
    if (!this.isRunning || !this.videoEl || !this.ctx) return;

    if (this.videoEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !this.videoEl.paused) {
      try {
        this.ctx.drawImage(this.videoEl, 0, 0, this.width, this.height);
        const imgData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imgData.data;

        if (this.prevFrameData) {
          let diffA = 0;
          let countA = 0;
          let diffB = 0;
          let countB = 0;

          const midX = Math.floor(this.width / 2);
          const threshold = 18; // noise threshold

          for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
              const idx = (y * this.width + x) * 4;
              // calculate luminance delta
              const curLuma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
              const prevLuma = 0.299 * this.prevFrameData[idx] + 0.587 * this.prevFrameData[idx + 1] + 0.114 * this.prevFrameData[idx + 2];
              const diff = Math.abs(curLuma - prevLuma);

              if (diff > threshold) {
                // If camera is mirrored, videoEl has transform: scaleX(-1), but canvas draw is original.
                // Left on mirrored screen corresponds to the RIGHT half in original video coordinates!
                // So original right half (x >= midX) is Screen Left (A).
                // Original left half (x < midX) is Screen Right (B).
                if (x >= midX) {
                  diffA += diff;
                  countA++;
                } else {
                  diffB += diff;
                  countB++;
                }
              }
            }
          }

          // Normalize to 0-100 range
          const maxPixelsSide = (this.width / 2) * this.height;
          const rawEnergyA = Math.min(100, Math.round((diffA / (maxPixelsSide * 35)) * 100));
          const rawEnergyB = Math.min(100, Math.round((diffB / (maxPixelsSide * 35)) * 100));

          // Exponential smoothing
          this.smoothA = this.smoothA * 0.75 + rawEnergyA * 0.25;
          this.smoothB = this.smoothB * 0.75 + rawEnergyB * 0.25;

          const finalA = Math.round(this.smoothA);
          const finalB = Math.round(this.smoothB);

          let detectedSide: 'A' | 'B' | 'neutral' = 'neutral';
          if (finalA > 20 || finalB > 20) {
            if (finalA > finalB + 10) detectedSide = 'A';
            else if (finalB > finalA + 10) detectedSide = 'B';
          }

          if (this.onUpdate) {
            this.onUpdate({
              energyA: finalA,
              energyB: finalB,
              detectedSide,
            });
          }
        }

        // Store copy of current frame
        if (!this.prevFrameData) {
          this.prevFrameData = new Uint8ClampedArray(data.length);
        }
        this.prevFrameData.set(data);
      } catch {
        // Fallback if video isn't readable
      }
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
