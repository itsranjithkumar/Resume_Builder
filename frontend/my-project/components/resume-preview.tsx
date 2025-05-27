"use client"

import { Button } from "@/components/ui/button"
import { Download, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ResumePreviewProps {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const handleDownloadPDF = () => {
    // Create a new window with the resume content for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const resumeContent = document.getElementById("resume-content")?.innerHTML || ""

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${data.personalInfo.fullName} - Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.4;
              color: #000;
              background: #fff;
            }
            .resume-container { 
              max-width: 8.5in; 
              margin: 0 auto; 
              padding: 0.5in;
              background: white;
            }
            .header { display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 2rem; }
            .profile-image { 
              width: 120px; 
              height: 120px; 
              border-radius: 8px; 
              object-fit: cover;
              flex-shrink: 0;
            }
            .header-content { flex: 1; }
            .name { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
            .contact-info { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem; }
            .contact-item { display: flex; align-items: center; gap: 0.25rem; font-size: 0.9rem; }
            .summary { font-size: 1rem; line-height: 1.5; margin-bottom: 2rem; }
            .section { margin-bottom: 2rem; }
            .section-title { 
              font-size: 1.25rem; 
              font-weight: 700; 
              margin-bottom: 1rem; 
              padding-bottom: 0.5rem;
              border-bottom: 2px solid #000;
            }
            .experience-item, .education-item, .project-item, .cert-item { 
              margin-bottom: 1.5rem; 
              page-break-inside: avoid;
            }
            .item-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
            .item-title { font-weight: 600; font-size: 1.1rem; }
            .item-subtitle { font-weight: 500; color: #333; }
            .item-date { font-size: 0.9rem; color: #666; white-space: nowrap; }
            .item-location { font-size: 0.9rem; color: #666; }
            .description { margin-top: 0.5rem; line-height: 1.4; }
            .skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
            .skill-category { margin-bottom: 0.75rem; }
            .skill-title { font-weight: 600; margin-bottom: 0.25rem; }
            .skill-items { font-size: 0.9rem; line-height: 1.3; }
            @media print {
              body { print-color-adjust: exact; }
              .resume-container { padding: 0.25in; }
              .section { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeContent}
          </div>
        </body>
      </html>
    `)

    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={handleDownloadPDF} className="bg-gray-900 hover:bg-gray-800 text-white">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Resume Content */}
      <div
        id="resume-content"
        className="bg-white shadow-2xl border border-gray-200 p-8 md:p-12"
        style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          {data.personalInfo.image && (
            <div className="flex-shrink-0">
              <img
                src={data.personalInfo.image || "/placeholder.svg"}
                alt={data.personalInfo.fullName}
                className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
              />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-3">{data.personalInfo.fullName}</h1>
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="h-4 w-4" />
                  <span>{data.personalInfo.linkedin}</span>
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        {data.summary && (
          <div className="mb-8">
            <p className="text-base leading-relaxed text-black">{data.summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {data.experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-black">PROFESSIONAL EXPERIENCE</h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{exp.position}</h3>
                      <p className="text-base font-medium text-gray-800">{exp.company}</p>
                      {exp.location && <p className="text-sm text-gray-600">{exp.location}</p>}
                    </div>
                    <div className="text-sm text-gray-600 text-right">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="mt-3">
                      <div className="text-sm leading-relaxed text-black whitespace-pre-line">{exp.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-black">EDUCATION</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-black">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className="text-base text-gray-800">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-black">PROJECTS</h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-semibold text-black">{project.name}</h3>
                    {project.link && <span className="text-sm text-gray-600">{project.link}</span>}
                  </div>
                  {project.technologies && (
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Technologies:</strong> {project.technologies}
                    </p>
                  )}
                  {project.description && <p className="text-sm leading-relaxed text-black">{project.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-black">TECHNICAL SKILLS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="text-base font-semibold text-black mb-1">{skill.category}</h3>
                  <p className="text-sm text-black leading-relaxed">{skill.items}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 pb-2 border-b-2 border-black">CERTIFICATIONS</h2>
            <div className="space-y-3">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-semibold text-black">{cert.name}</h3>
                    <p className="text-sm text-gray-800">{cert.issuer}</p>
                    {cert.link && <p className="text-sm text-gray-600">{cert.link}</p>}
                  </div>
                  {cert.date && <div className="text-sm text-gray-600">{formatDate(cert.date)}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
