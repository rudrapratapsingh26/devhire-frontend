import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import api from "../../utils/axios";

const statusStyles = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  PAUSED: "bg-amber-500/15 text-amber-400",
  CLOSED: "bg-zinc-700 text-zinc-400",
};

const ActiveJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/company/my-jobs");
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Failed to delete job", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <CompanyLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Active Jobs</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
          </p>
        </div>
        <button
          onClick={() => navigate("/company/jobs/new")}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
          <Plus size={16} />
          Post New Job
        </button>
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
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="font-semibold text-white">No jobs posted yet</p>
            <p className="mt-1 text-sm text-zinc-400">
              Post your first job to start receiving applications
            </p>
            <button
              onClick={() => navigate("/company/jobs/new")}
              className="mt-4 flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              <Plus size={15} />
              Post a Job
            </button>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="px-5 py-3 font-medium">Job Title</th>
                <th className="px-5 py-3 font-medium">Location</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Applicants</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Posted</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border last:border-0 hover:bg-zinc-800/40"
                >
                  <td className="px-5 py-4 font-semibold text-white">
                    {job.title}
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
                        statusStyles[job.status] || "bg-zinc-800 text-zinc-300"
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
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                        className="text-zinc-400 transition hover:text-white"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => navigate(`/candidate/jobs/${job.id}`)}
                        className="text-zinc-400 transition hover:text-accent"
                        aria-label="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => deleteJob(job.id)}
                        className="text-zinc-400 transition hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default ActiveJobs;
