"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ArrowLeft, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"
import { useRouter } from "next/navigation"

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  location: string
  linkedin: string
  website: string
  image: string
}

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  gpa: string
  location: string
}

interface Project {
  id: string
  name: string
  description: string
  technologies: string
  link: string
}

interface Skill {
  id: string
  category: string
  items: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  link: string
}

interface ResumeData {
  personalInfo: PersonalInfo
  summary: string
  experience: Experience[]
  education: Education[]
  projects: Project[]
  skills: Skill[]
  certifications: Certification[]
}

export default function ResumeViewPage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const data = localStorage.getItem("resumePreviewData")
    if (data) {
      try {
        setResumeData(JSON.parse(data))
      } catch (err) {
        router.push("/resume-preview")
      }
    } else {
      router.push("/resume-preview")
    }
  }, [router])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present"
    try {
      const [year, month] = dateStr.split("-")
      if (!year || !month) return dateStr
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const monthIndex = Number.parseInt(month) - 1
      if (monthIndex < 0 || monthIndex > 11) return dateStr
      return `${monthNames[monthIndex]} ${year}`
    } catch {
      return dateStr
    }
  }

  const handleDownloadPDF = () => {
    if (!resumeData) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const resumeHTML = document.getElementById("resume-content")?.innerHTML || ""

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${resumeData.personalInfo.fullName} - Resume</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            html, body {
              width: 210mm;
              height: 297mm;
              margin: 0;
              padding: 0;
              background: #fff;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              color: #1f2937;
              font-size: 11pt;
              line-height: 1.5;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: flex-start;
            }
            .resume-container {
              width: 180mm;
              min-height: 277mm;
              margin: 5mm auto 15mm auto;
              background: #fff;
              box-sizing: border-box;
              padding: 0;
            }
            /* Remove web-only styles for print */
            .bg-white, .rounded-3xl, .shadow-sm, .border, .overflow-hidden, .p-12 {
              background: none !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              padding: 0 !important;
            }
            /* --- Keep your resume styles for print below --- */
            .header { margin-top: 0; margin-bottom: 24px; text-align: left; }
            .name { font-size: 32pt; font-weight: 700; margin-bottom: 6px; color: #111827; letter-spacing: -0.5px; }
            .title { font-size: 14pt; color: #2563eb; margin-bottom: 12px; font-weight: 600; }
            .contact-info { display: flex; flex-wrap: wrap; gap: 16px; font-size: 10pt; color: #4b5563; }
            .contact-item { display: flex; align-items: center; gap: 4px; }
            .section { margin-bottom: 24px; }
            .section-title { font-size: 14pt; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #111827; padding-bottom: 4px; margin-bottom: 16px; letter-spacing: 0.5px; }
            .two-column { display: grid; grid-template-columns: 2fr 1fr; gap: 32px; }
            .experience-item, .education-item, .project-item { margin-bottom: 16px; }
            .job-title { font-weight: 700; font-size: 12pt; color: #111827; margin-bottom: 2px; }
            .company { color: #2563eb; font-weight: 600; font-size: 11pt; margin-bottom: 2px; }
            .date-location { font-size: 9pt; color: #6b7280; margin-bottom: 8px; }
            .description { font-size: 10pt; line-height: 1.6; color: #374151; }
            .description-item { margin-bottom: 4px; padding-left: 12px; position: relative; }
            .description-item:before { content: "•"; position: absolute; left: 0; color: #6b7280; }
            .skill-category { margin-bottom: 12px; }
            .skill-title { font-weight: 700; margin-bottom: 6px; font-size: 11pt; color: #111827; }
            .skill-items { font-size: 10pt; color: #4b5563; line-height: 1.4; }
            .project-name { font-weight: 700; font-size: 11pt; color: #111827; margin-bottom: 4px; }
            .project-desc { font-size: 10pt; color: #374151; margin-bottom: 4px; line-height: 1.5; }
            .project-tech { font-size: 9pt; color: #2563eb; font-weight: 600; }
            .cert-name { font-weight: 700; font-size: 11pt; color: #111827; margin-bottom: 2px; }
            .cert-details { font-size: 9pt; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeHTML}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 500)
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Editor
            </Button>
            <Button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-12">
            <ResumeContent data={resumeData} />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResumeContent({ data }: { data: ResumeData }) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Present"
    try {
      const [year, month] = dateStr.split("-")
      if (!year || !month) return dateStr
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const monthIndex = Number.parseInt(month) - 1
      if (monthIndex < 0 || monthIndex > 11) return dateStr
      return `${monthNames[monthIndex]} ${year}`
    } catch {
      return dateStr
    }
  }

  return (
    <div id="resume-content" className="max-w-none">
      {/* Header */}
      <div className="header mb-8">
        <h1 className="name text-5xl font-bold text-gray-900 mb-2 tracking-tight">
          {data.personalInfo.fullName.toUpperCase()}
        </h1>
        <div className="title text-xl text-blue-600 font-semibold mb-4">
          {data.experience[0]?.position || "Professional"} | {data.education[0]?.field || "Technology"}
        </div>
        <div className="contact-info flex flex-wrap gap-6 text-sm text-gray-600">
          {data.personalInfo.phone && (
            <div className="contact-item flex items-center gap-2">
              <Phone className="h-4 w-4" />
              {data.personalInfo.phone}
            </div>
          )}
          {data.personalInfo.email && (
            <div className="contact-item flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {data.personalInfo.email}
            </div>
          )}
          {data.personalInfo.location && (
            <div className="contact-item flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {data.personalInfo.location}
            </div>
          )}
          {data.personalInfo.linkedin && (
            <div className="contact-item flex items-center gap-2">
              <Linkedin className="h-4 w-4" />
              {data.personalInfo.linkedin}
            </div>
          )}
          {data.personalInfo.website && (
            <div className="contact-item flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {data.personalInfo.website}
            </div>
          )}
        </div>
      </div>

      <div className="two-column grid grid-cols-3 gap-12">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Summary */}
          {data.summary && (
            <div className="section">
              <h2 className="section-title text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6 uppercase tracking-wide">
                Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="section">
              <h2 className="section-title text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6 uppercase tracking-wide">
                Experience
              </h2>
              <div className="space-y-6">
                {data.experience.map((exp) => (
                  <div key={exp.id} className="experience-item">
                    <div className="mb-3">
                      <h3 className="job-title text-lg font-bold text-gray-900">{exp.position}</h3>
                      <div className="company text-blue-600 font-semibold text-base">{exp.company}</div>
                      <div className="date-location text-sm text-gray-500 flex items-center gap-3">
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                        {exp.location && (
                          <>
                            <span>•</span>
                            <span>{exp.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="description text-gray-700 leading-relaxed">
                      {exp.description.split("\n").map(
                        (line, idx) =>
                          line.trim() && (
                            <div key={idx} className="description-item mb-2 pl-4 relative">
                              <span className="absolute left-0 text-gray-400">•</span>
                              {line.trim()}
                            </div>
                          ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div className="section">
              <h2 className="section-title text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6 uppercase tracking-wide">
                Education
              </h2>
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <h3 className="font-bold text-gray-900 text-base">{edu.degree}</h3>
                    <div className="text-blue-600 font-semibold">{edu.institution}</div>
                    <div className="text-sm text-gray-500">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      {edu.gpa && <span> • GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div className="section">
              <h2 className="section-title text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6 uppercase tracking-wide">
                Certifications
              </h2>
              <div className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="cert-name font-bold text-gray-900">{cert.name}</h3>
                    <div className="cert-details text-sm text-gray-500">
                      {cert.issuer} • {formatDate(cert.date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="section">
              <h2 className="section-title text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6 uppercase tracking-wide">
                Tech Stack
              </h2>
              <div className="space-y-4">
                {data.skills.map((skill) => (
                  <div key={skill.id} className="skill-category">
                    <h3 className="skill-title font-bold text-gray-900 mb-2">{skill.category}</h3>
                    <div className="skill-items text-gray-600 leading-relaxed">{skill.items}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div className="section">
              <h2 className="section-title text-xl font-bold text-gray-900 border-b-2 border-gray-900 pb-2 mb-6 uppercase tracking-wide">
                Key Projects
              </h2>
              <div className="space-y-4">
                {data.projects.slice(0, 4).map((project) => (
                  <div key={project.id} className="project-item">
                    <h3 className="project-name font-bold text-gray-900 mb-1">{project.name}</h3>
                    <p className="project-desc text-sm text-gray-700 mb-2 leading-relaxed">{project.description}</p>
                    <div className="project-tech text-sm text-blue-600 font-medium">{project.technologies}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
