import React, { useEffect, useState, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  SkipForward,
  LogOut,
  Camera,
  CheckCircle2,
  XCircle,
  Play,
  Pause,
  Award,
  ThumbsUp,
  User,
  Users,
  Sparkles,
  Minus,
  Music,
  Star
} from 'lucide-react';
import { Question, GameSettings, CameraDevice, GameCompletionResult, ParticipantInfo } from '../types/quiz';
import { CameraView } from './CameraView';
import { ChickenDanceGuide } from './ChickenDanceGuide';
import { ChickenDanceWarningModal } from './ChickenDanceWarningModal';
import { sounds, bgm } from '../utils/audio';

interface FloatingScoreEffect {
  id: number;
  text: string;
  subtext: string;
  x: number;
  y: number;
}

interface GameScreenProps {
  questions: Question[];
  settings: GameSettings;
  activeDeviceId: string;
  availableCameras: CameraDevice[];
  onSelectCamera: (deviceId: string) => void;
  onExitToMenu: () => void;
  onGameComplete: (results: GameCompletionResult) => void;
  participant?: ParticipantInfo;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  settings,
  activeDeviceId,
  availableCameras,
  onSelectCamera,
  onExitToMenu,
  onGameComplete,
  participant,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'revealed'>('countdown');
  const [roundCountdown, setRoundCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(settings.timePerQuestion);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundOn, setSoundOn] = useState(settings.soundEnabled);
  const [isMusicActive, setIsMusicActive] = useState(() => bgm.getIsPlaying());

  // Ice breaking chicken dance requirement & video loop audio sync
  const [hasAcceptedChickenWarning, setHasAcceptedChickenWarning] = useState(false);
  const [isChickenVideoAudioActive, setIsChickenVideoAudioActive] = useState(false);

  // Score jumping animation & glow feedback state
  const [floatingScores, setFloatingScores] = useState<FloatingScoreEffect[]>([]);
  const [scorePulse, setScorePulse] = useState(false);

  // Cleanup audio when leaving game screen
  useEffect(() => {
    return () => {
      bgm.stop();
    };
  }, []);

  // Session time tracking
  const totalSessionTimeRef = useRef<number>(0);
  const questionStartTimeRef = useRef<number>(0);

  // Score tracking for summary & leaderboard
  const [playerScore, setPlayerScore] = useState(0);
  const [stats, setStats] = useState<{ countA: number; countB: number }>({ countA: 0, countB: 0 });

  const currentQ = questions[currentIndex] || questions[0];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickSecRef = useRef<number>(-1);

  // Trigger floating jumping glowing number effect
  const triggerScoreAnimation = useCallback((originX?: number, originY?: number) => {
    const newId = Date.now() + Math.random();
    const posX = originX !== undefined ? originX : 50;
    const posY = originY !== undefined ? originY : 55;

    setFloatingScores((prev) => [
      ...prev,
      {
        id: newId,
        text: '+1',
        subtext: 'BENAR! ⭐',
        x: posX,
        y: posY,
      },
    ]);

    setScorePulse(true);
    setTimeout(() => setScorePulse(false), 700);

    sounds.playScoreBonus();

    // Burst celebratory sparkles
    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { x: posX / 100, y: Math.max(0.1, posY / 100 - 0.05) },
        colors: ['#fbbf24', '#34d399', '#10b981', '#f59e0b', '#ffffff'],
      });
    } catch {}

    setTimeout(() => {
      setFloatingScores((prev) => prev.filter((item) => item.id !== newId));
    }, 1250);
  }, []);

  // Add correct point handler with coordinates
  const handleAddCorrectPoint = useCallback((e?: React.MouseEvent) => {
    setPlayerScore((prev) => Math.min(questions.length, prev + 1));
    let x = 50;
    let y = 55;
    if (e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      x = Math.max(15, Math.min(85, ((rect.left + rect.width / 2) / window.innerWidth) * 100));
      y = Math.max(15, Math.min(85, (rect.top / window.innerHeight) * 100));
    }
    triggerScoreAnimation(x, y);
  }, [questions.length, triggerScoreAnimation]);

  // Trigger celebration confetti
  const fireConfetti = useCallback((correctSide: 'A' | 'B') => {
    const xOrigin = correctSide === 'A' ? 0.25 : 0.75;
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { x: xOrigin, y: 0.6 },
        colors: correctSide === 'A' ? ['#3b82f6', '#10b981', '#60a5fa'] : ['#f97316', '#10b981', '#fb923c'],
      });
    } catch {}
  }, []);

  // Reveal current answer
  const revealAnswer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('revealed');

    // Add elapsed time for this question
    const elapsedForQuestion = (Date.now() - questionStartTimeRef.current) / 1000;
    totalSessionTimeRef.current += Math.min(settings.timePerQuestion, Math.max(0.5, elapsedForQuestion));

    sounds.playReveal(currentQ.correctAnswer);
    fireConfetti(currentQ.correctAnswer);

    // Track answer stats
    setStats((prev) => ({
      countA: currentQ.correctAnswer === 'A' ? prev.countA + 1 : prev.countA,
      countB: currentQ.correctAnswer === 'B' ? prev.countB + 1 : prev.countB,
    }));
  }, [currentQ.correctAnswer, fireConfetti, settings.timePerQuestion]);

  // Start question timer - active gameplay begins
  const startQuestionTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(settings.timePerQuestion);
    setGameState('playing');
    lastTickSecRef.current = -1;
    questionStartTimeRef.current = Date.now();

    // Start background music once the quiz starts running (duck if chicken video audio is active)
    if (soundOn && settings.musicEnabled !== false && !isChickenVideoAudioActive) {
      bgm.play();
      setIsMusicActive(true);
    }

    const startTime = Date.now();
    const durationMs = settings.timePerQuestion * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingMs = Math.max(0, durationMs - elapsed);
      const remainingSec = remainingMs / 1000;

      setTimeLeft(remainingSec);

      // Play ticking audio
      const floorSec = Math.ceil(remainingSec);
      if (floorSec !== lastTickSecRef.current && floorSec > 0) {
        lastTickSecRef.current = floorSec;
        if (floorSec <= 3) {
          sounds.playWarning();
        } else {
          sounds.playTick();
        }
      }

      if (remainingMs <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        revealAnswer();
      }
    }, 50);
  }, [settings.timePerQuestion, revealAnswer, soundOn, settings.musicEnabled]);

  // Round start 3-2-1 countdown (triggered once chicken dance warning is accepted)
  useEffect(() => {
    if (!hasAcceptedChickenWarning) return;

    let count = 3;
    setRoundCountdown(3);
    setGameState('countdown');
    sounds.playStartCountdown(3);

    const interval = setInterval(() => {
      count -= 1;
      setRoundCountdown(count);
      if (count > 0) {
        sounds.playStartCountdown(count);
      } else if (count === 0) {
        sounds.playStartCountdown(0);
      } else {
        clearInterval(interval);
        startQuestionTimer();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [currentIndex, hasAcceptedChickenWarning, startQuestionTimer]);

  // Sync background music when Chicken Dance video audio is unmuted/muted
  const handleChickenAudioStateChange = useCallback((hasAudio: boolean) => {
    setIsChickenVideoAudioActive(hasAudio);
    if (hasAudio) {
      // Duck / pause Harvest Moon BGM so chicken dance video music is heard clearly
      bgm.pause();
      setIsMusicActive(false);
    } else {
      // If chicken video audio is muted and music is enabled, resume game BGM
      if (soundOn && settings.musicEnabled !== false && gameState === 'playing' && !isPaused) {
        bgm.play();
        setIsMusicActive(true);
      }
    }
  }, [soundOn, settings.musicEnabled, gameState, isPaused]);

  // Cleanly exit to menu and stop BGM
  const handleExit = useCallback(() => {
    bgm.stop();
    onExitToMenu();
  }, [onExitToMenu]);

  // Handle next question or finish
  const handleNext = () => {
    sounds.playClick();
    if (gameState === 'playing') {
      revealAnswer();
      return;
    }

    if (currentIndex >= questions.length - 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      bgm.stop();
      const finalTime = Math.max(1, Math.round(totalSessionTimeRef.current * 10) / 10);
      onGameComplete({
        total: questions.length,
        correctCount: playerScore,
        timeSpentSeconds: finalTime,
        correctCountA: stats.countA + (currentQ.correctAnswer === 'A' ? 1 : 0),
        correctCountB: stats.countB + (currentQ.correctAnswer === 'B' ? 1 : 0),
        category: settings.category,
      });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  };

  // Repeat question
  const handleRepeat = () => {
    sounds.playClick();
    startQuestionTimer();
  };

  // Pause / Resume
  const togglePause = () => {
    if (gameState !== 'playing') return;
    if (isPaused) {
      setIsPaused(false);
      if (soundOn && settings.musicEnabled !== false && isMusicActive) {
        bgm.play();
      }
      const remainingMs = timeLeft * 1000;
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, (remainingMs - elapsed) / 1000);
        setTimeLeft(remaining);
        if (remaining <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          revealAnswer();
        }
      }, 50);
    } else {
      setIsPaused(true);
      bgm.pause();
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Switch camera device
  const handleCycleCamera = () => {
    if (availableCameras.length < 2) return;
    const currentIdx = availableCameras.findIndex((c) => c.deviceId === activeDeviceId);
    const nextIdx = (currentIdx + 1) % availableCameras.length;
    onSelectCamera(availableCameras[nextIdx].deviceId);
  };

  // Keyboard Shortcuts: Space or Arrow Right to proceed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasAcceptedChickenWarning) {
        if (e.code === 'Escape') {
          handleExit();
        }
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'KeyR') {
        handleRepeat();
      } else if (e.code === 'KeyP') {
        togglePause();
      } else if (e.code === 'KeyM') {
        const next = !soundOn;
        setSoundOn(next);
        sounds.setEnabled(next);
      } else if (e.code === 'KeyB' || e.code === 'Equal' || e.code === 'NumpadAdd') {
        if (gameState === 'revealed') {
          handleAddCorrectPoint();
        }
      } else if (e.code === 'Escape') {
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAcceptedChickenWarning, handleAddCorrectPoint, gameState, soundOn, handleExit]);

  const timerRatio = Math.max(0, Math.min(1, timeLeft / settings.timePerQuestion));
  const isUrgent = timeLeft <= 3 && gameState === 'playing';
  const isRevealed = gameState === 'revealed';

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black select-none">
      {/* CLEAN BACKGROUND CAMERA VIEW */}
      <CameraView
        activeDeviceId={activeDeviceId}
        isMirrored={settings.mirrorCamera}
        gameState={gameState}
        correctAnswer={currentQ.correctAnswer}
        onRequestSwitchCamera={handleCycleCamera}
      />

      {/* TOP HUD: Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
        <div className="w-full h-2.5 sm:h-3 bg-black/60 backdrop-blur-sm">
          <div
            className={`h-full transition-all duration-75 ${
              isUrgent
                ? 'bg-rose-500 shadow-[0_0_15px_#f43f5e]'
                : timeLeft < settings.timePerQuestion * 0.4
                ? 'bg-amber-400 shadow-[0_0_12px_#fbbf24]'
                : 'bg-emerald-400 shadow-[0_0_12px_#34d399]'
            }`}
            style={{ width: `${timerRatio * 100}%` }}
          />
        </div>
      </div>

      {/* TOP HEADER CONTROLS & QUESTION BOX */}
      <div className="absolute top-3 sm:top-5 left-0 right-0 z-30 px-4 sm:px-8 flex flex-col items-center pointer-events-none">
        {/* Upper metadata row */}
        <div className="w-full max-w-4xl flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
            <span className="px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg">
              SOAL {currentIndex + 1} / {questions.length}
            </span>

            {/* LIVE PLAYER / GROUP IDENTITY BADGE */}
            {participant && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-slate-200 text-xs shadow-lg">
                {participant.type === 'pribadi' ? (
                  <>
                    <User className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="font-extrabold text-white">{participant.name}</span>
                    <span className="text-slate-400 text-[11px]">({participant.className})</span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="font-extrabold text-white">{participant.name}</span>
                    <span className="text-orange-300 text-[11px] font-semibold">
                      ({participant.members.length} Siswa • {participant.className})
                    </span>
                  </>
                )}
              </span>
            )}

            {/* SCORE BADGE WITH JUMPING GLOW PULSE */}
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl backdrop-blur-md border text-xs font-black shadow-lg transition-all duration-300 ${
                scorePulse
                  ? 'animate-hud-pulse bg-gradient-to-r from-amber-500/40 via-emerald-500/40 to-amber-500/40 border-amber-300 text-amber-200 ring-4 ring-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.9)] scale-110'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-400 transition-transform ${scorePulse ? 'animate-spin scale-125' : ''}`} />
              <span className="tabular-nums font-black">{playerScore} Poin</span>
            </span>
          </div>

          {/* Quick HUD controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Host action buttons in Top Header for instant access */}
            <div className="flex items-center gap-1 sm:gap-1.5 mr-1">
              <button
                onClick={handleRepeat}
                className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1 shadow cursor-pointer transition-colors active:scale-95"
                title="Ulangi Soal Ini (Tekan R)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Ulangi</span>
              </button>

              {gameState === 'playing' && (
                <button
                  onClick={togglePause}
                  className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1 shadow cursor-pointer transition-colors active:scale-95"
                  title="Jeda / Lanjut Timer (P)"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-blue-400" />}
                  <span className="hidden md:inline">{isPaused ? 'Lanjut' : 'Jeda'}</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs transition-transform active:scale-95 shadow-md shadow-emerald-500/30 flex items-center gap-1.5 cursor-pointer"
                title="Lanjut atau Kunci Jawaban (Tekan Spasi)"
              >
                <span>
                  {gameState === 'playing'
                    ? 'Kunci Jawaban'
                    : currentIndex >= questions.length - 1
                    ? 'Selesai'
                    : 'Lanjut (Spasi)'}
                </span>
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
            <button
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                sounds.setEnabled(next);
                if (!next) {
                  bgm.pause();
                  setIsMusicActive(false);
                } else {
                  bgm.play();
                  setIsMusicActive(true);
                }
              }}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs transition-colors cursor-pointer"
              title="Efek Suara (M)"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={() => {
                const next = !isMusicActive;
                setIsMusicActive(next);
                if (next) {
                  bgm.play();
                } else {
                  bgm.pause();
                }
              }}
              className={`p-2 rounded-xl backdrop-blur-md border text-xs transition-colors cursor-pointer ${
                isMusicActive
                  ? 'bg-amber-500/30 border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-black/60 border-white/20 text-slate-400'
              }`}
              title="Soundtrack Harvest Moon Title (Loop)"
            >
              <Music className="w-4 h-4" />
            </button>

            {availableCameras.length > 1 && (
              <button
                onClick={handleCycleCamera}
                className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs transition-colors cursor-pointer"
                title="Ganti Kamera"
              >
                <Camera className="w-4 h-4 text-cyan-400" />
              </button>
            )}

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs transition-colors cursor-pointer"
              title="Layar Penuh (F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleExit}
              className="px-3 py-1.5 rounded-xl bg-rose-600/80 hover:bg-rose-600 backdrop-blur-md text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow"
              title="Kembali ke Menu (Esc)"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </div>

        {/* Compact Prominent Question Banner */}
        <div className="w-full max-w-3xl lg:max-w-4xl bg-slate-950/90 backdrop-blur-xl border-2 border-white/20 rounded-2xl p-2.5 sm:p-3.5 shadow-2xl text-center relative overflow-hidden pointer-events-auto">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50" />

          {/* Countdown Clock Badge */}
          <div className="absolute top-2 right-2.5 sm:top-2.5 sm:right-4">
            <div
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl font-mono font-black text-xs sm:text-sm border shadow-lg flex items-center gap-1.5 transition-transform ${
                isUrgent
                  ? 'bg-rose-600 border-rose-400 text-white animate-bounce'
                  : 'bg-black/80 border-white/20 text-white'
              }`}
            >
              <span>{Math.ceil(timeLeft)}s</span>
            </div>
          </div>

          {/* Category Tag (If available) */}
          {currentQ.category && (
            <div className="flex items-center justify-center mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/90 text-amber-300 font-bold text-[10px] sm:text-xs tracking-wider border border-amber-500/30 flex items-center gap-1">
                <span>🏷️</span>
                <span>{currentQ.category}</span>
              </span>
            </div>
          )}

          <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-black text-white tracking-normal leading-snug max-w-2xl mx-auto px-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            {currentQ.question}
          </h2>
        </div>
      </div>

      {/* START ROUND 3-2-1 COUNTDOWN OVERLAY */}
      {gameState === 'countdown' && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none">
          <div className="text-8xl sm:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-300 to-orange-500 animate-ping">
            {roundCountdown > 0 ? roundCountdown : 'GO!'}
          </div>
          <p className="text-lg sm:text-2xl font-extrabold text-white uppercase tracking-widest mt-4 drop-shadow">
            {roundCountdown > 0 ? 'Bersiap di tengah!' : 'PILIH A ATAU B!'}
          </p>
        </div>
      )}

      {/* SIDE A CHOICE CARD (LEFT - Docked in lower left corner) */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-14 left-2 sm:left-4 lg:left-6 z-25 w-auto max-w-[44%] sm:max-w-xs md:max-w-sm pointer-events-none">
        <div
          className={`p-3 sm:p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shadow-2xl flex items-center gap-2.5 sm:gap-3.5 ${
            isRevealed && currentQ.correctAnswer === 'A'
              ? 'bg-emerald-950/90 border-emerald-400 ring-4 ring-emerald-500/50 scale-105 shadow-[0_0_35px_rgba(16,185,129,0.7)]'
              : isRevealed && currentQ.correctAnswer !== 'A'
              ? 'bg-rose-950/60 border-rose-500/40 opacity-50 grayscale-40'
              : 'bg-slate-950/90 border-blue-500/60 hover:border-blue-400'
          }`}
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl text-white shadow-xl border-2 ${
              isRevealed && currentQ.correctAnswer === 'A'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-300'
                : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400/60'
            }`}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-xs font-bold text-blue-300 uppercase tracking-wider mb-0.5">
              Zona Kiri
            </span>
            <span className="block text-xs sm:text-base md:text-lg font-extrabold text-white break-words drop-shadow leading-snug">
              {currentQ.optionA}
            </span>
          </div>

          {/* Correct / Wrong Badge */}
          {isRevealed && (
            <div className="shrink-0">
              {currentQ.correctAnswer === 'A' ? (
                <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-xs sm:text-sm">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              ) : (
                <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400/70" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* SIDE B CHOICE CARD (RIGHT - Docked in lower right corner) */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-14 right-2 sm:right-4 lg:right-6 z-25 w-auto max-w-[44%] sm:max-w-xs md:max-w-sm pointer-events-none">
        <div
          className={`p-3 sm:p-4 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 shadow-2xl flex flex-row-reverse sm:flex-row items-center gap-2.5 sm:gap-3.5 text-right sm:text-left ${
            isRevealed && currentQ.correctAnswer === 'B'
              ? 'bg-emerald-950/90 border-emerald-400 ring-4 ring-emerald-500/50 scale-105 shadow-[0_0_35px_rgba(16,185,129,0.7)]'
              : isRevealed && currentQ.correctAnswer !== 'B'
              ? 'bg-rose-950/60 border-rose-500/40 opacity-50 grayscale-40'
              : 'bg-slate-950/90 border-orange-500/60 hover:border-orange-400'
          }`}
        >
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl md:text-3xl text-white shadow-xl border-2 ${
              isRevealed && currentQ.correctAnswer === 'B'
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-300'
                : 'bg-gradient-to-br from-orange-500 to-orange-700 border-orange-400/60'
            }`}
          >
            B
          </div>
          <div className="flex-1 min-w-0">
            <span className="block text-[10px] sm:text-xs font-bold text-orange-300 uppercase tracking-wider mb-0.5">
              Zona Kanan
            </span>
            <span className="block text-xs sm:text-base md:text-lg font-extrabold text-white break-words drop-shadow leading-snug">
              {currentQ.optionB}
            </span>
          </div>

          {/* Correct / Wrong Badge */}
          {isRevealed && (
            <div className="shrink-0">
              {currentQ.correctAnswer === 'B' ? (
                <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-xs sm:text-sm">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
              ) : (
                <XCircle className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400/70" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* CENTER REVEAL RESULT MODAL */}
      {isRevealed && (
        <div className="absolute top-[60%] sm:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-35 max-w-lg w-[90%] pointer-events-auto">
          <div className="bg-slate-950/95 backdrop-blur-2xl border-2 border-emerald-400 rounded-3xl p-5 sm:p-7 text-center shadow-[0_0_60px_rgba(16,185,129,0.5)] animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold uppercase tracking-widest border border-emerald-500/40 mb-3">
              <Award className="w-4 h-4 text-emerald-400" />
              Waktu Habis! Jawaban Benar Adalah
            </div>

            <div className="flex items-center justify-center gap-3 my-2">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl text-white shadow-xl border-2 ${
                  currentQ.correctAnswer === 'A'
                    ? 'bg-blue-600 border-blue-300'
                    : 'bg-orange-600 border-orange-300'
                }`}
              >
                {currentQ.correctAnswer}
              </div>
              <div className="text-left">
                <span className="text-xl sm:text-2xl font-black text-white block">
                  {currentQ.correctAnswer === 'A' ? currentQ.optionA : currentQ.optionB}
                </span>
                <span className="text-xs text-emerald-400 font-semibold">
                  Sisi yang benar: {currentQ.correctAnswer === 'A' ? 'Sisi A (Kiri)' : 'Sisi B (Kanan)'}
                </span>
              </div>
            </div>

            {/* Explanation / Fact */}
            {currentQ.explanation && (
              <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800 my-3 leading-relaxed">
                💡 {currentQ.explanation}
              </p>
            )}

            {/* Clear, Non-penalizing Score Controls with Jumping & Glowing Feedback */}
            <div
              className={`relative p-3.5 rounded-2xl bg-slate-900/95 border transition-all duration-300 my-3 flex items-center justify-between ${
                scorePulse
                  ? 'border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.6),0_0_60px_rgba(245,158,11,0.4)] ring-2 ring-emerald-400/70 scale-[1.02]'
                  : 'border-slate-800'
              }`}
            >
              <div className="text-left">
                <span className="text-[11px] text-slate-400 block font-semibold">
                  Poin Siswa ({participant?.name || 'Pemain'}):
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xl sm:text-2xl font-black transition-all duration-300 tabular-nums ${
                      scorePulse ? 'text-amber-200 scale-125 drop-shadow-[0_0_15px_#f59e0b]' : 'text-amber-300'
                    }`}
                  >
                    {playerScore}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">/ {questions.length} Poin</span>
                  {scorePulse && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/50 animate-pulse">
                      <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" /> +1
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPlayerScore((prev) => Math.max(0, prev - 1))}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-700 active:scale-95"
                  title="Koreksi kurangi poin jika salah"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleAddCorrectPoint}
                  className="relative group px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs sm:text-sm font-black transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-600/40 ring-2 ring-emerald-400/50 flex items-center gap-2 cursor-pointer"
                  title="Tambah poin untuk jawaban benar (Pintasan: B atau +)"
                >
                  <ThumbsUp className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
                  <span>+1 Siswa Benar</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[10px] text-emerald-200 border border-emerald-400/30 font-mono">
                    B
                  </span>
                </button>
              </div>
            </div>

            {/* Next / Repeat Action Buttons */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleRepeat}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi (R)
              </button>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 text-xs sm:text-sm font-black transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
              >
                <span>{currentIndex >= questions.length - 1 ? 'Lihat Hasil Akhir' : 'Soal Selanjutnya'}</span>
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating score effect */}

      {/* FLOATING JUMPING & GLOWING NUMBERS OVERLAY */}
      {floatingScores.map((fn) => (
        <div
          key={fn.id}
          className="pointer-events-none fixed z-50 animate-jump-glow flex flex-col items-center justify-center select-none"
          style={{ left: `${fn.x}%`, top: `${fn.y}%` }}
        >
          {/* Radiant radial glow ring */}
          <div className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 rounded-full bg-gradient-to-r from-amber-400/60 via-emerald-400/50 to-amber-300/60 blur-xl animate-glow-ring pointer-events-none" />

          {/* Jump badge with glowing number */}
          <div className="relative flex items-center gap-2.5 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl bg-slate-950/95 border-2 border-amber-300 shadow-[0_0_40px_rgba(245,158,11,1),0_0_70px_rgba(16,185,129,0.85)] ring-4 ring-emerald-400/50 backdrop-blur-2xl">
            <Sparkles className="w-6 h-6 text-amber-300 animate-spin" />
            <span className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-emerald-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] tracking-tight">
              {fn.text}
            </span>
            <div className="flex flex-col text-left pl-1">
              <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-widest flex items-center gap-1 drop-shadow">
                <span>{fn.subtext}</span>
              </span>
              <span className="text-[10px] text-amber-300/90 font-extrabold uppercase tracking-wider">
                POIN SISWA BERTAMBAH
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* CONTINUOUS CHICKEN DANCE VIDEO LOOP GUIDE (Plays throughout the quiz) */}
      {hasAcceptedChickenWarning && (
        <ChickenDanceGuide
          isPlaying={!isPaused && (gameState === 'playing' || gameState === 'countdown' || gameState === 'revealed')}
          onAudioStateChange={handleChickenAudioStateChange}
        />
      )}

      {/* PRE-QUIZ ICE BREAKING CHICKEN DANCE WARNING MODAL */}
      {!hasAcceptedChickenWarning && (
        <ChickenDanceWarningModal
          onConfirm={() => {
            sounds.playClick();
            setHasAcceptedChickenWarning(true);
          }}
        />
      )}
    </div>
  );
};

