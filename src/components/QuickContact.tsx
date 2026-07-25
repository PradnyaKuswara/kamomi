import React from 'react';
import { MessageCircle, Shield, Sparkles, Phone, MessageSquarePlus } from 'lucide-react';

interface QuickContactProps {
  contacts?: {
    role: string;
    name: string;
    actionText: string;
    color: string;
    icon?: React.ComponentType<{ className?: string }>;
    link: string;
  }[] | null;
  onOpenReport?: (() => void) | null;
}

export default function QuickContact({ 
  contacts = null,
  onOpenReport = null
}: QuickContactProps) {
  const defaultContacts = [
    {
      role: "Pengelola / Host",
      name: "Ibu Indah",
      actionText: "Chat WhatsApp",
      color: "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/10",
      icon: MessageCircle,
      link: "https://wa.me/6281234567890?text=Halo%20Ibu%20Indah%2C%20saya%20tamu%20kamar%20102..."
    },
    {
      role: "Keamanan / Security",
      name: "Pak Budi",
      actionText: "Telepon Darurat",
      color: "bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 text-white shadow-slate-900/10",
      icon: Phone,
      link: "tel:+6281234567891"
    },
    {
      role: "Layanan Laundry",
      name: "Klin Laundry",
      actionText: "Order Laundry",
      color: "bg-blue-500 hover:bg-blue-400 text-white shadow-blue-500/10",
      icon: Sparkles,
      link: "https://wa.me/6281234567892?text=Halo%20Klin%20Laundry%2C%20mau%20ambil%20laundry%20di%20kamar%20102..."
    }
  ];

  const activeContacts = contacts || defaultContacts;

  return (
    <div className="glassmorphic rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800/50">
      <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">Kontak & Hubungi</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Hubungi staf jika membutuhkan bantuan segera</p>

      <div className="space-y-4">
        {activeContacts.map((contact, idx) => {
          const Icon = contact.icon || MessageCircle;
          return (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-white/20 dark:bg-slate-900/10"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                  {contact.role}
                </span>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-200 block mt-0.5">
                  {contact.name}
                </span>
              </div>

              <a 
                href={contact.link}
                target="_blank"
                rel="noreferrer"
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-md ${contact.color}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {contact.actionText}
              </a>
            </div>
          );
        })}

        {onOpenReport && (
          <button
            onClick={onOpenReport}
            className="w-full mt-2 py-3 px-4 rounded-xl border border-dashed border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/5 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            <MessageSquarePlus className="h-4.5 w-4.5" />
            Laporkan Kerusakan / Keluhan Kamar
          </button>
        )}
      </div>
    </div>
  );
}
