import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/companies", icon: Building2, label: "Companies" },
  { to: "/admin/candidates", icon: Users, label: "Candidates" },
  { to: "/admin/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/admin/reports", icon: BarChart2, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-bg text-white">
      <aside className="fixed left-0 top-0 flex h-screen w-60 flex-col border-r border-border bg-surface px-4 py-6">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Briefcase size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold text-white">DevHire</span>
          <span className="ml-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
            Admin
          </span>
        </div>

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

        <div className="border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-2 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">
              AD
            </div>
            <span className="text-sm text-zinc-400">System healthy</span>
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

      <main className="ml-60 flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
