import React, { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../rest/queryClient';
import WiFiCard from './WiFiCard.tsx';
import HouseRules from './HouseRules.tsx';
import FacilityGuides from './FacilityGuides.tsx';
import QuickContact from './QuickContact.tsx';
import ReportIssue from './ReportIssue.tsx';
import { AlertCircle, ShieldAlert } from 'lucide-react';

function GuestRoomInner() {
  const [roomNumber, setRoomNumber] = useState('102');
  const [propertyName, setPropertyName] = useState('Kost Adem Tentrem');
  const [wifiSsid, setWifiSsid] = useState('AdemTentrem_102');
  const [wifiPass, setWifiPass] = useState('supersecurepass');
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    const parseParams = () => {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      const propParam = params.get('prop');
      const ssidParam = params.get('ssid');
      const passParam = params.get('pass');

      if (roomParam) setRoomNumber(roomParam);
      if (propParam) setPropertyName(propParam);

      if (ssidParam) {
        setWifiSsid(ssidParam);
      } else if (roomParam && propParam) {
        setWifiSsid(`${propParam.replace(/\s+/g, '')}_${roomParam}`);
      } else if (roomParam) {
        setWifiSsid(`AdemTentrem_${roomParam}`);
      }

      if (passParam) setWifiPass(passParam);
    };

    parseParams();

    window.addEventListener('popstate', parseParams);
    window.addEventListener('room-change', parseParams);

    return () => {
      window.removeEventListener('popstate', parseParams);
      window.removeEventListener('room-change', parseParams);
    };
  }, []);

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="glassmorphic rounded-3xl p-6 border border-[var(--border-color)] text-center relative overflow-hidden shadow-xl">
        <div className="absolute -top-12 -right-12 h-24 w-24 bg-cyan-600/15 rounded-full blur-2xl pointer-events-none"></div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--primary-accent)] ">
          Selamat Datang di
        </span>
        <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight mt-1">
          {propertyName}
        </h2>
        <div className="inline-flex mt-4 px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] font-extrabold text-xs tracking-wider uppercase">
          Kamar {roomNumber}
        </div>
      </div>

      {/* Wifi Info */}
      <WiFiCard ssid={wifiSsid} password={wifiPass} />

      {/* House Rules */}
      <HouseRules />

      {/* Facility Instructions */}
      <FacilityGuides />

      {/* Support & Quick Contact */}
      <QuickContact onOpenReport={() => setReportOpen(true)} />

      {/* Issue Report Modal */}
      <ReportIssue
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        roomNumber={roomNumber}
      />
    </div>
  );
}

export default function GuestRoom() {
  return (
    <QueryClientProvider client={queryClient}>
      <GuestRoomInner />
    </QueryClientProvider>
  );
}
