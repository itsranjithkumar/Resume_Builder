"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Eye,
  Download,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Target,
  FileText,
  BarChart3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ResumeOptimizer, type AnalysisResult } from "@/app/utils/resume-optimizer"

interface PreviewStepProps {
  onNext: () => void
  onBack: () => void
  state: {
    resumeContent: string
    jobDescription: string
    optimizedResume?: AnalysisResult
  }
  actions: any
}

// Show a diff of content improvements in the sidebar, above skills analysis
export function PreviewStep({ onNext, onBack, state, actions }: PreviewStepProps) {
  const [activeTab, setActiveTab] = useState("preview")
  const [isOptimizing, setIsOptimizing] = useState(false)

  // Perform optimization if not already done
  const optimizedResume =
    state.optimizedResume ||
    (() => {
      if (state.resumeContent && state.jobDescription) {
        return ResumeOptimizer.analyzeAndOptimize(state.resumeContent, state.jobDescription)
      }
      return null
    })()

  const handleOptimize = async () => {
    if (!state.resumeContent || !state.jobDescription) return

    setIsOptimizing(true)
    try {
      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const result = ResumeOptimizer.analyzeAndOptimize(state.resumeContent, state.jobDescription)
      actions.setOptimizedResume(result)
    } catch (error) {
      console.error("Optimization failed:", error)
    } finally {
      setIsOptimizing(false)
    }
  }

  if (!optimizedResume) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl mb-6">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Optimize</h2>
        <p className="text-slate-600 mb-8">Click below to analyze your resume and generate optimization suggestions.</p>
        <Button
          onClick={handleOptimize}
          disabled={isOptimizing}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium"
        >
          {isOptimizing ? "Analyzing..." : "Optimize Resume"}
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl mb-6">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Optimized Resume</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          AI-powered analysis complete with personalized feedback and actionable improvements.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Preview */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Resume Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white border border-slate-200 rounded-lg p-8 min-h-[600px] shadow-inner">
                <div className="space-y-6">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {optimizedResume.optimizedContent || state.resumeContent || "No resume content available"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Insights */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                Key Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{optimizedResume.keyMetrics.skillsMatched}</div>
                  <div className="text-xs text-slate-600">Skills Matched</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {optimizedResume.keyMetrics.quantifiedAchievements}
                  </div>
                  <div className="text-xs text-slate-600">Quantified Results</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {optimizedResume.keyMetrics.improvementsMade}
                  </div>
                  <div className="text-xs text-slate-600">Improvements</div>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {optimizedResume.keyMetrics.readabilityScore}
                  </div>
                  <div className="text-xs text-slate-600">Readability</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Analysis */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                Skills Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {optimizedResume.foundSkills.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Matched Skills ({optimizedResume.foundSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {optimizedResume.foundSkills.slice(0, 8).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {optimizedResume.foundSkills.length > 8 && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        +{optimizedResume.foundSkills.length - 8} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {optimizedResume.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Missing Skills ({optimizedResume.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {optimizedResume.missingSkills.slice(0, 6).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-red-100 text-red-800 text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {optimizedResume.missingSkills.length > 6 && (
                      <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                        +{optimizedResume.missingSkills.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Improvements */}
          {optimizedResume.suggestions && optimizedResume.suggestions.filter((s) => s.type === "content").length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  Content Improvements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {optimizedResume.suggestions.filter((s) => s.type === "content").slice(0, 4).map((s, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 mb-1">{s.section === "experience" ? "Experience" : "Content"}</div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-600">Before:</span>
                      <span className="text-sm text-red-700 font-mono bg-red-50 rounded px-1 py-0.5 whitespace-pre-wrap">{s.before}</span>
                      <span className="text-xs text-slate-600 mt-1">After:</span>
                      <span className="text-sm text-green-800 font-mono bg-green-50 rounded px-1 py-0.5 whitespace-pre-wrap">{s.after}</span>
                    </div>
                  </div>
                ))}
                {optimizedResume.suggestions.filter((s) => s.type === "content").length > 4 && (
                  <p className="text-xs text-slate-500 text-center pt-2">
                    +{optimizedResume.suggestions.filter((s) => s.type === "content").length - 4} more content recommendations available
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Top Recommendations (Skills, Structure, etc) */}
          {optimizedResume.improvements.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Top Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {optimizedResume.improvements.slice(0, 4).map((improvement: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500" />
                    <p className="text-sm text-slate-700 leading-relaxed">{improvement}</p>
                  </div>
                ))}
                {optimizedResume.improvements.length > 4 && (
                  <p className="text-xs text-slate-500 text-center pt-2">
                    +{optimizedResume.improvements.length - 4} more detailed recommendations available
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={handleOptimize}>
                <TrendingUp className="w-4 h-4 mr-2" />
                Re-analyze Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline" className="px-6 py-3 rounded-xl font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Upload
        </Button>

      </div>
    </div>
  )
}
