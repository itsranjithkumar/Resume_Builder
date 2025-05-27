"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink, Trash2 } from "lucide-react"
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
import { FileText } from "lucide-react"

const ResumesPage = () => {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchResumes = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/resumes")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setResumes(data)
      } catch (error) {
        console.error("Failed to fetch resumes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchResumes()
  }, [])

  const handleView = (id: string) => {
    router.push(`/resume/${id}`)
  }

  const handleGenerateResume = (id: string) => {
    router.push(`/resume/${id}`)
  }

  const handleEdit = (id: string) => {
    router.push(`/resumes/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setResumes(resumes.filter((resume) => resume.id !== id))
    } catch (error) {
      console.error("Failed to delete resume:", error)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Resumes</h1>
        <Button onClick={() => router.push("/resumes/new")}>Create New Resume</Button>
      </div>
      {loading ? (
        <p>Loading resumes...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id}>
              <CardHeader>
                <CardTitle>{resume.title}</CardTitle>
                <CardDescription>{resume.jobTitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Email: {resume.email}</p>
                <p>Phone: {resume.phone}</p>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 border-t bg-gray-50 px-6 py-3">
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(resume.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleGenerateResume(resume.id)}
                    className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Generate Resume
                  </Button>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(resume.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-destructive flex-1 sm:flex-none">
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

export default ResumesPage
