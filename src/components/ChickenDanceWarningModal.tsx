import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Play, Pause, Volume2, VolumeX, RotateCcw, ArrowRight } from 'lucide-react';

interface ChickenDanceWarningModalProps {
  onConfirm: () => void;
  videoSrc?: string;
  mascotSrc?: string;
}

export const ChickenDanceWarningModal: React.FC<ChickenDanceWarningModalProps> = ({
  onConfirm,
  videoSrc = '/assets/aistudio/ayam_chicken__1__1ba6830f.mp4',
  mascotSrc = '/assets/images/chicken_dance_mascot.jpg',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [audioError, setAudioError] = useState(false);

  // Attempt auto-play with audio on mount (fall back to muted if blocked by browser policy)
  useEffect(() => {
    if (!videoRef.current) return;
    const playPromise = videoRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.warn('Autoplay with sound prevented, switching to muted:', err);
          setAudioError(true);
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
    }
  }, []);

  const handleTogglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
    if (!next) setAudioError(false);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in select-none">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-amber-950/95 via-slate-950/98 to-slate-950 border-3 border-amber-400 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.55)] overflow-hidden flex flex-col max-h-[96vh]">
        {/* Glow ambient background accents */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-orange-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* MODAL HEADER */}
        <div className="relative px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 text-slate-950 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            {/* Mascot Avatar in Header */}
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-md bg-amber-400 shrink-0">
              <img
                src={mascotSrc}
                alt="Maskot Ayam Senam"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm sm:text-lg font-black tracking-wide text-white uppercase drop-shadow flex items-center gap-1.5">
                <span>🐔</span>
                <span>SESI ICE BREAKING: CHICKEN DANCE</span>
                <span>🐔</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-amber-100 font-bold leading-tight">
                Semua siswa berdiri, ikuti gerakan ayam di video, dan bergoyang dengan musik video!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex px-3 py-1 bg-black/35 rounded-full text-xs font-black text-amber-200 border border-white/20">
              Gerakan Wajib 💃
            </span>
          </div>
        </div>

        {/* MODAL BODY: PROMINENT VIDEO PLAYER */}
        <div className="p-3 sm:p-5 flex-1 overflow-y-auto flex flex-col items-center justify-center space-y-3">
          {/* Audio notice alert if muted */}
          {audioError && isMuted && (
            <div className="w-full bg-amber-500/20 border border-amber-400/60 px-3 py-1.5 rounded-xl flex items-center justify-between text-xs text-amber-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <span>🔔</span>
                <span>Klik tombol audio di bawah untuk menyalakan suara musik Senam Ayam!</span>
              </span>
              <button
                type="button"
                onClick={handleToggleMute}
                className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black rounded-lg text-xs cursor-pointer hover:bg-amber-300 transition-colors"
              >
                Nyalakan Musik 🔊
              </button>
            </div>
          )}

          {/* MAIN CENTRAL VIDEO CONTAINER */}
          <div className="relative w-full aspect-video max-h-[55vh] rounded-2xl overflow-hidden bg-black border-2 sm:border-3 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.4)] group flex items-center justify-center">
            {!hasVideoError ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                playsInline
                preload="auto"
                muted={isMuted}
                onError={() => {
                  console.warn('Video failed to load in browser, switching to audio/mascot view');
                  setHasVideoError(true);
                }}
                className="w-full h-full object-contain"
              >
                <source src={videoSrc} type="video/mp4" />
                <source src="/assets/aistudio/ayam_chicken__1__1ba6830f.mp4" type="video/mp4" />
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-950 via-slate-950 to-slate-900 text-center">
                <img
                  src={mascotSrc}
                  alt="Maskot Senam Ayam"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl border-4 border-amber-400 shadow-2xl animate-bounce mb-3"
                />
                <span className="text-base sm:text-lg font-black text-amber-300">
                  AYO BERGOYANG BERSAMA AYAM SENAM! 🐥
                </span>
                <span className="text-xs text-amber-100/80 mt-1">
                  Kepakkan sayap & goyang pinggul ikuti irama musik senam ayam!
                </span>
              </div>
            )}

            {/* Video overlay subtitle badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-amber-400/60 flex items-center gap-1.5 pointer-events-none">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-wide">
                Ikuti Gerakan Senam Ayam! 🐥
              </span>
            </div>

            {/* Video Player Floating Quick Bar */}
            <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Play / Pause Button */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95 shadow"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Putar Video</span>
                    </>
                  )}
                </button>

                {/* Restart Video Button */}
                <button
                  type="button"
                  onClick={handleRestart}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 cursor-pointer transition-colors"
                  title="Ulangi dari awal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Audio Toggle (Using Video Music) */}
              <button
                type="button"
                onClick={handleToggleMute}
                className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                  !isMuted
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-300'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {!isMuted ? (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Musik Video Aktif 🎵</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Nyalakan Musik Video 🔊</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QUICK INSTRUCTION STRIP */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-200">
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-400/30 flex items-center gap-2">
              <span className="text-xl">👐</span>
              <span className="text-left text-[11px] sm:text-xs">
                <strong className="text-amber-300 block">1. Kepakkan Sayap</strong>
                Tirukan kepak sayap ayam sesuai video
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-400/30 flex items-center gap-2">
              <span className="text-xl">💃</span>
              <span className="text-left text-[11px] sm:text-xs">
                <strong className="text-amber-300 block">2. Goyang Pinggul</strong>
                Goyang ceria bersama seluruh teman sekelas
              </span>
            </div>
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-amber-400/30 flex items-center gap-2">
              <span className="text-xl">🏃</span>
              <span className="text-left text-[11px] sm:text-xs">
                <strong className="text-amber-300 block">3. Lari ke Zona A / B</strong>
                Pilih jawaban dengan berlari sambil bergoyang!
              </span>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-xs text-amber-200/90 font-medium">
              Video senam akan terus diputar di tengah layar kuis sampai kuis selesai.
            </span>
          </div>

          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.55)] flex items-center justify-center gap-2 cursor-pointer transition-all transform hover:scale-102"
          >
            <span>MULAI JAWAB SOAL KUIS SEKARANG 🚀</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
