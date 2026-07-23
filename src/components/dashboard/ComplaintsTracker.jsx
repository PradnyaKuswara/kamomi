import React, { useState } from 'react';

export default function ComplaintsTracker() {
  const [complaints, setComplaints] = useState([
    { id: 1, room: '102', issue: 'AC Tidak Dingin', date: '2 Jam yang lalu', status: 'Pending', category: 'Fasilitas' },
    { id: 2, room: '101', issue: 'Air Kamar Mandi Mampet', date: '1 Hari yang lalu', status: 'Selesai', category: 'Plumbing' },
  ]);

  const handleResolveComplaint = (id) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, status: 'Selesai' } : c));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
          Laporan Keluhan Kamar
        </h1>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Daftar laporan keluhan fasilitas yang dikirimkan oleh tamu melalui scan QR.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
          {complaints.map((c) => (
            <div key={c.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-900/10 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500">
                    Kamar {c.room}
                  </span>
                  <span className="text-[10px] text-slate-400">{c.date}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">{c.issue}</h4>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase">{c.category}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  c.status === 'Pending' 
                    ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400' 
                    : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400'
                }`}>
                  {c.status}
                </span>
                {c.status === 'Pending' && (
                  <button 
                    onClick={() => handleResolveComplaint(c.id)}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-bold text-xs transition-all shadow-md shadow-cyan-500/10"
                  >
                    Tandai Selesai
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
