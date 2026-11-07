export interface BodyTrackingResult {
  hasPerson: boolean;
  centroidX: number; // 0 to 1 (normalized to mirrored screen: 0 = far left, 1 = far right)
  centroidY: number; // 0 to 1
  box: { x: number; y: number; width: number; height: number } | null;
  detectedZone: 'A' | 'B' | 'center' | 'none';
  confidence: number; // 0 to 100
  sideAWeight: number; // 0 to 100
  sideBWeight: number; // 0 to 100
}

export class BodyTracker {
  private videoEl: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D | null;
  private animFrameId: number | null = null;
  private isRunning: boolean = false;
  private onTrackCallback: ((result: BodyTrackingResult) => void) | null = null;

  // Background and motion buffers
  private prevFrame: Uint8ClampedArray | null = null;
  private backgroundFrame: Float32Array | null = null;
  private width: number = 80;
  private height: number = 45;

  // Smoothed outputs
  private smoothCentroidX: number = 0.5;
  private smoothCentroidY: number = 0.5;
  private smoothBox: { x: number; y: number; width: number; height: number } | null = null;
  private smoothWeightA: number = 0;
  private smoothWeightB: number = 0;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  public start(
    videoElement: HTMLVideoElement,
    callback: (result: BodyTrackingResult) => void
  ) {
    this.stop();
    this.videoEl = videoElement;
    this.onTrackCallback = callback;
    this.isRunning = true;
    this.prevFrame = null;
    this.backgroundFrame = null;
    this.smoothCentroidX = 0.5;
    this.smoothCentroidY = 0.5;
    this.smoothBox = null;
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.prevFrame = null;
    this.backgroundFrame = null;
  }

  private loop = () => {
    if (!this.isRunning || !this.videoEl || !this.ctx) return;

    if (this.videoEl.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !this.videoEl.paused) {
      try {
        this.ctx.drawImage(this.videoEl, 0, 0, this.width, this.height);
        const imgData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imgData.data;
        const totalPixels = this.width * this.height;

        if (!this.backgroundFrame) {
          // Initialize background model
          this.backgroundFrame = new Float32Array(totalPixels);
          for (let i = 0; i < totalPixels; i++) {
            const idx = i * 4;
            this.backgroundFrame[i] = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          }
        }

        let sumX = 0;
        let sumY = 0;
        let activePixelCount = 0;
        let minX = this.width;
        let maxX = 0;
        let minY = this.height;
        let maxY = 0;

        let activeA = 0; // Left side on mirrored screen
        let activeB = 0; // Right side on mirrored screen

        const threshold = 22; // luminance difference threshold
        const midX = Math.floor(this.width / 2);

        for (let y = 0; y < this.height; y++) {
          for (let x = 0; x < this.width; x++) {
            const i = y * this.width + x;
            const idx = i * 4;
            const curLuma = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            const bgLuma = this.backgroundFrame[i];

            const diff = Math.abs(curLuma - bgLuma);

            // Adaptive slow background update for static objects
            this.backgroundFrame[i] = bgLuma * 0.995 + curLuma * 0.005;

            if (diff > threshold) {
              // Because webcam is displayed mirrored with scaleX(-1):
              // Screen Left (Zone A) corresponds to canvas X in the right half (x >= midX).
              // Screen Right (Zone B) corresponds to canvas X in the left half (x < midX).
              const mirroredX = (this.width - 1) - x;

              sumX += mirroredX;
              sumY += y;
              activePixelCount++;

              if (mirroredX < minX) minX = mirroredX;
              if (mirroredX > maxX) maxX = mirroredX;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;

              if (mirroredX < midX) {
                activeA++;
              } else {
                activeB++;
              }
            }
          }
        }

        const halfPixels = (this.width / 2) * this.height;
        const rawWeightA = Math.min(100, Math.round((activeA / (halfPixels * 0.35)) * 100));
        const rawWeightB = Math.min(100, Math.round((activeB / (halfPixels * 0.35)) * 100));

        this.smoothWeightA = this.smoothWeightA * 0.7 + rawWeightA * 0.3;
        this.smoothWeightB = this.smoothWeightB * 0.7 + rawWeightB * 0.3;

        const hasPerson = activePixelCount > 40;
        let detectedZone: 'A' | 'B' | 'center' | 'none' = 'none';
        let box = null;

        if (hasPerson) {
          const rawCentroidX = (sumX / activePixelCount) / this.width;
          const rawCentroidY = (sumY / activePixelCount) / this.height;

          // Smooth centroid
          this.smoothCentroidX = this.smoothCentroidX * 0.65 + rawCentroidX * 0.35;
          this.smoothCentroidY = this.smoothCentroidY * 0.65 + rawCentroidY * 0.35;

          const rawBox = {
            x: Math.max(0, minX / this.width),
            y: Math.max(0, minY / this.height),
            width: Math.min(1, (maxX - minX + 4) / this.width),
            height: Math.min(1, (maxY - minY + 4) / this.height),
          };

          if (!this.smoothBox) {
            this.smoothBox = rawBox;
          } else {
            this.smoothBox = {
              x: this.smoothBox.x * 0.6 + rawBox.x * 0.4,
              y: this.smoothBox.y * 0.6 + rawBox.y * 0.4,
              width: this.smoothBox.width * 0.6 + rawBox.width * 0.4,
              height: this.smoothBox.height * 0.6 + rawBox.height * 0.4,
            };
          }

          box = this.smoothBox;

          // Decide zone based on centroid position:
          // Left side (Zone A): X < 0.44
          // Right side (Zone B): X > 0.56
          // Center: 0.44 <= X <= 0.56
          if (this.smoothCentroidX < 0.44) {
            detectedZone = 'A';
          } else if (this.smoothCentroidX > 0.56) {
            detectedZone = 'B';
          } else {
            // If centroid is near center, also consider side weights
            if (this.smoothWeightA > this.smoothWeightB + 20) {
              detectedZone = 'A';
            } else if (this.smoothWeightB > this.smoothWeightA + 20) {
              detectedZone = 'B';
            } else {
              detectedZone = 'center';
            }
          }
        } else {
          detectedZone = 'none';
        }

        const confidence = hasPerson ? Math.min(99, Math.round(50 + (activePixelCount / totalPixels) * 150)) : 0;

        if (this.onTrackCallback) {
          this.onTrackCallback({
            hasPerson,
            centroidX: this.smoothCentroidX,
            centroidY: this.smoothCentroidY,
            box,
            detectedZone,
            confidence,
            sideAWeight: Math.round(this.smoothWeightA),
            sideBWeight: Math.round(this.smoothWeightB),
          });
        }
      } catch {
        // Fallback if canvas read fails
      }
    }

    this.animFrameId = requestAnimationFrame(this.loop);
  };
}
