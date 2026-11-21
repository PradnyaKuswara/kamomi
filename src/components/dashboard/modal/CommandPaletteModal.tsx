import React from "react";
import { CommandPalette } from "@pradnyakuswara/ui";

export interface CommandMenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: CommandMenuItem[];
}

export default function CommandPaletteModal({
  isOpen,
  onOpenChange,
  menuItems,
}: CommandPaletteModalProps) {
  return (
    <CommandPalette
      open={isOpen}
      onOpenChange={onOpenChange}
      hotkey="k"
      placeholder="Ketik untuk mencari menu halaman..."
      emptyText="Tidak ada menu halaman yang sesuai."
      items={menuItems.map((item) => {
        const Icon = item.icon;
        return {
          id: item.id,
          label: item.label,
          group: "Menu Halaman",
          icon: <Icon className="h-4 w-4" />,
          onSelect: () => {
            window.location.href = item.href;
          },
        };
      })}
    />
  );
}
