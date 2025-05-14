"use client"
import React, { useState, useRef } from "react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Upload } from "lucide-react"

export default function CreateResume() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for section visibility
  // Update the visibleSections state to disable strengths and references by default
  const [visibleSections, setVisibleSections] = useState({
    strengths: false,
    achievements: true,
    references: false,
    projects: true,
  })

  // State for all fields
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

  // Update the skills state to support categories
  const [skills, setSkills] = useState(
    savedState?.skills || {
      frontend: [""],
      backend: [""],
      databases: [""],
      other: [""],
    },
  )

  // Update the achievements state to include links
  const [achievements, setAchievements] = useState(
    savedState?.achievements || [
      {
        title: "",
        description: "",
        link: "",
      },
    ],
  )

  const [strengths, setStrengths] = useState(
    savedState?.strengths || [
      {
        title: "",
        description: "",
      },
    ],
  )

  const [references, setReferences] = useState(
    savedState?.references || [
      { name: "", title: "", company: "", phone: "", email: "" },
      { name: "", title: "", company: "", phone: "", email: "" },
    ],
  )

  const [projects, setProjects] = useState(
    savedState?.projects || [
      {
        name: "",
        description: "",
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
  React.useEffect(() => {
    saveFormState({ personal, experience, education, skills, projects, achievements, strengths, references })
  }, [personal, experience, education, skills, projects, achievements, strengths, references])

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

  // Replace the addSkill function with category-based skill functions
  const addSkill = (category: string) => {
    setSkills((prevSkills) => ({
      ...prevSkills,
      [category]: [...prevSkills[category], ""],
    }))
  }

  const addProject = () => {
    setProjects([...projects, { name: "", description: "" }])
  }

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", description: "", link: "" }])
  }

  const addStrength = () => {
    setStrengths([...strengths, { title: "", description: "" }])
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

  // Replace the removeSkill function with category-based skill removal
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

  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_: any, i: number) => i !== index))
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
    // Flatten and join arrays/objects as needed
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      alert("You must be logged in to save your resume.")
      return
    }
    // Compose name and contact
    const name = `${personal.firstName} ${personal.lastName}`.trim()
    const contact = `${personal.email}, ${personal.phone}, ${personal.address}`
    // Convert arrays/objects to string (JSON or joined)
    // Replace the skillsStr line in handleGenerate with:
    const skillsStr = JSON.stringify(skills)
    const experienceStr = JSON.stringify(experience)
    const educationStr = JSON.stringify(education)
    const projectsStr = JSON.stringify(visibleSections.projects ? projects : [])
    const achievementsStr = JSON.stringify(visibleSections.achievements ? achievements : [])
    const strengthsStr = JSON.stringify(visibleSections.strengths ? strengths : [])
    const referencesStr = JSON.stringify(visibleSections.references ? references : [])
    // Prepare payload for backend
    const payload = {
      name,
      summary: personal.summary,
      skills: skillsStr,
      experience: experienceStr,
      education: educationStr,
      projects: projectsStr,
      achievements: achievementsStr,
      strengths: strengthsStr,
      references: referencesStr,
      contact,
      title: personal.title,
      profileImage: personal.profileImage, // Save base64 image
      content: "", // Optional, not used in UI
    }
    try {
      const res = await fetch("http://127.0.0.1:8000/api/resumes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        if (res.status === 401) {
          alert("Session expired or not authenticated. Please log in again.")
          localStorage.removeItem("token")
          router.push("/login")
          return
        }
        const msg = await res.text()
        throw new Error(msg || "Failed to save resume")
      }
      const newResume = await res.json()
      // Do NOT clear localStorage here; keep form state for back navigation
      // localStorage.removeItem('resumeFormState');
      // Optionally, pass the backend resume ID to the preview page for fetching
      router.push(`/dashboard/resume-preview?resume_id=${newResume.resume_id}`)
    } catch (err: any) {
      if (err.message.includes("401")) {
        alert("Session expired or not authenticated. Please log in again.")
        localStorage.removeItem("token")
        router.push("/login")
      } else {
        alert("Error saving resume: " + (err?.message || "Unknown error"))
      }
      console.error("Resume save error:", err)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Create Your Professional Resume</h1>
      <form onSubmit={handleGenerate} className="space-y-8">
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-4 md:grid-cols-8 mb-6">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="achievements">Certificates</TabsTrigger>
            <TabsTrigger value="strengths">Strengths</TabsTrigger>
            <TabsTrigger value="references">References</TabsTrigger>
          </TabsList>

          {/* Personal Section */}
          <TabsContent value="personal">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      placeholder="First Name"
                      value={personal.firstName}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      placeholder="Last Name"
                      value={personal.lastName}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, lastName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Professional Title</label>
                    <Input
                      placeholder="e.g. Full Stack Developer"
                      value={personal.title}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="e.g. +91 98765 43210"
                      value={personal.phone}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input
                      placeholder="www.linkedin.com/in/your-profile"
                      value={personal.linkedin}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, linkedin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      placeholder="City, State"
                      value={personal.address}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="https://example.com/your-image.jpg"
                        value={personal.profileImage}
                        onChange={(e) => setPersonal((p: any) => ({ ...p, profileImage: e.target.value }))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">OR</span>
                      <Button type="button" variant="outline" onClick={triggerFileInput}>
                        <Upload className="h-4 w-4 mr-2" /> Upload
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
                    <label className="text-sm font-medium">Professional Summary</label>
                    <Textarea
                      placeholder="Brief overview of your professional background and key strengths"
                      value={personal.summary}
                      onChange={(e) => setPersonal((p: any) => ({ ...p, summary: e.target.value }))}
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </div>

                {/* Update the Personal section to remove strength and reference options */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">Optional Sections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-achievements"
                        checked={visibleSections.achievements}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, achievements: checked === true })
                        }
                      />
                      <Label htmlFor="show-achievements">Include Certificates Section</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-projects"
                        checked={visibleSections.projects}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, projects: checked === true })
                        }
                      />
                      <Label htmlFor="show-projects">Include Projects Section</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Section */}
          <TabsContent value="experience">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Professional Experience</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addExperience}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Experience
                  </Button>
                </div>

                {experience.map(
                  (
                    exp: {
                      company: string | number | readonly string[] | undefined
                      role: string | number | readonly string[] | undefined
                      startDate: string | number | readonly string[] | undefined
                      endDate: string | number | readonly string[] | undefined
                      location: string | number | readonly string[] | undefined
                      details: any[]
                    },
                    idx: React.Key | null | undefined,
                  ) => (
                    <div key={idx} className="mb-8 border-b pb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Position {idx + 1}</h3>
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
                          <label className="text-sm font-medium">Company/Organization</label>
                          <Input
                            placeholder="Company Name"
                            value={exp.company}
                            onChange={(e) =>
                              setExperience((exps) =>
                                exps.map((ex, i) => (i === idx ? { ...ex, company: e.target.value } : ex)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Job Title</label>
                          <Input
                            placeholder="Your Role"
                            value={exp.role}
                            onChange={(e) =>
                              setExperience((exps) =>
                                exps.map((ex, i) => (i === idx ? { ...ex, role: e.target.value } : ex)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Start Date</label>
                          <Input
                            placeholder="e.g. Jan 2020"
                            value={exp.startDate}
                            onChange={(e) =>
                              setExperience((exps) =>
                                exps.map((ex, i) => (i === idx ? { ...ex, startDate: e.target.value } : ex)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">End Date</label>
                          <Input
                            placeholder="e.g. Present"
                            value={exp.endDate}
                            onChange={(e) =>
                              setExperience((exps) =>
                                exps.map((ex, i) => (i === idx ? { ...ex, endDate: e.target.value } : ex)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium">Location</label>
                          <Input
                            placeholder="City, State"
                            value={exp.location}
                            onChange={(e) =>
                              setExperience((exps) =>
                                exps.map((ex, i) => (i === idx ? { ...ex, location: e.target.value } : ex)),
                              )
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Key Responsibilities & Achievements</label>
                          <Button type="button" variant="outline" size="sm" onClick={() => addExperienceDetail(idx)}>
                            <PlusCircle className="h-4 w-4 mr-1" /> Add Bullet
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
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Section */}
          <TabsContent value="education">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Education</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addEducation}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Education
                  </Button>
                </div>

                {education.map((edu, idx) => (
                  <div key={idx} className="mb-8 border-b pb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Education {idx + 1}</h3>
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
                        <label className="text-sm font-medium">School/University</label>
                        <Input
                          placeholder="Institution Name"
                          value={edu.school}
                          onChange={(e) =>
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, school: e.target.value } : ed)),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Degree</label>
                        <Input
                          placeholder="e.g. Bachelor of Science"
                          value={edu.degree}
                          onChange={(e) =>
                            setEducation((edus: any[]) =>
                              edus.map((ed: any, i: any) => (i === idx ? { ...ed, degree: e.target.value } : ed)),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Year</label>
                        <Input
                          placeholder="e.g. 2016"
                          value={edu.startDate}
                          onChange={(e) =>
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, startDate: e.target.value } : ed)),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Year</label>
                        <Input
                          placeholder="e.g. 2020"
                          value={edu.endDate}
                          onChange={(e) =>
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, endDate: e.target.value } : ed)),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="City, State"
                          value={edu.location}
                          onChange={(e) =>
                            setEducation((edus: any[]) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, location: e.target.value } : ed)),
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Technical Skills</h2>

                {/* Frontend Skills */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Frontend Technologies</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkill("frontend")}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Frontend Skill
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
                    <h3 className="font-medium">Backend Technologies</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkill("backend")}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Backend Skill
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
                    <h3 className="font-medium">Databases</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkill("databases")}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Database Skill
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
                    <h3 className="font-medium">Other Skills</h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => addSkill("other")}>
                      <PlusCircle className="h-4 w-4 mr-2" /> Add Other Skill
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Section */}
          <TabsContent value="projects">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addProject}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Project
                  </Button>
                </div>

                {projects.map(
                  (
                    project: {
                      name: string | number | readonly string[] | undefined
                      description: string | number | readonly string[] | undefined
                    },
                    idx: React.Key | null | undefined,
                  ) => (
                    <div key={idx} className="mb-6 border-b pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Project {idx + 1}</h3>
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
                          <label className="text-sm font-medium">Project Name</label>
                          <Input
                            placeholder="Project Title"
                            value={project.name}
                            onChange={(e) =>
                              setProjects((projects: any[]) =>
                                projects.map((p: any, i: any) => (i === idx ? { ...p, name: e.target.value } : p)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="Brief description of the project and your role"
                            value={project.description}
                            onChange={(e) =>
                              setProjects((projects: any[]) =>
                                projects.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p)),
                              )
                            }
                            className="min-h-[80px]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Section */}
          <TabsContent value="achievements">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Certificates</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Certificate
                  </Button>
                </div>

                {achievements.map(
                  (
                    achievement: {
                      title: string | number | readonly string[] | undefined
                      description: string | number | readonly string[] | undefined
                      link?: string | number | readonly string[] | undefined
                    },
                    idx: React.Key | null | undefined,
                  ) => (
                    <div key={idx} className="mb-6 border-b pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Certificate {idx + 1}</h3>
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
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            placeholder="e.g. AWS Certified Solutions Architect"
                            value={achievement.title}
                            onChange={(e) =>
                              setAchievements((achievements: any[]) =>
                                achievements.map((a, i) => (i === idx ? { ...a, title: e.target.value } : a)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="e.g. Issued by Amazon Web Services, May 2023"
                            value={achievement.description}
                            onChange={(e) =>
                              setAchievements((achievements: any[]) =>
                                achievements.map((a, i) => (i === idx ? { ...a, description: e.target.value } : a)),
                              )
                            }
                            className="min-h-[80px]"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Certificate Link (Optional)</label>
                          <Input
                            placeholder="e.g. https://www.credential.net/your-certificate"
                            value={achievement.link}
                            onChange={(e) =>
                              setAchievements((achievements: any[]) =>
                                achievements.map((a, i) => (i === idx ? { ...a, link: e.target.value } : a)),
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Strengths Section */}
          <TabsContent value="strengths">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Personal Strengths</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addStrength}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Strength
                  </Button>
                </div>

                {strengths.map(
                  (
                    strength: {
                      title: string | number | readonly string[] | undefined
                      description: string | number | readonly string[] | undefined
                    },
                    idx: React.Key | null | undefined,
                  ) => (
                    <div key={idx} className="mb-6 border-b pb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold">Strength {idx + 1}</h3>
                        {idx > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStrength(idx)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Title</label>
                          <Input
                            placeholder="e.g. Critical Thinking"
                            value={strength.title}
                            onChange={(e) =>
                              setStrengths((strengths: any[]) =>
                                strengths.map((s, i) => (i === idx ? { ...s, title: e.target.value } : s)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          <Textarea
                            placeholder="Describe this strength"
                            value={strength.description}
                            onChange={(e) =>
                              setStrengths((strengths: any[]) =>
                                strengths.map((s: any, i: any) =>
                                  i === idx ? { ...s, description: e.target.value } : s,
                                ),
                              )
                            }
                            className="min-h-[80px]"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* References Section */}
          <TabsContent value="references">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">References</h2>
                <p className="mb-4 text-muted-foreground">Please list two (2) professional references.</p>

                {references.map(
                  (
                    ref: {
                      name: string | number | readonly string[] | undefined
                      title: string | number | readonly string[] | undefined
                      company: string | number | readonly string[] | undefined
                      phone: string | number | readonly string[] | undefined
                      email: string | number | readonly string[] | undefined
                    },
                    idx: React.Key | null | undefined,
                  ) => (
                    <div key={idx} className="mb-8 border-b pb-6">
                      <h3 className="font-bold mb-4">Reference {idx + 1}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Full Name</label>
                          <Input
                            placeholder="Full Name"
                            value={ref.name}
                            onChange={(e) =>
                              setReferences((refs: any[]) =>
                                refs.map((r, i) => (i === idx ? { ...r, name: e.target.value } : r)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Job Title</label>
                          <Input
                            placeholder="e.g. Head of Engineering"
                            value={ref.title}
                            onChange={(e) =>
                              setReferences((refs: any[]) =>
                                refs.map((r, i) => (i === idx ? { ...r, title: e.target.value } : r)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Company</label>
                          <Input
                            placeholder="Company Name"
                            value={ref.company}
                            onChange={(e) =>
                              setReferences((refs: any[]) =>
                                refs.map((r, i) => (i === idx ? { ...r, company: e.target.value } : r)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Phone Number</label>
                          <Input
                            placeholder="Phone Number"
                            value={ref.phone}
                            onChange={(e) =>
                              setReferences((refs: any[]) =>
                                refs.map((r: any, i: any) => (i === idx ? { ...r, phone: e.target.value } : r)),
                              )
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            placeholder="Email Address"
                            type="email"
                            value={ref.email}
                            onChange={(e) =>
                              setReferences((refs: any[]) =>
                                refs.map((r, i) => (i === idx ? { ...r, email: e.target.value } : r)),
                              )
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="px-8">
            Preview Resume
          </Button>
        </div>
      </form>
    </div>
  )
}
