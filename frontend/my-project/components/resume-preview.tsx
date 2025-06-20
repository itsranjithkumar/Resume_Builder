"use client"

import React from "react"
import "@/app/print-centering.css"

import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Phone, Mail, MapPin, Globe, Linkedin } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ResumePreviewProps {
  data: ResumeData
  template?: string
}

export default function ResumePreview({ data, template = "professional" }: ResumePreviewProps) {
  // Robust image error fallback state for Professional template
  const [imgError, setImgError] = React.useState(false)
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const handleDownloadPDF = async () => {
    try {
      // Dynamically import the libraries
      const html2canvas = (await import("html2canvas")).default
      const jsPDF = (await import("jspdf")).default

      const element = document.getElementById("resume-content")
      if (!element) return

      // Create canvas from the resume content
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      })

      const imgData = canvas.toDataURL("image/png")

      // Create PDF with exact dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: [8.5, 11],
      })

      const pdfWidth = 8.5
      // const pdfHeight = 11 (removed unused)
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Scale to fit width perfectly, maintaining aspect ratio
      const ratio = pdfWidth / (imgWidth / 192) // Using 192 DPI for scale 2

      const finalWidth = pdfWidth
      const finalHeight = (imgHeight / 192) * ratio

      // Position at top-left corner
      const x = 0
      const y = 0

      pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight)

      // Download the PDF
      const fileName = `${data.personalInfo.fullName || "Resume"}_Resume.pdf`
      pdf.save(fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      // Fallback to print if PDF generation fails
      window.print()
    }
  }

  // Extract job title from first experience or use a default
  const jobTitle = data.experience.length > 0 ? data.experience[0].position : "Professional"

  // Professional Template (Original)
  const ProfessionalTemplate = () => (
    <div
      id="resume-content"
      className="bg-white shadow-2xl border border-gray-200 flex overflow-hidden"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        width: "816px",
        height: "1056px",
        margin: "0 auto",
        marginTop: "0",
        paddingTop: "0",
      }}
    >
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-50 p-8 flex flex-col gap-6">
        {/* Profile Section */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-3xl font-extrabold text-gray-700 border-2 border-blue-600 overflow-hidden">
            {data.personalInfo.image && !imgError ? (
              <img
                src={data.personalInfo.image || "/placeholder.svg"}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
                onError={() => setImgError(true)}
              />
            ) : (
              <img
                src="/resume.png"
                alt="Default Profile"
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
              />
            )}
          </div>
          <h1 className="text-xl font-bold text-blue-600 mb-1 leading-tight">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm text-gray-600 font-medium">{jobTitle}</p>
          {data.personalInfo.age && (
            <p className="text-sm text-gray-500 font-normal mt-1">Age: {data.personalInfo.age}</p>
          )}
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-600">Contact</h2>
          <div className="space-y-2">
            {data.personalInfo.phone && (
              <div className="flex items-center text-xs text-gray-800">
                <Phone className="w-3.5 h-3.5 mr-2 text-blue-600" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center text-xs text-gray-800">
                <Mail className="w-3.5 h-3.5 mr-2 text-blue-600" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center text-xs text-gray-800">
                <MapPin className="w-3.5 h-3.5 mr-2 text-blue-600" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center text-xs text-gray-800">
                <Globe className="w-3.5 h-3.5 mr-2 text-blue-600" />
                {data.personalInfo.website}
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center text-xs text-gray-800">
                <Linkedin className="w-3.5 h-3.5 mr-2 text-blue-600" />
                {data.personalInfo.linkedin}
              </div>
            )}
          </div>
        </div>

        {/* About Me Section */}
        {data.summary && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-600">About Me</h2>
            <p className="text-xs leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </div>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-600">Skills</h2>
            <div className="space-y-3">
              {data.skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">{skill.category}</h3>
                  <ul className="space-y-1">
                    {skill.items.split(",").map((item, index) => (
                      <li key={index} className="text-xs text-gray-600 relative pl-4">
                        <span className="absolute left-0 text-blue-600 font-bold">•</span>
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        {/* Education Section */}
        {data.education.length > 0 && (
          <div className="mb-7">
            <h2 className="text-base font-bold text-blue-600 mb-4 pb-1 border-b-2 border-gray-200">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 leading-tight">{edu.degree}</h3>
                      <p className="text-xs text-gray-600 italic mb-1">
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap ml-4">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {(edu.field || edu.gpa) && (
                    <p className="text-xs text-gray-600 mt-2">
                      {edu.field && `Field: ${edu.field}`}
                      {edu.field && edu.gpa && " | "}
                      {edu.gpa && `GPA: ${edu.gpa}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div className="mb-7">
            <h2 className="text-base font-bold text-blue-600 mb-4 pb-1 border-b-2 border-gray-200">Experience</h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 leading-tight">{exp.position}</h3>
                      <p className="text-xs text-gray-600 italic mb-1">
                        {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-xs leading-relaxed text-gray-600 mt-2">
                      {exp.description.split("\n").map((line, index) => (
                        <div key={index} className="mb-1">
                          {line.trim().startsWith("•") ? (
                            <div className="flex items-start">
                              <span className="mr-2 text-blue-600">•</span>
                              <span>{line.trim().substring(1).trim()}</span>
                            </div>
                          ) : (
                            <div>{line}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div className="mb-7">
            <h2 className="text-base font-bold text-blue-600 mb-4 pb-1 border-b-2 border-gray-200">Projects</h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-800">{project.name}</h3>
                    {project.link && (
                      <>
                        <span className="text-gray-400">—</span>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          View Project
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-600 leading-relaxed mt-2">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="text-xs text-gray-500 mt-2">
                      <span className="font-medium">Technologies:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-base font-bold text-blue-600 mb-4 pb-1 border-b-2 border-gray-200">Certifications</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <div className="font-semibold text-gray-800 mb-1">
                    {cert.link ? (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        {cert.name}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      cert.name
                    )}
                  </div>
                  {cert.issuer && <div className="text-gray-600 mb-1">{cert.issuer}</div>}
                  {cert.date && <div className="text-gray-500">{formatDate(cert.date)}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Creative Template (Professional-aligned, minimal, black/gray/white/sky blue)
  const CreativeTemplate = () => (
    <div
      id="resume-content"
      className="bg-white shadow-2xl border border-gray-200 flex overflow-hidden"
      style={{
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        width: "816px",
        height: "1056px",
        margin: "0 auto",
        marginTop: "0",
        paddingTop: "0",
      }}
    >
      {/* Left Sidebar - Slight grey background */}
      <div className="w-72 bg-gray-100 p-6 flex flex-col gap-5 text-gray-900">
        {/* Profile Section */}
        <div className="text-left">
          <h1 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">
            {data.personalInfo.fullName || "ELLEN JOHNSON"}
          </h1>
          <p className="text-sm text-gray-600 font-medium mb-4 uppercase tracking-wide">
            {jobTitle || "DIGITAL MARKETING MANAGER"}
          </p>

          {/* Profile Image */}
          <div className="w-20 h-20 rounded-full bg-white mx-0 mb-4 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {data.personalInfo.image && !imgError ? (
              <img
                src={data.personalInfo.image || "/placeholder.svg"}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <img
                src="/placeholder.svg?height=80&width=80"
                alt="Default Profile"
                className="w-full h-full object-cover rounded-full"
              />
            )}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 uppercase tracking-wide">CONTACT</h2>
          <div className="space-y-2">
            {data.personalInfo.phone && (
              <div className="flex items-center text-xs text-gray-800">
                <Phone className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <span>{data.personalInfo.phone}</span>
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center text-xs text-gray-800">
                <Mail className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <span>{data.personalInfo.email}</span>
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center text-xs text-gray-800">
                <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <span>{data.personalInfo.location}</span>
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center text-xs text-gray-800">
                <Globe className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center text-xs text-gray-800">
                <Linkedin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                <span>{data.personalInfo.linkedin}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 uppercase tracking-wide">SKILLS</h2>
            <div className="space-y-3">
              {data.skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="text-xs font-semibold text-gray-800 mb-2 uppercase">{skill.category}</h3>
                  <ul className="space-y-1">
                    {skill.items.split(",").map((item, index) => (
                      <li key={index} className="text-xs text-gray-700 relative pl-3">
                        <span className="absolute left-0 text-gray-400">•</span>
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section - Moved to sidebar */}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b border-gray-400 uppercase tracking-wide">EDUCATION</h2>
            <div className="space-y-3">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-xs font-semibold text-gray-800 leading-tight">{edu.degree}</h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </p>
                  {(edu.field || edu.gpa) && (
                    <p className="text-xs text-gray-600 mt-1">
                      {edu.field && `${edu.field}`}
                      {edu.field && edu.gpa && " | "}
                      {edu.gpa && `GPA: ${edu.gpa}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in sidebar */}
        {data.certifications.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">CERTIFICATIONS</h2>
            <div className="space-y-2">
              {data.certifications.map((cert) => (
                <div key={cert.id}>
                  <div className="text-xs font-semibold text-gray-800">
                    {cert.link ? (
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-900 flex items-center gap-1"
                      >
                        {cert.name}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ) : (
                      cert.name
                    )}
                  </div>
                  {cert.issuer && <div className="text-xs text-gray-600">{cert.issuer}</div>}
                  {cert.date && <div className="text-xs text-gray-400">{formatDate(cert.date)}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-white">
        {/* About Me Section at top */}
        {data.summary && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-black mb-3 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
              PROFILE
            </h2>
            <p className="text-sm leading-relaxed text-gray-700">{data.summary}</p>
          </div>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-black mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
              EXPERIENCE
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={exp.id} className={index > 0 ? "border-t border-gray-200 pt-4" : ""}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-black leading-tight">{exp.position}</h3>
                      <p className="text-sm text-teal-600 font-semibold">
                        {exp.company}
                        {exp.location && ` | ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-xs text-gray-600 font-medium whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-xs leading-relaxed text-gray-700 mt-2">
                      {exp.description.split("\n").map((line, index) => (
                        <div key={index} className="mb-1">
                          {line.trim().startsWith("•") ? (
                            <div className="flex items-start">
                              <span className="mr-2 text-teal-500 font-bold">•</span>
                              <span>{line.trim().substring(1).trim()}</span>
                            </div>
                          ) : (
                            <div>{line}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base font-bold text-black mb-4 uppercase tracking-wide border-b-2 border-gray-300 pb-1">
              PROJECTS
            </h2>
            <div className="space-y-3">
              {data.projects.map((project, index) => (
                <div key={project.id} className={index > 0 ? "border-t border-gray-200 pt-3" : ""}>
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-sm font-bold text-black">{project.name}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-teal-600 hover:text-teal-800 flex items-center gap-1 ml-2"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-700 leading-relaxed mb-1">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold text-black">Technologies:</span> {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Minimal Template (Unified layout with Professional, styled differently)
  const MinimalTemplate = () => (
    <div
      id="resume-content"
      className="bg-white shadow-2xl border border-gray-200 flex overflow-hidden"
      style={{
        fontFamily: "'Source Serif Pro', 'Georgia', serif",
        width: "816px",
        height: "1056px",
        margin: "0 auto",
        marginTop: "0",
        paddingTop: "0",
      }}
    >
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-50 p-8 flex flex-col gap-6 border-r border-gray-200">
        {/* Profile Section */}
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden">
            {data.personalInfo.image && !imgError ? (
              <img
                src={data.personalInfo.image || "/placeholder.svg"}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
                onError={() => setImgError(true)}
              />
            ) : (
              <img
                src="/profile-default.png"
                alt="Default Profile"
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
              />
            )}
          </div>
          <h1 className="text-xl font-light text-gray-800 mb-1 leading-tight">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm text-gray-600 font-normal">{jobTitle}</p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-sm font-normal text-gray-800 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">
            Contact
          </h2>
          <div className="space-y-2">
            {data.personalInfo.phone && (
              <div className="flex items-center text-xs text-gray-800">
                <Phone className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center text-xs text-gray-800">
                <Mail className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center text-xs text-gray-800">
                <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center text-xs text-gray-800">
                <Globe className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.website}
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center text-xs text-gray-800">
                <Linkedin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.linkedin}
              </div>
            )}
          </div>
        </div>

        {/* About Me Section */}
        {data.summary && (
          <div>
            <h2 className="text-sm font-normal text-gray-800 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">
              About Me
            </h2>
            <p className="text-xs leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </div>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-normal text-gray-800 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">
              Skills
            </h2>
            <div className="space-y-3">
              {data.skills.map((skill) => (
                <div key={skill.id}>
                  <h3 className="text-xs font-medium text-gray-700 mb-2">{skill.category}</h3>
                  <ul className="space-y-1">
                    {skill.items.split(",").map((item, index) => (
                      <li key={index} className="text-xs text-gray-600 relative pl-3">
                        <span className="absolute left-0 text-gray-400">•</span>
                        {item.trim()}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-white">
        {/* Education Section */}
        {data.education.length > 0 && (
          <div className="mb-7">
            <h2 className="text-base font-light text-gray-800 mb-4 pb-1 border-b border-gray-300 uppercase tracking-wider">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 leading-tight">{edu.degree}</h3>
                      <p className="text-xs text-gray-600 italic mb-1">
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-4">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {(edu.field || edu.gpa) && (
                    <p className="text-xs text-gray-600 mt-2">
                      {edu.field && `Field: ${edu.field}`}
                      {edu.field && edu.gpa && " | "}
                      {edu.gpa && `GPA: ${edu.gpa}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {data.experience.length > 0 && (
          <div className="mb-7">
            <h2 className="text-base font-light text-gray-800 mb-4 pb-1 border-b border-gray-300 uppercase tracking-wider">
              Experience
            </h2>
            <div className="space-y-5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 leading-tight">{exp.position}</h3>
                      <p className="text-xs text-gray-600 italic mb-1">
                        {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-xs leading-relaxed text-gray-600 mt-2">
                      {exp.description.split("\n").map((line, index) => (
                        <div key={index} className="mb-1">
                          {line.trim().startsWith("•") ? (
                            <div className="flex items-start">
                              <span className="mr-2 text-gray-400">•</span>
                              <span>{line.trim().substring(1).trim()}</span>
                            </div>
                          ) : (
                            <div>{line}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <div className="mb-7">
            <h2 className="text-base font-light text-gray-800 mb-4 pb-1 border-b border-gray-300 uppercase tracking-wider">
              Projects
            </h2>
            <div className="space-y-4">
              {data.projects.map((project) => (
                <div key={project.id} className="relative pl-4">
                  <div className="absolute left-0 top-1 w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-800">{project.name}</h3>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  {project.description && <p className="text-xs text-gray-700 mb-1">{project.description}</p>}
                  {project.technologies && (
                    <p className="text-xs text-gray-500 italic">Technologies: {project.technologies}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  const renderTemplate = () => {
    switch (template) {
      case "creative":
        return <CreativeTemplate />
      case "minimal":
        return <MinimalTemplate />
      default:
        return <ProfessionalTemplate />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Download Button */}
      <div className="flex justify-end mb-6">
        <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white print:hidden">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Resume Content */}
      {renderTemplate()}
    </div>
  )
}
