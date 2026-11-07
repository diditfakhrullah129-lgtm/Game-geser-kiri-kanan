import React, { useState } from 'react';
import {
  User,
  Users,
  GraduationCap,
  Plus,
  X,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ParticipantInfo, ParticipantType } from '../types/quiz';
import { sounds } from '../utils/audio';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (participant: ParticipantInfo) => void;
  category: string;
  questionCount: number;
}

export const ParticipantModal: React.FC<ParticipantModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  category,
  questionCount,
}) => {
  const [type, setType] = useState<ParticipantType>('pribadi');

  // Pribadi state
  const [personalName, setPersonalName] = useState('');
  const [personalClass, setPersonalClass] = useState('Kelas 7B');

  // Kelompok state
  const [groupName, setGroupName] = useState('');
  const [groupClass, setGroupClass] = useState('Kelas 7B');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>(['Andi', 'Siti', 'Budi']);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAddMember = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = memberInput.trim();
    if (!trimmed) return;

    // Support comma separated pasting e.g. "Rian, Dedi, Maya"
    if (trimmed.includes(',')) {
      const splitNames = trimmed.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
      setMembers((prev) => [...prev, ...splitNames]);
    } else {
      setMembers((prev) => [...prev, trimmed]);
    }
    setMemberInput('');
    sounds.playClick();
  };

  const handleRemoveMember = (indexToRemove: number) => {
    setMembers((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    sounds.playClick();
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (type === 'pribadi') {
      if (!personalName.trim()) {
        setErrorMsg('Harap isi Nama Siswa terlebih dahulu.');
        return;
      }
      sounds.playClick();
      onConfirm({
        type: 'pribadi',
        name: personalName.trim(),
        className: personalClass.trim() || 'Kelas Umum',
        members: [],
      });
    } else {
      if (!groupName.trim()) {
        setErrorMsg('Harap isi Nama Kelompok terlebih dahulu.');
        return;
      }
      if (members.length === 0) {
        setErrorMsg('Harap masukkan minimal 1 nama anggota kelompok.');
        return;
      }
      sounds.playClick();
      onConfirm({
        type: 'kelompok',
        name: groupName.trim(),
        className: groupClass.trim() || 'Kelas Umum',
        members: members,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full flex flex-col shadow-2xl overflow-hidden max-h-[94vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Identitas Pemain Sebelum Mulai
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Pilih Mode Partisipasi Kuis
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Tentukan apakah kuis dimainkan secara Pribadi (Individu) atau Kelompok (Tim).
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Cards */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Mode Pribadi Card */}
            <button
              type="button"
              onClick={() => {
                setType('pribadi');
                setErrorMsg('');
                sounds.playClick();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                type === 'pribadi'
                  ? 'bg-gradient-to-br from-blue-950/80 to-slate-900 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-950/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    type === 'pribadi'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <User className="w-6 h-6" />
                </div>
                {type === 'pribadi' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Pribadi (Individu)</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  1 Siswa bermain sendiri di depan kamera.
                </p>
              </div>
            </button>

            {/* Mode Kelompok Card */}
            <button
              type="button"
              onClick={() => {
                setType('kelompok');
                setErrorMsg('');
                sounds.playClick();
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                type === 'kelompok'
                  ? 'bg-gradient-to-br from-orange-950/80 to-slate-900 border-orange-500 ring-2 ring-orange-500/30 shadow-lg shadow-orange-950/50'
                  : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 opacity-80'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    type === 'kelompok'
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Users className="w-6 h-6" />
                </div>
                {type === 'kelompok' && (
                  <CheckCircle2 className="w-5 h-5 text-orange-400" />
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-base text-white">Kelompok (Tim / Regu)</h4>
                <p className="text-xs text-slate-400 mt-1 leading-snug">
                  Siswa bermain bersama dalam satu tim / regu.
                </p>
              </div>
            </button>
          </div>

          {/* Form Content based on Selection */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5">
            {type === 'pribadi' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
                  <User className="w-4 h-4" />
                  <span>Data Siswa (Pribadi)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold block">
                      Nama Lengkap Siswa <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={personalName}
                        onChange={(e) => setPersonalName(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold block">
                      Kelas / Tingkat
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={personalClass}
                        onChange={(e) => setPersonalClass(e.target.value)}
                        placeholder="Contoh: Kelas 7B"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-4 h-4" />
                  <span>Data Tim & Anggota Kelompok</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold block">
                      Nama Kelompok / Tim <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Contoh: Kelompok Garuda Jaya"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold block">
                      Kelas
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={groupClass}
                        onChange={(e) => setGroupClass(e.target.value)}
                        placeholder="Contoh: Kelas 7B"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Anggota Kelompok Manager */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-slate-300 font-semibold block">
                      Daftar Anggota Kelompok ({members.length} Orang)
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Bisa tambah nama satu-satu atau pisahkan dengan koma (,)
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={memberInput}
                      onChange={(e) => setMemberInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddMember();
                        }
                      }}
                      placeholder="Ketik nama anggota (contoh: Rian, Dedi, Maya) lalu tekan Enter"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMember()}
                      className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah
                    </button>
                  </div>

                  {/* Member Tags Chips */}
                  <div className="flex flex-wrap gap-2 pt-2 min-h-[40px]">
                    {members.map((member, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-200 text-xs font-semibold"
                      >
                        <User className="w-3 h-3 text-orange-400" />
                        <span>{member}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(idx)}
                          className="hover:text-rose-400 transition-colors cursor-pointer ml-0.5"
                          title="Hapus Anggota"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {members.length === 0 && (
                      <span className="text-xs text-slate-500 italic">
                        Belum ada anggota. Masukkan nama anggota di atas.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Session Summary Pill */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400">
            <span>
              Topik: <strong className="text-blue-400">{category}</strong> • {questionCount} Soal
            </span>
            <span className="text-emerald-400 font-medium">Kamera Siap Terhubung ✓</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Kembali ke Pengaturan
          </button>

          <button
            type="button"
            onClick={handleStart}
            className="px-6 sm:px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-sm transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
          >
            <span>MULAI KUIS GERAK</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
