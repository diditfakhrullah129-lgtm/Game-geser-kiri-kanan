import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Plus, Trash2, Check, FileText, List, Save, Upload, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Question } from '../types/quiz';
import { sounds } from '../utils/audio';

interface QuestionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  onSave: (updated: Question[]) => void;
}

// Helper to determine answer key ('A' or 'B') from varied inputs
function determineAnswer(rawAns: string, optA: string, optB: string): 'A' | 'B' {
  const cleanAns = (rawAns || '').trim().toUpperCase();
  const lowerAns = (rawAns || '').trim().toLowerCase();
  const lowerA = (optA || '').trim().toLowerCase();
  const lowerB = (optB || '').trim().toLowerCase();

  if (
    cleanAns === 'B' ||
    cleanAns === '2' ||
    cleanAns === 'B.' ||
    cleanAns === '(B)' ||
    cleanAns === 'KANAN' ||
    cleanAns === 'RIGHT' ||
    cleanAns === 'OPSI B' ||
    cleanAns === 'PILIHAN B'
  ) {
    return 'B';
  }

  if (
    cleanAns === 'A' ||
    cleanAns === '1' ||
    cleanAns === 'A.' ||
    cleanAns === '(A)' ||
    cleanAns === 'KIRI' ||
    cleanAns === 'LEFT' ||
    cleanAns === 'OPSI A' ||
    cleanAns === 'PILIHAN A'
  ) {
    return 'A';
  }

  // Exact or partial match with option texts
  if (lowerAns && lowerB && (lowerAns === lowerB || lowerAns.startsWith(lowerB))) {
    return 'B';
  }
  if (lowerAns && lowerA && (lowerAns === lowerA || lowerAns.startsWith(lowerA))) {
    return 'A';
  }

  // Indonesian / English True & False heuristics
  if (lowerAns.includes('salah') || lowerAns.includes('false')) {
    if (lowerB.includes('salah')) return 'B';
    if (lowerA.includes('salah')) return 'A';
    return 'B';
  }
  if (lowerAns.includes('benar') || lowerAns.includes('true')) {
    if (lowerA.includes('benar')) return 'A';
    if (lowerB.includes('benar')) return 'B';
    return 'A';
  }

  if (cleanAns.includes('B') || cleanAns.includes('2')) return 'B';

  return 'A';
}

// Ultra-forgiving raw text parser that stitches wrapped lines and accepts varied delimiters
export function parseRawTextToQuestions(text: string): { questions: Question[]; count: number } {
  if (!text || !text.trim()) return { questions: [], count: 0 };

  const rawLines = text.split(/\r?\n/);
  const mergedLines: string[] = [];

  // Pass 1: Line stitching for copy-pasted broken lines (e.g. trailing "lah | A" or "| A")
  for (let i = 0; i < rawLines.length; i++) {
    const rawLine = rawLines[i].trim();
    if (!rawLine) continue;

    if (mergedLines.length > 0) {
      const prevLine = mergedLines[mergedLines.length - 1];
      const prevPipes = (prevLine.match(/\|/g) || []).length;
      const endsWithPipe = prevLine.endsWith('|');
      const isFragment =
        rawLine.startsWith('|') ||
        rawLine.startsWith('lah |') ||
        /^[a-zA-Z0-9_\.]+\s*\|\s*[AB12]/i.test(rawLine) ||
        /^[AB12]$/i.test(rawLine) ||
        (prevPipes < 3 && rawLine.includes('|'));

      if (endsWithPipe || isFragment) {
        if (rawLine.startsWith('|')) {
          mergedLines[mergedLines.length - 1] = prevLine + ' ' + rawLine.slice(1).trim();
        } else {
          mergedLines[mergedLines.length - 1] =
            prevLine + (endsWithPipe ? ' ' : ' | ') + rawLine;
        }
        continue;
      }
    }

    mergedLines.push(rawLine);
  }

  const parsedList: Question[] = [];

  // Pass 2: Parse each stitched line
  mergedLines.forEach((line, idx) => {
    // Detect delimiter: pipe |, tab \t, semicolon ;, or comma ,
    let delim = '|';
    if (line.includes('|')) delim = '|';
    else if (line.includes('\t')) delim = '\t';
    else if (line.includes(';')) delim = ';';
    else if ((line.match(/,/g) || []).length >= 3) delim = ',';

    const parts = line.split(delim).map((s) => s.trim());
    if (parts.length === 0 || parts.every((p) => p === '')) return;

    // Filter trailing empty parts if caused by trailing pipe
    while (parts.length > 1 && parts[parts.length - 1] === '') {
      parts.pop();
    }

    let q = '';
    let a = '';
    let b = '';
    let ansRaw = '';
    let cat = 'Umum';

    // If first column is index/number e.g. "1" or "1." or "No"
    if (
      parts.length >= 6 &&
      (/^\d+[\.\)]?$/.test(parts[0]) || /^(no|nomor|#)$/i.test(parts[0]))
    ) {
      q = parts[1];
      a = parts[2];
      b = parts[3];
      ansRaw = parts[4] || '';
      cat = parts[5] || 'Umum';
    } else if (
      parts.length >= 5 &&
      (/^\d+[\.\)]?$/.test(parts[0]) || /^(no|nomor|#)$/i.test(parts[0]))
    ) {
      q = parts[1];
      a = parts[2];
      b = parts[3];
      ansRaw = parts[4] || '';
    } else if (parts.length >= 5) {
      q = parts[0];
      a = parts[1];
      b = parts[2];
      ansRaw = parts[3] || '';
      cat = parts[4] || 'Umum';
    } else if (parts.length >= 4) {
      q = parts[0];
      a = parts[1];
      b = parts[2];
      ansRaw = parts[3] || '';
    } else if (parts.length === 3) {
      // Could be: Question | OptionA | OptionB (ans default to A)
      // or Question | Option | Answer
      q = parts[0];
      if (/^[AB12]$/i.test(parts[2]) || /^(benar|salah)$/i.test(parts[2])) {
        a = parts[1];
        b = parts[1].toLowerCase().includes('benar') ? 'Salah' : 'Pilihan B';
        ansRaw = parts[2];
      } else {
        a = parts[1];
        b = parts[2];
        ansRaw = 'A';
      }
    } else if (parts.length === 2) {
      // Question | Answer (e.g., Statement | Benar)
      q = parts[0];
      a = 'Benar';
      b = 'Salah';
      ansRaw = parts[1];
    } else if (parts.length === 1 && parts[0].length >= 3) {
      // Just a statement, default to True/False with A as correct
      q = parts[0];
      a = 'Benar';
      b = 'Salah';
      ansRaw = 'A';
    }

    // Strip leading number from question text if present (e.g. "1. Siapakah..." -> "Siapakah...")
    q = q.replace(/^\d+[\.\)\-:]\s*/, '').trim();

    if (!q) return;

    // Clean category tag
    cat = (cat || 'Umum').replace(/^category:|^kategori:/i, '').trim();
    if (!cat) cat = 'Umum';

    // Skip table header rows if detected
    const lowerQ = q.toLowerCase();
    const lowerA = (a || '').toLowerCase();
    const lowerAns = (ansRaw || '').toLowerCase();
    if (
      (lowerQ.includes('pertanyaan') || lowerQ.includes('soal')) &&
      (lowerA.includes('pilihan') || lowerAns.includes('jawaban') || lowerAns.includes('kunci'))
    ) {
      return;
    }

    // Defaults for missing options
    if (!a && !b) {
      a = 'Benar';
      b = 'Salah';
    } else if (!b) {
      b = a.toLowerCase().includes('benar') ? 'Salah' : 'Lainnya';
    } else if (!a) {
      a = b.toLowerCase().includes('salah') ? 'Benar' : 'Pilihan A';
    }

    const finalAns = determineAnswer(ansRaw, a, b);

    parsedList.push({
      id: `custom-parsed-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      question: q,
      optionA: a,
      optionB: b,
      correctAnswer: finalAns,
      category: cat,
      difficulty: 'Sedang',
      explanation: `Kunci: ${finalAns === 'A' ? a : b}`,
    });
  });

  return { questions: parsedList, count: parsedList.length };
}

export const QuestionEditorModal: React.FC<QuestionEditorModalProps> = ({
  isOpen,
  onClose,
  questions,
  onSave,
}) => {
  const [mode, setMode] = useState<'list' | 'raw'>('list');
  const [list, setList] = useState<Question[]>(questions);
  const [rawText, setRawText] = useState<string>(() =>
    questions.map((q) => `${q.question} | ${q.optionA} | ${q.optionB} | ${q.correctAnswer} | ${q.category || 'Umum'}`).join('\n')
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize state when modal is opened or incoming questions prop changes
  useEffect(() => {
    if (isOpen) {
      setList(questions);
      setRawText(
        questions.map((q) => `${q.question} | ${q.optionA} | ${q.optionB} | ${q.correctAnswer} | ${q.category || 'Umum'}`).join('\n')
      );
      setErrorMessage(null);
      setSaveStatus('idle');
    }
  }, [isOpen, questions]);

  // Live count of detected questions in raw mode
  const rawParseResult = useMemo(() => {
    if (mode !== 'raw') return null;
    return parseRawTextToQuestions(rawText);
  }, [rawText, mode]);

  if (!isOpen) return null;

  const handleFileUpload = (file: File) => {
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const firstSheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json<(string | number)[]>(firstSheet, { header: 1, defval: '' });

        const parsedList: Question[] = [];
        jsonRows.forEach((rawRow, i) => {
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
          } else if (row.length >= 2) {
            q = row[0];
            a = row[1];
            b = row[2] || (row[1].toLowerCase().includes('benar') ? 'Salah' : 'Pilihan B');
            ansRaw = row[3] || 'A';
          } else {
            return;
          }

          if (!q) return;

          const lowerQ = q.toLowerCase();
          const lowerA = (a || '').toLowerCase();
          const lowerAns = (ansRaw || '').toLowerCase();
          if (
            (lowerQ.includes('pertanyaan') || lowerQ.includes('soal')) &&
            (lowerA.includes('pilihan') || lowerAns.includes('jawaban') || lowerAns.includes('kunci'))
          ) {
            return;
          }

          const ans = determineAnswer(ansRaw, a, b);

          parsedList.push({
            id: `modal-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
            question: q.replace(/^\d+[\.\)\-:]\s*/, '').trim(),
            optionA: a || 'Benar',
            optionB: b || 'Salah',
            correctAnswer: ans,
            category: cat || 'Umum',
            difficulty: 'Sedang',
            explanation: `Kunci: ${ans === 'A' ? a : b}`,
          });
        });

        if (parsedList.length > 0) {
          setList(parsedList);
          setRawText(
            parsedList.map((q) => `${q.question} | ${q.optionA} | ${q.optionB} | ${q.correctAnswer} | ${q.category || 'Umum'}`).join('\n')
          );
          sounds.playScoreBonus();
        } else {
          setErrorMessage('File Excel/CSV tidak memuat soal yang dapat terbaca. Gunakan format: Pertanyaan | Pilihan A | Pilihan B | Kunci | Kategori.');
        }
      } catch (err) {
        console.error('Gagal membaca file di modal editor:', err);
        setErrorMessage('Terjadi kesalahan saat memproses file. Pastikan format file sesuai.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAddQuestion = () => {
    setErrorMessage(null);
    const newQ: Question = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      question: 'Pertanyaan baru...',
      optionA: 'Benar',
      optionB: 'Salah',
      correctAnswer: 'A',
      category: 'Umum',
      difficulty: 'Sedang',
    };
    setList([...list, newQ]);
  };

  const handleUpdateItem = (index: number, field: keyof Question, value: string) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
  };

  const handleDeleteItem = (index: number) => {
    setList(list.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setErrorMessage(null);

    let finalQuestions: Question[] = [];

    if (mode === 'raw') {
      const result = parseRawTextToQuestions(rawText);
      finalQuestions = result.questions;
    } else {
      // Validate list items
      finalQuestions = list
        .filter((item) => item.question && item.question.trim().length > 0)
        .map((item, idx) => ({
          ...item,
          id: item.id || `custom-${Date.now()}-${idx}`,
          question: item.question.trim(),
          optionA: item.optionA.trim() || 'Benar',
          optionB: item.optionB.trim() || 'Salah',
          correctAnswer: item.correctAnswer === 'B' ? 'B' : 'A',
          category: item.category?.trim() || 'Umum',
          difficulty: item.difficulty || 'Sedang',
        }));
    }

    if (finalQuestions.length === 0) {
      setErrorMessage(
        'Belum ada soal yang valid untuk disimpan! Harap masukkan minimal 1 baris soal (contoh: Pertanyaan | Benar | Salah | A | Kategori).'
      );
      sounds.playWarning();
      return;
    }

    // Set saving state with visual confirmation
    setSaveStatus('saving');
    sounds.playScoreBonus();

    try {
      onSave(finalQuestions);
      setSaveStatus('saved');
      setTimeout(() => {
        onClose();
        setSaveStatus('idle');
      }, 400);
    } catch (err) {
      console.error('Error saat menyimpan soal:', err);
      setErrorMessage('Terjadi kendala saat menyimpan. Silakan coba kembali.');
      setSaveStatus('idle');
    }
  };

  const switchToRaw = () => {
    setErrorMessage(null);
    setRawText(
      list
        .filter((q) => q.question.trim())
        .map((q) => `${q.question} | ${q.optionA || 'Benar'} | ${q.optionB || 'Salah'} | ${q.correctAnswer} | ${q.category || 'Umum'}`)
        .join('\n')
    );
    setMode('raw');
  };

  const switchToList = () => {
    setErrorMessage(null);
    const result = parseRawTextToQuestions(rawText);
    if (result.questions.length > 0) {
      setList(result.questions);
    }
    setMode('list');
  };

  const handleInsertTemplate = () => {
    const template = [
      'Fotosintesis tumbuhan hijau menghasilkan gas oksigen. | Benar | Salah | A | Sains',
      'Sinonim atau persamaan kata dari "Adaptasi" adalah penyesuaian. | Benar | Salah | A | Bahasa',
      'Warna primer pigmen terdiri dari merah, kuning, dan biru. | Benar | Salah | A | Seni',
      '7 x 8 = 56. | Benar | Salah | A | Matematika',
      'HTML adalah bahasa markup untuk struktur halaman web. | Benar | Salah | A | Informatika',
    ].join('\n');

    setRawText((prev) => (prev.trim() ? `${prev}\n${template}` : template));
    setErrorMessage(null);
  };

  const currentCount = mode === 'list' ? list.length : rawParseResult?.count ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Editor Soal Kuis Gerak</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                {currentCount} Soal Siap
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit dan sesuaikan soal langsung. Tekan &quot;Simpan Perubahan&quot; untuk langsung digunakan di kuis.
            </p>
          </div>

          <div className="flex items-center gap-2">
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
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              title="Upload file Excel atau CSV langsung ke editor"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Excel
            </button>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={switchToList}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  mode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                Daftar
              </button>
              <button
                onClick={switchToRaw}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  mode === 'raw' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Teks Mentah
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Notification Banner if any */}
        {errorMessage && (
          <div className="px-4 py-2.5 bg-rose-500/20 border-b border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span className="flex-1 font-medium">{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white text-xs font-bold"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {mode === 'list' ? (
            <div className="space-y-3">
              {list.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 p-6">
                  <p className="text-sm text-slate-400 mb-3">Belum ada soal dalam daftar.</p>
                  <button
                    onClick={handleAddQuestion}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Tambah Soal Pertama
                  </button>
                </div>
              ) : (
                list.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 transition-colors hover:border-slate-700"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-400">Soal #{idx + 1}</span>
                      <button
                        onClick={() => handleDeleteItem(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => handleUpdateItem(idx, 'question', e.target.value)}
                      placeholder="Tulis pertanyaan di sini..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          A
                        </div>
                        <input
                          type="text"
                          value={item.optionA}
                          onChange={(e) => handleUpdateItem(idx, 'optionA', e.target.value)}
                          placeholder="Pilihan A"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
                          B
                        </div>
                        <input
                          type="text"
                          value={item.optionB}
                          onChange={(e) => handleUpdateItem(idx, 'optionB', e.target.value)}
                          placeholder="Pilihan B"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Category Tagging & Answer Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-400 font-medium">Kategori:</span>
                        <div className="flex flex-wrap gap-1">
                          {['Pythagoras', 'Matematika', 'Sains', 'Bahasa', 'Seni', 'Informatika', 'Umum'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleUpdateItem(idx, 'category', cat)}
                              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                                (item.category || 'Umum') === cat
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={item.category || ''}
                          onChange={(e) => handleUpdateItem(idx, 'category', e.target.value)}
                          placeholder="Lainnya..."
                          className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-white focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      {/* Correct Answer Selection */}
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-xs text-slate-400">Kunci:</span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'correctAnswer', 'A')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              item.correctAnswer === 'A'
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            A ({item.optionA || 'Kiri'})
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'correctAnswer', 'B')}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              item.correctAnswer === 'B'
                                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/40'
                                : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            B ({item.optionB || 'Kanan'})
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

              <button
                onClick={handleAddQuestion}
                className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500 text-slate-400 hover:text-blue-400 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Tambah Soal Baru
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <span>
                  Format fleksibel: <code className="text-blue-300 font-mono">Pertanyaan | Pilihan A | Pilihan B | Kunci | Kategori</code>
                </span>
                <button
                  type="button"
                  onClick={handleInsertTemplate}
                  className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline cursor-pointer"
                >
                  + Tambah Contoh Format
                </button>
              </div>

              <textarea
                rows={13}
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Contoh format satu baris per soal:&#10;Fotosintesis tumbuhan menghasilkan gas oksigen. | Benar | Salah | A | Sains&#10;Sinonim dari adaptasi adalah penyesuaian. | Benar | Salah | A | Bahasa&#10;Warna primer terdiri dari merah, kuning, dan biru. | Benar | Salah | A | Seni"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs font-mono text-white leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
              />

              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-slate-400">
                  {rawParseResult && rawParseResult.count > 0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {rawParseResult.count} soal terbaca dengan baik & siap disimpan
                    </span>
                  ) : rawText.trim() ? (
                    <span className="text-amber-400 font-medium">
                      Memeriksa teks... pisahkan kolom dengan simbol garis tegak (|)
                    </span>
                  ) : (
                    <span className="text-slate-500">Teks masih kosong.</span>
                  )}
                </span>
                <span className="text-slate-500 font-mono">
                  {rawText.split('\n').filter((l) => l.trim()).length} baris teks
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950/70">
          <div className="text-xs text-slate-400 hidden sm:block">
            {saveStatus === 'saved' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-4 h-4" /> Perubahan berhasil disimpan!
              </span>
            ) : (
              <span>Soal yang disimpan otomatis aktif di menu permainan.</span>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
                saveStatus === 'saved'
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30 active:scale-95'
              }`}
            >
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-4 h-4" />
                  Tersimpan!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
