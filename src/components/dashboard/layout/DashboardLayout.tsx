import React, { useState, useEffect, useRef } from "react";
import {
  DoorClosed,
  FileText,
  AlertTriangle,
  HelpCircle,
  LogOut,
  Bell,
  MessageSquare,
  QrCode,
  ChevronLeft,
  ChevronRight,
  Settings,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useUserData } from "../../../hooks/useUserData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCheckMeMutation, useLogoutMutation } from "../../../rest/useCheckMe";
import { useUserSidebarMenusQuery } from "../../../rest/useMenu";
import ToastContainer from "../../layout/ToastContainer";
import PropertyWizardModal from "../modal/PropertyWizardModal";
import { ROLES } from "../../../types/role";
import ConfirmationModal from "../../modal/ConfirmationModal";
import type { MenuSection } from "../../../types/menu";
import LoadingState from "../view/LoadingState";
import AccessBlockedScreen from "../view/AccessBlockedScreen";
import SubscriptionBanner from "../view/SubscriptionBanner";
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import CommandPaletteModal from '../modal/CommandPaletteModal';
import { useNotificationSse } from "../../../rest/useNotificationSse";
import RightSidebar from "../sidebar/RightSidebar";

import { queryClient } from "../../../rest/queryClient";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeMenu: string;
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLayoutContent {...props} />
      <ToastContainer />
    </QueryClientProvider>
  );
}

function DashboardLayoutContent({
  children,
  activeMenu,
}: DashboardLayoutProps) {
  useNotificationSse();
  const [isVerifying, setIsVerifying] = useState(true);

  const { user, subscriptionInfo, setUserData, clearUserData } = useUserData();
  const ownerName = user.name || "System";
  const ownerEmail = user.email || "system@gmail.com";
  const ownerRole = user.roleName || "System";
  const ownerAvatarLink = user.avatarUrl;
  const [activeNotification, setActiveNotification] = useState(true);

  const hasCachedMenus = typeof window !== "undefined" && !!sessionStorage.getItem("cached_sidebar_menus");
  const { data: menuResponse } = useUserSidebarMenusQuery(hasCachedMenus ? undefined : user?.id);

  const [menus, setMenus] = useState<MenuSection[]>(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("cached_sidebar_menus");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (menuResponse?.success && menuResponse.data) {
      setMenus(menuResponse.data);
      sessionStorage.setItem("cached_sidebar_menus", JSON.stringify(menuResponse.data));
    }
  }, [menuResponse]);

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { mutateAsync: checkMe } = useCheckMeMutation();
  const { mutateAsync: logout } = useLogoutMutation();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    async function verifyAuth() {
      const token = localStorage.getItem("AUTH_TOKEN");
      if (!token) {
        clearUserData();
        localStorage.removeItem("user_logged_in");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await checkMe();
        if (res.success && res.data) {
          const userProperties = res.data.properties || [];
          const userData = {
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
            avatarUrl: res.data.avatarUrl,
            roleName: res.data.roleName,
            isEmailVerified: res.data.isEmailVerified ?? false,
            isActive: res.data.isActive ?? true,
            subscription: res.data.subscription,
            properties: userProperties,
            isLoggedIn: true,
          };
          setUserData(userData);
          sessionStorage.setItem("cached_user_data", JSON.stringify(userData));

          const hasProperty = userProperties.length > 0;
          const userRole = res.data.roleName;
          const userIsAdmin =
            userRole === "ADMIN" || userRole === "SUPER_ADMIN";
          if (hasProperty) {
            setShowPropertyModal(false);
          } else {
            if (userIsAdmin) {
              setShowPropertyModal(true);
            } else {
              setShowPropertyModal(false);
            }
          }
          setIsVerifying(false);
        } else {
          throw new Error("Invalid session");
        }
      } catch {
        clearUserData();
        sessionStorage.removeItem("cached_user_data");
        sessionStorage.removeItem("cached_sidebar_menus");
        localStorage.removeItem("AUTH_TOKEN");
        localStorage.removeItem("user_logged_in");
        window.location.href = "/login";
      }
    }

    verifyAuth();
  }, []);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (e) {
      console.error(e);
    } finally {
      clearUserData();
      sessionStorage.removeItem("cached_user_data");
      sessionStorage.removeItem("cached_sidebar_menus");
      localStorage.removeItem("AUTH_TOKEN");
      localStorage.removeItem("user_logged_in");
      window.location.href = "/login";
    }
  };

  const handleLogoutTrigger = () => {
    setShowLogoutModal(true);
  };

  if (isVerifying) {
    return <LoadingState />;
  }

  const userIsAdmin =
    user?.roleName === ROLES.ADMIN || user?.roleName === ROLES.SUPER_ADMIN;
  const hasNoProperty = !user?.properties || user.properties.length === 0;

  if (hasNoProperty && !userIsAdmin) {
    return <AccessBlockedScreen handleLogout={handleLogoutTrigger} />;
  }

  const currentPlanName = subscriptionInfo.planName;

  const fetchedMenus = menus;

    const getIconComponent = (iconName: string) => {
    const normalized = iconName.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (normalized === "dooropen" || normalized === "room") return DoorClosed;
    if (normalized === "rules") return FileText;
    if (normalized === "settingsaccount") return Settings;
    if (normalized === "faq") return HelpCircle;
    if (normalized === "complaints") return AlertTriangle;
    if (normalized === "bookopen" || normalized === "guides") return LucideIcons.BookOpen;

    const foundKey = Object.keys(LucideIcons).find(
      (key) => key.toLowerCase() === normalized,
    );
    if (foundKey) {
      return (LucideIcons as any)[foundKey];
    }
    return HelpCircle;
  };

  const getMenuId = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]/g, "");
  };

  const menuSections = fetchedMenus.map((section) => ({
    title: section.title,
    orderNo: section.orderNo,
    items: section.menus.map((m) => ({
      id: getMenuId(m.title),
      label: m.title,
      icon: getIconComponent(m.icon),
      href: m.url,
    })),
  }));

  const allMenuItems = menuSections.flatMap((section) => section.items);

  const activePageItem = allMenuItems.find((item) => item.id === activeMenu);
  const pageTitle = activePageItem ? activePageItem.label : "Dashboard";

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col font-sans transition-colors duration-300">
      <SubscriptionBanner subscriptionInfo={subscriptionInfo} currentPlanName={currentPlanName} />

      <div className="flex-1 flex flex-col md:flex-row w-full mx-auto md:min-h-0 md:overflow-hidden">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          ownerAvatarLink={ownerAvatarLink}
          ownerName={ownerName}
          ownerEmail={ownerEmail}
          ownerRole={ownerRole}
          currentPlanName={currentPlanName}
          menuSections={menuSections}
          activeMenu={activeMenu}
          handleLogout={handleLogoutTrigger}
        />

        {/* MAIN BODY AREA WITH TOPBAR */}
        <div className="flex-1 flex flex-col min-w-0 md:h-full md:min-h-0 md:overflow-hidden">
          <Topbar pageTitle={pageTitle} setIsCommandPaletteOpen={setIsCommandPaletteOpen} />

          {/* MAIN CENTER CONTENT AREA */}
          <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
            {children}
          </main>
        </div>

        {/* RIGHT SIDEBAR - NOTIFICATIONS & TIPS */}
        {activeMenu === "dashboard" && (
          <RightSidebar
            activeNotification={activeNotification}
            setActiveNotification={setActiveNotification}
          />
        )}
      </div>

      {/* Floating WhatsApp Button for Support */}
      <a
        href="https://wa.me/6281234567890?text=Halo%20Kamomi%2C%20saya%20butuh%20bantuan%20setup%20kost"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 p-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full shadow-lg hover:scale-105 transition-all z-50 flex items-center justify-center"
        title="Hubungi Bantuan WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>

      {showPropertyModal && (
        <PropertyWizardModal
          onComplete={() => {
            setShowPropertyModal(false);
          }}
        />
      )}

      {/* COMMAND PALETTE MODAL (Blur Backdrop & Centered) */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        menuItems={allMenuItems}
      />

      {/* LOGOUT CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => !isLoggingOut && setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Keluar Akun"
        message="Apakah Anda yakin ingin keluar dari akun Anda? Sesi Anda pada perangkat ini akan segera berakhir."
        confirmText="Keluar"
        cancelText="Batal"
        isDanger={true}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
