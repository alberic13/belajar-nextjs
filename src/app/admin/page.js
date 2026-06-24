export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Kartu Selamat Datang */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Utama</h1>
        <p className="text-zinc-400">
          Semua komponen halaman ini dirender di dalam <code className="text-amber-400 bg-zinc-800 px-2 py-0.5 rounded text-sm">src/app/admin/page.js</code> dan secara otomatis dibungkus oleh layout khusus admin dengan Sidebar di sebelah kiri.
        </p>
      </div>

      {/* Baris Statistik Kustom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-md">
          <div className="text-zinc-500 text-sm font-medium mb-1">Total Pengguna</div>
          <div className="text-3xl font-bold text-white">1,248</div>
          <div className="text-emerald-500 text-xs mt-2">▲ +12% minggu ini</div>
        </div>
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-md">
          <div className="text-zinc-500 text-sm font-medium mb-1">Transaksi Aktif</div>
          <div className="text-3xl font-bold text-white">85</div>
          <div className="text-emerald-500 text-xs mt-2">▲ +4% dari kemarin</div>
        </div>
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 shadow-md">
          <div className="text-zinc-500 text-sm font-medium mb-1">Keamanan Sistem</div>
          <div className="text-3xl font-bold text-emerald-400">Optimal</div>
          <div className="text-zinc-500 text-xs mt-2">Semua sistem berjalan normal</div>
        </div>
      </div>
    </div>
  );
}

