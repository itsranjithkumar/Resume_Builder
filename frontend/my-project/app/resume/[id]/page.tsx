"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Download } from "lucide-react"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfessionalTemplate from "@/components/resume-templates/professional-template"
import ModernTemplate from "@/components/resume-templates/modern-template"

interface ResumeData {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  profileImage: string | null
  certificates: {
    name: string
    issuer: string
    date: string
    link: string
  }[]
  skills: {
    name: string
  }[]
  experiences: {
    title: string
    company: string
    duration: string
    description: string
  }[]
  projects: {
    name: string
    description: string
    link: string
  }[]
  education: {
    degree: string
    institution: string
    year: string
  }[]
}

export default function ResumePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [resume, setResume] = useState<ResumeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  const resumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load resume data from localStorage
    const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]")
    const resumeData = savedResumes.find((r: ResumeData) => r.id === params.id)

    if (resumeData) {
      setResume(resumeData)
    } else {
      // Resume not found, redirect to resumes page
      router.push("/resumes")
    }

    setLoading(false)
  }, [params.id, router])

  const downloadPDF = async () => {
    if (!resumeRef.current || !resume) return

    setIsDownloading(true)

    try {
      // Wait a moment to ensure the template is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 500))

      const element = resumeRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
      })

      const imgData = canvas.toDataURL("image/png")

      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      })

      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      // If the content is longer than one page, add more pages
      if (imgHeight > 297) {
        let heightLeft = imgHeight - 297
        let position = -297

        while (heightLeft > 0) {
          position -= 297
          pdf.addPage()
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
          heightLeft -= 297
        }
      }

      // Save the PDF
      pdf.save(`${resume.name.replace(/\s+/g, "_")}_Resume.pdf`)
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Failed to generate PDF. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="container mx-auto flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-lg">Resume not found</p>
          <Button className="mt-4" onClick={() => router.push("/resumes")}>
            Back to Resumes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/resumes")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Resumes
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard?id=${params.id}`)}>
            <Edit className="mr-2 h-4 w-4" /> Edit Resume
          </Button>
          <Button onClick={downloadPDF} disabled={isDownloading}>
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="professional" value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <div className="flex justify-center mb-4">
            <TabsList>
              <TabsTrigger value="professional">Professional Template</TabsTrigger>
              <TabsTrigger value="modern">Modern Template</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="professional">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl shadow-xl">
                <ProfessionalTemplate ref={resumeRef} resume={resume} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modern">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl shadow-xl">
                <ModernTemplate ref={resumeRef} resume={resume} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
