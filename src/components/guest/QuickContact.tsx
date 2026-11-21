import React from 'react';
import { Button } from '@pradnyakuswara/ui';
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
    <div className="rounded-2xl p-5 bg-[var(--bg-subtle)] border border-[var(--border-color)] shadow-xs">
      <h3 className="font-semibold text-[var(--text-primary)] text-base mb-0.5">Kontak Bantuan</h3>
      <p className="text-xs text-[var(--text-muted)] mb-4">Hubungi pengelola atau minta bantuan kamar</p>

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
              className="flex items-center justify-between p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)]"
            >
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                  {contact.role}
                </span>
                <span className="font-medium text-xs sm:text-sm text-[var(--text-primary)] block">
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
          <Button variant="outline" size="sm" fullWidth
            onClick={onOpenReport}
          >
            <MessageSquarePlus className="h-4.5 w-4.5" />
            Laporkan Kerusakan / Keluhan Kamar
          </Button>
        )}
      </div>
    </div>
  );
}
