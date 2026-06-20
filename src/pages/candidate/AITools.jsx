import { useState } from "react";
import { Sparkles, FileText, Loader2, Copy, Check } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../utils/axios";

const AITools = () => {
  const [activeTab, setActiveTab] = useState("cover-letter");

  // Cover letter state
  const [coverLetterForm, setCoverLetterForm] = useState({
    jobTitle: "",
    company: "",
    jobDescription: "",
  });
  const [coverLetter, setCoverLetter] = useState("");
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [coverLetterError, setCoverLetterError] = useState("");
  const [copied, setCopied] = useState(false);

  // Resume score state
  const [resume, setResume] = useState(null);
  const [jobDescForScore, setJobDescForScore] = useState("");
  const [scoreResult, setScoreResult] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [scoreError, setScoreError] = useState("");

  const generateCoverLetter = async (e) => {
    e.preventDefault();
    setCoverLetterError("");
    setCoverLetter("");
    setCoverLetterLoading(true);
    try {
      const res = await api.post(
        "/candidate/generate-cover-letter",
        coverLetterForm
      );
      setCoverLetter(res.data.data.coverLetter);
    } catch (err) {
      setCoverLetterError(
        err.response?.data?.message || "Generation failed — try again"
      );
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreResume = async (e) => {
    e.preventDefault();
    if (!resume) {
      setScoreError("Please upload your resume");
      return;
    }
    setScoreError("");
    setScoreResult(null);
    setScoreLoading(true);
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescForScore);
      const res = await api.post("/candidate/score-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setScoreResult(res.data.data);
    } catch (err) {
      setScoreError(
        err.response?.data?.message || "Scoring failed — try again"
      );
    } finally {
      setScoreLoading(false);
    }
  };

  const scoreColor = (score) => {
    if (score >= 85) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const tabs = [
    { id: "cover-letter", label: "AI Cover Letter", icon: FileText },
    { id: "resume-score", label: "Resume Scorer", icon: Sparkles },
  ];

  return (
    <CandidateLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Tools</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Powered by AI to help you land your next role
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-xl border border-border bg-surface p-1 w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              activeTab === id
                ? "bg-accent text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Cover Letter Generator */}
      {activeTab === "cover-letter" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 font-bold text-white">Generate Cover Letter</h2>
            <form
              onSubmit={generateCoverLetter}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-200">
                  Job Title
                </label>
                <input
                  value={coverLetterForm.jobTitle}
                  onChange={(e) =>
                    setCoverLetterForm({
                      ...coverLetterForm,
                      jobTitle: e.target.value,
                    })
                  }
                  placeholder="e.g. Senior Frontend Engineer"
                  required
                  className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-200">
                  Company
                </label>
                <input
                  value={coverLetterForm.company}
                  onChange={(e) =>
                    setCoverLetterForm({
                      ...coverLetterForm,
                      company: e.target.value,
                    })
                  }
                  placeholder="e.g. Stripe"
                  required
                  className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-200">
                  Job Description
                </label>
                <textarea
                  value={coverLetterForm.jobDescription}
                  onChange={(e) =>
                    setCoverLetterForm({
                      ...coverLetterForm,
                      jobDescription: e.target.value,
                    })
                  }
                  placeholder="Paste the job description here..."
                  rows={5}
                  required
                  className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                />
              </div>

              {coverLetterError && (
                <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {coverLetterError}
                </div>
              )}

              <button
                type="submit"
                disabled={coverLetterLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {coverLetterLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {coverLetterLoading ? "Generating..." : "Generate Cover Letter"}
              </button>
            </form>
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-white">Output</h2>
              {coverLetter && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
                >
                  {copied ? (
                    <Check size={15} className="text-emerald-400" />
                  ) : (
                    <Copy size={15} />
                  )}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>
            {coverLetter ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
                {coverLetter}
              </p>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <Sparkles size={28} className="mb-3 text-zinc-700" />
                <p className="text-sm text-zinc-500">
                  Fill in the form and click generate
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resume Scorer */}
      {activeTab === "resume-score" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 font-bold text-white">Score Your Resume</h2>
            <form onSubmit={scoreResume} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-200">
                  Upload Resume (PDF)
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 px-4 py-6 text-center transition hover:border-accent">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setResume(e.target.files[0])}
                    className="hidden"
                  />
                  <FileText
                    size={22}
                    className={resume ? "text-accent" : "text-zinc-500"}
                  />
                  <span className="text-sm text-zinc-400">
                    {resume ? resume.name : "Click to upload your resume"}
                  </span>
                </label>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-200">
                  Job Description (optional)
                </label>
                <textarea
                  value={jobDescForScore}
                  onChange={(e) => setJobDescForScore(e.target.value)}
                  placeholder="Paste job description to get a match score..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/60"
                />
              </div>

              {scoreError && (
                <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                  {scoreError}
                </div>
              )}

              <button
                type="submit"
                disabled={scoreLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {scoreLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Sparkles size={16} />
                )}
                {scoreLoading ? "Scoring..." : "Score Resume"}
              </button>
            </form>
          </div>

          {/* Score result */}
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 font-bold text-white">Score Result</h2>
            {scoreResult ? (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center rounded-xl bg-zinc-900/60 py-8">
                  <span
                    className={`text-6xl font-bold ${scoreColor(
                      scoreResult.score
                    )}`}
                  >
                    {scoreResult.score}
                  </span>
                  <span className="mt-1 text-sm text-zinc-400">out of 100</span>
                </div>
                {scoreResult.feedback && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-white">
                      Feedback
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-300">
                      {scoreResult.feedback}
                    </p>
                  </div>
                )}
                {scoreResult.suggestions?.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-white">
                      Suggestions
                    </h3>
                    <ul className="flex flex-col gap-1.5">
                      {scoreResult.suggestions.map((s, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-zinc-300"
                        >
                          <span className="text-accent">→</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center text-center">
                <Sparkles size={28} className="mb-3 text-zinc-700" />
                <p className="text-sm text-zinc-500">
                  Upload your resume and click score
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </CandidateLayout>
  );
};

export default AITools;
