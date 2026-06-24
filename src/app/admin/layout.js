import Link from "next/link";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      {/* Sidebar Kiri */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between p-6">
        <div>
          {/* Logo / Judul Admin */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <span className="text-2xl">🔒</span>
            <span className="font-bold text-lg tracking-wider text-white">ADMIN PANEL</span>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-800 text-white font-medium transition-colors"
            >
              <span>📊</span> Dashboard
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <span>👥</span> Kelola User
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <span>⚙️</span> Pengaturan
            </Link>
          </nav>
        </div>

        {/* Tombol Kembali ke Web Utama di bagian bawah */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-rose-400 transition-colors font-medium border border-dashed border-zinc-800 hover:border-zinc-700"
          >
            <span>←</span> Keluar Ke Web
          </Link>
        </div>
      </aside>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col">
        {/* Header Atas */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-md">
          <h2 className="text-zinc-400 font-medium">Selamat Datang, Admin</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
              AD
            </div>
            <span className="text-sm font-medium text-zinc-300">Administrator</span>
          </div>
        </header>

        {/* Area Render Halaman Halaman (page.js) */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
