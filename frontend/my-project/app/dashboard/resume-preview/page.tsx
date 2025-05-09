"use client"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useRef } from "react"

export default function ResumePreview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const data = searchParams.get("data")
  const resumeRef = useRef<HTMLDivElement>(null)
  let resume = null

  try {
    resume = data ? JSON.parse(data) : null
  } catch {
    resume = null
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
          <title>Resume - Print</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
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
              overflow: hidden;
              position: relative;
            }
            .resume-content {
              transform-origin: top left;
              transform: scale(0.97);
              width: 100%;
              height: 100%;
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
            .two-columns {
              display: flex;
              gap: 24px;
            }
            .main-column {
              flex: 2;
            }
            .side-column {
              flex: 1;
            }
            .skill-tag {
              display: inline-block;
              background: #f3f4f6;
              padding: 4px 8px;
              border-radius: 4px;
              margin-right: 6px;
              margin-bottom: 6px;
              font-size: 13px;
            }
            .job-header, .edu-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
            }
            .job-company, .edu-school {
              display: flex;
              align-items: center;
              margin-bottom: 6px;
            }
            .job-details {
              list-style-type: disc;
              padding-left: 20px;
              margin-top: 6px;
              font-size: 14px;
            }
            .job-details li {
              margin-bottom: 4px;
            }
            .profile-image {
              width: 100px;
              height: 100px;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid #eee;
            }
            .header-container {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
            }
            .title {
              color: #0ea5e9;
              font-size: 18px;
              margin-top: 4px;
              margin-bottom: 8px;
            }
            .strength-item {
              display: flex;
              align-items: flex-start;
              margin-bottom: 10px;
            }
            .strength-icon {
              color: #0ea5e9;
              margin-right: 8px;
              font-size: 16px;
            }
            .achievement-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            .reference-item {
              margin-bottom: 12px;
            }
            .reference-name {
              font-weight: bold;
              margin-bottom: 2px;
            }
            .reference-details {
              font-size: 14px;
              margin: 2px 0;
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
        <Button variant="outline" onClick={() => router.back()} className="print:hidden">
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

                  {experience.map((exp: { role: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; startDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; endDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; company: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; details: (string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined)[] }, idx: Key | null | undefined) => (
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
                          {exp.details.map((detail: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, detailIdx: Key | null | undefined) => (
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

              {/* Education Section */}
              {education.length > 0 && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">EDUCATION</h2>

                  {education.map((edu: { degree: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; startDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; endDate: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; school: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; location: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
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

              {/* Key Achievements Section */}
              {visibleSections?.achievements !== false && achievements.length > 0 && achievements[0].title && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">KEY ACHIEVEMENTS</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {achievements.map((achievement: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
                      <div key={idx} className="mb-2">
                        <h3 className="font-bold text-gray-800 text-sm">{achievement.title}</h3>
                        <p className="text-sm text-gray-700">{achievement.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="flex-1">
              {/* Technical Skills Section */}
              {skills.length > 0 && skills[0] && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">TECHNICAL SKILLS</h2>

                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, idx: Key | null | undefined) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths Section */}
              {visibleSections?.strengths !== false && strengths.length > 0 && strengths[0].title && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">STRENGTHS</h2>

                  {strengths.map((strength: { title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
                    <div key={idx} className="mb-3">
                      <div className="flex items-center mb-1">
                        <Star className="h-4 w-4 text-cyan-500 mr-2 flex-shrink-0" />
                        <h3 className="font-bold text-gray-800 text-sm">{strength.title}</h3>
                      </div>
                      <p className="text-xs text-gray-700 ml-6">{strength.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects Section */}
              {visibleSections?.projects !== false && projects.length > 0 && projects[0].name && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">PROJECTS</h2>

                  {projects.map((project: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
                    <div key={idx} className="mb-3">
                      <h3 className="font-bold text-gray-800 text-sm">{project.name}</h3>
                      <p className="text-xs text-gray-700">{project.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* References Section */}
              {visibleSections?.references !== false && references.length > 0 && references[0].name && (
                <div className="mb-5">
                  <h2 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-3">REFERENCES</h2>

                  {references.map((ref: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; company: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; phone: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined }, idx: Key | null | undefined) => (
                    <div key={idx} className="mb-3">
                      <h3 className="font-bold text-gray-800 text-sm">{ref.name}</h3>
                      <p className="text-xs text-gray-700">
                        {ref.title} at {ref.company}
                      </p>
                      <p className="text-xs text-gray-700">{ref.phone}</p>
                      <p className="text-xs text-gray-700">{ref.email}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
