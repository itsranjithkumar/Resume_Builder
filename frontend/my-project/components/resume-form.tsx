"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, Upload, Eye } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ResumeFormProps {
  data: ResumeData
  onChange: (data: ResumeData) => void
  onPreview: () => void
}

import { useEffect } from "react";

export default function ResumeForm({ data, onChange, onPreview }: ResumeFormProps) {
  useEffect(() => {
    console.log("Resume JSON:", JSON.stringify(data, null, 2));
  }, [data]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(false);
  // Per-field loading states
  const [experienceAiLoading, setExperienceAiLoading] = useState<{ [id: string]: { [field: string]: boolean } }>({});
  const [educationAiLoading, setEducationAiLoading] = useState<{ [id: string]: { [field: string]: boolean } }>({});
  const [projectAiLoading, setProjectAiLoading] = useState<{ [id: string]: { [field: string]: boolean } }>({});
  const [certificationAiLoading, setCertificationAiLoading] = useState<{ [id: string]: { [field: string]: boolean } }>({});

  // Generic AI improvement handler for any field
  const improveFieldWithAI = async (section: string, id: string, field: string, value: string) => {
    let setLoading;
    let loadingKey;
    switch (section) {
      case 'experience': setLoading = setExperienceAiLoading; loadingKey = experienceAiLoading; break;
      case 'education': setLoading = setEducationAiLoading; loadingKey = educationAiLoading; break;
      case 'project': setLoading = setProjectAiLoading; loadingKey = projectAiLoading; break;
      case 'certification': setLoading = setCertificationAiLoading; loadingKey = certificationAiLoading; break;
      default: return;
    }
    setLoading((prev: any) => ({ ...prev, [id]: { ...prev[id], [field]: true } }));
    try {
      const res = await fetch("/api/ai-correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: value, field })
      });
      const result = await res.json();
      if (res.ok && result.text) {
        // Update the correct section/field
        if (section === 'experience') {
          const updated = data.experience.map((exp) => exp.id === id ? { ...exp, [field]: result.text } : exp);
          onChange({ ...data, experience: updated });
        } else if (section === 'education') {
          const updated = data.education.map((edu) => edu.id === id ? { ...edu, [field]: result.text } : edu);
          onChange({ ...data, education: updated });
        } else if (section === 'project') {
          const updated = data.projects.map((proj) => proj.id === id ? { ...proj, [field]: result.text } : proj);
          onChange({ ...data, projects: updated });
        } else if (section === 'certification') {
          const updated = data.certifications.map((cert) => cert.id === id ? { ...cert, [field]: result.text } : cert);
          onChange({ ...data, certifications: updated });
        }
        window.alert("Field improved with AI!");
      } else {
        window.alert(result.error || "AI improvement failed.");
      }
    } catch (e: any) {
      window.alert("AI improvement failed: " + (e?.message || e));
    } finally {
      setLoading((prev: any) => ({ ...prev, [id]: { ...prev[id], [field]: false } }));
    }
  };

  // AI improvement handler for summary field
  const improveWithAI = async () => {
    if (!data.summary.trim()) {
      window.alert("Please enter a professional summary before improving with AI.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai-correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.summary, field: "summary" })
      });
      const result = await res.json();
      if (res.ok && result.text) {
        onChange({ ...data, summary: result.text });
        window.alert("Summary improved with AI!");
      } else {
        window.alert(result.error || "AI improvement failed.");
      }
    } catch (e: any) {
      window.alert("AI improvement failed: " + (e?.message || e));
    } finally {
      setAiLoading(false);
    }
  };

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    })
  }

  const updateSummary = (value: string) => {
    onChange({ ...data, summary: value })
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    onChange({ ...data, experience: [...data.experience, newExp] })
  }

  const updateExperience = (id: string, field: string, value: string | boolean) => {
    const updated = data.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    onChange({ ...data, experience: updated })
  }

  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter((exp) => exp.id !== id) })
  }

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      location: "",
    }
    onChange({ ...data, education: [...data.education, newEdu] })
  }

  const updateEducation = (id: string, field: string, value: string) => {
    const updated = data.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    onChange({ ...data, education: updated })
  }

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((edu) => edu.id !== id) })
  }

  const addProject = () => {
    const newProject = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    }
    onChange({ ...data, projects: [...data.projects, newProject] })
  }

  const updateProject = (id: string, field: string, value: string) => {
    const updated = data.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project))
    onChange({ ...data, projects: updated })
  }

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter((project) => project.id !== id) })
  }

  const addSkill = () => {
    const newSkill = {
      id: Date.now().toString(),
      category: "",
      items: "",
    }
    onChange({ ...data, skills: [...data.skills, newSkill] })
  }

  const updateSkill = (id: string, field: string, value: string) => {
    const updated = data.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill))
    onChange({ ...data, skills: updated })
  }

  const removeSkill = (id: string) => {
    onChange({ ...data, skills: data.skills.filter((skill) => skill.id !== id) })
  }

  const addCertification = () => {
    const newCert = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
      link: "",
    }
    onChange({ ...data, certifications: [...data.certifications, newCert] })
  }

  const updateCertification = (id: string, field: string, value: string) => {
    const updated = data.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert))
    onChange({ ...data, certifications: updated })
  }

  const removeCertification = (id: string) => {
    onChange({ ...data, certifications: data.certifications.filter((cert) => cert.id !== id) })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        updatePersonalInfo("image", result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-8">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Upload Photo</span>
                  </Button>
                </Label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={data.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => updatePersonalInfo("email", e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.personalInfo.phone}
                onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo("location", e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={data.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo("linkedin", e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website/Portfolio</Label>
              <Input
                id="website"
                value={data.personalInfo.website}
                onChange={(e) => updatePersonalInfo("website", e.target.value)}
                placeholder="johndoe.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Professional Summary</CardTitle>
          <Button onClick={improveWithAI} disabled={aiLoading} variant="outline" size="sm">
            {aiLoading ? "Improving..." : "Improve with AI"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="summary">Summary</Label>
            <Textarea
              id="summary"
              value={data.summary}
              onChange={(e) => updateSummary(e.target.value)}
              placeholder="Write a compelling professional summary that highlights your key achievements and career objectives..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Professional Experience</CardTitle>
          <Button onClick={addExperience} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Google"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('experience', exp.id, 'company', exp.company)}
                      disabled={!!experienceAiLoading[exp.id]?.company}
                      variant="outline"
                      size="sm"
                    >
                      {experienceAiLoading[exp.id]?.company ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Position *</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                    placeholder="Mountain View, CA"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                    disabled={exp.current}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(checked) => updateExperience(exp.id, "current", checked)}
                  />
                  <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Job Description</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder="• Led a team of 5 engineers to develop scalable web applications&#10;• Improved system performance by 40% through optimization&#10;• Implemented CI/CD pipelines reducing deployment time by 60%"
                    rows={4}
                  />
                  <Button
                    onClick={() => improveFieldWithAI('experience', exp.id, 'description', exp.description)}
                    disabled={!!experienceAiLoading[exp.id]?.description}
                    variant="outline"
                    size="sm"
                  >
                    {experienceAiLoading[exp.id]?.description ? "Improving..." : "Improve with AI"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Education</CardTitle>
          <Button onClick={addEducation} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.education.map((edu, index) => (
            <div key={edu.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder="Stanford University"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('education', edu.id, 'institution', edu.institution)}
                      disabled={!!educationAiLoading[edu.id]?.institution}
                      variant="outline"
                      size="sm"
                    >
                      {educationAiLoading[edu.id]?.institution ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder="Bachelor of Science"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('education', edu.id, 'degree', edu.degree)}
                      disabled={!!educationAiLoading[edu.id]?.degree}
                      variant="outline"
                      size="sm"
                    >
                      {educationAiLoading[edu.id]?.degree ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <div className="flex gap-2">
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                      placeholder="Computer Science"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('education', edu.id, 'field', edu.field)}
                      disabled={!!educationAiLoading[edu.id]?.field}
                      variant="outline"
                      size="sm"
                    >
                      {educationAiLoading[edu.id]?.field ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>GPA</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Projects</CardTitle>
          <Button onClick={addProject} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.projects.map((project, index) => (
            <div key={project.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project {index + 1}</h4>
                <Button
                  onClick={() => removeProject(project.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Name *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(project.id, "name", e.target.value)}
                      placeholder="E-commerce Platform"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('project', project.id, 'name', project.name)}
                      disabled={!!projectAiLoading[project.id]?.name}
                      variant="outline"
                      size="sm"
                    >
                      {projectAiLoading[project.id]?.name ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Technologies</Label>
                  <Input
                    value={project.technologies}
                    onChange={(e) => updateProject(project.id, "technologies", e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Project Link</Label>
                  <Input
                    value={project.link}
                    onChange={(e) => updateProject(project.id, "link", e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="flex gap-2">
                  <Textarea
                    value={project.description}
                    onChange={(e) => updateProject(project.id, "description", e.target.value)}
                    placeholder="Built a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard..."
                    rows={3}
                  />
                  <Button
                    onClick={() => improveFieldWithAI('project', project.id, 'description', project.description)}
                    disabled={!!projectAiLoading[project.id]?.description}
                    variant="outline"
                    size="sm"
                  >
                    {projectAiLoading[project.id]?.description ? "Improving..." : "Improve with AI"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Skills</CardTitle>
          <Button onClick={addSkill} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Skill Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.skills.map((skill, index) => (
            <div key={skill.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Skill Category {index + 1}</h4>
                <Button
                  onClick={() => removeSkill(skill.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, "category", e.target.value)}
                    placeholder="Programming Languages"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Skills *</Label>
                  <Input
                    value={skill.items}
                    onChange={(e) => updateSkill(skill.id, "items", e.target.value)}
                    placeholder="JavaScript, Python, Java, TypeScript"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Certifications</CardTitle>
          <Button onClick={addCertification} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.certifications.map((cert, index) => (
            <div key={cert.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Certification {index + 1}</h4>
                <Button
                  onClick={() => removeCertification(cert.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Certification Name *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                      placeholder="AWS Certified Solutions Architect"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('certification', cert.id, 'name', cert.name)}
                      disabled={!!certificationAiLoading[cert.id]?.name}
                      variant="outline"
                      size="sm"
                    >
                      {certificationAiLoading[cert.id]?.name ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Issuing Organization *</Label>
                  <div className="flex gap-2">
                    <Input
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                      placeholder="Amazon Web Services"
                    />
                    <Button
                      onClick={() => improveFieldWithAI('certification', cert.id, 'issuer', cert.issuer)}
                      disabled={!!certificationAiLoading[cert.id]?.issuer}
                      variant="outline"
                      size="sm"
                    >
                      {certificationAiLoading[cert.id]?.issuer ? "Improving..." : "Improve with AI"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Credential URL</Label>
                  <Input
                    value={cert.link}
                    onChange={(e) => updateCertification(cert.id, "link", e.target.value)}
                    placeholder="https://aws.amazon.com/verification"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preview Button */}
      <div className="flex justify-center pt-8">
        <Button
          onClick={onPreview}
          size="lg"
          className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3"
        >
          <Eye className="h-5 w-5 mr-2" />
          Preview Resume
        </Button>
      </div>
    </div>
  )
}
