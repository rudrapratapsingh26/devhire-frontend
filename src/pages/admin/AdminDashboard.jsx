import { useState, useEffect } from "react";
import { Users, Briefcase, Building2, DollarSign, Search } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/companies/pending"),
      ]);
      setStats(statsRes.data.data);
      setPendingCompanies(pendingRes.data.data.companies || []);
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/companies/${id}/approve`);
      setPendingCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to approve company", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/companies/${id}/reject`);
      setPendingCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to reject company", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      change: "+8%",
    },
    {
      label: "Active Jobs",
      value: stats?.activeJobs ?? 0,
      icon: Briefcase,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      change: "+12%",
    },
    {
      label: "Companies",
      value: stats?.totalCompanies ?? 0,
      icon: Building2,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      change: "+5%",
    },
    {
      label: "Revenue",
      value: stats?.revenue ? `$${stats.revenue.toLocaleString()}` : "$0",
      icon: DollarSign,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
      change: "+15%",
    },
  ];

  const filtered = pendingCompanies.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
          <Search size={16} className="text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg, change }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
            >
              <Icon size={20} />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-zinc-400">{label}</p>
                <p className="mt-1 text-2xl font-bold text-white">{value}</p>
              </div>
              <span className="text-xs font-semibold text-emerald-400">
                {change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending company approvals */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4">
          <h2 className="font-bold text-white">Pending Company Approvals</h2>
          <p className="text-sm text-zinc-400">
            {pendingCompanies.length} companies awaiting review
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-xl bg-zinc-800/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No pending approvals 🎉
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="pb-3 font-medium">Company</th>
                <th className="pb-3 font-medium">Industry</th>
                <th className="pb-3 font-medium">Size</th>
                <th className="pb-3 font-medium">Submitted</th>
                <th className="pb-3 font-medium">Website</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-white">
                        {company.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-white">
                        {company.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                      {company.industry || "—"}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400">{company.size || "—"}</td>
                  <td className="py-3 text-zinc-400">
                    {company.createdAt
                      ? new Date(company.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "—"}
                  </td>
                  <td className="py-3 text-zinc-400">
                    {company.website || "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(company.id)}
                        className="rounded-lg bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/30"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(company.id)}
                        className="rounded-lg bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-400 transition hover:bg-red-500/30"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-4 font-bold text-white">Recent Platform Activity</h2>
        {activity.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No recent activity
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {activity.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-zinc-300">{item.message}</span>
                <span className="text-xs text-zinc-500">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
