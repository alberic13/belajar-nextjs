import Link from "next/link";
import { getSession } from "@/lib/session";
import { logoutUser } from "@/app/login/actions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  const email = session.email || "Admin";
  const initials = email.slice(0, 2).toUpperCase();

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

        {/* Tombol Logout di bagian bawah */}
        <div>
          <form action={logoutUser}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-rose-400 transition-colors font-medium border border-dashed border-zinc-800 hover:border-zinc-700 text-left cursor-pointer"
            >
              <span>←</span> Keluar / Logout
            </button>
          </form>
        </div>
      </aside>

      {/* Konten Kanan */}
      <div className="flex-1 flex flex-col">
        {/* Header Atas */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-md">
          <h2 className="text-zinc-400 font-medium">Selamat Datang, Admin</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center font-bold text-zinc-950 text-sm">
              {initials}
            </div>
            <span className="text-sm font-medium text-zinc-300">{email}</span>
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

