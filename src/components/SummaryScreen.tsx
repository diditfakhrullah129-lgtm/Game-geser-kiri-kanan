import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Settings,
  Sparkles,
  Clock,
  Target,
  CheckCircle2,
  Users,
  User,
  Save,
  ArrowRight,
  Download,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { ParticipantInfo } from '../types/quiz';
import { sounds, bgm } from '../utils/audio';

interface SummaryScreenProps {
  total: number;
  initialCorrectCount: number;
  timeSpentSeconds: number;
  countA: number;
  countB: number;
  category: string;
  participant?: ParticipantInfo;
  onSaveToLeaderboard: (playerName: string, finalScore: number) => void;
  onOpenLeaderboard: () => void;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  total,
  initialCorrectCount,
  timeSpentSeconds,
  countA,
  countB,
  category,
  participant,
  onSaveToLeaderboard,
  onOpenLeaderboard,
  onPlayAgain,
  onBackToMenu,
}) => {
  const [playerName, setPlayerName] = useState(() => {
    if (participant) {
      if (participant.type === 'pribadi') {
        return `${participant.name} (${participant.className})`;
      } else {
        return `${participant.name} (${participant.className})`;
      }
    }
    return 'Tim Juara Kelas';
  });

  const [score, setScore] = useState(initialCorrectCount > 0 ? initialCorrectCount : Math.max(1, Math.round(total * 0.8)));
  const [isSaved, setIsSaved] = useState(false);
  const [isExported, setIsExported] = useState(false);

  const handleExportCSV = () => {
    sounds.playClick();

    // Headers for teacher's grade book
    const headers = [
      'Waktu Selesai',
      'Mode',
      'Nama Siswa / Kelompok',
      'Kelas',
      'Anggota Tim',
      'Topik Kuis',
      'Jawaban Benar',
      'Total Soal',
      'Nilai (Skala 100)',
      'Akurasi (%)',
      'Durasi Pengerjaan (Detik)',
      'Kunci A Terpilih',
      'Kunci B Terpilih'
    ];

    const accuracyVal = Math.round((score / total) * 100);
    const finalScoreScale100 = ((score / total) * 100).toFixed(1);
    const memberList = participant?.type === 'kelompok' && participant.members?.length
      ? participant.members.join('; ')
      : '-';

    const rowData = [
      new Date().toLocaleString('id-ID'),
      participant?.type === 'kelompok' ? 'Kelompok' : 'Pribadi',
      playerName,
      participant?.className || '-',
      memberList,
      category,
      score,
      total,
      finalScoreScale100,
      `${accuracyVal}%`,
      timeSpentSeconds.toFixed(1),
      countA,
      countB
    ];

    // Helper to escape CSV cell contents safely
    const escapeCSV = (val: string | number) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const csvRow = rowData.map(escapeCSV).join(',');
    const csvHeaderLine = headers.map(escapeCSV).join(',');

    // Include UTF-8 BOM (\uFEFF) so Excel properly renders Indonesian characters and columns
    const csvContent = '\uFEFF' + [csvHeaderLine, csvRow].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    const sanitizedName = (playerName || 'Siswa')
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '_');
    const timestampStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('download', `Nilai_${sanitizedName}_${timestampStr}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExported(true);
    setTimeout(() => {
      setIsExported(false);
    }, 4000);
  };

  useEffect(() => {
    bgm.stop();
    sounds.playComplete();

    // Big victory confetti fireworks!
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      try {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      } catch {}
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;
    onSaveToLeaderboard(playerName.trim(), score);
    setIsSaved(true);
    sounds.playClick();
  };

  const accuracy = Math.round((score / total) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center backdrop-blur-xl">
        {/* Trophy Icon */}
        <div className="w-20 h-20 mx-auto mb-3 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center shadow-xl shadow-amber-500/30 text-slate-950">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Kuis Gerak Selesai!
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white mb-1 tracking-tight">
          Luar Biasa, Sesi Tuntas!
        </h2>

        {/* Participant Identification Details */}
        {participant && (
          <div className="my-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    participant.type === 'pribadi'
                      ? 'bg-blue-600 text-white'
                      : 'bg-orange-600 text-white'
                  }`}
                >
                  {participant.type === 'pribadi' ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">{participant.name}</span>
                  <span className="text-[10px] text-slate-400 block">{participant.className}</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  participant.type === 'pribadi'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                }`}
              >
                Mode {participant.type === 'pribadi' ? 'Pribadi' : 'Kelompok'}
              </span>
            </div>

            {participant.type === 'kelompok' && participant.members.length > 0 && (
              <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">
                  Anggota Tim ({participant.members.length} Siswa):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {participant.members.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-slate-200 text-[11px]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <p className="text-xs sm:text-sm text-slate-400 mb-4">
          Topik: <strong className="text-blue-400">{category}</strong> • {total} Soal
        </p>

        {/* Primary Metrics: Waktu & Jawaban Benar */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center">
            <Target className="w-5 h-5 text-emerald-400 mb-1" />
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-white">{score}</span>
              <span className="text-slate-400 text-sm font-bold">/ {total}</span>
            </div>
            <span className="text-[11px] text-emerald-300 font-semibold uppercase mt-0.5">
              Jawaban Benar ({accuracy}%)
            </span>
          </div>

          <div className="bg-slate-950/70 border border-blue-500/30 rounded-2xl p-4 flex flex-col items-center">
            <Clock className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-2xl sm:text-3xl font-black text-white">
              {timeSpentSeconds.toFixed(1)}s
            </span>
            <span className="text-[11px] text-cyan-300 font-semibold uppercase mt-0.5">
              Total Waktu Kuis
            </span>
          </div>
        </div>

        {/* A vs B Distribution Pill */}
        <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-2.5 mb-5 flex items-center justify-around text-xs text-slate-300">
          <span>Kunci A: <strong className="text-blue-400 font-bold">{countA}x</strong></span>
          <span className="text-slate-600">|</span>
          <span>Kunci B: <strong className="text-orange-400 font-bold">{countB}x</strong></span>
        </div>

        {/* SAVE TO LEADERBOARD FORM */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-400" />
              Simpan Rekor ke Papan Peringkat
            </span>
            <button
              onClick={onOpenLeaderboard}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              Lihat Top 5 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {isSaved ? (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Rekor &quot;{playerName}&quot; berhasil disimpan ke Papan Peringkat!
              </span>
              <button
                onClick={onOpenLeaderboard}
                className="underline text-emerald-200 hover:text-white cursor-pointer ml-2"
              >
                Buka
              </button>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Users className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Nama Tim / Siswa / Kelas..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    maxLength={50}
                    required
                  />
                </div>

                {/* Score Adjuster */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1">
                  <span className="text-[11px] text-slate-400 font-medium">Skor:</span>
                  <input
                    type="number"
                    min={0}
                    max={total}
                    value={score}
                    onChange={(e) => setScore(Math.max(0, Math.min(total, parseInt(e.target.value, 10) || 0)))}
                    className="w-12 bg-transparent text-center text-xs font-black text-amber-300 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500">/{total}</span>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Save className="w-3.5 h-3.5" />
                  Simpan
                </button>
              </div>
            </form>
          )}
        </div>

        {/* EXPORT DATA FOR TEACHERS */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  Ekspor Nilai untuk Guru
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                    CSV / Excel
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Unduh ringkasan hasil kuis & nama siswa untuk buku nilai
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
              isExported
                ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30 font-black'
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black shadow-emerald-600/20 active:scale-[0.99]'
            }`}
          >
            {isExported ? (
              <>
                <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                Berkas CSV Berhasil Diunduh!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                Unduh Data Nilai Siswa (.CSV)
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi
          </button>

          <button
            onClick={onBackToMenu}
            className="flex-1 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition-all border border-slate-700 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            Menu Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
};
