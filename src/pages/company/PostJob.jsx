import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Save, Send } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import api from "../../utils/axios";

const jobTypes = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
const experienceLevels = ["ENTRY", "MID", "SENIOR", "LEAD"];

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({
    description: false,
    requirements: false,
  });
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generateWithAI = async (field) => {
    if (!form.title) {
      setError("Enter a job title first to generate with AI");
      return;
    }
    setError("");
    setAiLoading({ ...aiLoading, [field]: true });
    try {
      const res = await api.post("/jobs/generate", {
        title: form.title,
        field,
      });
      setForm((prev) => ({ ...prev, [field]: res.data.data[field] }));
    } catch (err) {
      setError("AI generation failed — try again");
    } finally {
      setAiLoading({ ...aiLoading, [field]: false });
    }
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/jobs", { ...form, isDraft });
      navigate("/company/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CompanyLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Post New Job</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Fill in the details to attract the best candidates
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
        {/* Job Title */}
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

        {/* Job Description */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-200">
              Job Description
            </label>
            <button
              type="button"
              onClick={() => generateWithAI("description")}
              disabled={aiLoading.description}
              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-violet-400 disabled:opacity-60"
            >
              <Sparkles size={13} />
              {aiLoading.description ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the role, responsibilities, and what makes it exciting..."
            rows={6}
            className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          />
        </div>

        {/* Requirements */}
        <div className="mb-5">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-200">
              Requirements
            </label>
            <button
              type="button"
              onClick={() => generateWithAI("requirements")}
              disabled={aiLoading.requirements}
              className="flex items-center gap-1.5 text-xs font-medium text-accent hover:text-violet-400 disabled:opacity-60"
            >
              <Sparkles size={13} />
              {aiLoading.requirements ? "Generating..." : "Generate with AI"}
            </button>
          </div>
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="List key skills and qualifications..."
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          />
        </div>

        {/* Location + Job Type */}
        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. San Francisco, CA or Remote"
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
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
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

        {/* Salary + Deadline */}
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
              Application Deadline
            </label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
            />
          </div>
        </div>

        {/* Experience Level */}
        <div className="mb-8">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            Experience Level
          </label>
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
            className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          >
            <option value="">Select level</option>
            {experienceLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-zinc-300 transition hover:bg-zinc-800 disabled:opacity-60"
          >
            <Save size={15} />
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            <Send size={15} />
            {loading ? "Posting..." : "Post Job"}
          </button>
        </div>
      </form>
    </CompanyLayout>
  );
};

export default PostJob;
