"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Trash2, Upload, LinkIcon, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Define types for our resume data
interface Certificate {
  name: string
  issuer: string
  date: string
  link: string
}

interface Skill {
  name: string
}

interface Experience {
  title: string
  company: string
  duration: string
  description: string
}

interface Project {
  name: string
  description: string
  link: string
}

interface Education {
  degree: string
  institution: string
  year: string
}

interface ResumeData {
  id?: string
  name: string
  phone: string
  email: string
  bio: string
  profileImage: string | null
  certificates: Certificate[]
  skills: Skill[]
  experiences: Experience[]
  projects: Project[]
  education: Education[]
}

// AI correction using backend API route and GitHub token
async function correctText(text: string): Promise<string> {
  console.log("Calling /api/ai-correct with:", text);
  if (!text || text.trim() === "") return text;
  try {
    const response = await fetch("/api/ai-correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const data = await response.json();
    console.log("/api/ai-correct response:", data);
    if (data.error) {
      alert("AI error: " + data.error);
      return text;
    }
    return data.text || text;
  } catch (err: any) {
    alert("AI error: " + (err.message || "Unknown error"));
    return text;
  }
}


export default function ProfilePage() {
  const router = useRouter()
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [certificates, setCertificates] = useState<Certificate[]>([{ name: "", issuer: "", date: "", link: "" }])
  const [skills, setSkills] = useState<Skill[]>([{ name: "" }])
  const [experiences, setExperiences] = useState<Experience[]>([
    { title: "", company: "", duration: "", description: "" },
  ])
  const [projects, setProjects] = useState<Project[]>([{ name: "", description: "", link: "" }])
  const [education, setEducation] = useState<Education[]>([{ degree: "", institution: "", year: "" }])
  const [isLoading, setIsLoading] = useState(false)
  // NEW: Error state
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})

  // Validation helpers
  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  function validatePhone(phone: string) {
    return /^[0-9+()\-\s]{7,}$/.test(phone)
  }

  // Validate all fields and set formErrors
  function validateForm() {
    const errors: {[key: string]: string} = {}
    if (!name.trim()) errors.name = "Full name is required"
    if (!phone.trim()) errors.phone = "Phone number is required"
    else if (!validatePhone(phone)) errors.phone = "Invalid phone number"
    if (!email.trim()) errors.email = "Email is required"
    else if (!validateEmail(email)) errors.email = "Invalid email address"
    if (!bio.trim()) errors.bio = "Bio is required"
    // Certificates
    certificates.forEach((c, i) => {
      if (!c.name.trim()) errors[`cert_name_${i}`] = "Certificate name required"
      if (!c.issuer.trim()) errors[`cert_issuer_${i}`] = "Issuer required"
      if (!c.date.trim()) errors[`cert_date_${i}`] = "Date required"
    })
    // Skills
    skills.forEach((s, i) => {
      if (!s.name.trim()) errors[`skill_${i}`] = "Skill required"
    })
    // Experiences
    experiences.forEach((e, i) => {
      if (!e.title.trim()) errors[`exp_title_${i}`] = "Job title required"
      if (!e.company.trim()) errors[`exp_company_${i}`] = "Company required"
      if (!e.duration.trim()) errors[`exp_duration_${i}`] = "Duration required"
      if (!e.description.trim()) errors[`exp_desc_${i}`] = "Description required"
    })
    // Projects
    projects.forEach((p, i) => {
      if (!p.name.trim()) errors[`proj_name_${i}`] = "Project name required"
      if (!p.description.trim()) errors[`proj_desc_${i}`] = "Description required"
    })
    // Education
    education.forEach((e, i) => {
      if (!e.degree.trim()) errors[`edu_degree_${i}`] = "Degree required"
      if (!e.institution.trim()) errors[`edu_institution_${i}`] = "Institution required"
      if (!e.year.trim()) errors[`edu_year_${i}`] = "Year required"
    })
    setFormErrors(errors)
    return errors
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("id")
    if (id) {
      setResumeId(id)
      const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]")
      const resumeToEdit = savedResumes.find((resume: ResumeData) => resume.id === id)
      if (resumeToEdit) {
        setName(resumeToEdit.name || "")
        setPhone(resumeToEdit.phone || "")
        setEmail(resumeToEdit.email || "")
        setBio(resumeToEdit.bio || "")
        setProfileImage(resumeToEdit.profileImage || null)
        setCertificates(
          resumeToEdit.certificates.length > 0
            ? resumeToEdit.certificates
            : [{ name: "", issuer: "", date: "", link: "" }],
        )
        setSkills(resumeToEdit.skills.length > 0 ? resumeToEdit.skills : [{ name: "" }])
        setExperiences(
          resumeToEdit.experiences.length > 0
            ? resumeToEdit.experiences
            : [{ title: "", company: "", duration: "", description: "" }],
        )
        setProjects(
          resumeToEdit.projects.length > 0 ? resumeToEdit.projects : [{ name: "", description: "", link: "" }],
        )
        setEducation(
          resumeToEdit.education.length > 0 ? resumeToEdit.education : [{ degree: "", institution: "", year: "" }],
        )
      }
    }
  }, [])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target) {
          setProfileImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(e.target.files[0])
    }
  }

  // Certificate handlers
  const addCertificate = () => setCertificates([...certificates, { name: "", issuer: "", date: "", link: "" }])
  const removeCertificate = (index: number) => {
    const newCertificates = [...certificates]
    newCertificates.splice(index, 1)
    setCertificates(newCertificates)
  }
  const updateCertificate = (index: number, field: string, value: string) => {
    const newCertificates = [...certificates]
    newCertificates[index] = { ...newCertificates[index], [field]: value }
    setCertificates(newCertificates)
  }

  // Skill handlers
  const addSkill = () => setSkills([...skills, { name: "" }])
  const removeSkill = (index: number) => {
    const newSkills = [...skills]
    newSkills.splice(index, 1)
    setSkills(newSkills)
  }
  const updateSkill = (index: number, value: string) => {
    const newSkills = [...skills]
    newSkills[index].name = value
    setSkills(newSkills)
  }

  // Experience handlers
  const addExperience = () =>
    setExperiences([...experiences, { title: "", company: "", duration: "", description: "" }])
  const removeExperience = (index: number) => {
    const newExperiences = [...experiences]
    newExperiences.splice(index, 1)
    setExperiences(newExperiences)
  }
  const updateExperience = (index: number, field: string, value: string) => {
    const newExperiences = [...experiences]
    newExperiences[index] = { ...newExperiences[index], [field]: value }
    setExperiences(newExperiences)
  }

  // Project handlers
  const addProject = () => setProjects([...projects, { name: "", description: "", link: "" }])
  const removeProject = (index: number) => {
    const newProjects = [...projects]
    newProjects.splice(index, 1)
    setProjects(newProjects)
  }
  const updateProject = (index: number, field: string, value: string) => {
    const newProjects = [...projects]
    newProjects[index] = { ...newProjects[index], [field]: value }
    setProjects(newProjects)
  }

  // Education handlers
  const addEducation = () => setEducation([...education, { degree: "", institution: "", year: "" }])
  const removeEducation = (index: number) => {
    const newEducation = [...education]
    newEducation.splice(index, 1)
    setEducation(newEducation)
  }
  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...education]
    newEducation[index] = { ...newEducation[index], [field]: value }
    setEducation(newEducation)
  }

  const improveWithAI = async (section: string) => {
    setIsLoading(true)
    try {
      switch (section) {
        case "personal": {
          const newName = await correctText(name);
          const newPhone = await correctText(phone);
          const newEmail = await correctText(email);
          console.log("Original bio:", bio);
          const newBio = await correctText(bio);
          console.log("AI returned bio:", newBio);
          const changed =
            newName !== name ||
            newPhone !== phone ||
            newEmail !== email ||
            newBio !== bio;
          setName(newName);
          setPhone(newPhone);
          setEmail(newEmail);
          setBio(newBio);
          if (!changed) {
            console.log("AI input/output:", { name, newName, phone, newPhone, email, newEmail, bio, newBio });
            alert("No changes were made by AI. The input may already be correct or not suitable for rewriting.");
            return;
          }
          break;
        }
        case "certificates": {
          const improvedCertificates = await Promise.all(
            certificates.map(async (cert) => ({
              ...cert,
              name: await correctText(cert.name),
              issuer: await correctText(cert.issuer),
              date: await correctText(cert.date),
              link: cert.link,
            }))
          );
          // Check if any field was actually changed
          let changed = false;
          for (let i = 0; i < certificates.length; i++) {
            if (
              certificates[i].name !== improvedCertificates[i].name ||
              certificates[i].issuer !== improvedCertificates[i].issuer ||
              certificates[i].date !== improvedCertificates[i].date
            ) {
              changed = true;
              break;
            }
          }
          setCertificates(improvedCertificates);
          if (!changed) {
            alert("No spelling or grammar issues detected in Certificates. For advanced rewriting, a paid AI service is required.");
          }
          break;
        }
        case "skills":
          setSkills(
            await Promise.all(
              skills.map(async (skill) => ({
                name: await correctText(skill.name),
              })),
            ),
          )
          break
        case "experiences":
          setExperiences(
            await Promise.all(
              experiences.map(async (exp) => ({
                ...exp,
                title: await correctText(exp.title),
                company: await correctText(exp.company),
                duration: await correctText(exp.duration),
                description: await correctText(exp.description),
              })),
            ),
          )
          break
        case "projects":
          setProjects(
            await Promise.all(
              projects.map(async (proj) => ({
                ...proj,
                name: await correctText(proj.name),
                description: await correctText(proj.description),
                link: proj.link,
              })),
            ),
          )
          break
        case "education":
          setEducation(
            await Promise.all(
              education.map(async (edu) => ({
                ...edu,
                degree: await correctText(edu.degree),
                institution: await correctText(edu.institution),
                year: await correctText(edu.year),
              })),
            ),
          )
          break
      }
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} section has been improved!`)
    } catch (error) {
      alert(`Failed to improve ${section} section.`)
    } finally {
      setIsLoading(false)
    }
  }

  const saveResume = () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const el = document.getElementById(firstErrorKey.replace(/_/g, '-'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    const resumeData: ResumeData = {
      id: resumeId || `resume_${Date.now()}`,
      name,
      phone,
      email,
      bio,
      profileImage,
      certificates,
      skills,
      experiences,
      projects,
      education,
    }
    const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]")
    if (resumeId) {
      const updatedResumes = savedResumes.map((resume: ResumeData) => (resume.id === resumeId ? resumeData : resume))
      localStorage.setItem("resumes", JSON.stringify(updatedResumes))
      alert("Resume updated successfully!")
    } else {
      savedResumes.push(resumeData)
      localStorage.setItem("resumes", JSON.stringify(savedResumes))
      alert("Resume saved successfully!")
    }
    router.push("/resumes")
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">{resumeId ? "Edit Resume" : "Create Resume"}</h1>
        <Button size="lg" onClick={saveResume} className="w-full sm:w-auto">
          {resumeId ? "Update Resume" : "Save Resume"}
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Personal Information */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
              <CardDescription>Add your basic information to your resume</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => improveWithAI("personal")}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Improve with AI</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={`mt-1 ${formErrors.name ? 'border-red-500' : ''}`}
                  />
                  {formErrors.name && (
                    <div className="text-red-600 text-xs mt-1">{formErrors.name}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className={`mt-1 ${formErrors.phone ? 'border-red-500' : ''}`}
                  />
                  {formErrors.phone && (
                    <div className="text-red-600 text-xs mt-1">{formErrors.phone}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className={`mt-1 ${formErrors.email ? 'border-red-500' : ''}`}
                  />
                  {formErrors.email && (
                    <div className="text-red-600 text-xs mt-1">{formErrors.email}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="bio" className="text-sm font-medium">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write a short bio about yourself"
                    className={`min-h-[120px] mt-1 ${formErrors.bio ? 'border-red-500' : ''}`}
                  />
                  {formErrors.bio && (
                    <div className="text-red-600 text-xs mt-1">{formErrors.bio}</div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Avatar className="h-40 w-40 border-2 border-gray-200">
                    <AvatarImage src={profileImage || ""} alt="Profile" />
                    <AvatarFallback className="text-4xl bg-gray-100">{name ? name.charAt(0) : "U"}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex items-center justify-center">
                  <Label
                    htmlFor="profile-image"
                    className="flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Certificates</CardTitle>
              <CardDescription>Add your certifications and achievements</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => improveWithAI("certificates")}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Improve with AI</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {certificates.map((certificate, index) => (
                <div key={index} className="rounded-lg border p-4 hover:border-gray-300 transition-colors">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Certificate #{index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCertificate(index)}
                      disabled={certificates.length === 1}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`cert-name-${index}`} className="text-sm font-medium">
                        Certificate Name
                      </Label>
                      <Input
                        id={`cert-name-${index}`}
                        value={certificate.name}
                        onChange={(e) => updateCertificate(index, "name", e.target.value)}
                        placeholder="AWS Certified Solutions Architect"
                        className={`mt-1 ${formErrors[`cert_name_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`cert_name_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`cert_name_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`cert-issuer-${index}`} className="text-sm font-medium">
                        Issuing Organization
                      </Label>
                      <Input
                        id={`cert-issuer-${index}`}
                        value={certificate.issuer}
                        onChange={(e) => updateCertificate(index, "issuer", e.target.value)}
                        placeholder="Amazon Web Services"
                        className={`mt-1 ${formErrors[`cert_issuer_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`cert_issuer_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`cert_issuer_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`cert-date-${index}`} className="text-sm font-medium">
                        Date
                      </Label>
                      <Input
                        id={`cert-date-${index}`}
                        value={certificate.date}
                        onChange={(e) => updateCertificate(index, "date", e.target.value)}
                        placeholder="May 2023"
                        className={`mt-1 ${formErrors[`cert_date_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`cert_date_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`cert_date_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`cert-link-${index}`} className="flex items-center gap-1 text-sm font-medium">
                        <LinkIcon className="h-4 w-4" /> Certificate Link
                      </Label>
                      <Input
                        id={`cert-link-${index}`}
                        value={certificate.link}
                        onChange={(e) => updateCertificate(index, "link", e.target.value)}
                        placeholder="https://example.com/certificate"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addCertificate} variant="outline" className="w-full hover:bg-gray-50 transition-colors">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Certificate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Skills</CardTitle>
              <CardDescription>Add your technical and professional skills</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => improveWithAI("skills")}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Improve with AI</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    id={`skill-${index}`}
                    value={skill.name}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="JavaScript, React, UI/UX Design, etc."
                    className={`flex-1 ${formErrors[`skill_${index}`] ? 'border-red-500' : ''}`}
                  />
                  {formErrors[`skill_${index}`] && (
                    <div className="text-red-600 text-xs mt-1">{formErrors[`skill_${index}`]}</div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSkill(index)}
                    disabled={skills.length === 1}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              ))}
              <Button onClick={addSkill} variant="outline" className="w-full hover:bg-gray-50 transition-colors">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Experience</CardTitle>
              <CardDescription>Add your work experience</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => improveWithAI("experiences")}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Improve with AI</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {experiences.map((experience, index) => (
                <div key={index} className="rounded-lg border p-4 hover:border-gray-300 transition-colors">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Experience #{index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(index)}
                      disabled={experiences.length === 1}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`exp-title-${index}`} className="text-sm font-medium">
                        Job Title
                      </Label>
                      <Input
                        id={`exp-title-${index}`}
                        value={experience.title}
                        onChange={(e) => updateExperience(index, "title", e.target.value)}
                        placeholder="Senior Software Engineer"
                        className={`mt-1 ${formErrors[`exp_title_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`exp_title_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`exp_title_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`exp-company-${index}`} className="text-sm font-medium">
                        Company
                      </Label>
                      <Input
                        id={`exp-company-${index}`}
                        value={experience.company}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                        placeholder="Google"
                        className={`mt-1 ${formErrors[`exp_company_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`exp_company_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`exp_company_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`exp-duration-${index}`} className="text-sm font-medium">
                        Duration
                      </Label>
                      <Input
                        id={`exp-duration-${index}`}
                        value={experience.duration}
                        onChange={(e) => updateExperience(index, "duration", e.target.value)}
                        placeholder="Jan 2020 - Present"
                        className={`mt-1 ${formErrors[`exp_duration_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`exp_duration_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`exp_duration_${index}`]}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor={`exp-desc-${index}`} className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id={`exp-desc-${index}`}
                      value={experience.description}
                      onChange={(e) => updateExperience(index, "description", e.target.value)}
                      placeholder="Describe your responsibilities and achievements"
                      className={`min-h-[100px] mt-1 ${formErrors[`exp_desc_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`exp_desc_${index}`] && (
                      <div className="text-red-600 text-xs mt-1">{formErrors[`exp_desc_${index}`]}</div>
                    )}
                  </div>
                </div>
              ))}
              <Button onClick={addExperience} variant="outline" className="w-full hover:bg-gray-50 transition-colors">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Experience
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Projects</CardTitle>
              <CardDescription>Add your personal or professional projects</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => improveWithAI("projects")}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Improve with AI</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="rounded-lg border p-4 hover:border-gray-300 transition-colors">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Project #{index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProject(index)}
                      disabled={projects.length === 1}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`project-name-${index}`} className="text-sm font-medium">
                        Project Name
                      </Label>
                      <Input
                        id={`project-name-${index}`}
                        value={project.name}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                        placeholder="E-commerce Platform"
                        className={`mt-1 ${formErrors[`proj_name_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`proj_name_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`proj_name_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`project-link-${index}`} className="flex items-center gap-1 text-sm font-medium">
                        <LinkIcon className="h-4 w-4" /> Project Link
                      </Label>
                      <Input
                        id={`project-link-${index}`}
                        value={project.link}
                        onChange={(e) => updateProject(index, "link", e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor={`project-desc-${index}`} className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id={`project-desc-${index}`}
                      value={project.description}
                      onChange={(e) => updateProject(index, "description", e.target.value)}
                      placeholder="Describe your project, technologies used, and your role"
                      className={`min-h-[100px] mt-1 ${formErrors[`proj_desc_${index}`] ? 'border-red-500' : ''}`}
                    />
                    {formErrors[`proj_desc_${index}`] && (
                      <div className="text-red-600 text-xs mt-1">{formErrors[`proj_desc_${index}`]}</div>
                    )}
                  </div>
                </div>
              ))}
              <Button onClick={addProject} variant="outline" className="w-full hover:bg-gray-50 transition-colors">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Education */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-xl font-bold">Education</CardTitle>
              <CardDescription>Add your educational background</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => improveWithAI("education")}
              disabled={isLoading}
            >
              <Sparkles className="h-4 w-4" />
              <span className="hidden sm:inline">Improve with AI</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="rounded-lg border p-4 hover:border-gray-300 transition-colors">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                      disabled={education.length === 1}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor={`edu-degree-${index}`} className="text-sm font-medium">
                        Degree
                      </Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, "degree", e.target.value)}
                        placeholder="Bachelor of Science in Computer Science"
                        className={`mt-1 ${formErrors[`edu_degree_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`edu_degree_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`edu_degree_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`edu-institution-${index}`} className="text-sm font-medium">
                        Institution
                      </Label>
                      <Input
                        id={`edu-institution-${index}`}
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, "institution", e.target.value)}
                        placeholder="Stanford University"
                        className={`mt-1 ${formErrors[`edu_institution_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`edu_institution_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`edu_institution_${index}`]}</div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`edu-year-${index}`} className="text-sm font-medium">
                        Year
                      </Label>
                      <Input
                        id={`edu-year-${index}`}
                        value={edu.year}
                        onChange={(e) => updateEducation(index, "year", e.target.value)}
                        placeholder="2018 - 2022"
                        className={`mt-1 ${formErrors[`edu_year_${index}`] ? 'border-red-500' : ''}`}
                      />
                      {formErrors[`edu_year_${index}`] && (
                        <div className="text-red-600 text-xs mt-1">{formErrors[`edu_year_${index}`]}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button onClick={addEducation} variant="outline" className="w-full hover:bg-gray-50 transition-colors">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Education
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <Button size="lg" className="px-8 w-full sm:w-auto" onClick={saveResume}>
            {resumeId ? "Update Resume" : "Save Resume"}
          </Button>
        </div>
      </div>
    </div>
  )
}
