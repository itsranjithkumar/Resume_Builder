"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  PlusCircle,
  Download,
  Pencil,
  Trash2,
  ChevronRight,
  User,
  Phone,
  Mail,
  FileText,
  X,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface UserProfile {
  id: number
  email: string
  full_name?: string
  bio?: string
  phone?: string
  profile_picture?: string
}

interface Resume {
  resume_id: number
  name: string
  summary: string
  // Add other fields as needed
}

export default function Dashboard() {
  // ...existing state...
  const [resumeSkills, setResumeSkills] = useState("")
  const [resumeExperience, setResumeExperience] = useState("")
  const [resumeEducation, setResumeEducation] = useState("")
  const [resumeProjects, setResumeProjects] = useState("")
  const [resumeContact, setResumeContact] = useState("")
  const [resumeTitle, setResumeTitle] = useState("")
  const [resumeContent, setResumeContent] = useState("")

  // ...existing state...
  const [editingResumeId, setEditingResumeId] = useState<number | null>(null)
  const [editResumeName, setEditResumeName] = useState("")
  const [editResumeSummary, setEditResumeSummary] = useState("")

  function startEditResume(resume: Resume) {
    setEditingResumeId(resume.resume_id)
    setEditResumeName(resume.name)
    setEditResumeSummary(resume.summary)
  }

  async function handleEditResume(e: React.FormEvent<HTMLFormElement>, resumeId: number) {
    e.preventDefault()
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      await fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          content: "",
        }),
      })
      // Refresh resumes
      const resumesRes = await fetch("http://127.0.0.1:8000/api/resumes/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const resumesData = await resumesRes.json()
      setResumes(resumesData)
      setEditingResumeId(null)
    } catch (err) {
      setError("Failed to update resume")
    }
  }

  async function handleDeleteResume(resumeId: number) {
    if (!window.confirm("Are you sure you want to delete this resume?")) return
    const token = localStorage.getItem("token")
    if (!token) {
      setError("You must be logged in to delete a resume.")
      return
    }
    try {
      setLoading(true)
      const res = await fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401) {
        // Unauthorized: clear token and redirect
        localStorage.removeItem("token")
        setError("Session expired or not authenticated. Please log in again.")
        setLoading(false)
        router.push("/login")
        return
      }
      if (!res.ok) {
        const msg = await res.text()
        setError(msg || "Failed to delete resume")
        setLoading(false)
        return
      }
      // Refresh resumes
      const resumesRes = await fetch("http://127.0.0.1:8000/api/resumes/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const resumesData = await resumesRes.json()
      setResumes(resumesData)
      setError("")
    } catch (err: any) {
      setError("Failed to delete resume: " + (err?.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  // ...existing state...
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [resumeName, setResumeName] = useState("")
  const [resumeSummary, setResumeSummary] = useState("")

  async function handleCreateResume(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch("http://127.0.0.1:8000/api/resumes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
          user_id: user.id,
        }),
      })
      if (!res.ok) throw new Error("Failed to create resume")
      // Refresh resumes
      const resumesRes = await fetch("http://127.0.0.1:8000/api/resumes/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const resumesData = await resumesRes.json()
      setResumes(resumesData)
      setShowCreateResume(false)
      setResumeName("")
      setResumeSummary("")
    } catch (err) {
      setError("Failed to create resume")
    }
  }
  const [user, setUser] = useState<UserProfile | null>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editing, setEditing] = useState(false)
  const [editFullName, setEditFullName] = useState("")
  const [editBio, setEditBio] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editPicture, setEditPicture] = useState<File | null>(null)
  const router = useRouter()

  // When entering edit mode, initialize fields with current user data
  useEffect(() => {
    if (editing && user) {
      setEditFullName(user.full_name || "")
      setEditBio(user.bio || "")
      setEditPhone(user.phone || "")
      setEditPicture(null)
    }
  }, [editing, user])

  async function handleProfileUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!user) return
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      // Update text fields
      await fetch(`http://127.0.0.1:8000/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: editFullName,
          bio: editBio,
          phone: editPhone,
        }),
      })
      // Upload profile picture if selected
      if (editPicture) {
        const formData = new FormData()
        formData.append("file", editPicture)
        await fetch(`http://127.0.0.1:8000/api/users/${user.id}/upload-profile-picture`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
      }
      // Refresh user profile
      const res = await fetch(`http://127.0.0.1:8000/api/users/${user.id}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const updatedUser = await res.json()
      setUser(updatedUser)
      setEditing(false)
    } catch (err) {
      setError("Failed to update profile")
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.replace("/login")
      return
    }
    // Decode user ID from token
    const parseJwt = (token: string) => {
      try {
        return JSON.parse(atob(token.split(".")[1]))
      } catch (e) {
        return null
      }
    }
    const payload = parseJwt(token)
    const userEmail = payload?.sub

    // Fetch user ID by email (temporary workaround)
    fetch(`http://127.0.0.1:8000/api/users/email/${userEmail}`)
      .then((res) => res.json())
      .then((userData) => {
        const userId = userData.id
        // Fetch user profile
        fetch(`http://127.0.0.1:8000/api/users/${userId}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch user profile")
            return res.json()
          })
          .then(setUser)
          .catch(() => setError("Could not load user profile"))

        // Fetch resumes for user (after profile loads)
        fetch(`http://127.0.0.1:8000/api/resumes/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(async (res) => {
            if (!res.ok) throw new Error("Failed to fetch resumes")
            return res.json()
          })
          .then(setResumes)
          .catch(() => setError("Could not load resumes"))
          .finally(() => setLoading(false))
      })
      .catch(() => {
        setError("Could not load user profile")
        setLoading(false)
      })
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="h-12 w-12 text-black animate-spin mb-4" />
        <p className="text-black text-lg font-medium">Loading your dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-black">
                Resume<span className="font-light">Builder</span>
              </span>
            </div>
            <nav className="flex items-center space-x-6">
              <button
                onClick={() => router.push("/dashboard/create-resume")}
                className="text-sm font-medium text-black hover:opacity-70 transition-opacity flex items-center"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                New Resume
              </button>
              <button className="text-sm font-medium text-black hover:opacity-70 transition-opacity">Templates</button>
              <button className="text-sm font-medium text-black hover:opacity-70 transition-opacity">Settings</button>
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  router.push("/login")
                }}
                className="text-sm font-medium text-black hover:opacity-70 transition-opacity"
              >
                Sign Out
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-50 rounded-3xl overflow-hidden"
          >
            <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>

            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-6">
                <div className="relative z-10 flex-shrink-0 mr-6">
                  {user.profile_picture ? (
                    <img
                      src={
                        user.profile_picture.startsWith("http")
                          ? user.profile_picture
                          : `http://127.0.0.1:8000/${user.profile_picture.replace(/^\/+/, "")}`
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center text-4xl text-gray-400 border-4 border-white shadow-xl">
                      <User className="h-16 w-16" />
                    </div>
                  )}
                </div>

                <div className="mt-6 md:mt-0 flex-1">
                  <h1 className="text-3xl font-bold text-white">{user.full_name || user.email.split("@")[0]}</h1>
                  <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-white">
                      <Mail className="h-4 w-4 mr-1" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-white">
                        <Phone className="h-4 w-4 mr-1" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                  {user.bio && <p className="mt-3 text-black max-w-2xl">{user.bio}</p>}
                </div>

                {!editing && (
                  <Button
                    onClick={() => setEditing(true)}
                    variant="outline"
                    size="sm"
                    className="mt-4 md:mt-0 md:self-start border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>

              {editing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <Input
                        id="fullName"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        placeholder="Your full name"
                        className="border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <Textarea
                        id="bio"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
                        placeholder="A short bio about yourself"
                        className="border-gray-300 focus:border-black focus:ring-black"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        placeholder="Your phone number"
                        className="border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div>
                      <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditPicture(e.target.files?.[0] || null)}
                        className="border-gray-300 focus:border-black focus:ring-black"
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEditing(false)}
                        className="border-gray-300"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </div>
          </motion.div>
        </section>

        {/* Resume Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-semibold text-gray-900">Your Resumes</h2>
              <p className="text-gray-500 mt-1">
                {resumes.length === 0
                  ? "Create your first resume to get started"
                  : `You have created ${resumes.length} resume${resumes.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <Button
              onClick={() => router.push("/dashboard/create-resume")}
              className="bg-black hover:bg-gray-800 text-white"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Resume
            </Button>
          </div>

          {/* Resume Grid */}
          {resumes.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Create your first resume to showcase your skills and experience to potential employers.
              </p>
              <Button
                onClick={() => router.push("/dashboard/create-resume")}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.resume_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md ${
                    editingResumeId === resume.resume_id ? "ring-2 ring-black" : ""
                  }`}
                >
                  {editingResumeId === resume.resume_id ? (
                    <div className="p-6">
                      <form className="space-y-4" onSubmit={(e) => handleEditResume(e, resume.resume_id)}>
                        <div>
                          <label
                            htmlFor={`editName-${resume.resume_id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Resume Name
                          </label>
                          <Input
                            id={`editName-${resume.resume_id}`}
                            value={editResumeName}
                            onChange={(e) => setEditResumeName(e.target.value)}
                            className="border-gray-300 focus:border-black focus:ring-black"
                            required
                          />
                        </div>

                        <div>
                          <label
                            htmlFor={`editSummary-${resume.resume_id}`}
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Professional Summary
                          </label>
                          <Textarea
                            id={`editSummary-${resume.resume_id}`}
                            value={editResumeSummary}
                            onChange={(e) => setEditResumeSummary(e.target.value)}
                            className="border-gray-300 focus:border-black focus:ring-black"
                            rows={4}
                            required
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditingResumeId(null)}
                            className="border-gray-300"
                          >
                            Cancel
                          </Button>
                          <Button type="submit" className="bg-black hover:bg-gray-800 text-white">
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      <div className="h-3 bg-gradient-to-r from-gray-900 to-gray-700"></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-medium text-gray-900 group-hover:text-black transition-colors">
                            {resume.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className="text-xs font-normal bg-gray-50 text-gray-600 border-gray-200"
                          >
                            Resume
                          </Badge>
                        </div>

                        <p className="text-gray-600 line-clamp-3 mb-6 text-sm">{resume.summary}</p>

                        <div className="flex flex-wrap gap-2 mt-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/dashboard/create-resume?resume_id=${resume.resume_id}`)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteResume(resume.resume_id)}
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 ml-auto"
                          >
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>

                      <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => router.push(`/dashboard/resume/${resume.resume_id}`)}
                        >
                          <ChevronRight className="h-4 w-4 text-gray-700" />
                        </Button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}

              {/* Add New Resume Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: resumes.length * 0.1 }}
                className="group relative bg-gray-50 rounded-2xl overflow-hidden border border-dashed border-gray-300 hover:border-gray-400 transition-all duration-300 flex flex-col items-center justify-center p-6 cursor-pointer"
                onClick={() => router.push("/dashboard/create-resume")}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-gray-200 transition-colors">
                  <PlusCircle className="h-6 w-6 text-gray-500 group-hover:text-gray-700 transition-colors" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors mb-1">
                  Create New Resume
                </h3>
                <p className="text-gray-500 text-sm text-center">Add another resume to your collection</p>
              </motion.div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
