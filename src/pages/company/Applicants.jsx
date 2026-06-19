import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CompanyLayout from "../../layouts/CompanyLayout";
import api from "../../utils/axios";

const statusOptions = ["All", "Applied", "Reviewing", "Accepted", "Rejected"];

const statusStyles = {
  Applied: "bg-blue-500/15 text-blue-400",
  Reviewing: "bg-amber-500/15 text-amber-400",
  Accepted: "bg-emerald-500/15 text-emerald-400",
  Rejected: "bg-red-500/15 text-red-400",
};

const scoreColor = (score) => {
  if (score >= 85) return "bg-emerald-500/15 text-emerald-400";
  if (score >= 70) return "bg-blue-500/15 text-blue-400";
  if (score >= 50) return "bg-amber-500/15 text-amber-400";
  return "bg-red-500/15 text-red-400";
};

const Applicants = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/job/all");
      const apps = res.data.data.applications || [];
      apps.sort((a, b) => (b.aiScore ?? 0) - (a.aiScore ?? 0));
      setApplications(apps);
    } catch (err) {
      console.error("Failed to fetch applicants", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status } : app))
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filtered = applications
    .filter((app) => statusFilter === "All" || app.status === statusFilter)
    .filter(
      (app) =>
        app.candidate?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <CompanyLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Applicants</h1>
        <p className="mt-1 text-sm text-zinc-400">Ranked by AI match score</p>
      </div>

      {/* Search + filter */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
          <Search size={18} className="shrink-0 text-zinc-500" />
          <input
            type="text"
            placeholder="Search candidates or roles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {loading ? (
          <div className="flex flex-col gap-3 p-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-zinc-800/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-500">
            No applicants found
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Candidate</th>
                <th className="px-5 py-3 font-medium">Applied Role</th>
                <th className="px-5 py-3 font-medium">AI Score</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Applied Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border last:border-0 hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                        {app.candidate?.fullName?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium text-white">
                        {app.candidate?.fullName || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-300">{app.job?.title}</td>
                  <td className="px-5 py-4">
                    {app.aiScore != null && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-bold ${scoreColor(
                          app.aiScore
                        )}`}
                      >
                        {app.aiScore}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${
                        statusStyles[app.status] || "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {["Applied", "Reviewing", "Accepted", "Rejected"].map(
                        (s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => navigate(`/company/applicants/${app.id}`)}
                      className="text-xs font-medium text-accent hover:underline"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CompanyLayout>
  );
};

export default Applicants;
