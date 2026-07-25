import { useState } from 'react';

export default function RoomsList() {
  const [rooms, setRooms] = useState([
    {
      id: '101',
      name: 'Kamar 101',
      ssid: 'AdemTentrem_101',
      scans: 42,
      status: 'Aktif',
    },
    {
      id: '102',
      name: 'Kamar 102',
      ssid: 'AdemTentrem_102',
      scans: 89,
      status: 'Aktif',
    },
    {
      id: '103',
      name: 'Kamar 103',
      ssid: 'AdemTentrem_103',
      scans: 12,
      status: 'Aktif',
    },
    {
      id: '104',
      name: 'Kamar 104',
      ssid: 'AdemTentrem_104',
      scans: 0,
      status: 'Draf',
    },
    {
      id: '105',
      name: 'Kamar 105',
      ssid: 'AdemTentrem_105',
      scans: 0,
      status: 'Draf',
    },
  ]);

  const handleAddRoom = () => {
    const num = prompt('Masukkan Nomor Kamar Baru:', '106');
    if (num) {
      setRooms([
        ...rooms,
        {
          id: num,
          name: `Kamar ${num}`,
          ssid: `AdemTentrem_${num}`,
          scans: 0,
          status: 'Draf',
        },
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">
            Daftar Kamar & Link QR
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Kelola informasi Wi-Fi, tata tertib, dan ekspor stiker QR untuk
            setiap kamar.
          </p>
        </div>

        <button
          onClick={handleAddRoom}
          className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/10 hover:opacity-90 transition-all self-start sm:self-center"
        >
          Tambah Kamar Baru
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900/40 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[9px] uppercase font-bold tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/40 border-b border-slate-200/50 dark:border-slate-800/50">
              <tr>
                <th className="px-6 py-4">Nomor Kamar</th>
                <th className="px-6 py-4">SSID Wi-Fi</th>
                <th className="px-6 py-4">Total Scan</th>
                <th className="px-6 py-4">Status QR</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-slate-800/50">
              {rooms.map((room) => (
                <tr
                  key={room.id}
                  className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                    {room.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono">
                    {room.ssid}
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {room.scans} kali
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[9px] ${
                        room.status === 'Aktif'
                          ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <a
                      href={`/editor?room=${room.id}`}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-all"
                    >
                      Edit & Cetak QR
                    </a>
                    <a
                      href={`/guest?room=${room.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 font-bold transition-all"
                    >
                      Buka Link Guest
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
