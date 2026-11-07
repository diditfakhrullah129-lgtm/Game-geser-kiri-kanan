import { LeaderboardEntry } from '../types/quiz';

const STORAGE_KEY = 'kuis_gerak_leaderboard_v1';

const INITIAL_SEEDS: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    playerName: 'Tim Bintang Kelas',
    category: 'Informatika',
    correctCount: 10,
    totalQuestions: 10,
    timeSpentSeconds: 48.2,
    date: '2026-10-25T08:30:00.000Z',
    badge: 'Sempurna 🎯',
  },
  {
    id: 'seed-2',
    playerName: 'Regu Garuda Jaya',
    category: 'Matematika',
    correctCount: 9,
    totalQuestions: 10,
    timeSpentSeconds: 52.8,
    date: '2026-10-26T09:15:00.000Z',
    badge: 'Cepat ⚡',
  },
  {
    id: 'seed-3',
    playerName: 'Tim Kilat 7B',
    category: 'IPA',
    correctCount: 9,
    totalQuestions: 10,
    timeSpentSeconds: 61.4,
    date: '2026-10-26T10:00:00.000Z',
  },
  {
    id: 'seed-4',
    playerName: 'Kelompok Rajawali',
    category: 'Pengetahuan Umum',
    correctCount: 8,
    totalQuestions: 10,
    timeSpentSeconds: 45.0,
    date: '2026-10-26T11:20:00.000Z',
    badge: 'Super Cepat 🚀',
  },
  {
    id: 'seed-5',
    playerName: 'Squad Juara SD',
    category: 'Bahasa Indonesia',
    correctCount: 8,
    totalQuestions: 10,
    timeSpentSeconds: 68.7,
    date: '2026-10-27T03:45:00.000Z',
  },
];

export function getLeaderboardEntries(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
      return INITIAL_SEEDS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SEEDS;
  } catch (err) {
    console.warn('Error reading leaderboard from localStorage:', err);
    return INITIAL_SEEDS;
  }
}

export function saveLeaderboardEntry(entry: Omit<LeaderboardEntry, 'id' | 'date'>): LeaderboardEntry {
  const current = getLeaderboardEntries();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: new Date().toISOString(),
  };

  const updated = [newEntry, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error saving to localStorage:', err);
  }

  return newEntry;
}

export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export function resetToDefaultLeaderboard(): LeaderboardEntry[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEEDS));
  } catch {}
  return INITIAL_SEEDS;
}
