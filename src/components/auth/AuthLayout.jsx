import { Briefcase, Sparkles } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-accent/20 blur-[120px]" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-3 px-6 sm:px-10 pt-8">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Briefcase size={18} strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-white">DevHire</span>
        <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-violet-300">
          <Sparkles size={12} />
          AI Powered
        </span>
      </div>

      {/* Card */}
      <div className="relative z-10 flex min-h-[calc(100vh-88px)] items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface/80 p-8 shadow-2xl shadow-black/40 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
