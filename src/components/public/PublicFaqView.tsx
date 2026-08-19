import { useState, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFaqsQuery } from '../../rest/useFaq';
import type { Faq } from '../../types/faq';
import {
  ChevronDown,
  Search,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Loader2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const queryClient = new QueryClient();

export default function PublicFaqView() {
  return (
    <QueryClientProvider client={queryClient}>
      <PublicFaqContent />
    </QueryClientProvider>
  );
}

const DEFAULT_FAQS: Faq[] = [
  {
    id: 1,
    question: "Apa itu Kamomi.id dan bagaimana cara kerjanya?",
    answer: "Kamomi.id adalah platform manajemen hunian digital berbasis QR Code akrilik pintar. Pemilik kost, homestay, atau villa cukup menempelkan QR akrilik di pintu kamar. Tamu dapat memindai QR untuk terhubung ke Wi-Fi 1-klik, melihat tata tertib, hingga melaporkan keluhan secara langsung tanpa perlu mengunduh aplikasi.",
    category: "Umum",
    sequence: 1,
    isActive: true,
  },
  {
    id: 2,
    question: "Apakah tamu harus mengunduh aplikasi untuk menggunakan Kamomi.id?",
    answer: "Sama sekali tidak. Kamomi.id dirancang berbasis Web Portal (PWA). Tamu cukup mengarahkan kamera HP ke QR Code akrilik dan halaman digital guestbook langsung terbuka di browser HP mereka dalam kurun waktu kurang dari 3 detik.",
    category: "Tamu",
    sequence: 2,
    isActive: true,
  },
  {
    id: 3,
    question: "Bagaimana cara kerja fitur Wi-Fi 1-Klik?",
    answer: "Sistem Kamomi.id membuat kredensial koneksi Wi-Fi otomatis dalam format QR/Konektor pintar. Begitu tamu menekan tombol 'Hubungkan Wi-Fi', HP mereka akan langsung terhubung ke jaringan Wi-Fi kamar tanpa perlu memasukkan kata sandi secara manual.",
    category: "QR Code",
    sequence: 3,
    isActive: true,
  },
  {
    id: 4,
    question: "Apakah ada paket gratis untuk pemilik kost baru?",
    answer: "Ya! Kamomi.id menyediakan Paket Gratis Selamanya untuk 3 kamar pertama. Anda bisa mencoba semua fitur unggulan, cetak stiker QR, dan mengelola operasional hunian tanpa biaya langganan.",
    category: "Langganan",
    sequence: 4,
    isActive: true,
  },
  {
    id: 5,
    question: "Bagaimana jika ada keluhan atau kendala dari penghuni kamar?",
    answer: "Penghuni dapat menekan menu 'Lapor Kendala' pada portal guestbook kamar mereka. Notifikasi instan beserta nomor kamar dan pesan keluhan akan langsung terkirim ke WhatsApp / Dashboard pemilik hunian.",
    category: "Operasional",
    sequence: 5,
    isActive: true,
  },
  {
    id: 6,
    question: "Apakah stiker / akrilik QR Code disediakan oleh Kamomi.id?",
    answer: "Kami menyediakan template desain fisik high-resolution siap cetak, serta layanan cetak akrilik premium UV-print yang tahan air dan tahan gores untuk pengiriman langsung ke alamat properti Anda.",
    category: "QR Code",
    sequence: 6,
    isActive: true,
  },
];

function PublicFaqContent() {
  const { data, isLoading, isError } = useFaqsQuery();
  
  // Combine API database records or fallback to default FAQs
  const faqs: Faq[] = useMemo(() => {
    if (data?.data && data.data.length > 0) {
      return data.data.filter((f) => f.isActive !== false);
    }
    return DEFAULT_FAQS;
  }, [data]);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [openId, setOpenId] = useState<number | null>(1); // Open first question by default

  const categories = useMemo(() => {
    const cats = Array.from(new Set(faqs.map((f) => f.category)));
    return ['Semua', ...cats];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
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

  const toggleAccordion = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Search & Category Filter Bar */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pertanyaan atau kata kunci (contoh: Wi-Fi, QR Code, Harga)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
            Kategori:
          </span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Memuat data FAQ dari database...
          </p>
        </div>
      )}

      {/* FAQ Items Accordion */}
      {!isLoading && (
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800">
              <AlertCircle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Pertanyaan tidak ditemukan
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Coba gunakan kata kunci pencarian lain atau pilih kategori "Semua".
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/5'
                      : 'bg-white/80 dark:bg-slate-900/80 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isOpen
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <HelpCircle className="h-4 w-4" />
                      </div>
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-2">
                          {faq.category}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                    <div
                      className={`p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border-emerald-200 dark:border-emerald-800' : ''
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-0 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800/60 mt-2">
                      <p className="pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Support Banner Card */}
      <div className="rounded-3xl bg-linear-to-br from-slate-900 via-slate-950 to-emerald-950 p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-8">
        <div className="relative z-10 space-y-3 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <MessageSquare className="h-3.5 w-3.5" />
            Dukungan Pelanggan 24/7
          </div>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Belum Menemukan Jawaban Anda?
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-medium">
            Tim layanan dukungan pelanggan Kamomi.id siap membantu pertanyaan operasional dan konsultasi hunian Anda.
          </p>
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <a
            href="https://wa.me/6281234567890?text=Halo%20Kamomi.id,%20saya%20ingin%20bertanya%20mengenai%20layanan%20guestbook%20digital"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all transform hover:scale-102 active:scale-98"
          >
            <span>Chat Whatsapp Kami</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
