export default function LoginLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50 font-sans relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/20 blur-[120px] pointer-events-none"></div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-md p-6">
        {children}
      </div>
    </div>
  );
}
