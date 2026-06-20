import { useState, useEffect } from "react";
import { Pencil, Briefcase, GraduationCap, FileText, Download, Upload } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../utils/axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/candidate/profile");
      setProfile(res.data.data.profile);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      const res = await api.put("/candidate/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile(res.data.data.profile);
    } catch (err) {
      console.error("Failed to upload resume", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <CandidateLayout>
        <div className="flex flex-col gap-4">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-surface" />
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
        </div>
      </CandidateLayout>
    );
  }

  return (
    <CandidateLayout>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <button className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover">
          <Pencil size={15} />
          Edit Profile
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {/* Experience */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Briefcase size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">Experience</h2>
          </div>
          {profile?.experience?.length > 0 ? (
            <div className="flex flex-col gap-5">
              {profile.experience.map((exp, i) => (
                <div key={i} className={i !== profile.experience.length - 1 ? "border-b border-border pb-5" : ""}>
                  <h3 className="font-semibold text-white">{exp.title}</h3>
                  <p className="text-sm text-accent">{exp.company}</p>
                  <p className="text-xs text-zinc-500">{exp.startDate} — {exp.endDate || "Present"}</p>
                  {exp.bullets?.length > 0 && (
                    <ul className="mt-2 flex flex-col gap-1">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="flex gap-2 text-sm text-zinc-300">
                          <span className="text-accent">•</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No experience added yet</p>
          )}
        </div>

        {/* Education */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <GraduationCap size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">Education</h2>
          </div>
          {profile?.education?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {profile.education.map((edu, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-white">{edu.institution}</h3>
                  <p className="text-sm text-accent">{edu.degree}</p>
                  <p className="text-xs text-zinc-500">{edu.startYear} — {edu.endYear}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No education added yet</p>
          )}
        </div>

        {/* Resume */}
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <FileText size={18} />
            </div>
            <h2 className="text-lg font-bold text-white">Resume</h2>
          </div>
          {profile?.resumeUrl ? (
            <div className="flex items-center justify-between rounded-xl bg-zinc-900/60 p-4">
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-zinc-400" />
                <div>
                  <p className="text-sm font-medium text-white">{profile.resumeFileName || "Resume.pdf"}</p>
                  <p className="text-xs text-zinc-500">PDF</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-accent transition hover:bg-zinc-800"
                >
                  <Download size={14} />
                  Download
                </a>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-white transition hover:bg-accent-hover">
                  <Upload size={14} />
                  {uploading ? "Uploading..." : "Upload New"}
                  <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 px-4 py-8 text-center transition hover:border-accent">
              <input type="file" accept="application/pdf" onChange={handleResumeUpload} className="hidden" />
              <Upload size={22} className="text-zinc-500" />
              <span className="text-sm text-zinc-400">
                {uploading ? "Uploading..." : "Upload your resume (PDF)"}
              </span>
            </label>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Profile;