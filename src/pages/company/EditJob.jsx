import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Sparkles, Save } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import api from "../../utils/axios";

const jobTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const experienceLevels = ["ENTRY", "MID", "SENIOR", "LEAD"];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "",
    salaryRange: "",
    deadline: "",
    experienceLevel: "",
  });

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);
      const job = res.data.data.job;
      setForm({
        title: job.title || "",
        description: job.description || "",
        requirements: job.requirements || "",
        location: job.location || "",
        jobType: job.jobType || "",
        salaryRange: job.salaryRange || "",
        deadline: job.deadline ? job.deadline.split("T")[0] : "",
        experienceLevel: job.experienceLevel || "",
      });
    } catch (err) {
      setError("Failed to load job details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.put(`/jobs/${id}`, form);
      navigate("/company/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update job");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <CompanyLayout>
        <div className="h-96 animate-pulse rounded-2xl border border-border bg-surface" />
      </CompanyLayout>
    );
  }

  return (
    <CompanyLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Edit Job</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Update your job listing details
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            Job Title
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Senior Frontend Engineer"
            required
            className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          />
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            Job Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          />
        </div>

        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          />
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Remote"
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Job Type
            </label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent"
            >
              <option value="">Select type</option>
              {jobTypes.map((t) => (
                <option key={t} value={t}>
                  {t.replace("_", "-")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Salary Range
            </label>
            <input
              name="salaryRange"
              value={form.salaryRange}
              onChange={handleChange}
              placeholder="e.g. $120,000 – $160,000"
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent"
          >
            <option value="">Select level</option>
            {experienceLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => navigate("/company/jobs")}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            <Save size={15} />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </CompanyLayout>
  );
};

export default EditJob;
