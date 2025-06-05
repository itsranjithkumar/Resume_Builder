"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Briefcase, Sparkles } from "lucide-react"

interface JobDescriptionInputProps {
  jobDescription: string
  onJobDescriptionChange: (jd: string) => void
}

export function JobDescriptionInput({ jobDescription, onJobDescriptionChange }: JobDescriptionInputProps) {
  const handleSampleJD = () => {
    // DUMMY SAMPLE JD - Replace with real samples or user's saved JDs
    const sampleJD = `Senior Frontend Developer - React/TypeScript

We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern technologies.

Requirements:
• 5+ years of experience in frontend development
• Strong proficiency in React.js and TypeScript
• Experience with modern CSS frameworks and preprocessors
• Knowledge of state management libraries (Redux, Zustand)
• Familiarity with testing frameworks (Jest, React Testing Library)
• Experience with build tools (Webpack, Vite)
• Understanding of RESTful APIs and GraphQL
• Experience with version control systems (Git)
• Knowledge of AWS services and Docker containerization
• Experience with CI/CD pipelines

Nice to have:
• Experience with Next.js
• Knowledge of Kubernetes
• Familiarity with microservices architecture
• Experience with performance optimization

Responsibilities:
• Develop and maintain high-quality web applications
• Collaborate with design and backend teams
• Write clean, maintainable, and testable code
• Participate in code reviews and technical discussions
• Mentor junior developers`

    onJobDescriptionChange(sampleJD)
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Job Description
        </CardTitle>
        <CardDescription>Paste the job description you want to optimize for</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          className="min-h-[300px] resize-none"
        />

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{jobDescription.length} characters</p>
          <Button onClick={handleSampleJD} variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Use Sample JD
          </Button>
        </div>

        {jobDescription && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">✓ Job description ready for analysis</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
