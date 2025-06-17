"use client"

import React, { useState } from "react"
import ResumeForm from "../components/resume-form"
import ResumePreview from "../components/resume-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export interface ResumeData {
  references: string[]
  personalInfo: {
    fullName: string
    age?: string
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
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
    location: string
    description: React.ReactNode
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

export default function Home() {
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("professional")
  // Key for localStorage
  const RESUME_STORAGE_KEY = "resumeData";

  // Helper to get initial data from localStorage or fallback to default
  const getInitialResumeData = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(RESUME_STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fallback to default if parse fails
        }
      }
    }
    return {
      references: [],
      personalInfo: {
        age: "",
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
    };
  };

  const [resumeData, setResumeData] = useState<ResumeData>(getInitialResumeData());

  // Save resumeData to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
  }, [resumeData]);

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleBackToForm = () => {
    setShowPreview(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {!showPreview ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Builder</h1>
              <p className="text-gray-600">Create a professional resume with our easy-to-use builder</p>
            </div>
            <ResumeForm
              data={resumeData}
              onChange={setResumeData}
              onPreview={handlePreview}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <Button onClick={handleBackToForm} variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Form
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Resume Preview</h1>
              <div></div>
            </div>
            <ResumePreview data={resumeData} template={selectedTemplate} />
          </>
        )}
      </div>
    </div>
  )
}
