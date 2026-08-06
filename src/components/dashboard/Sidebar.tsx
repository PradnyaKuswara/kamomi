import React from "react";
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
      className={`relative z-50 transition-all duration-300 border-r border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/40 backdrop-blur-md p-4 flex flex-col justify-between shrink-0 ${
        isCollapsed ? "w-full md:w-20" : "w-full md:w-64"
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="hidden md:flex absolute -right-3.5 top-7 z-[999999] h-7 w-7 items-center justify-center rounded-full border border-slate-200/60 dark:border-slate-800/60 bg-white/90 dark:bg-slate-900/90 text-slate-500 hover:text-cyan-500 shadow-md hover:scale-105 transition-all cursor-pointer"
        title={isCollapsed ? "Perlebar Sidebar" : "Kecilkan Sidebar"}
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      <div className="space-y-6">
        {/* Brand Logo */}
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-cyan-500/20 blur-md rounded-xl"></div>
            <img
              src="/logo.png"
              alt="Kamomi Logo"
              className="h-9 w-9 object-contain rounded-xl shadow-md relative z-10"
            />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-lg font-black tracking-tight text-cyan-600 dark:text-cyan-400 block truncate">
                Kamomi
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-0.5">
                  .id
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold block truncate">
                Guestbook Manager
              </span>
            </div>
          )}
        </div>

        {/* Profile Info Card */}
        {isCollapsed ? (
          <div className="flex justify-center py-1">
            <a href="/dashboard/settings" className="block shrink-0 relative group">
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 z-20 shadow-sm animate-pulse" />
              <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              {ownerAvatarLink ? (
                <img
                  src={ownerAvatarLink}
                  alt={ownerName}
                  className="h-10 w-10 aspect-square rounded-full object-cover object-center bg-cyan-600 shadow-md relative z-10 border border-white/50 dark:border-slate-800/50"
                  title={ownerName}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="h-10 w-10 aspect-square rounded-full bg-gradient-to-br from-cyan-500 to-indigo-650 flex items-center justify-center text-white font-extrabold text-sm shadow-md relative z-10 border border-white/50 dark:border-slate-800/50"
                  title={ownerName}
                >
                  {ownerName?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </a>
          </div>
        ) : (
          <div
            className="p-3.5 bg-gradient-to-b from-white/85 to-white/45 dark:from-slate-900/90 dark:to-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] dark:shadow-none transition-all duration-300 hover:border-cyan-500/20 hover:shadow-[0_8px_30px_rgba(6,182,212,0.04)] space-y-3"
          >
            <div className="flex items-center gap-3">
              <a href="/dashboard/settings" className="block shrink-0 relative group">
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950 z-20 shadow-sm animate-pulse" />
                <div className="absolute -inset-1 bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
                {ownerAvatarLink ? (
                  <img
                    src={ownerAvatarLink}
                    alt={ownerName}
                    className="h-10 w-10 aspect-square rounded-full object-cover object-center bg-cyan-600 shadow-md relative z-10 border border-white/50 dark:border-slate-800/50"
                    title={ownerName}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="h-10 w-10 aspect-square rounded-full bg-gradient-to-br from-cyan-500 to-indigo-650 flex items-center justify-center text-white font-extrabold text-sm shadow-md relative z-10 border border-white/50 dark:border-slate-800/50"
                    title={ownerName}
                  >
                    {ownerName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
              </a>

              <div className="min-w-0 flex-1 space-y-0.5">
                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white tracking-tight leading-none truncate">
                  {ownerName}
                </h4>
                <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate leading-none">
                  {ownerEmail}
                </p>
                <div className="pt-1">
                  <span className="inline-flex px-1.5 py-0.5 rounded-md text-[8px] font-extrabold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 uppercase tracking-widest leading-none">
                    {ownerRole}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Paket Aktif</span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-wider transition-all duration-300 ${
                currentPlanName?.toUpperCase() === 'FREE' 
                  ? 'bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50'
                  : 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400 border-cyan-500/20 dark:border-cyan-400/20 shadow-xs shadow-cyan-500/10'
              }`}>
                {currentPlanName}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menus */}
        <nav className="space-y-4">
          {menuSections.map((section) => (
            <div key={section.title} className="space-y-1.5">
              {!isCollapsed && section.items.length > 0 && (
                <span className="px-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-1">
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
                      className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                        isCollapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 dark:from-cyan-500/10 dark:to-transparent text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 dark:border-cyan-500/10 shadow-[0_0_16px_rgba(6,182,212,0.06)]"
                          : "text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-900/30 hover:text-slate-900 dark:hover:text-white border border-transparent"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                      )}
                      <Icon
                        className={`h-4.5 w-4.5 shrink-0 transition-transform duration-200 ${isActive ? "text-cyan-600 dark:text-cyan-400 scale-105" : "group-hover:scale-105"}`}
                      />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        title={isCollapsed ? "Keluar Akun" : undefined}
        className={`flex items-center gap-3.5 px-3.5 py-2.5 text-sm font-semibold text-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 border border-transparent hover:border-rose-500/10 rounded-xl transition-all w-full mt-6 ${
          isCollapsed ? "justify-center" : ""
        }`}
      >
        <LogOut className="h-4.5 w-4.5 shrink-0" />
        {!isCollapsed && <span>Keluar Akun</span>}
      </button>
    </aside>
  );
}
