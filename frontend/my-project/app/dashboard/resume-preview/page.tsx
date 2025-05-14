"use client"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  type JSXElementConstructor,
  type Key,
  type ReactElement,
  type ReactNode,
  type ReactPortal,
  useRef,
} from "react"

import { useEffect, useState } from "react"

export default function ResumePreview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const data = searchParams.get("data")
  const resumeId = searchParams.get("resume_id")
  const resumeRef = useRef<HTMLDivElement>(null)
  const [resume, setResume] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch resume from backend if resume_id is present
  useEffect(() => {
    if (resumeId) {
      setLoading(true)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      if (!token) {
        setError("You must be logged in to view this resume.")
        setLoading(false)
        return
      }
      fetch(`http://127.0.0.1:8000/api/resumes/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error((await res.text()) || "Failed to fetch resume")
          return res.json()
        })
        .then((data) => {
          // Parse backend fields to frontend structure
          setResume(parseBackendResume(data))
          setLoading(false)
        })
        .catch((err) => {
          setError("Unable to load resume data: " + (err.message || "Unknown error"))
          setLoading(false)
          console.error("Resume fetch error:", err)
        })
    } else if (data) {
      try {
        setResume(JSON.parse(data))
      } catch (err) {
        setResume(null)
        setError("Invalid resume data: " + (err instanceof Error ? err.message : String(err)))
        console.error("Resume parse error:", err)
      }
    }
  }, [resumeId, data])

  // Update the parseBackendResume function to handle the new skills structure
  function parseBackendResume(data: any) {
    // Convert backend resume fields to frontend structure
    // Most fields are JSON strings, except name, summary, skills, contact, etc.
    const [firstName, ...lastParts] = (data.name || "").split(" ")
    const lastName = lastParts.join(" ")
    const personal = {
      firstName: firstName || "",
      lastName: lastName || "",
      phone: (data.contact || "").split(",")[1]?.trim() || "",
      email: (data.contact || "").split(",")[0]?.trim() || "",
      address: (data.contact || "").split(",")[2]?.trim() || "",
      title: data.title || "",
      linkedin: "", // Not stored in backend
      summary: data.summary || "",
      profileImage: data.profileImage || "", // Use base64 from backend if present
      profileImageFile: null,
    }

    // Try to parse skills as JSON first (for new format)
    let parsedSkills
    try {
      parsedSkills = JSON.parse(data.skills)
    } catch {
      // Fall back to old format if JSON parsing fails
      parsedSkills = {
        frontend: [],
        backend: [],
        databases: [],
        other: [],
      }

      // Convert comma-separated skills to "other" category
      if (data.skills) {
        parsedSkills.other = data.skills
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      }
    }

    return {
      personal,
      experience: safeParseJSON(data.experience) || [],
      education: safeParseJSON(data.education) || [],
      skills: parsedSkills,
      projects: safeParseJSON(data.projects) || [],
      achievements: safeParseJSON(data.achievements) || [],
      strengths: safeParseJSON(data.strengths) || [],
      references: safeParseJSON(data.references) || [],
      visibleSections: {
        projects: !!data.projects,
        achievements: !!data.achievements,
        strengths: false,
        references: false,
      },
    }
  }

  function safeParseJSON(str: string) {
    try {
      return JSON.parse(str)
    } catch {
      return []
    }
  }

  // Update the handlePrint function to include the new styles for skills and certificates
  const handlePrint = () => {
    const content = resumeRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printDocument = printWindow.document
    printDocument.write(`
  <html>
    <head>
      <title>Resume - Print</title>
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
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        body {
          font-family: Arial, sans-serif;
          color: #333;
          line-height: 1.5;
        }
        .resume-container {
          width: 210mm;
          height: 297mm;
          padding: 20mm;
          margin: 0 auto;
          background: white;
          box-sizing: border-box;
          position: relative;
        }
        .resume-content {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 4px;
          color: #333;
        }
        h2 {
          font-size: 18px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4px;
          margin-top: 16px;
          margin-bottom: 12px;
        }
        h3 {
          font-size: 16px;
          margin-bottom: 4px;
          margin-top: 12px;
        }
        p {
          margin: 4px 0;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }
        .contact-item {
          display: flex;
          align-items: center;
        }
        .section {
          margin-bottom: 16px;
        }
        .flex {
          display: flex;
        }
        .flex-row {
          flex-direction: row;
        }
        .gap-6 {
          gap: 1.5rem;
        }
        .flex-\\[2\\] {
          flex: 2;
        }
        .flex-1 {
          flex: 1;
        }
        .justify-between {
          justify-content: space-between;
        }
        .items-start {
          align-items: flex-start;
        }
        .items-center {
          align-items: center;
        }
        .mb-5 {
          margin-bottom: 1.25rem;
        }
        .mb-3 {
          margin-bottom: 0.75rem;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .mb-1 {
          margin-bottom: 0.25rem;
        }
        .mt-1 {
          margin-top: 0.25rem;
        }
        .font-bold {
          font-weight: 700;
        }
        .font-medium {
          font-weight: 500;
        }
        .text-gray-800 {
          color: #1f2937;
        }
        .text-gray-700 {
          color: #374151;
        }
        .text-gray-600 {
          color: #4b5563;
        }
        .text-sm {
          font-size: 0.875rem;
        }
        .text-xs {
          font-size: 0.75rem;
        }
        .mx-2 {
          margin-left: 0.5rem;
          margin-right: 0.5rem;
        }
        .list-disc {
          list-style-type: disc;
        }
        .list-outside {
          list-style-position: outside;
        }
        .ml-5 {
          margin-left: 1.25rem;
        }
        .grid {
          display: grid;
        }
        .grid-cols-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .gap-2 {
          gap: 0.5rem;
        }
        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }
        .inline-block {
          display: inline-block;
        }
        .px-2 {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }
        .py-1 {
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
        }
        .bg-gray-100 {
          background-color: #f3f4f6;
        }
        .rounded-md {
          border-radius: 0.375rem;
        }
        .border-b {
          border-bottom-width: 1px;
        }
        .border-gray-300 {
          border-color: #d1d5db;
        }
        .pb-1 {
          padding-bottom: 0.25rem;
        }
        .w-24 {
          width: 6rem;
        }
        .h-24 {
          height: 6rem;
        }
        .rounded-full {
          border-radius: 9999px;
        }
        .overflow-hidden {
          overflow: hidden;
        }
        .border-2 {
          border-width: 2px;
        }
        .border-gray-200 {
          border-color: #e5e7eb;
        }
        .flex-shrink-0 {
          flex-shrink: 0;
        }
        .w-full {
          width: 100%;
        }
        .h-full {
          height: 100%;
        }
        .object-cover {
          object-fit: cover;
        }
        .text-4xl {
          font-size: 2.25rem;
        }
        .text-lg {
          font-size: 1.125rem;
        }
        .text-cyan-500 {
          color: #06b6d4;
        }
        .text-cyan-600 {
          color: #0891b2;
        }
        .mt-3 {
          margin-top: 0.75rem;
        }
        .flex-wrap {
          flex-wrap: wrap;
        }
        .gap-3 {
          gap: 0.75rem;
        }
        a {
          color: #0891b2;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="resume-container">
        <div class="resume-content">
          ${content.innerHTML}
        </div>
      </div>
    </body>
  </html>
`)

    printDocument.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  if (!resume) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid resume data</h1>
        <p className="mb-6">Unable to load resume data. Please go back and try again.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resume Builder
        </Button>
      </div>
    )
  }

  const { personal, experience, education, skills, projects, achievements, strengths, references, visibleSections } =
    resume

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-4">
      <div className="max-w-[800px] mx-auto mb-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => {
            // When going back, restore form state from localStorage
            if (typeof window !== "undefined") {
              const saved = localStorage.getItem("resumeFormState")
              if (saved) {
                // Optionally, trigger a reload or pass state back
                // This is handled by CreateResume's useEffect
              }
            }
            router.back()
          }}
          className="print:hidden"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
        </Button>
        <Button onClick={handlePrint} className="print:hidden">
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>

      {/* A4 Resume Sheet */}
      <div
        ref={resumeRef}
        className="bg-white shadow-xl mx-auto w-full max-w-[800px] h-[1122px] border border-gray-300 overflow-hidden print:shadow-none print:border-none print:w-[210mm] print:h-[297mm]"
        style={{ boxSizing: "border-box" }}
      >
        <div className="p-8 h-full overflow-y-auto">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-5">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-1">
                {personal.firstName} {personal.lastName}
              </h1>
              <p className="text-lg text-cyan-500 font-medium">{personal.title}</p>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                {personal.phone && <div className="flex items-center">{personal.phone}</div>}
                {personal.email && <div className="flex items-center">{personal.email}</div>}
                {personal.linkedin && <div className="flex items-center">{personal.linkedin}</div>}
                {personal.address && <div className="flex items-center">{personal.address}</div>}
              </div>
            </div>

            {personal.profileImage && (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <img
                  src={personal.profileImage || "/placeholder.svg"}
                  alt={`${personal.firstName} ${personal.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=96&width=96"
                  }}
                />
              </div>
            )}
          </div>

          {/* Summary Section */}
          {personal.summary && (
            <div className="mb-5">
              <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
              <p className="text-sm text-gray-700">{personal.summary}</p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="flex flex-row gap-6">
            {/* Main Column */}
            <div className="flex-[2]">
              {/* Experience Section */}
              {experience.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">PROFESSIONAL EXPERIENCE</h2>

                  {experience.map(
                    (
                      exp: {
                        role:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        startDate:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        endDate:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        company:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        location:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        details: (
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactPortal
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        )[]
                      },
                      idx: Key | null | undefined,
                    ) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800">{exp.role}</h3>
                          <span className="text-sm text-gray-600">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700 mb-1">
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{exp.location}</span>
                            </>
                          )}
                        </div>

                        {exp.details.length > 0 && (
                          <ul className="list-disc list-outside ml-5 text-sm text-gray-700 mt-1">
                            {exp.details.map(
                              (
                                detail:
                                  | string
                                  | number
                                  | bigint
                                  | boolean
                                  | ReactElement<unknown, string | JSXElementConstructor<any>>
                                  | Iterable<ReactNode>
                                  | ReactPortal
                                  | Promise<
                                      | string
                                      | number
                                      | bigint
                                      | boolean
                                      | ReactPortal
                                      | ReactElement<unknown, string | JSXElementConstructor<any>>
                                      | Iterable<ReactNode>
                                      | null
                                      | undefined
                                    >
                                  | null
                                  | undefined,
                                detailIdx: Key | null | undefined,
                              ) => (
                                <li key={detailIdx} className="mb-1">
                                  {detail}
                                </li>
                              ),
                            )}
                          </ul>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Projects Section moved to main column */}
              {visibleSections?.projects !== false && projects.length > 0 && projects[0].name && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">PROJECTS</h2>
                  {projects.map((project: { name: string; description: string }, idx: Key | null | undefined) => (
                    <div key={idx} className="mb-3">
                      <h3 className="font-bold text-gray-800">{project.name}</h3>
                      <p className="text-sm text-gray-700">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {education.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>

                  {education.map(
                    (
                      edu: {
                        degree:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        startDate:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        endDate:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        school:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                        location:
                          | string
                          | number
                          | bigint
                          | boolean
                          | ReactElement<unknown, string | JSXElementConstructor<any>>
                          | Iterable<ReactNode>
                          | ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | ReactPortal
                              | ReactElement<unknown, string | JSXElementConstructor<any>>
                              | Iterable<ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                      },
                      idx: Key | null | undefined,
                    ) => (
                      <div key={idx} className="mb-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-gray-800">{edu.degree}</h3>
                          <span className="text-sm text-gray-600">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <span className="font-medium">{edu.school}</span>
                          {edu.location && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{edu.location}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="flex-1">
              {/* Technical Skills Section */}
              {skills && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">TECHNICAL SKILLS</h2>

                  {/* Frontend Skills */}
                  {skills.frontend && skills.frontend.filter(Boolean).length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Frontend Technologies:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.frontend.filter(Boolean).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Backend Skills */}
                  {skills.backend && skills.backend.filter(Boolean).length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Backend Technologies:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.backend.filter(Boolean).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Database Skills */}
                  {skills.databases && skills.databases.filter(Boolean).length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Databases:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.databases.filter(Boolean).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other Skills */}
                  {skills.other && skills.other.filter(Boolean).length > 0 && (
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 text-sm mb-2">Other Skills:</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {skills.other.filter(Boolean).map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Certificates Section */}
              {visibleSections?.achievements !== false && achievements.length > 0 && achievements[0].title && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">CERTIFICATES</h2>
                  <div className="space-y-2">
                    {achievements.map(
                      (
                        achievement: { title: string; description: string; link?: string },
                        idx: Key | null | undefined,
                      ) => (
                        <div key={idx} className="mb-2">
                          <h3 className="font-bold text-gray-800 text-sm">
                            {achievement.link ? (
                              <a
                                href={achievement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-600 hover:underline"
                              >
                                {achievement.title}
                              </a>
                            ) : (
                              achievement.title
                            )}
                          </h3>
                          <p className="text-sm text-gray-700">{achievement.description}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* References Section removed as per user request */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
