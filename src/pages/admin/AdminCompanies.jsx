import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import api from "../../utils/axios";

const statusStyles = {
  APPROVED: "bg-emerald-500/15 text-emerald-400",
  PENDING: "bg-amber-500/15 text-amber-400",
  REJECTED: "bg-red-500/15 text-red-400",
};

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/companies");
      setCompanies(res.data.data.companies || []);
    } catch (err) {
      console.error("Failed to fetch companies", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.patch(`/admin/companies/${id}/approve`);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "APPROVED" } : c))
      );
    } catch (err) {
      console.error("Failed to approve", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/admin/companies/${id}/reject`);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "REJECTED" } : c))
      );
    } catch (err) {
      console.error("Failed to reject", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filtered = companies
    .filter((c) => filter === "All" || c.status === filter)
    .filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Companies</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {companies.length} companies registered
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
          <Search size={18} className="shrink-0 text-zinc-500" />
          <input
            type="text"
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-white outline-none"
        >
          {["All", "PENDING", "APPROVED", "REJECTED"].map((s) => (
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
            No companies found
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Company</th>
                <th className="px-5 py-3 font-medium">Industry</th>
                <th className="px-5 py-3 font-medium">Size</th>
                <th className="px-5 py-3 font-medium">Submitted</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((company) => (
                <tr
                  key={company.id}
                  className="border-b border-border last:border-0 hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold text-white">
                        {company.name?.charAt(0)}
                      </div>
                      <span className="font-medium text-white">
                        {company.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {company.industry || "—"}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {company.size || "—"}
                  </td>
                  <td className="px-5 py-4 text-zinc-400">
                    {new Date(company.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[company.status] ||
                        "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {company.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {company.status === "PENDING" && (
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
                    )}
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

export default AdminCompanies;
