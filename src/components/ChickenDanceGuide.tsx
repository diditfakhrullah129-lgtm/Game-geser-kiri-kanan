import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Move, Minimize2, Maximize2, Sparkles } from 'lucide-react';

interface ChickenDanceGuideProps {
  isPlaying: boolean;
  videoSrc?: string;
  onAudioStateChange?: (hasAudio: boolean) => void;
}

export type VideoPosition = 'bottom-center' | 'top-right' | 'top-left';

export const ChickenDanceGuide: React.FC<ChickenDanceGuideProps> = ({
  isPlaying,
  videoSrc = '/assets/aistudio/ayam_chicken__1__1ba6830f.mp4',
  onAudioStateChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [position, setPosition] = useState<VideoPosition>('bottom-center');
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  // Sync play/pause with game state
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setHasStarted(true))
          .catch((err) => {
            console.warn('Video auto-play blocked, falling back to muted:', err);
            if (videoRef.current) {
              videoRef.current.muted = true;
              setIsMuted(true);
              videoRef.current.play().catch(() => {});
            }
          });
      }
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Audio state callback to optionally duck external BGM
  useEffect(() => {
    if (onAudioStateChange) {
      onAudioStateChange(!isMuted && isPlaying);
    }
  }, [isMuted, isPlaying, onAudioStateChange]);

  const toggleMute = () => {
    if (videoRef.current) {
      const next = !isMuted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  };

  const cyclePosition = () => {
    setPosition((prev) => {
      if (prev === 'bottom-center') return 'top-right';
      if (prev === 'top-right') return 'top-left';
      return 'bottom-center';
    });
  };

  // Ensure video restarts from beginning when it ends ("jika habis ulangin lagi")
  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  // Compute position classes
  const getPositionClasses = () => {
    if (position === 'bottom-center') {
      // Very bottom center as requested ("taruk di pojok bawah aja paling bawah posisi tengah")
      return 'bottom-1 sm:bottom-2 md:bottom-2.5 left-1/2 -translate-x-1/2';
    }
    if (position === 'top-right') {
      // Top Right: below HUD controls
      return 'top-14 sm:top-16 right-2 sm:right-4';
    }
    // Top Left: below HUD controls
    return 'top-14 sm:top-16 left-2 sm:left-4';
  };

  return (
    <aside
      aria-label="Panduan Video Ice Breaking Senam Ayam"
      className={`fixed z-35 transition-all duration-300 pointer-events-auto select-none ${getPositionClasses()}`}
    >
      <div
        className={`rounded-2xl bg-slate-950/95 border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] backdrop-blur-md overflow-hidden transition-all duration-300 ${
          isMinimized
            ? 'w-40 sm:w-48 p-1.5 flex items-center justify-between gap-1.5'
            : position === 'bottom-center'
            ? 'w-44 sm:w-52 md:w-56 lg:w-60'
            : 'w-40 sm:w-48 md:w-56'
        }`}
      >
        {/* WIDGET HEADER BAR */}
        <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 text-white border-b border-amber-400/40">
          <div className="flex items-center gap-1.5 truncate">
            {/* Mascot Avatar with Dancing Animation */}
            <div className="w-5 h-5 rounded-full overflow-hidden bg-amber-400 border border-white shrink-0 animate-bounce">
              <img
                src="/assets/images/chicken_dance_mascot.jpg"
                alt="Maskot Ayam"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-wide truncate drop-shadow flex items-center gap-1">
              <span>🐔</span>
              <span>SENAM AYAM</span>
            </span>
          </div>

          {/* Quick Widget Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Audio Toggle */}
            <button
              onClick={toggleMute}
              className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
              title={isMuted ? 'Nyalakan Musik Senam Ayam' : 'Matikan Suara Video'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-300" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>

            {/* Position Switcher */}
            <button
              onClick={cyclePosition}
              className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
              title="Pindah Posisi Video (Bawah Tengah / Kanan / Kiri)"
            >
              <Move className="w-3.5 h-3.5 text-amber-200" />
            </button>

            {/* Minimize / Expand Toggle */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 rounded-lg bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
              title={isMinimized ? 'Perbesar Video Panduan' : 'Perkecil Video'}
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* VIDEO DISPLAY CONTAINER */}
        {!isMinimized && (
          <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
            {!hasVideoError ? (
              <video
                ref={videoRef}
                loop
                autoPlay
                playsInline
                preload="auto"
                muted={isMuted}
                onEnded={handleVideoEnded}
                onError={() => {
                  console.warn('In-game chicken dance video load error, switching to animated fallback');
                  setHasVideoError(true);
                }}
                className="w-full h-full object-cover"
              >
                <source src={videoSrc} type="video/mp4" />
                <source src="/assets/aistudio/ayam_chicken__1__1ba6830f.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-amber-950 via-slate-950 to-slate-900 text-center">
                <img
                  src="/assets/images/chicken_dance_mascot.jpg"
                  alt="Maskot Ayam"
                  className="w-12 h-12 object-cover rounded-xl border border-amber-400 shadow animate-bounce mb-1"
                />
                <span className="text-[11px] font-black text-amber-300">
                  IKUTI GERAKAN AYAM! 🐥
                </span>
              </div>
            )}

            {/* Pulsing "IKUTI GERAKAN AYAM!" subtitle banner */}
            <div className="absolute bottom-1.5 left-2 right-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-sm border border-amber-400/50 text-center pointer-events-none">
              <span className="text-[10px] sm:text-[11px] font-black text-amber-300 tracking-wider flex items-center justify-center gap-1 animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-400" />
                IKUTI GERAKAN AYAM! 🐥
              </span>
            </div>
          </div>
        )}

        {/* MINIMIZED COMPACT BAR */}
        {isMinimized && (
          <div className="flex-1 min-w-0 pr-1">
            <span className="text-[10px] text-amber-300 font-bold block truncate">
              Klik perbesar ↗ untuk melihat video senam
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};
