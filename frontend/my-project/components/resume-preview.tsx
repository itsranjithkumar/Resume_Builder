"use client"

import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Phone, Mail, MapPin, Globe, Linkedin, Award } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ResumePreviewProps {
  data: ResumeData
  template?: string
}

export default function ResumePreview({ data, template = "professional" }: ResumePreviewProps) {
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
          <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-500 overflow-hidden">
            {data.personalInfo.image ? (
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
              />
            ) : (
              data.personalInfo.fullName ? getInitials(data.personalInfo.fullName) : "YN"
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
      }}
    >
      {/* Sidebar */}
      <aside className="w-[220px] min-w-[180px] max-w-[240px] bg-gray-50 border-r border-gray-200 p-8 flex flex-col gap-7">
        {/* Profile Photo/Initials */}
        <div className="text-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-3xl font-extrabold text-gray-700 border-2 border-sky-400 overflow-hidden">
            {data.personalInfo.image ? (
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
              />
            ) : (
              data.personalInfo.fullName ? getInitials(data.personalInfo.fullName) : "YN"
            )}
          </div>
          <h1 className="text-lg font-bold text-black mb-1 leading-tight truncate">{data.personalInfo.fullName || "Your Name"}</h1>
          <p className="text-xs font-medium text-sky-600 bg-sky-100 px-2 py-0.5 rounded-full inline-block mb-1 truncate">{jobTitle}</p>
        </div>
        {/* Contact Info */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-gray-200 pb-1 text-sky-700">Contact</h2>
          <ul className="flex flex-col gap-2 text-xs text-gray-700">
            {data.personalInfo.email && (
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-400" />{data.personalInfo.email}</li>
            )}
            {data.personalInfo.phone && (
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-sky-400" />{data.personalInfo.phone}</li>
            )}
            {data.personalInfo.location && (
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sky-400" />{data.personalInfo.location}</li>
            )}
            {data.personalInfo.website && (
              <li className="flex items-center gap-2"><Globe className="w-4 h-4 text-sky-400" />{data.personalInfo.website}</li>
            )}
            {data.personalInfo.linkedin && (
              <li className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-sky-400" />{data.personalInfo.linkedin}</li>
            )}
          </ul>
        </section>
        {/* Skills */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-gray-200 pb-1 text-sky-700">Skills</h2>
            <div className="flex flex-col gap-2">
              {data.skills.map((skill) => (
                <div key={skill.id} className="mb-1">
                  <div className="font-semibold text-xs mb-0.5 text-black">{skill.category}</div>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.split(",").map((item, idx) => (
                      <span key={idx} className="bg-sky-100 text-sky-700 text-[10px] px-2 py-0.5 rounded-full">
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Certifications */}
        {data.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2 border-b border-gray-200 pb-1 text-sky-700">Certifications</h2>
            <div className="flex flex-col gap-2">
              {data.certifications.map((cert) => (
                <div key={cert.id} className="flex flex-col gap-0.5 bg-sky-50 rounded-lg px-2 py-1">
                  <span className="font-semibold text-xs flex items-center gap-1 text-black"><Award className="w-3 h-3 text-sky-400" />{cert.name}</span>
                  {cert.issuer && <span className="text-[10px] text-gray-700">{cert.issuer}</span>}
                  {cert.date && <span className="text-[10px] text-gray-500">{formatDate(cert.date)}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 bg-white flex flex-col gap-8 overflow-y-auto" style={{boxSizing: 'border-box'}}>
        {/* Name & Job Title at Top for Print/Screen */}
        <div className="block md:hidden mb-2">
          <h1 className="text-2xl font-extrabold text-black leading-tight">{data.personalInfo.fullName || "Your Name"}</h1>
          <p className="text-base font-semibold text-sky-600">{jobTitle}</p>
        </div>
        {/* Profile / Summary */}
        {data.summary && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-sky-700 mb-2 uppercase tracking-wide border-b-2 border-sky-100 pb-1">Profile</h2>
            <p className="text-sm text-gray-800 leading-snug">{data.summary}</p>
          </section>
        )}
        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-sky-700 mb-2 uppercase tracking-wide border-b-2 border-sky-100 pb-1">Experience</h2>
            <div className="flex flex-col gap-5">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative pl-4">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-sky-400 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="text-base font-bold text-black leading-tight">{exp.position}</div>
                      <div className="text-xs text-sky-700 font-medium">
                        {exp.company}
                        {exp.location && `, ${exp.location}`}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-4">
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {exp.description && (
                    <div className="text-xs leading-snug text-gray-700 mt-1">
                      {exp.description.split("\n").map((line, idx) => (
                        <div key={idx} className="mb-0.5">
                          {line.trim().startsWith("•") ? (
                            <div className="flex items-start">
                              <span className="mr-1 text-sky-500">•</span>
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
          </section>
        )}
        {/* Education */}
        {data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-sky-700 mb-2 uppercase tracking-wide border-b-2 border-sky-100 pb-1">Education</h2>
            <div className="flex flex-col gap-5">
              {data.education.map((edu) => (
                <div key={edu.id} className="relative pl-4">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-sky-400 rounded-full"></div>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <div className="text-base font-bold text-black leading-tight">{edu.degree}</div>
                      <div className="text-xs text-sky-700 font-medium">
                        {edu.institution}
                        {edu.location && `, ${edu.location}`}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-light whitespace-nowrap ml-4">
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </span>
                  </div>
                  {(edu.field || edu.gpa) && (
                    <div className="text-[11px] text-gray-600 mt-0.5">
                      {edu.field && `Field: ${edu.field}`}
                      {edu.field && edu.gpa && " | "}
                      {edu.gpa && `GPA: ${edu.gpa}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-sky-700 mb-2 uppercase tracking-wide border-b-2 border-sky-100 pb-1">Projects</h2>
            <div className="flex flex-col gap-5">
              {data.projects.map((project) => (
                <div key={project.id} className="relative pl-4">
                  <div className="absolute left-0 top-2 w-2 h-2 bg-sky-400 rounded-full"></div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-base font-bold text-black">{project.name}</div>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-sky-500 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {project.link.replace(/^https?:\/\//, "")}
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <div className="text-xs text-gray-700 mb-1">{project.description}</div>
                  )}
                  {project.technologies && (
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {project.technologies.split(",").map((tech, idx) => (
                        <span key={idx} className="text-[10px] bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        {/* References */}
        {data.references && data.references.length > 0 && (
          <section className="mb-4">
            <h2 className="text-base font-bold text-sky-700 mb-2 uppercase tracking-wide border-b-2 border-sky-100 pb-1">References</h2>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {data.references.map((ref: string, idx: number) => (
                <li key={idx}>{ref}</li>
              ))}
            </ul>
          </section>
        )}
      </main>
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
            {data.personalInfo.image ? (
              <img
                src={data.personalInfo.image}
                alt={data.personalInfo.fullName || "Profile"}
                className="w-full h-full object-cover rounded-full border border-gray-300 shadow"
              />
            ) : (
              data.personalInfo.fullName ? getInitials(data.personalInfo.fullName) : "YN"
            )}
          </div>
          <h1 className="text-xl font-light text-gray-800 mb-1 leading-tight">
            {data.personalInfo.fullName || "Your Name"}
          </h1>
          <p className="text-sm text-gray-600 font-normal">{jobTitle}</p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-sm font-normal text-gray-800 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">Contact</h2>
          <div className="space-y-2">
            {data.personalInfo.phone && (
              <div className="flex items-center text-xs text-gray-600">
                <Phone className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.phone}
              </div>
            )}
            {data.personalInfo.email && (
              <div className="flex items-center text-xs text-gray-600">
                <Mail className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.email}
              </div>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.website && (
              <div className="flex items-center text-xs text-gray-600">
                <Globe className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.website}
              </div>
            )}
            {data.personalInfo.linkedin && (
              <div className="flex items-center text-xs text-gray-600">
                <Linkedin className="w-3.5 h-3.5 mr-2 text-gray-500" />
                {data.personalInfo.linkedin}
              </div>
            )}
          </div>
        </div>

        {/* About Me Section */}
        {data.summary && (
          <div>
            <h2 className="text-sm font-normal text-gray-800 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">About Me</h2>
            <p className="text-xs leading-relaxed text-gray-600 text-justify">{data.summary}</p>
          </div>
        )}

        {/* Skills Section */}
        {data.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-normal text-gray-800 mb-3 pb-1 border-b border-gray-300 uppercase tracking-wide">Skills</h2>
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
            <h2 className="text-base font-light text-gray-800 mb-4 pb-1 border-b border-gray-300 uppercase tracking-wider">Education</h2>
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
            <h2 className="text-base font-light text-gray-800 mb-4 pb-1 border-b border-gray-300 uppercase tracking-wider">Experience</h2>
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
            <h2 className="text-base font-light text-gray-800 mb-4 pb-1 border-b border-gray-300 uppercase tracking-wider">Projects</h2>
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
                  {project.description && (
                    <p className="text-xs text-gray-700 mb-1">{project.description}</p>
                  )}
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
        <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Resume Content */}
      {renderTemplate()}
    </div>
  )
}
