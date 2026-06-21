import { useState, useEffect } from "react";
import { Pencil, Briefcase, GraduationCap, FileText, Download, Upload, X, Plus, Trash2 } from "lucide-react";
import CandidateLayout from "../../layouts/CandidateLayout";
import api from "../../utils/axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    headline: "",
    location: "",
    bio: "",
    skills: [],
    experience: [],
    education: [],
  });
  const [skillInput, setSkillInput] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get("/candidate/profile");
      const p = res.data.data.profile;
      setProfile(p);
      setEditForm({
        headline: p?.headline || "",
        location: p?.location || "",
        bio: p?.bio || "",
        skills: p?.skills || [],
        experience: p?.experience || [],
        education: p?.education || [],
      });
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

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put("/candidate/profile", editForm);
      setProfile(res.data.data.profile);
      setShowEditModal(false);
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !editForm.skills.includes(skillInput.trim())) {
      setEditForm({ ...editForm, skills: [...editForm.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setEditForm({ ...editForm, skills: editForm.skills.filter((s) => s !== skill) });
  };

  const addExperience = () => {
    setEditForm({
      ...editForm,
      experience: [...editForm.experience, { title: "", company: "", startDate: "", endDate: "", bullets: [] }],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...editForm.experience];
    updated[index] = { ...updated[index], [field]: value };
    setEditForm({ ...editForm, experience: updated });
  };

  const removeExperience = (index) => {
    setEditForm({ ...editForm, experience: editForm.experience.filter((_, i) => i !== index) });
  };

  const addEducation = () => {
    setEditForm({
      ...editForm,
      education: [...editForm.education, { institution: "", degree: "", startYear: "", endYear: "" }],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...editForm.education];
    updated[index] = { ...updated[index], [field]: value };
    setEditForm({ ...editForm, education: updated });
  };

  const removeEducation = (index) => {
    setEditForm({ ...editForm, education: editForm.education.filter((_, i) => i !== index) });
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
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-hover"
        >
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
                          <span className="text-accent">•</span>{bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No experience added yet — click Edit Profile to add</p>
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
            <p className="text-sm text-zinc-500">No education added yet — click Edit Profile to add</p>
          )}
        </div>

        {/* Skills */}
        {profile?.skills?.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, i) => (
                <span key={i} className="rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-surface p-6">
            {/* Modal header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-zinc-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {/* Basic info */}
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-semibold text-zinc-300">Basic Info</h3>
                <input
                  value={editForm.headline}
                  onChange={(e) => setEditForm({ ...editForm, headline: e.target.value })}
                  placeholder="Headline (e.g. Full-Stack Developer)"
                  className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                />
                <input
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="Location (e.g. San Francisco, CA)"
                  className="w-full rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                />
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Short bio..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                />
              </div>

              {/* Skills */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-zinc-300">Skills</h3>
                <div className="mb-2 flex flex-wrap gap-2">
                  {editForm.skills.map((skill, i) => (
                    <span key={i} className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-sm text-zinc-300">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-zinc-500 hover:text-red-400">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    placeholder="Add a skill (press Enter)"
                    className="flex-1 rounded-xl border border-border bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                  />
                  <button
                    onClick={addSkill}
                    className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Experience */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-300">Experience</h3>
                  <button
                    onClick={addExperience}
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-violet-400"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {editForm.experience.map((exp, i) => (
                    <div key={i} className="relative rounded-xl border border-border p-4">
                      <button
                        onClick={() => removeExperience(i)}
                        className="absolute right-3 top-3 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={exp.title}
                          onChange={(e) => updateExperience(i, "title", e.target.value)}
                          placeholder="Job Title"
                          className="rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                        <input
                          value={exp.company}
                          onChange={(e) => updateExperience(i, "company", e.target.value)}
                          placeholder="Company"
                          className="rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                        <input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                          placeholder="Start Date (e.g. Jan 2023)"
                          className="rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                        <input
                          value={exp.endDate}
                          onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                          placeholder="End Date (or leave blank)"
                          className="rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-300">Education</h3>
                  <button
                    onClick={addEducation}
                    className="flex items-center gap-1 text-xs font-medium text-accent hover:text-violet-400"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {editForm.education.map((edu, i) => (
                    <div key={i} className="relative rounded-xl border border-border p-4">
                      <button
                        onClick={() => removeEducation(i)}
                        className="absolute right-3 top-3 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          value={edu.institution}
                          onChange={(e) => updateEducation(i, "institution", e.target.value)}
                          placeholder="Institution"
                          className="col-span-2 rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                        <input
                          value={edu.degree}
                          onChange={(e) => updateEducation(i, "degree", e.target.value)}
                          placeholder="Degree"
                          className="col-span-2 rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                        <input
                          value={edu.startYear}
                          onChange={(e) => updateEducation(i, "startYear", e.target.value)}
                          placeholder="Start Year"
                          className="rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                        <input
                          value={edu.endYear}
                          onChange={(e) => updateEducation(i, "endYear", e.target.value)}
                          placeholder="End Year"
                          className="rounded-xl border border-border bg-zinc-900/60 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none focus:border-accent"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="mt-6 flex justify-end gap-3 border-t border-border pt-5">
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-hover disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </CandidateLayout>
  );
};

export default Profile;