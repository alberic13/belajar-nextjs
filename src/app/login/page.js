"use client";

import { useState, useActionState, useEffect } from "react";
import { loginUser, registerUser } from "./actions";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  // Menggunakan React 19 useActionState untuk form handler
  const [loginState, loginAction, loginPending] = useActionState(loginUser, null);
  const [registerState, registerAction, registerPending] = useActionState(registerUser, null);

  const state = isRegister ? registerState : loginState;
  const formAction = isRegister ? registerAction : loginAction;
  const pending = isRegister ? registerPending : loginPending;

  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white text-xl shadow-lg shadow-violet-500/20">
          {isRegister ? "📝" : "✨"}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white transition-all">
          {isRegister ? "Daftar Akun Baru" : "Selamat Datang Kembali"}
        </h1>
        <p className="text-sm text-zinc-400">
          {isRegister
            ? "Lengkapi email dan password untuk mendaftar"
            : "Silakan masuk ke akun Anda untuk melanjutkan"}
        </p>
      </div>

      {/* Alert status sukses/gagal dari database */}
      {state && (
        <div
          className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${
            state.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4">
        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
            Alamat Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            className="w-full h-11 px-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder-zinc-600 text-sm outline-none transition-all"
            required
          />
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Kata Sandi
            </label>
            {!isRegister && (
              <a href="#" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                Lupa Sandi?
              </a>
            )}
          </div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full h-11 px-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-white placeholder-zinc-600 text-sm outline-none transition-all"
            required
          />
        </div>

        {/* Remember Me (Hanya muncul saat login) */}
        {!isRegister && (
          <div className="flex items-center gap-2 py-1">
            <input
              id="remember-me"
              type="checkbox"
              className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-violet-500 focus:ring-offset-zinc-900"
            />
            <label htmlFor="remember-me" className="text-xs text-zinc-400 select-none">
              Ingat saya di perangkat ini
            </label>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium text-sm shadow-lg shadow-violet-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
          {pending ? "Memproses..." : isRegister ? "Daftar Akun" : "Masuk"}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-xs text-zinc-500">
          {isRegister ? "Sudah punya akun? " : "Belum punya akun? "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-violet-400 hover:text-violet-300 transition-colors font-medium cursor-pointer bg-transparent border-none outline-none p-0"
          >
            {isRegister ? "Masuk Sekarang" : "Daftar Sekarang"}
          </button>
        </p>
      </div>
    </div>
  );
}
