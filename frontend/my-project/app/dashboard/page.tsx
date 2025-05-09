"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  email: string;
  full_name?: string;
  bio?: string;
  phone?: string;
  profile_picture?: string;
}

interface Resume {
  resume_id: number;
  name: string;
  summary: string;
  // Add other fields as needed
}

export default function Dashboard() {
  // ...existing state...
  const [resumeSkills, setResumeSkills] = useState("");
  const [resumeExperience, setResumeExperience] = useState("");
  const [resumeEducation, setResumeEducation] = useState("");
  const [resumeProjects, setResumeProjects] = useState("");
  const [resumeContact, setResumeContact] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [resumeContent, setResumeContent] = useState("");

  // ...existing state...
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null);
  const [editResumeName, setEditResumeName] = useState("");
  const [editResumeSummary, setEditResumeSummary] = useState("");

  function startEditResume(resume: Resume) {
    setEditingResumeId(resume.resume_id);
    setEditResumeName(resume.name);
    setEditResumeSummary(resume.summary);
  }

  async function handleEditResume(e: React.FormEvent<HTMLFormElement>, resumeId: number) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editResumeName,
          summary: editResumeSummary,
          skills: "",
          experience: "",
          education: "",
          projects: "",
          contact: "",
          title: "",
          content: ""
        })
      });
      // Refresh resumes
      const resumesRes = await fetch("http://127.0.0.1:8000/api/resumes/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resumesData = await resumesRes.json();
      setResumes(resumesData);
      setEditingResumeId(null);
    } catch (err) {
      setError("Failed to update resume");
    }
  }

  async function handleDeleteResume(resumeId: number) {
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh resumes
      const resumesRes = await fetch("http://127.0.0.1:8000/api/resumes/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resumesData = await resumesRes.json();
      setResumes(resumesData);
    } catch (err) {
      setError("Failed to delete resume");
    }
  }

  // ...existing state...
  const [showCreateResume, setShowCreateResume] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [resumeSummary, setResumeSummary] = useState("");

  async function handleCreateResume(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://127.0.0.1:8000/api/resumes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: resumeName,
          summary: resumeSummary,
          skills: "",
          experience: "",
          education: "",
          projects: "",
          contact: "",
          title: "",
          content: "",
          user_id: user.id
        })
      });
      if (!res.ok) throw new Error("Failed to create resume");
      // Refresh resumes
      const resumesRes = await fetch("http://127.0.0.1:8000/api/resumes/user/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resumesData = await resumesRes.json();
      setResumes(resumesData);
      setShowCreateResume(false);
      setResumeName("");
      setResumeSummary("");
    } catch (err) {
      setError("Failed to create resume");
    }
  }
  const [user, setUser] = useState<UserProfile | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [editFullName, setEditFullName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPicture, setEditPicture] = useState<File | null>(null);
  const router = useRouter();

  // When entering edit mode, initialize fields with current user data
  useEffect(() => {
    if (editing && user) {
      setEditFullName(user.full_name || "");
      setEditBio(user.bio || "");
      setEditPhone(user.phone || "");
      setEditPicture(null);
    }
  }, [editing, user]);

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // Update text fields
      await fetch(`http://127.0.0.1:8000/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: editFullName,
          bio: editBio,
          phone: editPhone
        })
      });
      // Upload profile picture if selected
      if (editPicture) {
        const formData = new FormData();
        formData.append("file", editPicture);
        await fetch(`http://127.0.0.1:8000/api/users/${user.id}/upload-profile-picture`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
      }
      // Refresh user profile
      const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditing(false);
    } catch (err) {
      setError("Failed to update profile");
    }
  }
  // (already declared above, remove duplicate)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }
    // Decode user ID from token
    const parseJwt = (token: string) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };
    const payload = parseJwt(token);
    const userEmail = payload?.sub;

    // Fetch user ID by email (temporary workaround)
    fetch(`http://127.0.0.1:8000/api/users/email/${userEmail}`)
      .then(res => res.json())
      .then(userData => {
        const userId = userData.id;
        // Fetch user profile
        fetch(`http://127.0.0.1:8000/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(async res => {
            if (!res.ok) throw new Error("Failed to fetch user profile");
            return res.json();
          })
          .then(setUser)
          .catch(() => setError("Could not load user profile"));

        // Fetch resumes for user (after profile loads)
        fetch(`http://127.0.0.1:8000/api/resumes/user/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(async res => {
            if (!res.ok) throw new Error("Failed to fetch resumes");
            return res.json();
          })
          .then(setResumes)
          .catch(() => setError("Could not load resumes"))
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setError("Could not load user profile");
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-950 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
          <div className="flex-shrink-0">
            {user.profile_picture ? (
              <img src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://127.0.0.1:8000/${user.profile_picture.replace(/^\/+/, '')}`}
                   alt="Profile"
                   className="w-32 h-32 rounded-full object-cover border-4 border-blue-400 shadow-lg" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl text-gray-500 border-4 border-gray-200">👤</div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.full_name || "Your Name"}</h1>
            <p className="text-gray-700 dark:text-gray-200 mb-1">{user.email}</p>
            {user.bio && <p className="text-gray-500 dark:text-gray-400 mb-1">{user.bio}</p>}
            {user.phone && <p className="text-gray-500 dark:text-gray-400">📞 {user.phone}</p>}
            <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setEditing(true)}>Edit Profile</button>
            {editing && (
              <form className="mt-4 space-y-2" onSubmit={handleProfileUpdate}>
                <input className="block w-full p-2 border rounded" type="text" placeholder="Full Name" value={editFullName} onChange={e => setEditFullName(e.target.value)} />
                <input className="block w-full p-2 border rounded" type="text" placeholder="Bio" value={editBio} onChange={e => setEditBio(e.target.value)} />
                <input className="block w-full p-2 border rounded" type="text" placeholder="Phone" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
                <input className="block w-full p-2 border rounded" type="file" accept="image/*" onChange={e => setEditPicture(e.target.files?.[0] || null)} />
                <div className="flex gap-2">
                  <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                  <button type="button" className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your Resumes</h2>
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => router.push('/dashboard/create-resume')}>Create Resume</button>
          {resumes.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400">No resumes found. Start by creating one!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resumes.map(resume => (
                <div key={resume.resume_id} className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                  {editingResumeId === resume.resume_id ? (
                    <form className="space-y-2" onSubmit={e => handleEditResume(e, resume.resume_id)}>
                      <input className="block w-full p-2 border rounded" type="text" value={editResumeName} onChange={e => setEditResumeName(e.target.value)} required />
                      <textarea className="block w-full p-2 border rounded" value={editResumeSummary} onChange={e => setEditResumeSummary(e.target.value)} required />
                      <div className="flex gap-2">
                        <button type="submit" className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                        <button type="button" className="px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500" onClick={() => setEditingResumeId(null)}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{resume.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">{resume.summary}</p>
                      <div className="flex gap-3 mt-4">
                        <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition" onClick={() => startEditResume(resume)}>Edit</button>
                        <button className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition" onClick={() => handleDeleteResume(resume.resume_id)}>Delete</button>
                        <button className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition">Download</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
