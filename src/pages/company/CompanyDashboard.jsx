import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Calendar, FileText, Plus } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import api from "../../utils/axios";

const statusStyles = {
  ACTIVE: "bg-emerald-500/15 text-emerald-400",
  PAUSED: "bg-amber-500/15 text-amber-400",
  CLOSED: "bg-zinc-700 text-zinc-400",
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        api.get("/jobs/company/my-jobs"),
        api.get("/applications/job/all"),
      ]);
      const myJobs = jobsRes.data.data.jobs || [];
      const myApps = appsRes.data.data.applications || [];
      setJobs(myJobs);
      setApplications(myApps);
      setStats({
        activeJobs: myJobs.filter((j) => j.status === "ACTIVE").length,
        totalApplicants: myApps.length,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statCards = [
    {
      label: "Active Jobs",
      value: stats?.activeJobs ?? 0,
      icon: Briefcase,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total Applicants",
      value: stats?.totalApplicants ?? 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Interviews Scheduled",
      value: 0,
      icon: Calendar,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      label: "Offers Sent",
      value: applications.filter((a) => a.status === "Accepted").length,
      icon: FileText,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <CompanyLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Welcome back, here's your hiring overview
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

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl border border-border bg-surface p-5"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}
            >
              <Icon size={20} />
            </div>
            <p className="text-xs text-zinc-400">{label}</p>
            <p className="mt-1 text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Active jobs table */}
      <div className="mb-8 rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-white">Active Job Listings</h2>
            <p className="text-sm text-zinc-400">Manage your open positions</p>
          </div>
          <button
            onClick={() => navigate("/company/jobs")}
            className="text-sm font-medium text-accent hover:underline"
          >
            View all →
          </button>
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
        ) : jobs.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No jobs posted yet
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="pb-3 font-medium">Job Title</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Applicants</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.slice(0, 5).map((job) => (
                <tr
                  key={job.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3 font-semibold text-white">{job.title}</td>
                  <td className="py-3 text-zinc-400">{job.location || "—"}</td>
                  <td className="py-3 text-zinc-400">{job.jobType || "—"}</td>
                  <td className="py-3 text-zinc-400">
                    {job._count?.applications ?? 0}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[job.status] || "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                        className="text-xs font-medium text-zinc-400 hover:text-white"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => navigate(`/company/jobs/${job.id}`)}
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Recent applicants */}
      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4">
          <h2 className="font-bold text-white">Applicants</h2>
          <p className="text-sm text-zinc-400">Ranked by AI match score</p>
        </div>

        {applications.length === 0 ? (
          <p className="py-8 text-center text-sm text-zinc-500">
            No applications yet
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-zinc-500">
                <th className="pb-3 font-medium">Candidate</th>
                <th className="pb-3 font-medium">Applied Role</th>
                <th className="pb-3 font-medium">AI Score</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
                        {app.candidate?.fullName?.charAt(0) || "?"}
                      </div>
                      <span className="font-medium text-white">
                        {app.candidate?.fullName || "Unknown"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-zinc-400">{app.job?.title}</td>
                  <td className="py-3">
                    {app.aiScore != null && (
                      <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-bold text-emerald-400">
                        {app.aiScore}
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                      {app.status}
                    </span>
                  </td>
                  <td className="py-3">
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

export default CompanyDashboard;
