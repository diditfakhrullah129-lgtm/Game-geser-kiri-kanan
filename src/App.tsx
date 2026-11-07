import React, { useState, useEffect, useCallback } from 'react';
import { GameState, GameSettings, Question, CameraDevice, GameCompletionResult, LeaderboardEntry, ParticipantInfo } from './types/quiz';
import { DEFAULT_BANKS } from './data/questionBanks';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { SummaryScreen } from './components/SummaryScreen';
import { QuestionEditorModal } from './components/QuestionEditorModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ParticipantModal } from './components/ParticipantModal';
import { CanvaEmbedModal } from './components/CanvaEmbedModal';
import { getLeaderboardEntries, saveLeaderboardEntry } from './utils/leaderboard';
import { sounds, bgm } from './utils/audio';

const STORAGE_KEY_SETTINGS = 'kuis_gerak_settings_v1';
const STORAGE_KEY_CUSTOM_Q = 'kuis_gerak_custom_q_v1';

const DEFAULT_SETTINGS: GameSettings = {
  timePerQuestion: 15,
  questionCount: 10,
  category: 'Informatika',
  categoryFilter: 'Semua',
  grade: 'Semua Kelas',
  difficulty: 'Semua',
  randomizeOptions: true,
  soundEnabled: true,
  musicEnabled: true,
  enableMotionMeter: true,
  mirrorCamera: true,
};

export default function App() {
  const [gameState, setGameState] = useState<GameState>('setup');
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [customQuestions, setCustomQuestions] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CUSTOM_Q);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
  const [isCanvaModalOpen, setIsCanvaModalOpen] = useState(false);
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantInfo | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(() => getLeaderboardEntries());

  const [gameResult, setGameResult] = useState<GameCompletionResult>({
    total: 0,
    correctCount: 0,
    timeSpentSeconds: 0,
    correctCountA: 0,
    correctCountB: 0,
    category: 'Informatika',
  });

  // Sync sound settings with audio engine
  useEffect(() => {
    sounds.setEnabled(settings.soundEnabled);
    if (!settings.soundEnabled || settings.musicEnabled === false) {
      bgm.pause();
    }
  }, [settings.soundEnabled, settings.musicEnabled]);

  // Ensure BGM stops immediately whenever leaving the active game screen
  useEffect(() => {
    if (gameState !== 'playing') {
      bgm.stop();
    }
  }, [gameState]);

  // Save settings to localStorage
  const updateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Enumerate camera devices
  const refreshCameras = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Kamera ${index + 1}`,
        }));

      setAvailableCameras(videoInputs);

      if (videoInputs.length > 0 && (!activeDeviceId || !videoInputs.some((c) => c.deviceId === activeDeviceId))) {
        setActiveDeviceId(videoInputs[0].deviceId);
      }
    } catch (e) {
      console.warn('Gagal membaca daftar kamera:', e);
    }
  }, [activeDeviceId]);

  useEffect(() => {
    refreshCameras();

    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', refreshCameras);
      return () => {
        navigator.mediaDevices.removeEventListener('devicechange', refreshCameras);
      };
    }
  }, [refreshCameras]);

  // Step 1: When user clicks Start on Setup screen, open Participant selection modal
  const handleStartGame = (questionsToPlay: Question[]) => {
    setActiveQuestions(questionsToPlay);
    setIsParticipantModalOpen(true);
  };

  // Step 2: When user confirms participant details, launch the game
  const handleConfirmParticipant = (participant: ParticipantInfo) => {
    setCurrentParticipant(participant);
    setIsParticipantModalOpen(false);
    setGameState('playing');
  };

  // End game summary flow
  const handleGameComplete = (results: GameCompletionResult) => {
    setGameResult(results);
    setGameState('ended');
  };

  // Save customized questions and connect them automatically
  const handleSaveEditor = (updated: Question[]) => {
    setCustomQuestions(updated);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_Q, JSON.stringify(updated));
    } catch {}
    updateSettings({
      category: 'Kustom',
      questionCount: updated.length,
    });
  };

  const handleSaveCustomQuestions = (updated: Question[]) => {
    setCustomQuestions(updated);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_Q, JSON.stringify(updated));
    } catch {}
    updateSettings({
      category: 'Kustom',
      questionCount: updated.length, // Automatically match exact uploaded count
    });
  };

  const handleClearCustomQuestions = () => {
    setCustomQuestions([]);
    try {
      localStorage.removeItem(STORAGE_KEY_CUSTOM_Q);
    } catch {}
    updateSettings({ category: 'Informatika', questionCount: 10 });
  };

  // Save entry to leaderboard
  const handleSaveToLeaderboard = (playerName: string, finalScore: number) => {
    const accuracy = Math.round((finalScore / (gameResult.total || 1)) * 100);
    let badge = undefined;
    if (accuracy === 100) badge = 'Sempurna 🎯';
    else if (gameResult.timeSpentSeconds < (gameResult.total * 6)) badge = 'Kilat ⚡';

    saveLeaderboardEntry({
      playerName,
      category: gameResult.category,
      correctCount: finalScore,
      totalQuestions: gameResult.total,
      timeSpentSeconds: gameResult.timeSpentSeconds,
      badge,
      participantType: currentParticipant?.type,
      className: currentParticipant?.className,
      members: currentParticipant?.members,
    });

    setLeaderboardEntries(getLeaderboardEntries());
  };

  const handleRefreshLeaderboard = () => {
    setLeaderboardEntries(getLeaderboardEntries());
  };

  return (
    <main className="w-full min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      {gameState === 'setup' && (
        <SetupScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          onStartGame={handleStartGame}
          availableCameras={availableCameras}
          activeDeviceId={activeDeviceId}
          onSelectCamera={setActiveDeviceId}
          onRefreshCameras={refreshCameras}
          onOpenEditor={(questions?: Question[]) => {
            if (questions && questions.length > 0) {
              handleSaveCustomQuestions(questions);
            }
            setIsEditorOpen(true);
          }}
          customQuestions={customQuestions}
          onSaveCustomQuestions={handleSaveCustomQuestions}
          onClearCustomQuestions={handleClearCustomQuestions}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenCanvaEmbed={() => setIsCanvaModalOpen(true)}
        />
      )}

      {gameState === 'playing' && (
        <GameScreen
          questions={activeQuestions}
          settings={settings}
          activeDeviceId={activeDeviceId}
          availableCameras={availableCameras}
          onSelectCamera={setActiveDeviceId}
          onExitToMenu={() => setGameState('setup')}
          onGameComplete={handleGameComplete}
          participant={currentParticipant || undefined}
        />
      )}

      {gameState === 'ended' && (
        <SummaryScreen
          total={gameResult.total}
          initialCorrectCount={gameResult.correctCount}
          timeSpentSeconds={gameResult.timeSpentSeconds}
          countA={gameResult.correctCountA}
          countB={gameResult.correctCountB}
          category={gameResult.category}
          participant={currentParticipant || undefined}
          onSaveToLeaderboard={handleSaveToLeaderboard}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onPlayAgain={() => {
            const reshuffled = [...activeQuestions].sort(() => Math.random() - 0.5);
            setActiveQuestions(reshuffled);
            setGameState('playing');
          }}
          onBackToMenu={() => setGameState('setup')}
        />
      )}

      {/* MODAL 1: Pemilihan Pribadi atau Kelompok */}
      <ParticipantModal
        isOpen={isParticipantModalOpen}
        onClose={() => setIsParticipantModalOpen(false)}
        onConfirm={handleConfirmParticipant}
        category={settings.category}
        questionCount={settings.questionCount}
      />

      {/* MODAL 2: Editor Soal */}
      <QuestionEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        questions={
          customQuestions.length > 0
            ? customQuestions
            : (settings.categoryFilter && settings.categoryFilter !== 'Semua' && DEFAULT_BANKS[settings.categoryFilter])
            ? DEFAULT_BANKS[settings.categoryFilter]
            : DEFAULT_BANKS[settings.category] || DEFAULT_BANKS['Pythagoras'] || DEFAULT_BANKS['Informatika']
        }
        onSave={handleSaveEditor}
      />

      {/* MODAL 3: Papan Peringkat */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={leaderboardEntries}
        onRefresh={handleRefreshLeaderboard}
      />

      {/* MODAL 4: Sematkan ke Canva & Iframe Generator */}
      <CanvaEmbedModal
        isOpen={isCanvaModalOpen}
        onClose={() => setIsCanvaModalOpen(false)}
      />
    </main>
  );
}
