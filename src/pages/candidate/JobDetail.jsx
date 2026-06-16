import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import ApplyModal from "../../components/candidate/ApplyModal";
import api from "../../utils/axios";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applied, setApplied] = useState(false);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs/${id}`);
      setJob(res.data.data.job);
    } catch (err) {
      setError("This job couldn't be found, it may have been removed.");
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    try {
      const res = await api.get("/applications/my");
      const applications = res.data.data.applications || [];
      setApplied(applications.some((app) => app.jobId === id));
    } catch (err) {
      console.error("Failed to check application status", err);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const res = await api.get("/bookmarks");
      const bookmarks = res.data.data.bookmarks || [];
      setIsSaved(bookmarks.some((b) => b.jobId === id));
    } catch (err) {
      console.error("Failed to check bookmark status", err);
    }
  };

  useEffect(() => {
    fetchJob();
    checkApplicationStatus();
    checkBookmarkStatus();
  }, [id]);

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await api.delete(`/bookmarks/${id}`);
      } else {
        await api.post(`/bookmarks/${id}`);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.error("Failed to update bookmark", err);
    }
  };

  if (loading) {
    return (
      <CandidateLayout>
        <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface" />
      </CandidateLayout>
    );
  }

  if (error || !job) {
    return (
      <CandidateLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-white">{error}</p>
          <Link
            to="/candidate/jobs"
            className="mt-4 text-sm text-accent hover:underline"
          >
            Back to job feed
          </Link>
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <Link
        to="/candidate/jobs"
        className="mb-4 flex items-center gap-1.5 text-sm text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to job feed
      </Link>

      <div className="rounded-2xl border border-border bg-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-800 text-lg font-bold text-white">
              {job.company?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{job.title}</h1>
              <p className="text-sm text-accent">{job.company?.name}</p>
            </div>
          </div>
          <button
            onClick={handleSaveToggle}
            className="text-zinc-500 transition hover:text-accent"
            aria-label="Save job"
          >
            <Bookmark
              size={20}
              className={isSaved ? "fill-accent text-accent" : ""}
            />
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.location && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              <MapPin size={11} />
              {job.location}
            </span>
          )}
          {job.jobType && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
              <Briefcase size={11} />
              {job.jobType}
            </span>
          )}
          {job.salaryRange && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-emerald-400">
              <DollarSign size={11} />
              {job.salaryRange}
            </span>
          )}
          {job.createdAt && (
            <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
              <Clock size={11} />
              Posted{" "}
              {new Date(job.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <h2 className="mb-2 text-sm font-semibold text-white">
            Job Description
          </h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
            {job.description}
          </p>
        </div>

        {job.requirements && (
          <div className="mt-6 border-t border-border pt-6">
            <h2 className="mb-2 text-sm font-semibold text-white">
              Requirements
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-300">
              {job.requirements}
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-6">
          {applied ? (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400">
              <CheckCircle2 size={18} />
              You've already applied to this job
            </div>
          ) : (
            <button
              onClick={() => setShowApplyModal(true)}
              className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition hover:bg-accent-hover sm:w-auto sm:px-8"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setApplied(true);
          }}
        />
      )}
    </CandidateLayout>
  );
};

export default JobDetail;
