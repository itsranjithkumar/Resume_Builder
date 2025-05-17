"use client"
import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  PlusCircle,
  Trash2,
  Upload,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderKanban,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

export default function CreateResume() {
  const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const resumeId = searchParams?.get("resume_id") || null; // null if not editing
  const [loadingResume, setLoadingResume] = useState(!!resumeId);

  useEffect(() => {
    if (resumeId) {
      setLoadingResume(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) return;
      fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.text()) || "Failed to fetch resume");
          return res.json();
        })
        .then((data) => {
          // Parse backend fields to frontend structure
          const [firstName, ...lastParts] = (data.name || "").split(" ");
          const lastName = lastParts.join(" ");
          setPersonal((prev) => ({
            ...prev,
            firstName: firstName || "",
            lastName: lastName || "",
            phone: (data.contact || "").split(",")[1]?.trim() || "",
            email: (data.contact || "").split(",")[0]?.trim() || "",
            address: (data.contact || "").split(",")[2]?.trim() || "",
            title: data.title || "",
            linkedin: "",
            summary: data.summary || "",
            profileImage: data.profileImage || "",
            profileImageFile: null,
          }));
          let parsedSkills;
          try {
            parsedSkills = JSON.parse(data.skills);
          } catch {
            parsedSkills = {
              frontend: [],
              backend: [],
              databases: [],
              other: [],
            };
            if (data.skills) {
              parsedSkills.other = data.skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            }
          }
          setSkills(parsedSkills);
          setExperience(JSON.parse(data.experience || "[]"));
          setEducation(JSON.parse(data.education || "[]"));
          setProjects(JSON.parse(data.projects || "[]"));
          setAchievements(JSON.parse(data.achievements || "[]"));
          setLoadingResume(false);
        })
        .catch(() => setLoadingResume(false));
    }
    // eslint-disable-next-line
  }, [resumeId]);

  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for section visibility - remove strengths and references by default
  const [visibleSections, setVisibleSections] = useState({
    achievements: true,
    projects: true,
  })

  // Load form state from localStorage if available
  function loadFormState() {
    try {
      const saved = localStorage.getItem("resumeFormState")
      if (!saved) return null
      return JSON.parse(saved)
    } catch {
      return null
    }
  }
  const savedState = typeof window !== "undefined" ? loadFormState() : null

  const [personal, setPersonal] = useState(
    savedState?.personal || {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      title: "",
      linkedin: "",
      summary: "",
      profileImage: "",
      profileImageFile: null as File | null,
    },
  )

  const [experience, setExperience] = useState(
    savedState?.experience || [
      {
        company: "",
        role: "",
        startDate: "",
        endDate: "",
        location: "",
        details: [""],
      },
    ],
  )

  const [education, setEducation] = useState(
    savedState?.education || [
      {
        school: "",
        degree: "",
        startDate: "",
        endDate: "",
        location: "",
      },
    ],
  )

  const [skills, setSkills] = useState(
    savedState?.skills || {
      frontend: [""],
      backend: [""],
      databases: [""],
      other: [""],
    },
  )

  const [achievements, setAchievements] = useState(
    savedState?.achievements || [
      {
        title: "",
        description: "",
        link: "",
      },
    ],
  )

  // Update the projects state to include a link field
  const [projects, setProjects] = useState(
    savedState?.projects || [
      {
        name: "",
        description: "",
        link: "", // Add link field
      },
    ],
  )

  // Save form state to localStorage on every change
  function saveFormState(newState: any) {
    try {
      localStorage.setItem("resumeFormState", JSON.stringify(newState))
    } catch {}
  }

  // Use effects to persist changes
  useEffect(() => {
    saveFormState({ personal, experience, education, skills, projects, achievements })
  }, [personal, experience, education, skills, projects, achievements])

  // Handle file upload for profile image
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Convert image to base64 for persistence
      const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })
      const imageBase64 = await toBase64(file)
      setPersonal({
        ...personal,
        profileImage: imageBase64,
        profileImageFile: file,
      })
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Handle adding new items to arrays
  const addExperience = () => {
    setExperience([...experience, { company: "", role: "", startDate: "", endDate: "", location: "", details: [""] }])
  }

  const addEducation = () => {
    setEducation([...education, { school: "", degree: "", startDate: "", endDate: "", location: "" }])
  }

  const addSkill = (category: string) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [category]: [...prevSkills[category], ""],
    }))
  }

  // Update the addProject function to include the link field
  const addProject = () => {
    setProjects([...projects, { name: "", description: "", link: "" }])
  }

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", description: "", link: "" }])
  }

  // Handle adding bullet points to experience
  const addExperienceDetail = (expIndex: number) => {
    const updatedExperience = [...experience]
    updatedExperience[expIndex].details.push("")
    setExperience(updatedExperience)
  }

  // Handle removing items
  const removeExperience = (index: number) => {
    setExperience(experience.filter((_: any, i: number) => i !== index))
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_: any, i: number) => i !== index))
  }

  const removeSkill = (category: string, index: number) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [category]: prevSkills[category].filter((_, i) => i !== index),
    }))
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_: any, i: number) => i !== index))
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_: any, i: number) => i !== index))
  }

  const removeExperienceDetail = (expIndex: number, detailIndex: number) => {
    const updatedExperience = [...experience]
    updatedExperience[expIndex].details = updatedExperience[expIndex].details.filter(
      (_: any, i: number) => i !== detailIndex,
    )
    setExperience(updatedExperience)
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()

    // Prepare data for backend according to ResumeCreate schema
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      alert("You must be logged in to save your resume.")
      return
    }

    // Compose name and contact
    const name = `${personal.firstName} ${personal.lastName}`.trim()
    const contact = `${personal.email}, ${personal.phone}, ${personal.address}`

    // Convert arrays/objects to string (JSON or joined)
    const skillsStr = JSON.stringify(skills)
    const experienceStr = JSON.stringify(experience)
    const educationStr = JSON.stringify(education)
    const projectsStr = JSON.stringify(visibleSections.projects ? projects : [])
    const achievementsStr = JSON.stringify(visibleSections.achievements ? achievements : [])

    // Prepare payload for backend
    const payload = {
      name,
      summary: personal.summary,
      skills: skillsStr,
      experience: experienceStr,
      education: educationStr,
      projects: projectsStr,
      achievements: achievementsStr,
      strengths: "[]", // Empty array as string
      references: "[]", // Empty array as string
      contact,
      title: personal.title,
      profileImage: personal.profileImage, // Save base64 image
      content: "", // Optional, not used in UI
    }

    try {
      let res;
      if (resumeId) {
        // PATCH to update existing resume
        res = await fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } else {
        // POST to create new resume
        res = await fetch("http://127.0.0.1:8000/api/resumes/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired or not authenticated. Please log in again.");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        const msg = await res.text();
        throw new Error(msg || "Failed to save resume");
      }
      const newResume = await res.json();
      router.push(`/dashboard/resume-preview?resume_id=${newResume.resume_id || resumeId}`);
    } catch (err: any) {
      if (err.message.includes("401")) {
        alert("Session expired or not authenticated. Please log in again.");
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        alert("Error saving resume: " + (err?.message || "Unknown error"));
      }
      console.error("Resume save error:", err);
    }
  }

  if (loadingResume) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading resume for editing...</h1>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <User className="mr-2 h-6 w-6 text-gray-600" />
        Create Your Professional Resume
      </h1>

      <form onSubmit={handleGenerate} className="space-y-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-6 mb-6">
            <TabsTrigger value="personal" className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">1. Personal</span>
              <span className="sm:hidden">1</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">2. Experience</span>
              <span className="sm:hidden">2</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2 text-sm">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">3. Education</span>
              <span className="sm:hidden">3</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2 text-sm">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">4. Skills</span>
              <span className="sm:hidden">4</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2 text-sm">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">5. Projects</span>
              <span className="sm:hidden">5</span>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4" />
              <span className="hidden sm:inline">6. Certificates</span>
              <span className="sm:hidden">6</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Section */}
          <TabsContent value="personal">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <User className="mr-2 h-5 w-5 text-gray-500" />
                  Personal Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">First Name</label>
                    <Input
                      placeholder="First Name"
                      value={personal.firstName}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, firstName: e.target.value }))}
                      required
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Last Name</label>
                    <Input
                      placeholder="Last Name"
                      value={personal.lastName}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, lastName: e.target.value }))}
                      required
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">Professional Title</label>
                    <Input
                      placeholder="e.g. Full Stack Developer"
                      value={personal.title}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, title: e.target.value }))}
                      required
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Phone className="mr-1 h-4 w-4 text-gray-500" />
                      Phone
                    </label>
                    <Input
                      placeholder="e.g. +91 98765 43210"
                      value={personal.phone}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, phone: e.target.value }))}
                      required
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <Mail className="mr-1 h-4 w-4 text-gray-500" />
                      Email
                    </label>
                    <Input
                      placeholder="e.g. ranjith.kumar@email.com"
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, email: e.target.value }))}
                      required
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-600">LinkedIn URL</label>
                    <Input
                      placeholder="www.linkedin.com/in/your-profile"
                      value={personal.linkedin}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, linkedin: e.target.value }))}
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-600 flex items-center">
                      <MapPin className="mr-1 h-4 w-4 text-gray-500" />
                      Address
                    </label>
                    <Input
                      placeholder="e.g. Chennai"
                      value={personal.address}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, address: e.target.value }))}
                      required
                      className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-600">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="https://example.com/your-image.jpg"
                        value={personal.profileImage}
                        onChange={(e) => setPersonal((p: any) => ({ ...p, profileImage: e.target.value }))}
                        className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                      <span className="text-sm text-gray-500">OR</span>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={triggerFileInput}
                        className="border-gray-300 hover:bg-gray-100"
                      >
                        <Upload className="h-4 w-4 mr-2 text-gray-500" /> Upload
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    {personal.profileImage && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                          <img
                            src={personal.profileImage || "/placeholder.svg"}
                            alt="Profile preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-500">Preview</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-600">Professional Summary</label>
                    <Textarea
                      placeholder="Brief overview of your professional background and key strengths"
                      value={personal.summary}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, summary: e.target.value }))}
                      className="min-h-[100px] border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2 text-gray-700">Optional Sections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-achievements"
                        checked={visibleSections.achievements}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, achievements: checked === true })
                        }
                      />
                      <Label htmlFor="show-achievements" className="text-gray-600">
                        Include Certificates Section
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-projects"
                        checked={visibleSections.projects}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, projects: checked === true })
                        }
                      />
                      <Label htmlFor="show-projects" className="text-gray-600">
                        Include Projects Section
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button
                    type="button"
                    onClick={() => document.querySelector('[data-value="experience"]')?.click()}
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    Next: Experience
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Section */}
          <TabsContent value="experience">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <Briefcase className="mr-2 h-5 w-5 text-gray-500" />
                    Professional Experience
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExperience}
                    className="border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Experience
                  </Button>
                </div>

                {experience.map((exp, idx) => (
                  <div key={idx} className="mb-8 border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Position {idx + 1}</h3>
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExperience(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Company/Organization</label>
                        <Input
                          placeholder="Company Name"
                          value={exp.company}
                          onChange={(e) =>
                            setExperience((exps) =>
                              exps.map((ex, i) => (i === idx ? { ...ex, company: e.target.value } : ex)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Job Title</label>
                        <Input
                          placeholder="Your Role"
                          value={exp.role}
                          onChange={(e) =>
                            setExperience((exps) =>
                              exps.map((ex, i) => (i === idx ? { ...ex, role: e.target.value } : ex)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Start Date</label>
                        <Input
                          placeholder="e.g. Jan 2020"
                          value={exp.startDate}
                          onChange={(e) =>
                            setExperience((exps) =>
                              exps.map((ex, i) => (i === idx ? { ...ex, startDate: e.target.value } : ex)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">End Date</label>
                        <Input
                          placeholder="e.g. Present"
                          value={exp.endDate}
                          onChange={(e) =>
                            setExperience((exps) =>
                              exps.map((ex, i) => (i === idx ? { ...ex, endDate: e.target.value } : ex)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <Input
                          placeholder="City, State"
                          value={exp.location}
                          onChange={(e) =>
                            setExperience((exps) =>
                              exps.map((ex, i) => (i === idx ? { ...ex, location: e.target.value } : ex)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-600">Key Responsibilities & Achievements</label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addExperienceDetail(idx)}
                          className="border-gray-300 hover:bg-gray-100 text-gray-700"
                        >
                          <PlusCircle className="h-4 w-4 mr-1 text-gray-500" /> Add Bullet
                        </Button>
                      </div>

                      {exp.details.map((detail, detailIdx) => (
                        <div key={detailIdx} className="flex gap-2 items-center">
                          <Input
                            placeholder="Describe your achievement or responsibility"
                            value={detail}
                            onChange={(e) => {
                              const updatedExperience = [...experience]
                              updatedExperience[idx].details[detailIdx] = e.target.value
                              setExperience(updatedExperience)
                            }}
                            required
                            className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          />
                          {detailIdx > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExperienceDetail(idx, detailIdx)}
                              className="text-red-500 hover:text-red-700 p-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="personal"]')?.click()}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Previous: Personal
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.querySelector('[data-value="education"]')?.click()}
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    Next: Education
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Section */}
          <TabsContent value="education">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-gray-500" />
                    Education
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addEducation}
                    className="border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Education
                  </Button>
                </div>

                {education.map((edu, idx) => (
                  <div key={idx} className="mb-8 border-b border-gray-200 pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Education {idx + 1}</h3>
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEducation(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">School/University</label>
                        <Input
                          placeholder="Institution Name"
                          value={edu.school}
                          onChange={(e) =>
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, school: e.target.value } : ed)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Degree</label>
                        <Input
                          placeholder="e.g. Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) =>
                            setEducation((edus: any[]) =>
                              edus.map((ed: any, i: any) => (i === idx ? { ...ed, degree: e.target.value } : ed)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Start Year</label>
                        <Input
                          placeholder="e.g. 2016"
                          value={edu.startDate}
                          onChange={(e) =>
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, startDate: e.target.value } : ed)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">End Year</label>
                        <Input
                          placeholder="e.g. 2020"
                          value={edu.endDate}
                          onChange={(e) =>
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, endDate: e.target.value } : ed)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-600">Location</label>
                        <Input
                          placeholder="City, State"
                          value={edu.location}
                          onChange={(e) =>
                            setEducation((edus: any[]) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, location: e.target.value } : ed)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="experience"]')?.click()}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Previous: Experience
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.querySelector('[data-value="skills"]')?.click()}
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    Next: Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
                  <Code className="mr-2 h-5 w-5 text-gray-500" />
                  Technical Skills
                </h2>

                {/* Frontend Skills */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Frontend Technologies</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill("frontend")}
                      className="border-gray-300 hover:bg-gray-100 text-gray-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Frontend Skill
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {skills.frontend.map((skill, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          placeholder="e.g. React.js, HTML5, CSS3"
                          value={skill}
                          onChange={(e) => {
                            const updatedSkills = { ...skills }
                            updatedSkills.frontend[idx] = e.target.value
                            setSkills(updatedSkills)
                          }}
                          required={idx === 0}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                        {idx > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill("frontend", idx)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Backend Skills */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Backend Technologies</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill("backend")}
                      className="border-gray-300 hover:bg-gray-100 text-gray-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Backend Skill
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {skills.backend.map((skill, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          placeholder="e.g. Node.js, Express.js, FastAPI"
                          value={skill}
                          onChange={(e) => {
                            const updatedSkills = { ...skills }
                            updatedSkills.backend[idx] = e.target.value
                            setSkills(updatedSkills)
                          }}
                          required={idx === 0}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                        {idx > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill("backend", idx)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Database Skills */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Databases</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill("databases")}
                      className="border-gray-300 hover:bg-gray-100 text-gray-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Database Skill
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {skills.databases.map((skill, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          placeholder="e.g. MongoDB, MySQL, PostgreSQL"
                          value={skill}
                          onChange={(e) => {
                            const updatedSkills = { ...skills }
                            updatedSkills.databases[idx] = e.target.value
                            setSkills(updatedSkills)
                          }}
                          required={idx === 0}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                        {idx > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill("databases", idx)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other Skills */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-700">Other Skills</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addSkill("other")}
                      className="border-gray-300 hover:bg-gray-100 text-gray-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Other Skill
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {skills.other.map((skill, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <Input
                          placeholder="e.g. Git, Docker, AWS"
                          value={skill}
                          onChange={(e) => {
                            const updatedSkills = { ...skills }
                            updatedSkills.other[idx] = e.target.value
                            setSkills(updatedSkills)
                          }}
                          required={idx === 0}
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                        {idx > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSkill("other", idx)}
                            className="text-red-500 hover:text-red-700 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="education"]')?.click()}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Previous: Education
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.querySelector('[data-value="projects"]')?.click()}
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    Next: Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Section */}
          <TabsContent value="projects">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <FolderKanban className="mr-2 h-5 w-5 text-gray-500" />
                    Projects
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addProject}
                    className="border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Project
                  </Button>
                </div>

                {projects.map((project, idx) => (
                  <div key={idx} className="mb-6 border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Project {idx + 1}</h3>
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProject(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Project Name</label>
                        <Input
                          placeholder="Project Title"
                          value={project.name}
                          onChange={(e) =>
                            setProjects((projects: any[]) =>
                              projects.map((p: any, i: any) => (i === idx ? { ...p, name: e.target.value } : p)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Description</label>
                        <Textarea
                          placeholder="Brief description of the project and your role"
                          value={project.description}
                          onChange={(e) =>
                            setProjects((projects: any[]) =>
                              projects.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p)),
                            )
                          }
                          className="min-h-[80px] border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Project Link (Optional)</label>
                        <Input
                          placeholder="e.g. https://github.com/your-project"
                          value={project.link}
                          onChange={(e) =>
                            setProjects((projects: any[]) =>
                              projects.map((p, i) => (i === idx ? { ...p, link: e.target.value } : p)),
                            )
                          }
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="skills"]')?.click()}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Previous: Skills
                  </Button>
                  <Button
                    type="button"
                    onClick={() => document.querySelector('[data-value="achievements"]')?.click()}
                    className="bg-gray-700 hover:bg-gray-800"
                  >
                    Next: Certificates
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Section */}
          <TabsContent value="achievements">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                    <Award className="mr-2 h-5 w-5 text-gray-500" />
                    Certificates
                  </h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAchievement}
                    className="border-gray-300 hover:bg-gray-100 text-gray-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2 text-gray-500" /> Add Certificate
                  </Button>
                </div>

                {achievements.map((achievement, idx) => (
                  <div key={idx} className="mb-6 border-b border-gray-200 pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-700">Certificate {idx + 1}</h3>
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAchievement(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Title</label>
                        <Input
                          placeholder="e.g. AWS Certified Solutions Architect"
                          value={achievement.title}
                          onChange={(e) =>
                            setAchievements((achievements: any[]) =>
                              achievements.map((a, i) => (i === idx ? { ...a, title: e.target.value } : a)),
                            )
                          }
                          required
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Description</label>
                        <Textarea
                          placeholder="e.g. Issued by Amazon Web Services, May 2023"
                          value={achievement.description}
                          onChange={(e) =>
                            setAchievements((achievements: any[]) =>
                              achievements.map((a, i) => (i === idx ? { ...a, description: e.target.value } : a)),
                            )
                          }
                          className="min-h-[80px] border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Certificate Link (Optional)</label>
                        <Input
                          placeholder="e.g. https://www.credential.net/your-certificate"
                          value={achievement.link}
                          onChange={(e) =>
                            setAchievements((achievements: any[]) =>
                              achievements.map((a, i) => (i === idx ? { ...a, link: e.target.value } : a)),
                            )
                          }
                          className="border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.querySelector('[data-value="projects"]')?.click()}
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    Previous: Projects
                  </Button>
                  <Button type="submit" className="bg-gray-700 hover:bg-gray-800">
                    Preview Resume
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-300 hover:bg-gray-100"
          >
            Back
          </Button>
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => {
                // Save current form state
                saveFormState({ personal, experience, education, skills, projects, achievements })
                // Show success message
                alert("Form progress saved! You can continue later.")
              }}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              Save Progress
            </Button>
            <Button type="submit" size="lg" className="px-8 bg-gray-700 hover:bg-gray-800">
              Preview Resume
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
