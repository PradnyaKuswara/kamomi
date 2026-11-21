import React from "react";
import Logo, { LogoMark } from "../../brand/Logo";
import { Avatar, Badge } from "@pradnyakuswara/ui";
import { ChevronRight, ChevronLeft, LogOut } from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  ownerAvatarLink?: string;
  ownerName: string;
  ownerEmail: string;
  ownerRole: string;
  currentPlanName: string;
  menuSections: any[];
  activeMenu: string;
  handleLogout: () => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  ownerAvatarLink,
  ownerName,
  ownerEmail,
  ownerRole,
  currentPlanName,
  menuSections,
  activeMenu,
  handleLogout,
}: SidebarProps) {
  return (
    <aside
      className={`relative z-50 transition-all duration-300 border-r border-[var(--border-color)] bg-[var(--bg-sidebar)] p-4 shrink-0 md:h-full ${isCollapsed ? "w-full md:w-20" : "w-full md:w-64"}`}
    >
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3.5 top-7 z-50 h-7 w-7 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--color-primary)] shadow-[var(--shadow-1)] transition-colors cursor-pointer"
        title={isCollapsed ? "Perlebar Sidebar" : "Kecilkan Sidebar"}
        aria-label={isCollapsed ? "Perlebar Sidebar" : "Kecilkan Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="flex flex-col justify-between h-full overflow-y-auto overflow-x-hidden no-scrollbar pr-0.5">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
            {isCollapsed ? (
              <LogoMark className="h-9 w-9" />
            ) : (
              <div className="min-w-0">
                <Logo textClassName="text-lg" />
                <span className="mt-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block truncate">
                  Smart Hospitality
                </span>
              </div>
            )}
          </div>

          {/* Profile */}
          {isCollapsed ? (
            <div className="flex justify-center py-1">
              <a href="/dashboard/settings" title={ownerName}>
                <Avatar src={ownerAvatarLink} name={ownerName} size="md" />
              </a>
            </div>
          ) : (
            <div className="p-3.5 bg-[var(--card-bg)] rounded-[var(--radius-lg)] border border-[var(--card-border)] space-y-3">
              <div className="flex items-center gap-3">
                <a href="/dashboard/settings" className="shrink-0">
                  <Avatar src={ownerAvatarLink} name={ownerName} size="md" />
                </a>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <h4 className="font-semibold text-sm text-[var(--text-primary)] leading-tight truncate">{ownerName}</h4>
                  <p className="text-xs text-[var(--text-muted)] truncate">{ownerEmail}</p>
                  <div className="pt-1">
                    <Badge variant="secondary" size="sm">{ownerRole}</Badge>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">Paket Aktif</span>
                <Badge variant={currentPlanName?.toUpperCase() === "FREE" ? "default" : "primary"} size="sm">
                  {currentPlanName}
                </Badge>
              </div>
            </div>
          )}

          {/* Navigation Menus */}
          <nav className="space-y-4">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-1.5">
                {!isCollapsed && section.items.length > 0 && (
                  <span className="px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] block mb-1">
                    {section.title}
                  </span>
                )}
                <div className="space-y-1">
                  {section.items.map((item: any) => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        title={isCollapsed ? item.label : undefined}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors ${isCollapsed ? "justify-center" : ""} ${
                          isActive
                            ? "bg-[var(--color-primary-soft)] text-[var(--color-on-primary-soft)] dark:bg-[var(--ui-primary-subtle)] dark:text-[var(--ui-primary-text)]"
                            : "text-[var(--text-secondary)] hover:bg-[var(--control-hover)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5 shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          title={isCollapsed ? "Keluar Akun" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] rounded-[var(--radius-md)] transition-colors w-full mt-6 cursor-pointer ${isCollapsed ? "justify-center" : ""}`}
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!isCollapsed && <span>Keluar Akun</span>}
        </button>
      </div>
    </aside>
  );
}
