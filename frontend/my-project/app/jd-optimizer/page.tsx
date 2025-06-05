"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Download, Copy, TrendingUp, Target, Zap } from "lucide-react"
import { ResumeUpload } from "@/components/resume-upload"
import { JobDescriptionInput } from "@/components/job-description-input"
import { AnalysisResults } from "@/components/analysis-results"
import { ResumeEditor } from "@/components/resume-editor"
import { OptimizationStats } from "@/components/optimization-stats"

// DUMMY AI FUNCTIONS - Replace these with real AI integration
const analyzeResumeAndJD = async (resume: string, jobDescription: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    matchScore: 72,
    missingSkills: ["React.js", "TypeScript", "AWS", "Docker", "Kubernetes", "GraphQL"],
    suggestedImprovements: [
      {
        section: "Skills",
        current: "JavaScript, HTML, CSS",
        suggested: "JavaScript, TypeScript, React.js, HTML5, CSS3, GraphQL",
        reason: "Add TypeScript and React.js as they are mentioned 8 times in the job description",
      },
      {
        section: "Experience",
        current: "Developed web applications",
        suggested: "Developed scalable web applications using React.js and TypeScript, deployed on AWS infrastructure",
        reason: "Include specific technologies and cloud platform mentioned in JD",
      },
      {
        section: "Projects",
        current: "Built e-commerce website",
        suggested:
          "Built responsive e-commerce platform with React.js frontend and Node.js backend, containerized with Docker",
        reason: "Highlight containerization and specific tech stack",
      },
    ],
    keywordDensity: {
      React: { resume: 0, jd: 8, status: "missing" },
      TypeScript: { resume: 0, jd: 5, status: "missing" },
      JavaScript: { resume: 3, jd: 4, status: "good" },
      AWS: { resume: 0, jd: 6, status: "missing" },
      Docker: { resume: 0, jd: 3, status: "missing" },
    },
  }
}

export default function JDOptimizerPage() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input")
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [analysisResults, setAnalysisResults] = useState<any>(null)
  const [optimizedResume, setOptimizedResume] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    if (!resume || !jobDescription) return

    setIsAnalyzing(true)
    setStep("analyzing")

    try {
      // DUMMY AI CALL - Replace with real AI service
      const results = await analyzeResumeAndJD(resume, jobDescription)
      setAnalysisResults(results)
      setOptimizedResume(resume) // Start with original resume
      setStep("results")
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplySuggestion = (suggestion: any) => {
    // DUMMY AI FUNCTION - Replace with real implementation
    const updatedResume = optimizedResume.replace(suggestion.current, suggestion.suggested)
    setOptimizedResume(updatedResume)
  }

  const handleDownload = () => {
    const blob = new Blob([optimizedResume], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "optimized-resume.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedResume)
  }

  if (step === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is comparing your resume with the job description...
                </p>
              </div>
              <Progress value={65} className="w-full" />
              <p className="text-xs text-muted-foreground">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setStep("input")} className="mb-4">
              ← Back to Input
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Optimization Results
                </h1>
                <p className="text-muted-foreground">AI-powered resume analysis and suggestions</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={handleDownload} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <OptimizationStats results={analysisResults} />

          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <AnalysisResults results={analysisResults} onApplySuggestion={handleApplySuggestion} />
            <ResumeEditor resume={optimizedResume} onChange={setOptimizedResume} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            JD Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tailor your resume to any job description using AI. Increase your chances of passing ATS and impressing
            recruiters.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI compares your resume with job requirements to identify gaps and opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">ATS Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Ensure your resume passes Applicant Tracking Systems with keyword optimization.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Editing</h3>
              <p className="text-sm text-muted-foreground">
                Apply AI suggestions instantly and see your resume improve in real-time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ResumeUpload resume={resume} onResumeChange={setResume} />

          <JobDescriptionInput jobDescription={jobDescription} onJobDescriptionChange={setJobDescription} />
        </div>

        {/* Analyze Button */}
        <div className="text-center mt-8">
          <Button
            onClick={handleAnalyze}
            disabled={!resume || !jobDescription || isAnalyzing}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Optimize My Resume"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">AI analysis typically takes 30-60 seconds</p>
        </div>
      </div>
    </div>
  )
}
