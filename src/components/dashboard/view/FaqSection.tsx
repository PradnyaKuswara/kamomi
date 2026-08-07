import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFaqsQuery } from '../../../rest/useFaq';
import type { Faq } from '../../../types/faq';
import {
  ChevronDown,
  Search,
  HelpCircle,
  BookOpen,
  Loader2,
  MessageCircleQuestion,
  AlertCircle,
} from 'lucide-react';

const defaultQueryClient = new QueryClient();

export default function FaqSection() {
  return (
    <QueryClientProvider client={defaultQueryClient}>
      <FaqSectionContent />
    </QueryClientProvider>
  );
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  default: {
    bg: 'bg-slate-100 dark:bg-slate-800/60',
    text: 'text-slate-600 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-700',
  },
  Akun: {
    bg: 'bg-indigo-100/60 dark:bg-indigo-950/40',
    text: 'text-indigo-600 dark:text-indigo-400',
    border: 'border-indigo-200 dark:border-indigo-800/40',
  },
  Kamar: {
    bg: 'bg-cyan-100/60 dark:bg-cyan-950/40',
    text: 'text-cyan-600 dark:text-cyan-400',
    border: 'border-cyan-200 dark:border-cyan-800/40',
  },
  'QR Code': {
    bg: 'bg-violet-100/60 dark:bg-violet-950/40',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/40',
  },
  Langganan: {
    bg: 'bg-amber-100/60 dark:bg-amber-950/40',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800/40',
  },
  Tamu: {
    bg: 'bg-emerald-100/60 dark:bg-emerald-950/40',
    text: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800/40',
  },
};

function getCategoryStyle(cat: string) {
  return CATEGORY_COLORS[cat] ?? CATEGORY_COLORS['default'];
}

function FaqSectionContent() {
  const { data, isLoading, isError } = useFaqsQuery();
  const faqs: Faq[] = data?.data ?? [];

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [openId, setOpenId] = useState<number | null>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map((f) => f.category)));
    return ['Semua', ...cats];
  }, [faqs]);

  const filtered = useMemo(() => {
    return faqs.filter((f) => {
      const matchCat = activeCategory === 'Semua' || f.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [faqs, activeCategory, search]);

  const toggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const grouped = useMemo(() => {
    const map: Record<string, Faq[]> = {};
    filtered.forEach((f) => {
      if (!map[f.category]) map[f.category] = [];
      map[f.category].push(f);
    });
    return map;
  }, [filtered]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Bantuan &amp; FAQ
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Temukan jawaban atas pertanyaan umum seputar penggunaan Kamomi.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 transition-all"
          />
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center min-h-75 space-y-3">
          <Loader2 className="h-8 w-8 text-cyan-500 animate-spin" />
          <p className="text-xs text-slate-400">Memuat FAQ...</p>
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center min-h-60 space-y-3 text-center">
          <AlertCircle className="h-10 w-10 text-rose-400" />
          <p className="text-sm font-semibold text-rose-500">Gagal memuat FAQ.</p>
          <p className="text-xs text-slate-400">Periksa koneksi Anda dan coba refresh halaman.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                const style = cat === 'Semua' ? CATEGORY_COLORS['default'] : getCategoryStyle(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${isActive
                      ? `${style.bg} ${style.text} ${style.border} shadow-sm`
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-60 text-center space-y-3 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8">
              <MessageCircleQuestion className="h-10 w-10 text-slate-300 dark:text-slate-600" />
              <p className="font-semibold text-slate-500 dark:text-slate-400 text-sm">
                Pertanyaan tidak ditemukan
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Coba kata kunci lain, atau hubungi kami melalui formulir bantuan di bawah.
              </p>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => {
                const style = getCategoryStyle(category);
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className={`h-3.5 w-3.5 ${style.text}`} />
                      <span className={`text-[10px] font-extrabold uppercase tracking-widest ${style.text}`}>
                        {category}
                      </span>
                      <span className={`inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full text-[9px] font-bold ${style.bg} ${style.text} ${style.border} border`}>
                        {items.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {items.map((faq) => {
                        const isOpen = openId === faq.id;
                        return (
                          <div
                            key={faq.id}
                            className={`rounded-xl border transition-all duration-200 overflow-hidden ${isOpen
                              ? `${style.border} ${style.bg}`
                              : 'border-slate-200/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-900/40'
                              } hover:border-opacity-80`}
                          >
                            <button
                              onClick={() => toggle(faq.id)}
                              className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <HelpCircle className={`h-4 w-4 mt-0.5 shrink-0 ${isOpen ? style.text : 'text-slate-400'}`} />
                                <span className={`text-xs font-semibold leading-snug ${isOpen ? 'text-slate-800 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                  {faq.question}
                                </span>
                              </div>
                              <ChevronDown
                                className={`h-4 w-4 shrink-0 mt-0.5 transition-transform duration-200 ${isOpen ? `rotate-180 ${style.text}` : 'text-slate-400'
                                  }`}
                              />
                            </button>

                            {isOpen && (
                              <div className="px-4 pb-4 pl-11">
                                <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                                  {faq.answer}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-2 rounded-2xl border border-cyan-200/50 dark:border-cyan-800/30 bg-linear-to-br from-cyan-50/60 to-indigo-50/40 dark:from-cyan-950/20 dark:to-indigo-950/10 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-xl bg-cyan-500/15 flex items-center justify-center shrink-0">
                <MessageCircleQuestion className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  Masih ada pertanyaan?
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Tim kami siap membantu Anda melalui WhatsApp atau email.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-[11px] hover:opacity-90 transition-all shadow-sm shadow-emerald-500/20"
              >
                WhatsApp
              </a>
              <a
                href="mailto:support@kamomi.id"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px] hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                Email
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
