import { useState } from "react";
import { X, Upload, FileText, Loader2 } from "lucide-react";
import api from "../../utils/axios";

const ApplyModal = ({ job, onClose, onSuccess }) => {
  const [resume, setResume] = useState(null);
  const [generateCoverLetter, setGenerateCoverLetter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      setError("Resume must be a PDF file");
      return;
    }
    setError("");
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) {
      setError("Please upload your resume");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("generateCoverLetter", generateCoverLetter);

      await api.post(`/applications/${job.id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to submit application";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Apply to {job.title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-500 transition hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Resume (PDF)
            </label>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 px-4 py-6 text-center transition hover:border-accent">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              {resume ? (
                <>
                  <FileText size={22} className="text-accent" />
                  <span className="text-sm text-white">{resume.name}</span>
                </>
              ) : (
                <>
                  <Upload size={22} className="text-zinc-500" />
                  <span className="text-sm text-zinc-400">
                    Click to upload your resume
                  </span>
                </>
              )}
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={generateCoverLetter}
              onChange={(e) => setGenerateCoverLetter(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-800 text-accent focus:ring-accent"
            />
            Generate an AI cover letter for this job
          </label>

          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
