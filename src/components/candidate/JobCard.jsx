import { Link } from "react-router-dom";
import { Bookmark, Globe, Clock } from "lucide-react";

const JobCard = ({ job, onSave, isSaved }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 transition hover:border-zinc-600">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800 text-sm font-bold text-white">
            {job.company?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="font-semibold text-white">{job.title}</h3>
            <p className="text-sm text-accent">{job.company?.name}</p>
          </div>
        </div>
        <button
          onClick={() => onSave(job.id)}
          className="mt-0.5 text-zinc-500 transition hover:text-accent"
          aria-label="Save job"
        >
          <Bookmark
            size={18}
            className={isSaved ? "fill-accent text-accent" : ""}
          />
        </button>
      </div>

      {job.salaryRange && (
        <p className="text-sm font-semibold text-emerald-400">
          {job.salaryRange}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {job.location && (
          <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
            <Globe size={11} />
            {job.location}
          </span>
        )}
        {job.jobType && (
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
            {job.jobType}
          </span>
        )}
        {job.createdAt && (
          <span className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
            <Clock size={11} />
            {new Date(job.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

      <Link
        to={`/candidate/jobs/${job.id}`}
        className="w-full rounded-xl border border-zinc-700 py-2 text-center text-sm font-semibold text-white transition hover:border-accent hover:bg-accent/10 hover:text-accent"
      >
        Apply Now
      </Link>
    </div>
  );
};

export default JobCard;
