import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Presentation,
  Tv,
  HelpCircle,
  Sparkles,
  Layers,
  Laptop,
  CheckCircle2,
  X,
  Code
} from 'lucide-react';

interface CanvaEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanvaEmbedModal: React.FC<CanvaEmbedModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);
  const [activeTab, setActiveTab] = useState<'guide' | 'code'>('guide');

  if (!isOpen) return null;

  // Resolve current live URL
  const currentUrl = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
  const embedUrl = `${currentUrl}?embed=true`;
  const iframeSnippet = `<iframe \n  src="${embedUrl}" \n  width="100%" \n  height="650px" \n  style="border:none; border-radius:16px; overflow:hidden;" \n  allow="camera; microphone; autoplay; fullscreen" \n  allowfullscreen\n></iframe>`;

  const copyToClipboard = (text: string, type: 'link' | 'iframe') => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } else {
        setCopiedIframe(true);
        setTimeout(() => setCopiedIframe(false), 2500);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-violet-950/60 via-slate-900 to-cyan-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Sematkan ke Canva (Embed Web)</h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Bisa Langsung Dimainkan!
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tampilkan kuis interaktif ini langsung di slide presentasi atau website Canva Anda
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 px-6 pt-3 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="w-4 h-4" />
            Panduan Canva (Mudah)
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
              activeTab === 'code'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-4 h-4" />
            Kode Iframe / HTML
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
          {/* Direct Link Section */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-indigo-400" />
                Tautan Embed Siap Pakai (Untuk Canva)
              </label>
              <span className="text-[11px] text-indigo-300 font-mono">Format HTTPS</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={embedUrl}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 select-all focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => copyToClipboard(embedUrl, 'link')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap shadow-md ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Salin Link
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              *Tautan ini sudah dioptimalkan untuk rasio layar 16:9 di Canva sehingga pas dan tidak bergeser.
            </p>
          </div>

          {activeTab === 'guide' ? (
            /* Step-by-Step Canva Guide */
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Cara Memasang Game di Canva (Hanya 30 Detik):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Step 1 */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">Buka Canva & Buat Slide</p>
                    <p className="text-slate-400 mt-1">
                      Buka dokumen Canva Anda, pilih template <strong>Presentasi (16:9)</strong> atau halaman web Canva.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">Buka Menu "Aplikasi" (Apps)</p>
                    <p className="text-slate-400 mt-1">
                      Di panel menu sebelah kiri Canva, klik tab <strong>Aplikasi (Apps)</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">Cari & Pilih "Sematkan" (Embed)</p>
                    <p className="text-slate-400 mt-1">
                      Ketik <strong>Sematkan</strong> atau <strong>Embed</strong> pada kolom pencarian aplikasi Canva.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3.5 flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100">Tempel Link & Sesuaikan</p>
                    <p className="text-slate-400 mt-1">
                      Paste link di atas, klik <strong>Tambahkan ke desain</strong>, lalu tarik sudut kotak hingga pas memenuhi slide.
                    </p>
                  </div>
                </div>
              </div>

              {/* Useful Canva Playing Tips */}
              <div className="p-3.5 bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900 border border-cyan-800/40 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Tv className="w-4 h-4" />
                  Tips saat Mengajar di Depan Kelas:
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    Saat presentasi, klik tombol <strong>Tampilkan (Present)</strong> di Canva. Kuis langsung interaktif dan murid bisa langsung bermain!
                  </li>
                  <li>
                    <strong>Kontrol Keyboard:</strong> Tekan tombol <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px] border border-slate-700">A</kbd> atau <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px] border border-slate-700">B</kbd> pada keyboard laptop untuk menjawab secara instan.
                  </li>
                  <li>
                    <strong>Musik BGM:</strong> Lagu Harvest Moon akan langsung berputar meriah saat Anda mengklik layar kuis di Canva.
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            /* HTML Iframe Section */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-cyan-400" />
                  Snippet Kode Iframe HTML (Bisa untuk Canva, Blog, Web Sekolah, atau LMS)
                </label>
                <button
                  onClick={() => copyToClipboard(iframeSnippet, 'iframe')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold transition ${
                    copiedIframe ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {copiedIframe ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedIframe ? 'Tersalin' : 'Salin Kode'}
                </button>
              </div>
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                {iframeSnippet}
              </pre>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kode di atas sudah dilengkapi atribut <code className="text-indigo-300">allow="camera; microphone; autoplay; fullscreen"</code> untuk memastikan audio, animasi layar penuh, dan input berjalan mulus di dalam Canva maupun portal web sekolah.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Mendukung Canva Desktop, Web Browser & Canva Mobile
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            Mengerti, Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
