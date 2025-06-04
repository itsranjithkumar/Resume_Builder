"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, Download, ArrowLeft, ArrowRight, TrendingUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "../components/ui/progress"

interface PreviewStepProps {
  onNext: () => void
  onBack: () => void
  state: any
  actions: any
}

export function PreviewStep({ onNext, onBack, state, actions }: PreviewStepProps) {
  const [activeTab, setActiveTab] = useState("preview")

  const improvements = [
    { type: "added", text: "Added 15 relevant keywords for better ATS compatibility", impact: "high" },
    { type: "enhanced", text: "Enhanced 8 bullet points with quantified achievements", impact: "high" },
    { type: "improved", text: "Improved technical skills section alignment", impact: "medium" },
    { type: "optimized", text: "Optimized formatting for better readability", impact: "medium" },
    { type: "strengthened", text: "Strengthened professional summary", impact: "high" },
  ]

  const matchScore = 92

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl mb-6">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Optimized Resume</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Review your AI-optimized resume with live feedback and actionable insights.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Preview */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Resume Preview</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Match Score: {matchScore}%
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white border border-slate-200 rounded-lg p-8 min-h-[600px] shadow-inner">
                {/* Resume Content Preview */}
                <div className="space-y-6">
                  <div className="text-center border-b border-slate-200 pb-6">
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">John Doe</h1>
                    <p className="text-slate-600">Senior Software Engineer</p>
                    <p className="text-sm text-slate-500 mt-2">
                      john.doe@email.com • (555) 123-4567 • LinkedIn: /in/johndoe
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">
                      Professional Summary
                    </h2>
                    <p className="text-slate-700 leading-relaxed">
                      Results-driven Senior Software Engineer with 8+ years of experience developing scalable web
                      applications and leading cross-functional teams. Proven track record of delivering high-quality
                      solutions that increased system performance by 40% and reduced deployment time by 60%.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">
                      Technical Skills
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-slate-800 mb-1">Languages:</p>
                        <p className="text-slate-600 text-sm">JavaScript, TypeScript, Python, Java</p>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 mb-1">Frameworks:</p>
                        <p className="text-slate-600 text-sm">React, Next.js, Node.js, Express</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-3 border-b border-slate-200 pb-1">
                      Professional Experience
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-slate-900">Senior Software Engineer</h3>
                            <p className="text-slate-600">Tech Company Inc.</p>
                          </div>
                          <p className="text-slate-500 text-sm">2020 - Present</p>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm ml-4">
                          <li>Led development of microservices architecture, improving system scalability by 300%</li>
                          <li>Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes</li>
                          <li>Mentored 5 junior developers and conducted code reviews for team of 12</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with Insights */}
        <div className="space-y-6">
          {/* Match Score */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Job Match Score</h3>
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{matchScore}%</span>
                  <Badge className="bg-green-600 text-white">Excellent</Badge>
                </div>
                <Progress value={matchScore} className="h-2" />
                <p className="text-sm text-slate-600">Your resume is highly optimized for this position</p>
              </div>
            </CardContent>
          </Card>

          {/* Improvements */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                AI Improvements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {improvements.map((improvement, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      improvement.impact === "high" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  />
                  <p className="text-sm text-slate-700">{improvement.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download as PDF
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download as Word
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View Full Screen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline" className="px-6 py-3 rounded-xl font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Optimization
        </Button>
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-600/30"
        >
          Export Resume
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
