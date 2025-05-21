"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Download, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

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
          <Button>
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="mb-8 rounded-lg bg-white p-8 shadow-md">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={resume.profileImage || ""} alt={resume.name} />
              <AvatarFallback className="text-2xl">{resume.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{resume.name}</h1>
              <div className="mt-2 space-y-1 text-gray-600">
                {resume.email && <p>{resume.email}</p>}
                {resume.phone && <p>{resume.phone}</p>}
              </div>
            </div>
          </div>
        </div>

        {resume.bio && (
          <div className="mt-6">
            <h2 className="mb-2 text-xl font-semibold">About Me</h2>
            <p className="text-gray-700">{resume.bio}</p>
          </div>
        )}
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="space-y-8 md:col-span-1">
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map(
                  (skill, index) =>
                    skill.name && (
                      <Badge key={index} variant="secondary">
                        {skill.name}
                      </Badge>
                    ),
                )}
                {resume.skills.filter((s) => s.name).length === 0 && (
                  <p className="text-sm text-gray-500">No skills added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resume.education.map(
                  (edu, index) =>
                    edu.degree && (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">{edu.year}</p>
                      </div>
                    ),
                )}
                {resume.education.filter((e) => e.degree).length === 0 && (
                  <p className="text-sm text-gray-500">No education added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Certificates Section */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resume.certificates.map(
                  (cert, index) =>
                    cert.name && (
                      <div key={index}>
                        {index > 0 && <Separator className="my-4" />}
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                        <p className="text-sm text-gray-500">{cert.date}</p>
                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" /> View Certificate
                          </a>
                        )}
                      </div>
                    ),
                )}
                {resume.certificates.filter((c) => c.name).length === 0 && (
                  <p className="text-sm text-gray-500">No certificates added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8 md:col-span-2">
          {/* Experience Section */}
          <Card>
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resume.experiences.map(
                  (exp, index) =>
                    exp.title && (
                      <div key={index}>
                        {index > 0 && <Separator className="my-6" />}
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                          <h3 className="font-semibold">{exp.title}</h3>
                          <span className="text-sm text-gray-500">{exp.duration}</span>
                        </div>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="mt-2 text-gray-700">{exp.description}</p>
                      </div>
                    ),
                )}
                {resume.experiences.filter((e) => e.title).length === 0 && (
                  <p className="text-sm text-gray-500">No experience added yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {resume.projects.map(
                  (project, index) =>
                    project.name && (
                      <div key={index}>
                        {index > 0 && <Separator className="my-6" />}
                        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                          <h3 className="font-semibold">{project.name}</h3>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="h-3 w-3" /> View Project
                            </a>
                          )}
                        </div>
                        <p className="mt-2 text-gray-700">{project.description}</p>
                      </div>
                    ),
                )}
                {resume.projects.filter((p) => p.name).length === 0 && (
                  <p className="text-sm text-gray-500">No projects added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
