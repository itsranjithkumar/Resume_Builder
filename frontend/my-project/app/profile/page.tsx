"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, User, Trash2, Edit, Plus, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"

interface SavedResume {
  id: string
  savedAt: string
  title: string
  template: string
  data: any
}

export default function ProfilePage() {
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Load saved resumes from localStorage
    try {
      const resumes = JSON.parse(localStorage.getItem("savedResumes") || "[]")
      setSavedResumes(resumes)
    } catch (error) {
      console.error("Error loading saved resumes:", error)
      setSavedResumes([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleEditResume = (resume: SavedResume) => {
    // Store the resume data in localStorage for the form to pick up
    localStorage.setItem("editingResume", JSON.stringify(resume))
    // Navigate back to the resume form
    router.push("/")
  }

  const handleCreateNew = () => {
    // Clear any existing editing data and draft resume data to ensure clean form
    localStorage.removeItem("editingResume")
    localStorage.removeItem("resumeData")
    router.push("/")
  }

  const handleDeleteResume = (resumeId: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      const updatedResumes = savedResumes.filter((resume) => resume.id !== resumeId)
      setSavedResumes(updatedResumes)
      localStorage.setItem("savedResumes", JSON.stringify(updatedResumes))
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTemplateColor = (template: string) => {
    switch (template) {
      case "professional":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "creative":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "minimal":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your resumes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-3 animate-fadein drop-shadow-md" style={{letterSpacing: '-0.01em'}}>Welcome to your profile</h2>
          <h1 className="text-6xl font-bold text-gray-900 mb-6 tracking-tight">Your Resume Collection</h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your professional resumes with ease. Create, edit, and organize all your career documents in one
            place.
          </p>
        </div>

        {/* Create New Resume CTA */}
        <div className="text-center mb-20">
          <Button
            onClick={handleCreateNew}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create New Resume
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Stats Section */}
        {savedResumes.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-1">{savedResumes.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Resumes</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-4xl font-bold text-blue-600 mb-1">
                  {savedResumes.filter((r) => r.template === "professional").length}
                </div>
                <div className="text-sm font-medium text-gray-600">Professional</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-4xl font-bold text-purple-600 mb-1">
                  {savedResumes.filter((r) => r.template === "creative").length}
                </div>
                <div className="text-sm font-medium text-gray-600">Creative</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="text-4xl font-bold text-gray-600 mb-1">
                  {savedResumes.filter((r) => r.template === "minimal").length}
                </div>
                <div className="text-sm font-medium text-gray-600">Minimal</div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Resumes Section */}
        <div className="mb-16">
          {savedResumes.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <FileText className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">No resumes yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start building your professional resume today. It only takes a few minutes to create something amazing.
              </p>
              <Button
                onClick={handleCreateNew}
                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold"
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Your First Resume
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Your Resumes</h2>
                <p className="text-gray-600">
                  {savedResumes.length} resume{savedResumes.length !== 1 ? "s" : ""} ready to help you land your dream
                  job
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedResumes.map((resume) => (
                  <Card
                    key={resume.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md rounded-2xl overflow-hidden bg-white glassmorphism"
                  >
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="p-6 pb-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {resume.title || "Untitled Resume"}
                            </h3>
                            <Badge
                              className={`${getTemplateColor(resume.template)} text-xs font-medium border rounded-full px-3 py-1`}
                            >
                              {resume.template.charAt(0).toUpperCase() + resume.template.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        {/* Resume Info */}
                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-3 text-gray-400" />
                            <span className="font-medium">
                              {resume.data.personalInfo?.email || "No email provided"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                            <span>Saved {formatDate(resume.savedAt)}</span>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
                          <div className="text-center">
                            <div className="font-bold text-gray-900">{resume.data.experience?.length || 0}</div>
                            <div>Experience</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-gray-900">{resume.data.education?.length || 0}</div>
                            <div>Education</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-gray-900">{resume.data.projects?.length || 0}</div>
                            <div>Projects</div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleEditResume(resume)}
                            className="flex-1 bg-black hover:bg-gray-800 text-white font-semibold py-2.5 rounded-full transition-all duration-200"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Resume
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteResume(resume.id)
                            }}
                            variant="outline"
                            className="p-2.5 rounded-full border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
