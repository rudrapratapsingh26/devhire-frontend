import { Link } from "react-router-dom";
import { Briefcase, Sparkles, Zap, FileText, Target } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-border px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white">DevHire</span>
        </div>
        <div className="hidden items-center gap-8 md:flex">
          <a href="#" className="text-sm text-zinc-400 hover:text-white">
            For Candidates
          </a>
          <a href="#" className="text-sm text-zinc-400 hover:text-white">
            For Companies
          </a>
          <a href="#" className="text-sm text-zinc-400 hover:text-white">
            Pricing
          </a>
          <a href="#" className="text-sm text-zinc-400 hover:text-white">
            Blog
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-zinc-300 hover:text-white"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-8 py-24 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={14} />
            Now with AI Cover Letter Generator
          </div>
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
            Find Your Next Dev
            <br />
            Role. <span className="text-accent">Faster.</span>
          </h1>
          <p className="mb-8 text-lg text-zinc-400">
            DevHire connects top engineering talent with world-class companies —
            powered by AI matching and smart filters.
          </p>

          {/* Search bar */}
          <div className="mx-auto mb-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-surface p-2">
            <div className="flex flex-1 items-center gap-3 px-3">
              <Target size={18} className="text-zinc-500" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
            </div>
            <Link
              to="/candidate/jobs"
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Search Jobs
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/candidate/jobs"
              className="flex items-center gap-2 rounded-xl bg-accent/10 border border-accent/20 px-5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/20"
            >
              <Briefcase size={16} />
              Browse Jobs
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mx-auto max-w-5xl px-8 pb-24">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {[
            {
              icon: Zap,
              title: "AI Job Matching",
              desc: "Our AI analyzes your skills and experience to surface roles that genuinely fit, ranked by relevance.",
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              icon: FileText,
              title: "AI Cover Letter Generator",
              desc: "Generate tailored, professional cover letters in seconds — customized to each job description.",
              color: "text-violet-400",
              bg: "bg-violet-500/10",
            },
            {
              icon: Target,
              title: "Smart Filters & Salary Insights",
              desc: "Filter by stack, salary, and remote options with transparent compensation data for every listing.",
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
          ].map(({ icon: Icon, title, desc, color, bg }) => (
            <div
              key={title}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <div
                className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
              >
                <Icon size={20} />
              </div>
              <h3 className="mb-2 font-bold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Briefcase size={12} />
            </div>
            <span className="text-sm text-zinc-400">
              © 2025 DevHire. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-zinc-500 hover:text-white">
              Privacy
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white">
              Terms
            </a>
            <a href="#" className="text-sm text-zinc-500 hover:text-white">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
