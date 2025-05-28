"use client"

import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Phone, Mail, MapPin, Globe, Linkedin } from "lucide-react"
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
      const pdfHeight = 11
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

  // Get initials for profile photo placeholder
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="max-w-6xl mx-auto pt-0 mt-0">
      {/* Download Button */}
      <div className="flex justify-end mb-6 no-print print:hidden">
        <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Resume Content */}
      <div
        id="resume-content"
        className="bg-white shadow-2xl border border-gray-200 flex overflow-hidden"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          width: "816px", // 8.5 inches at 96 DPI
          height: "1056px", // 11 inches at 96 DPI
          margin: "0 auto",
          marginTop: 0,
          paddingTop: 0,
        }}
      >
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 p-8 flex flex-col gap-6">
          {/* Profile Section */}
          <div className="text-center">
            {data.personalInfo.image ? (
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-2 border-gray-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-500">
                {data.personalInfo.fullName ? getInitials(data.personalInfo.fullName) : "YN"}
              </div>
            )}
            <h1 className="text-xl font-bold text-blue-600 mb-1 leading-tight">
              {data.personalInfo.fullName || "Your Name"}
            </h1>
            <p className="text-sm text-gray-600 font-medium">{jobTitle}</p>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-sm font-bold text-gray-800 mb-3 pb-1 border-b-2 border-blue-600">Contact</h2>
            <div className="space-y-2">
              {data.personalInfo.phone && (
                <div className="flex items-center text-xs text-gray-600">
                  <Phone className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  {data.personalInfo.phone}
                </div>
              )}
              {data.personalInfo.email && (
                <div className="flex items-center text-xs text-gray-600">
                  <Mail className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  {data.personalInfo.email}
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center text-xs text-gray-600">
                  <MapPin className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  {data.personalInfo.location}
                </div>
              )}
              {data.personalInfo.website && (
                <div className="flex items-center text-xs text-gray-600">
                  <Globe className="w-3.5 h-3.5 mr-2 text-blue-600" />
                  {data.personalInfo.website}
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-center text-xs text-gray-600">
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
                  <div key={project.id} className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
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

          {/* Certifications/References Section */}
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
    </div>
  )
}
