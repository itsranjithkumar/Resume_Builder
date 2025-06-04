"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Phone, Mail, MapPin, Globe, Linkedin } from "lucide-react"
import type { ResumeData } from "@/app/page"

interface ResumePreviewProps {
  data: ResumeData
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null)

  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString + "-01")
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
  }

  const handleDownloadPDF = async () => {
    if (typeof window !== "undefined") {
      const { default: html2canvas } = await import("html2canvas")
      const { jsPDF } = await import("jspdf")

      if (resumeRef.current) {
        const canvas = await html2canvas(resumeRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        })

        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF("p", "mm", "a4")

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 0

        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save(`${data.personalInfo.fullName || "resume"}.pdf`)
      }
    }
  }

  const jobTitle = data.experience.length > 0 ? data.experience[0].position : "Data Scientist"

  return (
    <div className="max-w-4xl mx-auto">
      {/* Download Button */}
      <div className="mb-6 text-center">
        <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Resume Content */}
      <div
        ref={resumeRef}
        className="bg-white shadow-lg border border-gray-200 mx-auto"
        style={{
          width: "210mm", // A4 width
          minHeight: "297mm", // A4 height
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header Section */}
        <div className="bg-white p-8 border-b border-gray-200">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-blue-600 mb-2">{data.personalInfo.fullName || "First Last"}</h1>
              <p className="text-xl text-gray-600 mb-4">{jobTitle}</p>
              <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">{data.summary}</p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-80 bg-gray-50 p-6">
            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Contact</h2>
              <div className="space-y-3">
                {data.personalInfo.location && (
                  <div className="flex items-start text-sm text-gray-700">
                    <MapPin className="w-4 h-4 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span>{data.personalInfo.location}</span>
                  </div>
                )}
                {data.personalInfo.phone && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
                    <span>{data.personalInfo.phone}</span>
                  </div>
                )}
                {data.personalInfo.email && (
                  <div className="flex items-center text-sm text-gray-700">
                    <Mail className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
                    <span className="break-all">{data.personalInfo.email}</span>
                  </div>
                )}
                {data.personalInfo.linkedin && (
                  <div className="flex items-start text-sm text-gray-700">
                    <Linkedin className="w-4 h-4 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="break-all">{data.personalInfo.linkedin}</span>
                  </div>
                )}
                {data.personalInfo.website && (
                  <div className="flex items-start text-sm text-gray-700">
                    <Globe className="w-4 h-4 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                    <span className="break-all">{data.personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {data.skills.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Skills</h2>
                <div className="space-y-4">
                  {data.skills.map((skill) => (
                    <div key={skill.id}>
                      <h3 className="text-sm font-semibold text-gray-800 mb-2 italic">{skill.category}:</h3>
                      <ul className="space-y-1">
                        {skill.items.split(",").map((item, index) => (
                          <li key={index} className="text-sm text-gray-700 pl-2">
                            • {item.trim()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Section */}
            <div>
              <h2 className="text-lg font-bold text-blue-600 mb-4 uppercase tracking-wide">Other</h2>
              <div className="space-y-2 text-sm text-gray-700">
                <p>• Volunteered in a 3-month data science Project, run by ACB Corporation Inc.</p>
                <p>• ABC Certification (2022)</p>
                <p>• Completed 10+ competitions on Kaggle in 2021.</p>
                <p>• Awards: Resume Worded Teaching Fellow (only 5 awarded to class), Dean's List 2012 (Top 10%)</p>
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <p className="text-xs">
                    • Don't forget to use <span className="text-blue-600 underline">Resume Worded</span> to scan your
                    resume before you send it off (it's free and proven to get you more jobs). It's helped 900k people
                    in 2021 speed up their job search by over 3x, so please I'd encourage you to try the free version at
                    least to get parts of your resume fixed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Work Experience Section */}
            {data.experience.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Work Experience</h2>
                <div className="space-y-6">
                  {data.experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                          <p className="text-base text-gray-700 italic">
                            {exp.company}, {exp.location}
                          </p>
                        </div>
                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                          {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && (
                        <div className="text-sm leading-relaxed text-gray-700 mt-3">
                          {exp.description.split("\n").map((line, index) => (
                            <div key={index} className="mb-2">
                              {line.trim().startsWith("•") ? (
                                <div className="flex items-start">
                                  <span className="mr-2 text-blue-600 font-bold">•</span>
                                  <span>{line.trim().substring(1).trim()}</span>
                                </div>
                              ) : line.trim().startsWith("Recruiter notes:") ? (
                                <div className="text-xs text-gray-500 italic mt-2">{line.trim()}</div>
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

            {/* Education Section */}
            {data.education.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-blue-600 mb-6 uppercase tracking-wide">Education</h2>
                <div className="space-y-4">
                  {data.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                          <p className="text-sm text-gray-700 italic">
                            {edu.institution}
                            {edu.location && `, ${edu.location}`}
                          </p>
                          {edu.field && <p className="text-sm text-gray-600 mt-1">Major in {edu.field}</p>}
                        </div>
                        <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                          {formatDate(edu.endDate)}
                        </span>
                      </div>
                      {edu.description && <p className="text-sm text-gray-700 mt-2">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
