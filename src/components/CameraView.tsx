import React, { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Sparkles, UserCheck } from 'lucide-react';

interface CameraViewProps {
  activeDeviceId: string;
  isMirrored: boolean;
  gameState: 'setup' | 'participant_selection' | 'countdown' | 'playing' | 'revealed' | 'ended';
  correctAnswer?: 'A' | 'B';
  onCameraReady?: (ready: boolean) => void;
  onRequestSwitchCamera?: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({
  activeDeviceId,
  isMirrored,
  gameState,
  correctAnswer,
  onCameraReady,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraState, setCameraState] = useState<'idle' | 'requesting' | 'active' | 'denied' | 'error' | 'simulated'>('requesting');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isCancelled = false;

    async function initCamera() {
      setCameraState('requesting');
      setErrorMessage('');

      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          ...(activeDeviceId ? { deviceId: { exact: activeDeviceId } } : { facingMode: 'user' }),
        },
      };

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Browser tidak mendukung akses kamera.');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (isCancelled) {
          mediaStream.getTracks().forEach((t) => t.stop());
          return;
        }

        currentStream = mediaStream;
        setStream(mediaStream);
        setCameraState('active');

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }

        onCameraReady?.(true);
      } catch (err: unknown) {
        if (isCancelled) return;
        const e = err as { name?: string; message?: string };
        console.warn('Camera access issue:', e);
        if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
          setCameraState('denied');
          setErrorMessage('Izin kamera ditolak. Harap izinkan akses kamera di peramban.');
        } else if (e.name === 'NotFoundError' || e.name === 'DevicesNotFoundError') {
          setCameraState('error');
          setErrorMessage('Kamera tidak ditemukan pada perangkat Anda.');
        } else {
          setCameraState('error');
          setErrorMessage('Gagal menghubungkan kamera. Mode simulasi dapat digunakan.');
        }
        onCameraReady?.(false);
      }
    }

    initCamera();

    return () => {
      isCancelled = true;
      if (currentStream) {
        currentStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [activeDeviceId]);

  const handleUseSimulatedCamera = () => {
    setCameraState('simulated');
    onCameraReady?.(true);
  };

  const handleRetryCamera = () => {
    setCameraState('requesting');
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: false })
      .then((st) => {
        setStream(st);
        setCameraState('active');
        if (videoRef.current) {
          videoRef.current.srcObject = st;
          videoRef.current.play().catch(() => {});
        }
        onCameraReady?.(true);
      })
      .catch((err) => {
        setCameraState('denied');
        setErrorMessage(err.message || 'Izin kamera belum disetujui');
      });
  };

  const isRevealed = gameState === 'revealed';
  const aIsCorrect = isRevealed && correctAnswer === 'A';
  const bIsCorrect = isRevealed && correctAnswer === 'B';

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* Real Video Element without any tracking/scan clutter */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          cameraState === 'active' ? 'opacity-100' : 'opacity-0'
        } ${isMirrored ? 'scale-x-[-1]' : ''}`}
      />

      {/* Simulated Camera Background when active */}
      {cameraState === 'simulated' && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center p-6 max-w-lg bg-black/40 backdrop-blur-md rounded-2xl border border-indigo-500/30">
            <div className="w-16 h-16 rounded-full bg-indigo-600/30 border border-indigo-400 flex items-center justify-center mb-3 animate-pulse">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Mode Kamera Virtual</h3>
            <p className="text-sm text-indigo-200/80 mb-4">
              Siswa bermain di depan layar dengan berpindah ke Zona Kiri (A) atau Kanan (B).
            </p>
            <button
              onClick={handleRetryCamera}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Coba Hubungkan Kamera Fisik
            </button>
          </div>
        </div>
      )}

      {/* Camera Denied / Error State Overlay */}
      {(cameraState === 'denied' || cameraState === 'error') && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="max-w-md w-full bg-slate-900/90 border border-rose-500/30 rounded-2xl p-6 text-center shadow-2xl shadow-rose-950/40">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <CameraOff className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Akses Kamera Belum Diizinkan</h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              {errorMessage || 'Aplikasi membutuhkan izin kamera untuk menampilkan siswa yang berdiri di sisi A atau B.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetryCamera}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Izinkan Kamera
              </button>
              <button
                onClick={handleUseSimulatedCamera}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                Main Tanpa Kamera (Virtual)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDE A OVERLAY (LEFT ZONE) */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 pointer-events-none transition-all duration-500 ${
          isRevealed
            ? aIsCorrect
              ? 'bg-emerald-500/35 border-r-4 border-emerald-400 shadow-[inset_0_0_80px_rgba(16,185,129,0.5)]'
              : 'bg-rose-950/45 border-r border-rose-500/30'
            : ''
        }`}
      >
        <div className="absolute top-24 left-6 flex items-center gap-2 opacity-80">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_#3b82f6]" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300 drop-shadow">
            Zona A (Kiri)
          </span>
        </div>
      </div>

      {/* SIDE B OVERLAY (RIGHT ZONE) */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 pointer-events-none transition-all duration-500 ${
          isRevealed
            ? bIsCorrect
              ? 'bg-emerald-500/35 border-l-4 border-emerald-400 shadow-[inset_0_0_80px_rgba(16,185,129,0.5)]'
              : 'bg-rose-950/45 border-l border-rose-500/30'
            : ''
        }`}
      >
        <div className="absolute top-24 right-6 flex items-center gap-2 opacity-80 justify-end">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-300 drop-shadow">
            Zona B (Kanan)
          </span>
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316]" />
        </div>
      </div>

      {/* CENTER DIVIDER LINE */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gradient-to-b from-white/10 via-white/40 to-white/10 pointer-events-none shadow-[0_0_15px_rgba(255,255,255,0.4)]">
        <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 w-6 h-6 rounded-full bg-white/20 backdrop-blur-md border border-white/60 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
        </div>
      </div>
    </div>
  );
};
