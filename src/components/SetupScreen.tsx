import React, { useState, useRef, useMemo } from 'react';
import {
  Play,
  Camera,
  Upload,
  FileSpreadsheet,
  Clock,
  Sparkles,
  HelpCircle,
  FileDown,
  Volume2,
  VolumeX,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Music,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Filter,
  X,
  Share2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question, GameSettings, CameraDevice } from '../types/quiz';
import { DEFAULT_BANKS, STANDARD_CATEGORIES } from '../data/questionBanks';
import { sounds, bgm } from '../utils/audio';
import { ChickenDanceWarningModal } from './ChickenDanceWarningModal';

interface SetupScreenProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onStartGame: (questions: Question[]) => void;
  availableCameras: CameraDevice[];
  activeDeviceId: string;
  onSelectCamera: (deviceId: string) => void;
  onRefreshCameras: () => void;
  onOpenEditor: (questions: Question[]) => void;
  customQuestions: Question[];
  onSaveCustomQuestions: (questions: Question[]) => void;
  onClearCustomQuestions: () => void;
  onOpenLeaderboard: () => void;
  onOpenCanvaEmbed?: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({
  settings,
  onUpdateSettings,
  onStartGame,
  availableCameras,
  activeDeviceId,
  onSelectCamera,
  onRefreshCameras,
  onOpenEditor,
  customQuestions,
  onSaveCustomQuestions,
  onClearCustomQuestions,
  onOpenLeaderboard,
  onOpenCanvaEmbed,
}) => {
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isPreviewingMusic, setIsPreviewingMusic] = useState(false);
  const [showQuestionPreview, setShowQuestionPreview] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTab, setUploadTab] = useState<'file' | 'paste'>('file');
  const [pasteContent, setPasteContent] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isIceBreakingModalOpen, setIsIceBreakingModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop any lingering audio when returning to setup screen
  React.useEffect(() => {
    bgm.stop();
    setIsPreviewingMusic(false);
    return () => {
      bgm.stop();
    };
  }, []);

  // All available questions across custom uploads and default banks
  const allCurrentQuestions = useMemo(() => {
    if (settings.category === 'Kustom' && customQuestions && customQuestions.length > 0) {
      return customQuestions;
    }
    const seen = new Set<string>();
    const list: Question[] = [];
    Object.values(DEFAULT_BANKS).forEach((bankQs) => {
      bankQs.forEach((q) => {
        if (!seen.has(q.question)) {
          seen.add(q.question);
          list.push(q);
        }
      });
    });
    return list;
  }, [settings.category, customQuestions]);

  // Compute category list with live question counts
  const categoryFilterList = useMemo(() => {
    const standard = ['Semua', 'Pythagoras', 'Matematika', 'Sains', 'Bahasa', 'Seni', 'Informatika', 'Umum'];
    const customFound = new Set<string>();
    allCurrentQuestions.forEach((q) => {
      const c = (q.category || 'Umum').trim();
      if (c && !standard.map((s) => s.toLowerCase()).includes(c.toLowerCase())) {
        customFound.add(c);
      }
    });

    const fullCategories = [...standard, ...Array.from(customFound)];

    const getIcon = (cat: string) => {
      switch (cat.toLowerCase()) {
        case 'pythagoras': return '📐';
        case 'matematika': return '🔢';
        case 'sains': return '🔬';
        case 'bahasa': return '📖';
        case 'seni': return '🎨';
        case 'informatika': return '💻';
        case 'umum': return '🌍';
        case 'semua': return '⭐';
        default: return '🏷️';
      }
    };

    return fullCategories.map((name) => {
      let count = 0;
      if (name === 'Semua') {
        count = allCurrentQuestions.length;
      } else {
        count = allCurrentQuestions.filter(
          (q) => (q.category || 'Umum').toLowerCase() === name.toLowerCase()
        ).length;
      }
      return {
        name,
        count,
        icon: getIcon(name),
      };
    });
  }, [allCurrentQuestions]);

  const activeCategoryFilter = settings.categoryFilter || 'Semua';
  const categoryFilterCount =
    categoryFilterList.find((c) => c.name === activeCategoryFilter)?.count || allCurrentQuestions.length;

  // Prepare question pool based on selection and category filter
  const getPreparedQuestions = (): Question[] => {
    let pool: Question[] = [];

    // If Kustom category is selected AND custom questions exist, use them exclusively
    if (settings.category === 'Kustom' && customQuestions && customQuestions.length > 0) {
      pool = [...customQuestions];
    } else if (customQuestions && customQuestions.length > 0 && !DEFAULT_BANKS[settings.category]) {
      pool = [...customQuestions];
    } else if (DEFAULT_BANKS[settings.category]) {
      pool = [...DEFAULT_BANKS[settings.category]];
    } else if (customQuestions && customQuestions.length > 0) {
      pool = [...customQuestions];
    } else {
      pool = [...DEFAULT_BANKS['Pythagoras'] || DEFAULT_BANKS['Informatika']];
    }

    // Apply Category Filter if not "Semua"
    const activeFilter = settings.categoryFilter || 'Semua';
    if (activeFilter !== 'Semua') {
      const filtered = pool.filter(
        (q) => (q.category || 'Umum').toLowerCase() === activeFilter.toLowerCase()
      );
      if (filtered.length > 0) {
        pool = filtered;
      } else {
        // Draw from all available questions for this category
        const fromAll = allCurrentQuestions.filter(
          (q) => (q.category || 'Umum').toLowerCase() === activeFilter.toLowerCase()
        );
        if (fromAll.length > 0) {
          pool = fromAll;
        }
      }
    }

    // Custom questions: purely return custom questions
    if (settings.category === 'Kustom' && customQuestions && customQuestions.length > 0) {
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      let selected = shuffled.slice(0, Math.min(settings.questionCount, shuffled.length));

      if (settings.randomizeOptions) {
        selected = selected.map((q) => {
          if (Math.random() < 0.5) return q;
          return {
            ...q,
            optionA: q.optionB,
            optionB: q.optionA,
            correctAnswer: q.correctAnswer === 'A' ? 'B' : 'A',
          };
        });
      }
      return selected;
    }

    // Difficulty filter
    if (settings.difficulty !== 'Semua') {
      const filtered = pool.filter((q) => q.difficulty === settings.difficulty);
      if (filtered.length >= 3) {
        pool = filtered;
      }
    }

    // Shuffle pool
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    let selected = [...shuffled];

    // Supplement from other questions if pool is smaller than requested and filter is 'Semua'
    if (selected.length < settings.questionCount && activeFilter === 'Semua') {
      const allOtherQuestions = Object.entries(DEFAULT_BANKS)
        .filter(([cat]) => cat !== settings.category)
        .flatMap(([, qs]) => qs)
        .sort(() => Math.random() - 0.5);

      for (const q of allOtherQuestions) {
        if (selected.length >= settings.questionCount) break;
        if (!selected.some((existing) => existing.question === q.question)) {
          selected.push({
            ...q,
            id: `suppl-${Date.now()}-${selected.length}`,
          });
        }
      }
    }

    // Strictly slice to exact question count requested
    selected = selected.slice(0, Math.min(settings.questionCount, selected.length));

    // Randomize options
    if (settings.randomizeOptions) {
      selected = selected.map((q) => {
        if (Math.random() < 0.5) return q;
        return {
          ...q,
          optionA: q.optionB,
          optionB: q.optionA,
          correctAnswer: q.correctAnswer === 'A' ? 'B' : 'A',
        };
      });
    }

    return selected;
  };

  const handleStart = () => {
    sounds.playClick();
    const questions = getPreparedQuestions();
    if (questions.length === 0) {
      setStatusMessage({
        text: 'Tidak ada soal yang tersedia. Harap pilih kategori lain atau muat soal baru.',
        type: 'error',
      });
      return;
    }
    onStartGame(questions);
  };

  // Parse spreadsheet / raw rows
  const parseRowsToQuestions = (rows: (string | number)[][], sourceName: string): Question[] => {
    const list: Question[] = [];

    rows.forEach((rawRow, i) => {
      const row = rawRow.map((c) => String(c ?? '').trim());
      if (row.every((c) => c === '')) return;

      let q = '';
      let a = '';
      let b = '';
      let ansRaw = '';
      let cat = 'Umum';

      if (
        row.length >= 6 &&
        (/^\d+[\.\)]?$/.test(row[0]) || /^(no|nomor|idx|#)$/i.test(row[0])) &&
        row[1].length > 0
      ) {
        q = row[1];
        a = row[2];
        b = row[3];
        ansRaw = row[4];
        cat = row[5] || 'Umum';
      } else if (
        row.length >= 5 &&
        (/^\d+[\.\)]?$/.test(row[0]) || /^(no|nomor|idx|#)$/i.test(row[0])) &&
        row[1].length > 0
      ) {
        q = row[1];
        a = row[2];
        b = row[3];
        ansRaw = row[4];
      } else if (row.length >= 5) {
        q = row[0];
        a = row[1];
        b = row[2];
        ansRaw = row[3];
        cat = row[4] || 'Umum';
      } else if (row.length >= 4) {
        q = row[0];
        a = row[1];
        b = row[2];
        ansRaw = row[3];
      } else {
        return;
      }

      if (!q || !a || !b) return;

      const lowerQ = q.toLowerCase();
      const lowerA = a.toLowerCase();
      const lowerAns = ansRaw.toLowerCase();
      if (
        (lowerQ.includes('pertanyaan') || lowerQ.includes('soal') || lowerQ.includes('question')) &&
        (lowerA.includes('pilihan') || lowerA.includes('opsi') || lowerA.includes('option') || lowerAns.includes('jawaban') || lowerAns.includes('kunci'))
      ) {
        return;
      }

      let ans: 'A' | 'B' = 'A';
      const cleanAns = ansRaw.trim().toUpperCase();

      if (
        cleanAns === 'B' ||
        cleanAns === 'B.' ||
        cleanAns === '(B)' ||
        cleanAns === '2' ||
        cleanAns === 'KANAN' ||
        cleanAns === 'RIGHT' ||
        cleanAns === 'OPSI B' ||
        cleanAns === 'PILIHAN B'
      ) {
        ans = 'B';
      } else if (cleanAns.toLowerCase() === b.toLowerCase()) {
        ans = 'B';
      } else {
        ans = 'A';
      }

      list.push({
        id: `custom-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
        question: q,
        optionA: a,
        optionB: b,
        correctAnswer: ans,
        category: (cat || 'Umum').replace(/^category:|^kategori:/i, '').trim() || 'Umum',
        difficulty: 'Sedang',
        explanation: `Jawaban: ${ans === 'A' ? a : b}`,
      });
    });

    if (list.length > 0) {
      onSaveCustomQuestions(list);
      onUpdateSettings({
        category: 'Kustom',
        categoryFilter: 'Semua',
        questionCount: list.length,
      });
      setStatusMessage({
        text: `Berhasil terhubung! ${list.length} soal dari "${sourceName}" aktif digunakan.`,
        type: 'success',
      });
      setIsUploadModalOpen(false);
    } else {
      setStatusMessage({
        text: `Gagal membaca soal dari ${sourceName}. Pastikan format: Pertanyaan | Opsi A | Opsi B | Kunci (A/B) | Kategori.`,
        type: 'error',
      });
    }

    return list;
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const firstSheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json<(string | number)[]>(firstSheet, { header: 1, defval: '' });
        parseRowsToQuestions(jsonRows, file.name);
      } catch {
        try {
          const dec = new TextDecoder('utf-8');
          const text = dec.decode(e.target?.result as ArrayBuffer).replace(/^\uFEFF/, '');
          const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
          const rows = lines.map((l) => {
            if (l.includes('|')) return l.split('|').map((s) => s.trim());
            if (l.includes('\t')) return l.split('\t').map((s) => s.trim());
            if (l.includes(';')) return l.split(';').map((s) => s.trim());
            return l.split(',').map((s) => s.trim());
          });
          parseRowsToQuestions(rows, file.name);
        } catch {
          setStatusMessage({ text: `Gagal memproses file "${file.name}".`, type: 'error' });
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleApplyPaste = () => {
    if (!pasteContent.trim()) {
      setStatusMessage({ text: 'Silakan tempel teks soal terlebih dahulu.', type: 'error' });
      return;
    }
    const lines = pasteContent.trim().replace(/^\uFEFF/, '').split(/\r?\n/).filter((l) => l.trim().length > 0);
    const rows = lines.map((l) => {
      if (l.includes('|')) return l.split('|').map((s) => s.trim());
      if (l.includes('\t')) return l.split('\t').map((s) => s.trim());
      if (l.includes(';')) return l.split(';').map((s) => s.trim());
      return l.split(',').map((s) => s.trim());
    });
    parseRowsToQuestions(rows, 'Teks Tempelan');
  };

  const handleDownloadSample = () => {
    const csvContent = '\uFEFFpertanyaan;pilihan A;pilihan B;jawaban;kategori\n' +
      'Pelopor Teorema Pythagoras adalah filsuf Pythagoras dari Samos.;Benar;Salah;A;Pythagoras\n' +
      'Rumus Teorema Pythagoras sisi miring c adalah c² = a² + b².;Benar;Salah;A;Pythagoras\n' +
      'Segitiga siku-siku dengan sisi 3 cm dan 4 cm memiliki hipotenusa 5 cm.;Benar;Salah;A;Pythagoras\n' +
      'Kelompok angka 3, 4, dan 5 merupakan Triple Pythagoras.;Benar;Salah;A;Pythagoras\n' +
      'Fotosintesis tumbuhan menghasilkan gas oksigen.;Benar;Salah;A;Sains\n';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'contoh_soal_kuis_gerak.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden relative selection:bg-blue-500 selection:text-white p-2 sm:p-4">
      {/* Subtle Glows */}
      <div className="absolute top-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER BAR (Ultra Compact) */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between gap-2 shrink-0 py-1 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            <span className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow">
              A
            </span>
            <span className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center font-black text-xs text-white shadow">
              B
            </span>
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-none">
              Kuis Gerak <span className="text-blue-400">A</span> / <span className="text-orange-400">B</span>
            </h1>
            <span className="text-[10px] text-slate-400 hidden sm:inline">Motion Webcam Edu Game</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsIceBreakingModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-400/50 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 shadow-sm"
            title="Buka Video Ice Breaking Senam Ayam"
          >
            <span>🐔</span>
            <span className="hidden sm:inline">Senam Ayam</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Upload atau Tempel Soal Sendiri"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Upload Soal</span>
          </button>

          <button
            onClick={() => onOpenEditor(getPreparedQuestions())}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Buka Editor Soal"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Editor</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 hover:border-amber-500/30 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Lihat Papan Peringkat"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Nilai</span>
          </button>

          {onOpenCanvaEmbed && (
            <button
              onClick={onOpenCanvaEmbed}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/30 text-xs transition-colors cursor-pointer"
              title="Sematkan ke Canva / Embed"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => setShowHelpModal(true)}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs transition-colors cursor-pointer"
            title="Cara Bermain"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT BODY (Zero scroll layout) */}
      <main className="w-full max-w-5xl mx-auto flex-1 flex flex-col justify-between py-2 sm:py-3 gap-2 overflow-hidden">
        {/* Active Custom Question Banner (Ultra Slim) */}
        {customQuestions && customQuestions.length > 0 && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-xs shrink-0">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span className="font-bold text-white truncate">
                {customQuestions.length} Soal Kustom Aktif
              </span>
              <span className="text-[11px] text-emerald-300 hidden sm:inline truncate">
                ({settings.category === 'Kustom' ? 'Sedang Digunakan' : 'Klik pakai untuk bermain'})
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {settings.category !== 'Kustom' ? (
                <button
                  onClick={() => onUpdateSettings({ category: 'Kustom', questionCount: customQuestions.length })}
                  className="px-2 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] cursor-pointer hover:bg-emerald-400"
                >
                  Pakai
                </button>
              ) : (
                <span className="text-[10px] text-emerald-300 font-bold">✓ Aktif</span>
              )}
              <button
                onClick={() => setShowQuestionPreview(!showQuestionPreview)}
                className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-[10px] cursor-pointer"
              >
                {showQuestionPreview ? 'Tutup' : 'Lihat'}
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Hapus soal kustom hasil upload?')) {
                    onClearCustomQuestions();
                  }
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 cursor-pointer"
                title="Hapus Soal Kustom"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Question Preview Drawer (If toggled) */}
        {showQuestionPreview && customQuestions && customQuestions.length > 0 && (
          <div className="max-h-28 overflow-y-auto p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-[11px] space-y-1 shrink-0">
            {customQuestions.map((q, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2 text-slate-300">
                <span className="truncate">{idx + 1}. {q.question}</span>
                <span className="text-blue-400 font-mono shrink-0">Kunci: {q.correctAnswer}</span>
              </div>
            ))}
          </div>
        )}

        {/* 1. CATEGORY FILTER BAR (Compact Horizontal Scroll / Flex) */}
        <div className="shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Filter className="w-3 h-3 text-blue-400" />
              Pilih Kategori Soal:
            </span>
            <span className="text-[10px] text-blue-400 font-semibold">
              {categoryFilterCount} Soal Tersedia
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {categoryFilterList.map(({ name, count, icon }) => {
              const isSelected = (settings.categoryFilter || 'Semua') === name;
              const isPythagoras = name.toLowerCase() === 'pythagoras';
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onUpdateSettings({ categoryFilter: name });
                    if (name !== 'Semua' && count > 0 && settings.questionCount > count) {
                      onUpdateSettings({ questionCount: count });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-400/50 scale-102'
                      : isPythagoras
                      ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="text-sm">{icon}</span>
                  <span>{name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. HERO PLAY BUTTON CARD (Centerpiece, Highly Prominent) */}
        <div className="rounded-2xl p-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 shadow-xl shrink-0">
          <div className="bg-slate-900/95 backdrop-blur-md rounded-[14px] p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Kuis Siap Dimainkan
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold">
                  {settings.categoryFilter && settings.categoryFilter !== 'Semua' ? settings.categoryFilter : settings.category}
                </span>
                <button
                  type="button"
                  onClick={() => setIsIceBreakingModalOpen(true)}
                  className="px-2.5 py-0.5 rounded-full bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/50 text-amber-300 text-[10px] font-extrabold flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                  title="Buka Video Ice Breaking Senam Ayam"
                >
                  <span>🐔</span>
                  <span>Ice Breaking Chicken Dance ↗</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5">
                Target: <strong className="text-white">{Math.min(settings.questionCount, categoryFilterCount)} Soal</strong> • Waktu:{' '}
                <strong className="text-white">{settings.timePerQuestion} Detik/Soal</strong>
              </p>
            </div>

            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-base sm:text-lg tracking-wide transition-all transform hover:scale-103 active:scale-97 shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>MULAI KUIS SEKARANG</span>
            </button>
          </div>
        </div>

        {/* 3. COMPACT SETTINGS GRID (Side-by-side, No Scroll) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
          {/* Card A: Jumlah Soal */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300">Jumlah Soal</span>
              <span className="text-xs font-mono font-bold text-blue-400">
                {Math.min(settings.questionCount, categoryFilterCount)} Soal
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[5, 10, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onUpdateSettings({ questionCount: Math.min(num, categoryFilterCount) })}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settings.questionCount === num
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => onUpdateSettings({ questionCount: categoryFilterCount })}
                className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer truncate px-1 ${
                  settings.questionCount >= categoryFilterCount
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                }`}
              >
                Semua
              </button>
            </div>
          </div>

          {/* Card B: Waktu Berpikir */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Waktu Tiap Soal
              </span>
              <span className="text-xs font-mono font-bold text-amber-300">
                {settings.timePerQuestion}s
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[10, 15, 20, 30].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onUpdateSettings({ timePerQuestion: sec })}
                  className={`py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    settings.timePerQuestion === sec
                      ? 'bg-amber-500 text-slate-950 shadow font-black'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          </div>

          {/* Card C: Kamera, Suara & Mirror */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Camera className="w-3 h-3 text-blue-400" /> Sensor & Suara
              </span>
              <button
                onClick={onRefreshCameras}
                className="text-[10px] text-blue-400 hover:underline cursor-pointer"
              >
                Deteksi
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <select
                value={activeDeviceId}
                onChange={(e) => onSelectCamera(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-blue-500 truncate"
              >
                <option value="">Kamera Otomatis</option>
                {availableCameras.map((cam, idx) => (
                  <option key={cam.deviceId || idx} value={cam.deviceId}>
                    {cam.label || `Kamera ${idx + 1}`}
                  </option>
                ))}
              </select>

              {/* Music Soundtrack Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !(settings.musicEnabled !== false);
                  onUpdateSettings({ musicEnabled: next });
                  if (!next) {
                    bgm.stop();
                    setIsPreviewingMusic(false);
                  }
                }}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  settings.musicEnabled !== false
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                title="Soundtrack Harvest Moon saat kuis"
              >
                <Music className="w-3.5 h-3.5" />
              </button>

              {/* Sound Effect Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !settings.soundEnabled;
                  onUpdateSettings({ soundEnabled: next });
                  sounds.setEnabled(next);
                  if (next) sounds.playTick();
                }}
                className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                  settings.soundEnabled
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                title="Efek Suara Bel & Detik"
              >
                {settings.soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Mirror Toggle */}
              <button
                type="button"
                onClick={() => onUpdateSettings({ mirrorCamera: !settings.mirrorCamera })}
                className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-colors ${
                  settings.mirrorCamera
                    ? 'bg-blue-600/30 border-blue-500/50 text-blue-300'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
                title="Mode Cermin Kamera"
              >
                Mirror
              </button>
            </div>
          </div>
        </div>

        {/* 4. FOOTER QUICK HINT (Ultra Sleek) */}
        <footer className="w-full py-1 text-center text-[11px] text-slate-400 shrink-0">
          <span>💡 Pemain melangkah ke </span>
          <span className="text-blue-400 font-bold">Kiri (Pilihan A)</span>
          <span> atau </span>
          <span className="text-orange-400 font-bold">Kanan (Pilihan B)</span>
          <span> di depan kamera sebelum waktu habis.</span>
        </footer>
      </main>

      {/* MODAL 1: Upload / Tempel Soal (Opens on demand, keeps main menu uncluttered) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Upload Soal Sendiri</h3>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 mb-4">
              <button
                onClick={() => setUploadTab('file')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  uploadTab === 'file' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Upload File (.xlsx / .csv)
              </button>
              <button
                onClick={() => setUploadTab('paste')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  uploadTab === 'paste' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tempel Teks Excel
              </button>
            </div>

            {uploadTab === 'file' ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-slate-600'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />
                <FileSpreadsheet className="w-10 h-10 text-blue-400 mx-auto mb-2" />
                <p className="text-xs text-white font-bold mb-1">Klik atau tarik file Excel / CSV ke sini</p>
                <p className="text-[11px] text-slate-400">Format: Pertanyaan | Pilihan A | Pilihan B | Kunci | Kategori</p>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  rows={5}
                  value={pasteContent}
                  onChange={(e) => setPasteContent(e.target.value)}
                  placeholder="Contoh:&#10;7 x 8 = ... | 54 | 56 | B | Matematika&#10;Teorema pythagoras berlaku untuk segitiga... | Siku-siku | Sama sisi | A | Pythagoras"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleApplyPaste}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow"
                >
                  Terapkan Soal
                </button>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Gunakan format tabel 4 atau 5 kolom</span>
              <button
                onClick={handleDownloadSample}
                className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <FileDown className="w-3.5 h-3.5" /> Unduh Contoh CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Panduan Bermain */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl relative text-xs text-slate-300">
            <button
              onClick={() => setShowHelpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-white text-base mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" /> Cara Bermain Kuis Gerak
            </h3>
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-blue-400 block mb-0.5">1. Posisikan Kamera</span>
                Arahkan webcam ke depan kelas atau ruangan. Siswa berdiri santai di posisi tengah.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-indigo-400 block mb-0.5">2. Ambil Pilihan Sisi</span>
                Saat pertanyaan muncul, pemain melangkah atau berlari ke sisi <strong>Kiri (A)</strong> atau <strong>Kanan (B)</strong> sebelum timer berakhir.
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">3. Skor & Kunci Jawaban</span>
                Jawaban benar akan menyala hijau dengan selebrasi konfeti, efek suara, dan skor animasi melompat!
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
            >
              Mengerti & Kembali
            </button>
          </div>
        </div>
      )}

      {/* ICE BREAKING CHICKEN DANCE DEDICATED PREVIEW MODAL */}
      {isIceBreakingModalOpen && (
        <ChickenDanceWarningModal
          onConfirm={() => {
            setIsIceBreakingModalOpen(false);
            handleStart();
          }}
        />
      )}
    </div>
  );
};
