"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Edit, Trash2, Plus, FileText, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ResumeData {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  profileImage: string | null
  certificates: any[]
  skills: any[]
  experiences: any[]
  projects: any[]
  education: any[]
}

export default function ResumesPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<ResumeData[]>([])

  useEffect(() => {
    // Load resumes from localStorage
    const savedResumes = JSON.parse(localStorage.getItem("resumes") || "[]")
    setResumes(savedResumes)
  }, [])

  const handleEdit = (id: string) => {
    router.push(`/dashboard?id=${id}`)
  }

  const handleDelete = (id: string) => {
    // Filter out the resume with the given id
    const updatedResumes = resumes.filter((resume) => resume.id !== id)
    // Update localStorage
    localStorage.setItem("resumes", JSON.stringify(updatedResumes))
    // Update state
    setResumes(updatedResumes)
    // Show toast
    alert("Resume deleted!")
  }

  const handleView = (id: string) => {
    router.push(`/resume/${id}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">My Resumes</h1>
        <Button onClick={() => router.push("/dashboard")}>
          <Plus className="mr-2 h-4 w-4" /> Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-400" />
          <h2 className="mb-2 text-xl font-semibold">No Resumes Found</h2>
          <p className="mb-4 text-gray-500">You haven't created any resumes yet. Create your first resume now!</p>
          <Button onClick={() => router.push("/dashboard")}>
            <Plus className="mr-2 h-4 w-4" /> Create Resume
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="truncate">{resume.name || "Untitled Resume"}</CardTitle>
                <CardDescription className="truncate">{resume.email || "No email provided"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    {resume.profileImage ? (
                      <img
                        src={resume.profileImage || "/placeholder.svg"}
                        alt={resume.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">No Image</div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      {resume.skills.length} Skills • {resume.experiences.length} Experiences
                    </p>
                    <p className="text-sm text-gray-500">
                      {resume.projects.length} Projects • {resume.education.length} Education
                    </p>
                  </div>
                </div>
                <p className="line-clamp-2 text-sm text-gray-600">{resume.bio || "No bio provided"}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3">
                <Button variant="outline" size="sm" onClick={() => handleView(resume.id)}>
                  <ExternalLink className="mr-2 h-4 w-4" /> View
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(resume.id)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your resume.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(resume.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
