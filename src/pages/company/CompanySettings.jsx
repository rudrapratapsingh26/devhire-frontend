import { useState, useEffect } from "react";
import { Save, Upload } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import api from "../../utils/axios";

const CompanySettings = () => {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    size: "",
    website: "",
    description: "",
  });
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await api.get("/company/profile");
      const company = res.data.data.company;
      setForm({
        name: company.name || "",
        industry: company.industry || "",
        size: company.size || "",
        website: company.website || "",
        description: company.description || "",
      });
    } catch (err) {
      console.error("Failed to fetch company profile", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => formData.append(key, val));
      if (logo) formData.append("logo", logo);
      await api.put("/company/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("Company profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
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
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your company profile
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-6"
      >
        {/* Logo upload */}
        <div className="mb-6">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            Company Logo
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-zinc-700 px-4 py-4 transition hover:border-accent">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files[0])}
              className="hidden"
            />
            <Upload size={18} className="text-zinc-500" />
            <span className="text-sm text-zinc-400">
              {logo ? logo.name : "Click to upload company logo"}
            </span>
          </label>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Company Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Acme Inc."
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Industry
            </label>
            <input
              name="industry"
              value={form.industry}
              onChange={handleChange}
              placeholder="e.g. Fintech"
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
            />
          </div>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Company Size
            </label>
            <select
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white outline-none transition focus:border-accent"
            >
              <option value="">Select size</option>
              {["1-10", "10-50", "50-200", "200-500", "500+"].map((s) => (
                <option key={s} value={s}>
                  {s} employees
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-200">
              Website
            </label>
            <input
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="e.g. https://acme.com"
              className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="mb-1.5 block text-sm font-medium text-zinc-200">
            About Company
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell candidates about your company..."
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400">
            {success}
          </div>
        )}

        <div className="flex justify-end border-t border-border pt-5">
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

export default CompanySettings;
