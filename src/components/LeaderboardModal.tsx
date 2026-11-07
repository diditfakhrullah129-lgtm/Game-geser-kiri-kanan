import React, { useState } from 'react';
import {
  Trophy,
  Zap,
  Target,
  Clock,
  Calendar,
  X,
  RotateCcw,
  Sparkles,
  Medal,
  Award,
  Filter
} from 'lucide-react';
import { LeaderboardEntry } from '../types/quiz';
import { clearLeaderboard, resetToDefaultLeaderboard } from '../utils/leaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  onRefresh: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  onRefresh,
}) => {
  const [tab, setTab] = useState<'highest_correct' | 'fastest_time'>('highest_correct');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  if (!isOpen) return null;

  // Extract unique categories
  const categories = ['Semua', ...Array.from(new Set(entries.map((e) => e.category).filter(Boolean)))];

  // Filter entries
  let filtered = entries;
  if (selectedCategory !== 'Semua') {
    filtered = filtered.filter((e) => e.category === selectedCategory);
  }

  // Sort top 5 based on selected tab
  const sorted = [...filtered].sort((a, b) => {
    if (tab === 'highest_correct') {
      // Primary: most correct answers
      if (b.correctCount !== a.correctCount) {
        return b.correctCount - a.correctCount;
      }
      // Secondary: fastest time
      return a.timeSpentSeconds - b.timeSpentSeconds;
    } else {
      // Fastest completions
      // Primary: lowest timeSpentSeconds
      if (a.timeSpentSeconds !== b.timeSpentSeconds) {
        return a.timeSpentSeconds - b.timeSpentSeconds;
      }
      // Secondary: most correct answers
      return b.correctCount - a.correctCount;
    }
  });

  const top5 = sorted.slice(0, 5);

  const handleReset = () => {
    if (window.confirm('Reset papan peringkat ke data awal?')) {
      resetToDefaultLeaderboard();
      onRefresh();
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 0:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-500 text-slate-950 font-black text-base flex items-center justify-center shadow-lg shadow-amber-500/40 border border-amber-200">
            🥇
          </div>
        );
      case 1:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-200 to-slate-400 text-slate-900 font-black text-base flex items-center justify-center shadow-lg shadow-slate-400/30 border border-slate-100">
            🥈
          </div>
        );
      case 2:
        return (
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white font-black text-base flex items-center justify-center shadow-lg shadow-amber-700/30 border border-amber-500">
            🥉
          </div>
        );
      default:
        return (
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center justify-center border border-slate-700">
            #{rank + 1}
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                Papan Peringkat Sesi
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/30">
                  TOP 5
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Peringkat rekor tersimpan secara lokal di peramban ini
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Category Filter Controls */}
        <div className="p-4 sm:px-6 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950/60">
          {/* Tabs: Jawaban Terbanyak vs Waktu Tercepat */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setTab('highest_correct')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'highest_correct'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              Jawaban Terbanyak
            </button>
            <button
              onClick={() => setTab('fastest_time')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                tab === 'fastest_time'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-slate-950 shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Waktu Tercepat
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'Semua' ? 'Semua Topik' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Leaderboard List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {top5.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-300">Belum ada rekor tersimpan untuk kategori ini.</p>
              <p className="text-xs text-slate-500 mt-1">Mainkan kuis dan selesaikan sesi untuk mencatatkan rekor!</p>
            </div>
          ) : (
            top5.map((entry, index) => {
              const accuracy = Math.round((entry.correctCount / (entry.totalQuestions || 1)) * 100);
              const formattedDate = new Date(entry.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={entry.id || index}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center gap-3 sm:gap-4 ${
                    index === 0
                      ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : index === 1
                      ? 'bg-slate-950/60 border-slate-400/30'
                      : index === 2
                      ? 'bg-amber-950/15 border-amber-700/30'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  {/* Rank Icon */}
                  {getRankBadge(index)}

                  {/* Player & Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-white text-sm sm:text-base truncate">
                        {entry.playerName}
                      </h4>
                      {entry.participantType && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            entry.participantType === 'pribadi'
                              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              : 'bg-orange-500/15 text-orange-300 border-orange-500/30'
                          }`}
                        >
                          {entry.participantType === 'pribadi' ? '👤 Pribadi' : '👥 Kelompok'}
                        </span>
                      )}
                      {entry.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          {entry.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                      <span className="text-blue-400 font-semibold">{entry.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formattedDate}
                      </span>
                      {entry.members && entry.members.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[200px]" title={entry.members.join(', ')}>
                            Anggota: {entry.members.join(', ')}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Score & Time Badges */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Correct Count Badge */}
                    <div
                      className={`px-3 py-1.5 rounded-xl border flex flex-col items-center ${
                        tab === 'highest_correct'
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-black">
                        {entry.correctCount}/{entry.totalQuestions}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Benar ({accuracy}%)</span>
                    </div>

                    {/* Completion Time Badge */}
                    <div
                      className={`px-3 py-1.5 rounded-xl border flex flex-col items-center ${
                        tab === 'fastest_time'
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-black flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {entry.timeSpentSeconds.toFixed(1)}s
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Waktu</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            onClick={handleReset}
            className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Peringkat Bawaan
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
