import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import JobCard from "../../components/candidate/JobCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axios";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"];
const experienceLevels = ["Entry", "Mid", "Senior", "Lead"];

const JobFeed = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    experienceLevel: "",
  });

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filters.jobType) params.append("jobType", filters.jobType);
      if (filters.location) params.append("location", filters.location);
      if (filters.experienceLevel)
        params.append("experienceLevel", filters.experienceLevel);

      const res = await api.get(`/jobs?${params.toString()}`);
      setJobs(res.data.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const res = await api.get("/bookmarks");
      const savedIds = res.data.data.bookmarks.map((b) => b.jobId);
      setSavedJobs(savedIds);
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchJobs();
    }, 400);
    return () => clearTimeout(delay);
  }, [search, filters]);

  const handleSave = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await api.delete(`/bookmarks/${jobId}`);
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
      } else {
        await api.post(`/bookmarks/${jobId}`);
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error("Failed to save job", err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? "" : value,
    }));
  };

  return (
    <CandidateLayout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {greeting()}, {user?.fullName?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Here are jobs tailored to your profile
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5">
        <Search size={18} className="shrink-0 text-zinc-500" />
        <input
          type="text"
          placeholder="Search jobs, skills, companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-sm text-zinc-400">
          <SlidersHorizontal size={15} />
          <span>Filters:</span>
        </div>

        {jobTypes.map((type) => (
          <button
            key={type}
            onClick={() => handleFilterChange("jobType", type)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filters.jobType === type
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {type}
          </button>
        ))}

        {experienceLevels.map((level) => (
          <button
            key={level}
            onClick={() => handleFilterChange("experienceLevel", level)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              filters.experienceLevel === level
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-zinc-400 hover:border-zinc-600 hover:text-white"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-zinc-400">
        <span className="font-semibold text-white">{jobs.length}</span> jobs
        found
      </p>

      {/* Job cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-white">No jobs found</p>
          <p className="mt-1 text-sm text-zinc-400">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={handleSave}
              isSaved={savedJobs.includes(job.id)}
            />
          ))}
        </div>
      )}
    </CandidateLayout>
  );
};

export default JobFeed;
