import React from "react";
import { Button, Card, CardContent, EmptyState } from "@pradnyakuswara/ui";
import { ShieldAlert, LogOut } from "lucide-react";

interface AccessBlockedScreenProps {
  handleLogout: () => void;
}

export default function AccessBlockedScreen({ handleLogout }: AccessBlockedScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent>
          <EmptyState
            icon={<ShieldAlert className="h-8 w-8" />}
            title="Akses Belum Aktif"
            description="Akun Anda belum terhubung ke properti manapun. Harap hubungi Admin atau Pengelola properti Anda untuk mendaftarkan email Anda ke hunian dan kamar yang sesuai."
            action={
              <Button variant="outline" onClick={handleLogout} leftIcon={<LogOut className="h-4 w-4" />}>
                Keluar Akun
              </Button>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
