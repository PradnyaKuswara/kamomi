import React from "react";
import { Alert, Button } from "@pradnyakuswara/ui";

interface SubscriptionBannerProps {
  subscriptionInfo: any;
  currentPlanName: string;
}

export default function SubscriptionBanner({ subscriptionInfo, currentPlanName }: SubscriptionBannerProps) {
  if (!subscriptionInfo.isActive && subscriptionInfo.planName !== "Free") {
    const endDate = subscriptionInfo.endDate
      ? ` pada ${new Date(subscriptionInfo.endDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}`
      : "";
    return (
      <Alert
        variant="warning"
        title="Langganan berakhir"
        className="rounded-none border-x-0 border-t-0"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Masa aktif langganan <strong>Paket {subscriptionInfo.planName}</strong> Anda telah berakhir{endDate}.
            Layanan diturunkan ke paket Free sementara.
          </span>
          <a href="/pricing">
            <Button size="sm" variant="outline">Perpanjang Sekarang →</Button>
          </a>
        </div>
      </Alert>
    );
  }

  if (currentPlanName === "Free") {
    return (
      <Alert variant="info" title="Paket Free" className="rounded-none border-x-0 border-t-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span>
            Upgrade ke <strong>Starter</strong> atau <strong>Pro</strong> untuk buka fitur kustomisasi QR,
            WhatsApp notification &amp; kuota kamar lebih besar.
          </span>
          <a href="/pricing" className="hidden md:inline-block">
            <Button size="sm">Upgrade Sekarang →</Button>
          </a>
        </div>
      </Alert>
    );
  }

  return null;
}
