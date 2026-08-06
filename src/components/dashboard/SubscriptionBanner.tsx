import React from "react";

interface SubscriptionBannerProps {
  subscriptionInfo: any;
  currentPlanName: string;
}

export default function SubscriptionBanner({ subscriptionInfo, currentPlanName }: SubscriptionBannerProps) {
  if (!subscriptionInfo.isActive && subscriptionInfo.planName !== "Free") {
    return (
      <div className="bg-amber-600 px-4 py-2.5 text-center text-xs font-bold text-white relative flex items-center justify-center gap-2 shadow-sm">
        <span>
          ⚠️ Masa aktif langganan **Paket {subscriptionInfo.planName}** Anda
          telah berakhir{" "}
          {subscriptionInfo.endDate
            ? `pada ${new Date(subscriptionInfo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
            : ""}
          . Layanan diturunkan ke paket Free sementara.
        </span>
        <a
          href="/pricing"
          className="inline-flex items-center gap-1 bg-white text-amber-900 hover:bg-slate-50 px-3 py-1 rounded-lg transition-all ml-3 font-extrabold text-[11px] shadow-sm"
        >
          Perpanjang Sekarang →
        </a>
      </div>
    );
  }

  if (currentPlanName === "Free") {
    return (
      <div className="bg-gradient-to-r from-cyan-700 via-cyan-600 to-blue-700 px-4 py-2.5 text-center text-xs font-bold text-white relative flex items-center justify-center gap-2 shadow-sm">
        <span>
          🚀 Anda saat ini menggunakan <strong>Paket Free</strong>. Upgrade
          ke <strong>Starter</strong> atau <strong>Pro</strong> untuk buka
          fitur kustomisasi QR, WhatsApp notification & kuota kamar lebih
          besar!
        </span>
        <a
          href="/pricing"
          className="hidden md:inline-flex items-center gap-1 bg-white text-cyan-800 hover:bg-cyan-50 px-3 py-1 rounded-lg transition-all ml-3 font-extrabold text-[11px] shadow-sm"
        >
          Upgrade Sekarang →
        </a>
      </div>
    );
  }

  return null;
}
