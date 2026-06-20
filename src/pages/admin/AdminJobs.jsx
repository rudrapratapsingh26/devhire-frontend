import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/jobs");
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = jobs.filter(
    (j) =>
      j.title?.toLowerCase().includes(search.toLowerCase()) ||
      j.company?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Jobs</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {jobs.length} jobs on the platform
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
        <Search size={18} className="shrink-0 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by title or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {loading ? (
          <div className="flex flex-col gap-3 p-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-zinc-800/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-500">
            No jobs found
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Job Title</th>
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Applicants</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Posted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border last:border-0 hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4 font-semibold text-white">
                    {job.title}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {job.company?.name || "—"}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {job.location || "—"}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {job.jobType?.replace("_", "-") || "—"}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {job._count?.applications ?? 0}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        job.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminJobs;
