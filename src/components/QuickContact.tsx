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
    <div className="glassmorphic rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-800/50">
      <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1">Kontak & Hubungi</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">Hubungi staf jika membutuhkan bantuan segera</p>

      <div className="space-y-4">
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
