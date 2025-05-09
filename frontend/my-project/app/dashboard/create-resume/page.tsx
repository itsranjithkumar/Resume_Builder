"use client"
import { useState, useRef } from "react"
import type React from "react"

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
  const [visibleSections, setVisibleSections] = useState({
    strengths: true,
    achievements: true,
    references: true,
    projects: true,
  })

  // State for all fields
  const [personal, setPersonal] = useState({
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
  })

  const [experience, setExperience] = useState([
    {
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
      details: [""],
    },
  ])

  const [education, setEducation] = useState([
    {
      school: "",
      degree: "",
      startDate: "",
      endDate: "",
      location: "",
    },
  ])

  const [skills, setSkills] = useState([""])

  const [projects, setProjects] = useState([
    {
      name: "",
      description: "",
    },
  ])

  const [achievements, setAchievements] = useState([
    {
      title: "",
      description: "",
    },
  ])

  const [strengths, setStrengths] = useState([
    {
      title: "",
      description: "",
    },
  ])

  const [references, setReferences] = useState([
    { name: "", title: "", company: "", phone: "", email: "" },
    { name: "", title: "", company: "", phone: "", email: "" },
  ])

  // Handle file upload for profile image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const imageUrl = URL.createObjectURL(file)
      setPersonal({
        ...personal,
        profileImage: imageUrl,
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

  const addSkill = () => {
    setSkills([...skills, ""])
  }

  const addProject = () => {
    setProjects([...projects, { name: "", description: "" }])
  }

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", description: "" }])
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
    setExperience(experience.filter((_, i) => i !== index))
  }

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index))
  }

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index))
  }

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index))
  }

  const removeAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index))
  }

  const removeStrength = (index: number) => {
    setStrengths(strengths.filter((_, i) => i !== index))
  }

  const removeExperienceDetail = (expIndex: number, detailIndex: number) => {
    const updatedExperience = [...experience]
    updatedExperience[expIndex].details = updatedExperience[expIndex].details.filter((_, i) => i !== detailIndex)
    setExperience(updatedExperience)
  }

  function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    const resumeData = {
      personal,
      experience,
      education,
      skills,
      projects: visibleSections.projects ? projects : [],
      achievements: visibleSections.achievements ? achievements : [],
      strengths: visibleSections.strengths ? strengths : [],
      references: visibleSections.references ? references : [],
      visibleSections,
    }
    router.push("/dashboard/resume-preview?data=" + encodeURIComponent(JSON.stringify(resumeData)))
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
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
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
                      onChange={(e) => setPersonal((p) => ({ ...p, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      placeholder="Last Name"
                      value={personal.lastName}
                      onChange={(e) => setPersonal((p) => ({ ...p, lastName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Professional Title</label>
                    <Input
                      placeholder="e.g. Full Stack Developer"
                      value={personal.title}
                      onChange={(e) => setPersonal((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      placeholder="e.g. +91 98765 43210"
                      value={personal.phone}
                      onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      placeholder="your.email@example.com"
                      type="email"
                      value={personal.email}
                      onChange={(e) => setPersonal((p) => ({ ...p, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn URL</label>
                    <Input
                      placeholder="www.linkedin.com/in/your-profile"
                      value={personal.linkedin}
                      onChange={(e) => setPersonal((p) => ({ ...p, linkedin: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input
                      placeholder="City, State"
                      value={personal.address}
                      onChange={(e) => setPersonal((p) => ({ ...p, address: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium">Profile Image</label>
                    <div className="flex items-center gap-4">
                      <Input
                        placeholder="https://example.com/your-image.jpg"
                        value={personal.profileImage}
                        onChange={(e) => setPersonal((p) => ({ ...p, profileImage: e.target.value }))}
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
                      onChange={(e) => setPersonal((p) => ({ ...p, summary: e.target.value }))}
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">Optional Sections</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-strengths"
                        checked={visibleSections.strengths}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, strengths: checked === true })
                        }
                      />
                      <Label htmlFor="show-strengths">Include Strengths Section</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-achievements"
                        checked={visibleSections.achievements}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, achievements: checked === true })
                        }
                      />
                      <Label htmlFor="show-achievements">Include Key Achievements Section</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="show-references"
                        checked={visibleSections.references}
                        onCheckedChange={(checked: boolean) =>
                          setVisibleSections({ ...visibleSections, references: checked === true })
                        }
                      />
                      <Label htmlFor="show-references">Include References Section</Label>
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

                {experience.map((exp, idx) => (
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
                ))}
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
                            setEducation((edus) =>
                              edus.map((ed, i) => (i === idx ? { ...ed, degree: e.target.value } : ed)),
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
                            setEducation((edus) =>
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Technical Skills</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addSkill}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Skill
                  </Button>
                </div>

                <div className="space-y-4">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <Input
                        placeholder="e.g. JavaScript, Project Management, Data Analysis"
                        value={skill}
                        onChange={(e) => setSkills((skills) => skills.map((s, i) => (i === idx ? e.target.value : s)))}
                        required
                      />
                      {idx > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(idx)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
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

                {projects.map((project, idx) => (
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
                            setProjects((projects) =>
                              projects.map((p, i) => (i === idx ? { ...p, name: e.target.value } : p)),
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
                            setProjects((projects) =>
                              projects.map((p, i) => (i === idx ? { ...p, description: e.target.value } : p)),
                            )
                          }
                          className="min-h-[80px]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Section */}
          <TabsContent value="achievements">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Key Achievements</h2>
                  <Button type="button" variant="outline" size="sm" onClick={addAchievement}>
                    <PlusCircle className="h-4 w-4 mr-2" /> Add Achievement
                  </Button>
                </div>

                {achievements.map((achievement, idx) => (
                  <div key={idx} className="mb-6 border-b pb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold">Achievement {idx + 1}</h3>
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
                          placeholder="e.g. Cost Saving of $2M"
                          value={achievement.title}
                          onChange={(e) =>
                            setAchievements((achievements) =>
                              achievements.map((a, i) => (i === idx ? { ...a, title: e.target.value } : a)),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Describe how you achieved this"
                          value={achievement.description}
                          onChange={(e) =>
                            setAchievements((achievements) =>
                              achievements.map((a, i) => (i === idx ? { ...a, description: e.target.value } : a)),
                            )
                          }
                          className="min-h-[80px]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
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

                {strengths.map((strength, idx) => (
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
                            setStrengths((strengths) =>
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
                            setStrengths((strengths) =>
                              strengths.map((s, i) => (i === idx ? { ...s, description: e.target.value } : s)),
                            )
                          }
                          className="min-h-[80px]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* References Section */}
          <TabsContent value="references">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">References</h2>
                <p className="mb-4 text-muted-foreground">Please list two (2) professional references.</p>

                {references.map((ref, idx) => (
                  <div key={idx} className="mb-8 border-b pb-6">
                    <h3 className="font-bold mb-4">Reference {idx + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input
                          placeholder="Full Name"
                          value={ref.name}
                          onChange={(e) =>
                            setReferences((refs) =>
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
                            setReferences((refs) =>
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
                            setReferences((refs) =>
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
                            setReferences((refs) =>
                              refs.map((r, i) => (i === idx ? { ...r, phone: e.target.value } : r)),
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
                            setReferences((refs) =>
                              refs.map((r, i) => (i === idx ? { ...r, email: e.target.value } : r)),
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
