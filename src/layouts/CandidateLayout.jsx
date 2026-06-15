import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Briefcase,
  Bookmark,
  FileText,
  Wand2,
  User,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/candidate/jobs", icon: LayoutDashboard, label: "Job Feed" },
  { to: "/candidate/applications", icon: FileText, label: "My Applications" },
  { to: "/candidate/saved", icon: Bookmark, label: "Saved Jobs" },
  { to: "/candidate/ai-tools", icon: Wand2, label: "AI Tools" },
  { to: "/candidate/profile", icon: User, label: "Profile" },
];

const CandidateLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-bg text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-border bg-surface px-4 py-6">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white">DevHire</span>
          <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-violet-300">
            AI
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom - user + logout */}
        <div className="border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
              {user?.fullName?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                {user?.fullName || "Candidate"}
              </span>
              <span className="text-xs text-zinc-500">Candidate</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
};

export default CandidateLayout;
