"use client"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Phone, Mail, MapPin, LinkIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef, useEffect, useState } from "react"

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

  function parseBackendResume(data: any) {
    // Convert backend resume fields to frontend structure
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
      profileImage: data.profileImage || "",
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
      visibleSections: {
        projects: !!data.projects,
        achievements: !!data.achievements,
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

  const handlePrint = () => {
    const content = resumeRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printDocument = printWindow.document
    printDocument.write(`
<html>
  <head>
    <title>Resume - ${resume?.personal?.firstName || ""} ${resume?.personal?.lastName || ""}</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@latest/font/lucide.css" />
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
        font-family: Arial, sans-serif;
        color: #333;
        line-height: 1.5;
        font-size: 12px;
      }
      .resume-container {
        width: 210mm;
        height: 297mm;
        padding: 15mm;
        margin: 0 auto;
        background: white;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
      }
      .resume-content {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
      h1 {
        font-size: 24px;
        margin-bottom: 4px;
        color: #333;
      }
      h2 {
  text-transform: uppercase;
  font-size: 16px;
  border-bottom: 1px solid #333;
  padding-bottom: 4px;
  margin-top: 14px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}
      h3 {
        font-size: 14px;
        margin-bottom: 4px;
        margin-top: 10px;
        color: #444;
      }
      p {
        margin: 4px 0;
        font-size: 12px;
      }
      .contact-info {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 6px;
        font-size: 12px;
      }
      .contact-item {
        display: flex;
        align-items: center;
      }
      .section {
        margin-bottom: 14px;
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
        margin-bottom: 1rem;
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
        color: #333;
      }
      .text-gray-700 {
        color: #444;
      }
      .text-gray-600 {
        color: #555;
      }
      .text-sm {
        font-size: 12px;
      }
      .text-xs {
        font-size: 10px;
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
        background-color: #f5f5f5;
      }
      .rounded-md {
        border-radius: 0.375rem;
      }
      .border-b {
        border-bottom-width: 1px;
      }
      .border-gray-300 {
        border-color: #ddd;
      }
      .border-blue-500 {
        border-color: #2563eb;
      }
      .pb-1 {
        padding-bottom: 0.25rem;
      }
      .w-20 {
        width: 5rem;
      }
      .h-20 {
        height: 5rem;
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
        border-color: #eee;
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
        font-size: 24px;
      }
      .text-lg {
        font-size: 14px;
      }
      .text-blue-500 {
        color: #2563eb;
      }
      .text-blue-600 {
        color: #2563eb;
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
        color: #2563eb;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .icon {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 4px;
        position: relative;
        top: 2px;
        color: #2563eb;
      }
      ul {
        margin-top: 4px;
        margin-bottom: 8px;
        padding-left: 20px;
      }
      li {
        margin-bottom: 3px;
        font-size: 12px;
      }
      .skill-tag {
        display: inline-block;
        background-color: #f5f5f5;
        padding: 2px 8px;
        margin: 2px;
        border-radius: 4px;
        font-size: 11px;
      }
      .gap-1 {
        gap: 0.25rem;
      }
      .gap-2 {
        gap: 0.5rem;
      }
      .lucide {
        color: #2563eb;
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }
      /* Fix for contact icons */
.contact-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
}
.lucide {
  width: 16px !important;
  height: 16px !important;
  margin-right: 6px !important;
  display: inline-block !important;
  color: #333 !important;
  stroke: #333 !important;
  stroke-width: 2px !important;
}
    </style>
  </head>
  <body>
    <div class="resume-container">
      <div class="resume-content">
        ${content.innerHTML}
      </div>
    </div>
    <script>
  window.onload = function() {
    // Replace SVG icons with Unicode symbols for better PDF compatibility
    document.querySelectorAll('.lucide-phone').forEach(icon => {
      const span = document.createElement('span');
      span.className = 'contact-icon';
      span.innerHTML = '📞';
      icon.parentNode.replaceChild(span, icon);
    });
    document.querySelectorAll('.lucide-mail').forEach(icon => {
      const span = document.createElement('span');
      span.className = 'contact-icon';
      span.innerHTML = '✉️';
      icon.parentNode.replaceChild(span, icon);
    });
    document.querySelectorAll('.lucide-map-pin').forEach(icon => {
      const span = document.createElement('span');
      span.className = 'contact-icon';
      span.innerHTML = '📍';
      icon.parentNode.replaceChild(span, icon);
    });
    document.querySelectorAll('.lucide-link').forEach(icon => {
      const span = document.createElement('span');
      span.className = 'contact-icon';
      span.innerHTML = '🔗';
      icon.parentNode.replaceChild(span, icon);
    });
  }
</script>
  </body>
</html>
`)

    printDocument.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading resume...</h1>
      </div>
    )
  }

  if (error || !resume) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid resume data</h1>
        <p className="mb-6">{error || "Unable to load resume data. Please go back and try again."}</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resume Builder
        </Button>
      </div>
    )
  }

  const { personal, experience, education, skills, projects, achievements, visibleSections } = resume

  // Combine all skills into a single array for compact display
  const allSkills = [
    ...(skills.frontend || []),
    ...(skills.backend || []),
    ...(skills.databases || []),
    ...(skills.other || []),
  ].filter(Boolean)

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
          className="print:hidden border-gray-300 hover:bg-gray-100 text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Edit
        </Button>
        <Button onClick={handlePrint} className="print:hidden bg-gray-700 hover:bg-gray-800">
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {personal.firstName} {personal.lastName}
              </h1>
              <p className="text-lg text-blue-500 font-medium">{personal.title}</p>

              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
                {personal.phone && (
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1 text-blue-500" />
                    {personal.phone}
                  </div>
                )}
                {personal.email && (
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-blue-500" />
                    <a
                      href={`mailto:${personal.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {personal.email}
                    </a>
                  </div>
                )}
                {personal.linkedin && (
                  <div className="flex items-center">
                    <LinkIcon className="h-3 w-3 mr-1 text-blue-500" />
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                      style={{ wordBreak: "break-all" }}
                    >
                      {personal.linkedin}
                    </a>
                  </div>
                )}
                {personal.address && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                    {personal.address}
                  </div>
                )}
              </div>
            </div>

            {personal.profileImage && (
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <img
                  src={personal.profileImage || "/placeholder.svg"}
                  alt={`${personal.firstName} ${personal.lastName}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=80&width=80"
                  }}
                />
              </div>
            )}
          </div>

          {/* Summary Section */}
          {personal.summary && (
            <div className="mb-4">
              <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">SUMMARY</h2>
              <p className="text-sm text-gray-700">{personal.summary}</p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="flex flex-row gap-6">
            {/* Main Column */}
            <div className="flex-[2]">
              {/* Experience Section */}
              {experience.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">
                    PROFESSIONAL EXPERIENCE
                  </h2>

                  {experience.map((exp, idx) => (
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
                          {exp.details.map((detail, detailIdx) => (
                            <li key={detailIdx} className="mb-1">
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section moved to main column */}
              {visibleSections?.projects !== false && projects.length > 0 && projects[0].name && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">PROJECTS</h2>
                  {projects.map((project, idx) => (
                    <div key={idx} className="mb-3">
                      <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        {project.name}
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center"
                            aria-label="Visit project link"
                          >
                            <LinkIcon className="h-4 w-4 text-blue-500 inline-block" />
                          </a>
                        )}
                      </h3>
                      <p className="text-sm text-gray-700">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Education Section */}
              {education.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">EDUCATION</h2>

                  {education.map((edu, idx) => (
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
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="flex-1">
              {/* Technical Skills Section */}
              {allSkills.length > 0 && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">
                    TECHNICAL SKILLS
                  </h2>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {allSkills.map(
                      (skill, idx) =>
                        skill && (
                          <span
                            key={idx}
                            className="inline-block bg-gray-100 rounded-md px-2 py-1 text-xs text-gray-700 mb-1"
                          >
                            {skill}
                          </span>
                        ),
                    )}
                  </div>
                </div>
              )}

              {/* Certificates Section */}
              {visibleSections?.achievements !== false && achievements.length > 0 && achievements[0].title && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold border-b border-gray-300 pb-1 mb-2 text-gray-800">CERTIFICATES</h2>
                  <div className="space-y-2">
                    {achievements.map((achievement, idx) => (
                      <div key={idx} className="mb-2">
                        <h3 className="font-bold text-gray-800 text-sm">
  {achievement.link ? (
    <a
      href={achievement.link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline flex items-center gap-1 align-middle"
      style={{display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle'}}>
      <span style={{verticalAlign: 'middle'}}>{achievement.title}</span>
      <LinkIcon className="h-3 w-3 ml-1 align-middle" style={{verticalAlign: 'middle'}} />
    </a>
  ) : (
    <span style={{verticalAlign: 'middle'}}>{achievement.title}</span>
  )}
</h3>
                        <p className="text-sm text-gray-700">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
