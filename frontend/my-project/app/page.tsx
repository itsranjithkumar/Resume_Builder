"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ResumeForm from "@/components/resume-form"
import ResumePreview from "@/components/resume-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, FileText } from "lucide-react"

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    image: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    location: string
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string
    link: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    link: string
  }>
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    image: "",
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
}

export default function ResumePage() {
  const router = useRouter()
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resumeData");
      if (saved) return JSON.parse(saved);
    }
    return initialData;
  });
  const [currentView, setCurrentView] = useState<"form" | "preview">("form")

  // Persist resumeData to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [resumeData]);

  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Validate token with backend
    fetch("http://127.0.0.1:8000/api/users/validate-token", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setAuthChecked(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handlePreview = () => {
    setCurrentView("preview")
  }

  const handleBackToForm = () => {
    setCurrentView("form")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              {currentView === "preview" && (
                <Button variant="outline" onClick={handleBackToForm} className="flex items-center space-x-2 no-print">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Form</span>
                </Button>
              )}
              {currentView === "form" && (
                <Button onClick={handlePreview} className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800">
                  <Eye className="h-4 w-4" />
                  <span>Preview Resume</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto py-8">
          {currentView === "form" ? (
            <ResumeForm data={resumeData} onChange={setResumeData} onPreview={handlePreview} />
          ) : (
            <>
              <Button variant="outline" onClick={handleBackToForm} className="mb-6 no-print">
                Back to Edit
              </Button>
              <ResumePreview data={resumeData} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
