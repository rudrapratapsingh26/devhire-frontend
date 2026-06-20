import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";

const AdminCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/candidates");
      setCandidates(res.data.data.candidates || []);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const filtered = candidates.filter(
    (c) =>
      c.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Candidates</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {candidates.length} candidates registered
        </p>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
        <Search size={18} className="shrink-0 text-zinc-500" />
        <input
          type="text"
          placeholder="Search by name or email..."
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
            No candidates found
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Applications</th>
                <th className="px-5 py-3 font-medium">Auth</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="border-b border-border last:border-0 hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                        {candidate.fullName?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium text-white">
                        {candidate.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{candidate.email}</td>
                  <td className="px-5 py-4 text-zinc-400">
                    {new Date(candidate.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {candidate._count?.applications ?? 0}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        candidate.googleId
                          ? "bg-blue-500/15 text-blue-400"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {candidate.googleId ? "Google" : "Email"}
                    </span>
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

export default AdminCandidates;
