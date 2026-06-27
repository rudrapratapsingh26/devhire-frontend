import { useState, useEffect } from "react";
import { Search, ExternalLink } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../utils/axios";

const statusStyles = {
  APPLIED: "bg-blue-500/15 text-blue-400",
  REVIEWING: "bg-amber-500/15 text-amber-400",
  ACCEPTED: "bg-emerald-500/15 text-emerald-400",
  REJECTED: "bg-red-500/15 text-red-400",
};

const scoreColor = (score) => {
  if (score >= 85) return "bg-emerald-500/15 text-emerald-400";
  if (score >= 70) return "bg-blue-500/15 text-blue-400";
  if (score >= 50) return "bg-amber-500/15 text-amber-400";
  return "bg-red-500/15 text-red-400";
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Total");

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get("/applications/my");
      setApplications(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch applications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const counts = {
    Total: applications.length,
    APPLIED: applications.filter((a) => a.status === "APPLIED").length,
    REVIEWING: applications.filter((a) => a.status === "REVIEWING").length,
    ACCEPTED: applications.filter((a) => a.status === "ACCEPTED").length,
    REJECTED: applications.filter((a) => a.status === "REJECTED").length,
  };

  const filtered = applications
    .filter((app) => activeFilter === "Total" || app.status === activeFilter)
    .filter((app) =>
      app.job?.title?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <CandidateLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Applications</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {applications.length} applications tracked
        </p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
        <Search size={18} className="shrink-0 text-zinc-500" />
        <input
          type="text"
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
        />
      </div>

      {/* Status filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
              activeFilter === status
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-zinc-300 hover:border-zinc-600"
            }`}
          >
            {status}
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                activeFilter === status
                  ? "bg-accent text-white"
                  : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
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
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-semibold text-white">No applications found</p>
            <p className="mt-1 text-sm text-zinc-400">
              Try a different filter or search term
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Job Title</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Applied Date</th>
                <th className="px-5 py-3 font-medium">AI Score</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border last:border-0 hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4 font-semibold text-white">
                    {app.job?.title}
                  </td>
                  <td className="px-5 py-4 text-zinc-300">
                    {app.job?.company?.name}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {new Date(app.appliedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
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
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[app.status] || "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`/candidate/jobs/${app.jobId}`}
                      className="text-zinc-400 transition hover:text-accent"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CandidateLayout>
  );
};

export default MyApplications;