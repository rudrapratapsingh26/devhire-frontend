import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import JobCard from "../../components/candidate/JobCard";
import api from "../../utils/axios";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/bookmarks");
      const bookmarks = res.data.data.bookmarks || [];
      setSavedJobs(bookmarks.map((b) => b.job));
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/bookmarks/${jobId}`);
      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Failed to remove bookmark", err);
    }
  };

  return (
    <CandidateLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Saved Jobs</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {savedJobs.length} jobs saved for later
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-2xl border border-border bg-surface"
            />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-800 text-zinc-500">
            <Bookmark size={24} />
          </div>
          <p className="text-lg font-semibold text-white">No saved jobs yet</p>
          <p className="mt-1 text-sm text-zinc-400">
            Bookmark jobs from the feed to come back to them later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSave={handleUnsave}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </CandidateLayout>
  );
};

export default SavedJobs;
