import React from 'react';
import { 
  MessageCircle, 
  Shield, 
  Sparkles, 
  Phone, 
  MessageSquarePlus,
  Mail,
  Link,
  MessageSquare
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageCircle,
  Shield,
  Sparkles,
  Phone,
  MessageSquarePlus,
  Mail,
  Link,
  MessageSquare
};

interface QuickContactProps {
  contacts?: {
    role: string;
    name: string;
    actionText: string;
    color: string;
    icon?: string | React.ComponentType<{ className?: string }>;
    link: string;
  }[] | null;
  onOpenReport?: (() => void) | null;
}

export default function QuickContact({ 
  contacts = null,
  onOpenReport = null
}: QuickContactProps) {

  const activeContacts = contacts || [];

  return (
    <div className="rounded-2xl p-5 bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 shadow-xs">
      <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-0.5">Kontak Bantuan</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Hubungi pengelola atau minta bantuan kamar</p>

      <div className="space-y-2.5">
        {activeContacts.map((contact, idx) => {
          let Icon: React.ComponentType<{ className?: string }> = MessageCircle;
          if (contact.icon) {
            if (typeof contact.icon === 'string') {
              const matchedIcon = iconMap[contact.icon] || iconMap[contact.icon.charAt(0).toUpperCase() + contact.icon.slice(1)];
              if (matchedIcon) {
                Icon = matchedIcon;
              }
            } else {
              Icon = contact.icon;
            }
          }
          return (
            <div 
              key={idx} 
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/50 bg-white dark:bg-slate-950"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                  {contact.role}
                </span>
                <span className="font-medium text-xs sm:text-sm text-slate-800 dark:text-slate-200 block">
                  {contact.name}
                </span>
              </div>

              <a 
                href={contact.link}
                target="_blank"
                rel="noreferrer"
                className={`px-3.5 py-2 text-xs font-medium rounded-xl flex items-center gap-1.5 transition-all shadow-xs ${contact.color}`}
              >
                <Icon className="h-4 w-4" />
                {contact.actionText}
              </a>
            </div>
          );
        })}

        {onOpenReport && (
          <button
            onClick={onOpenReport}
            className="w-full mt-2 py-3 px-4 rounded-xl border border-dashed border-emerald-500/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer bg-emerald-50/50 dark:bg-emerald-950/20"
          >
            <MessageSquarePlus className="h-4.5 w-4.5" />
            Laporkan Kerusakan / Keluhan Kamar
          </button>
        )}
      </div>
    </div>
  );
}
