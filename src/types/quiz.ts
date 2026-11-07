export interface Question {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  correctAnswer: 'A' | 'B';
  category?: string;
  difficulty?: 'Mudah' | 'Sedang' | 'Sulit';
  explanation?: string;
}

export type GameState = 'setup' | 'participant_selection' | 'countdown' | 'playing' | 'revealed' | 'ended';

export type ParticipantType = 'pribadi' | 'kelompok';

export interface ParticipantInfo {
  type: ParticipantType;
  name: string; // Nama Siswa atau Nama Kelompok
  className: string; // Kelas
  members: string[]; // Daftar anggota (jika kelompok)
}

export interface GameSettings {
  timePerQuestion: number; // in seconds
  questionCount: number;
  category: string;
  categoryFilter?: string;
  grade: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit' | 'Semua';
  randomizeOptions: boolean;
  soundEnabled: boolean;
  musicEnabled?: boolean;
  enableMotionMeter: boolean;
  mirrorCamera: boolean;
}

export interface CameraDevice {
  deviceId: string;
  label: string;
}

export interface MotionData {
  energyA: number; // 0 to 100
  energyB: number; // 0 to 100
  detectedSide: 'A' | 'B' | 'neutral';
}

export interface BodyTrackingResult {
  hasPerson: boolean;
  centroidX: number; // 0 to 1
  centroidY: number; // 0 to 1
  box: { x: number; y: number; width: number; height: number } | null;
  detectedZone: 'A' | 'B' | 'center' | 'none';
  confidence: number; // 0 to 100
  sideAWeight: number; // 0 to 100
  sideBWeight: number; // 0 to 100
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  category: string;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number; // Total time taken to complete in seconds
  date: string;
  badge?: string;
  participantType?: ParticipantType;
  className?: string;
  members?: string[];
}

export interface GameCompletionResult {
  total: number;
  correctCount: number;
  timeSpentSeconds: number;
  correctCountA: number;
  correctCountB: number;
  category: string;
}
