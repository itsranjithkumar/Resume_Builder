"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Mail, Share2, ArrowLeft, CheckCircle, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface ExportStepProps {
  onBack: () => void
  state: any
  actions: any
}

export function ExportStep({ onBack, state, actions }: ExportStepProps) {
  const [email, setEmail] = useState("")
  const [isEmailSent, setIsEmailSent] = useState(false)

  const handleEmailSend = () => {
    if (email.trim()) {
      setIsEmailSent(true)
      setTimeout(() => setIsEmailSent(false), 3000)
    }
  }

  const exportOptions = [
    {
      title: "PDF Format",
      description: "Perfect for job applications and ATS systems",
      icon: FileText,
      format: "PDF",
      recommended: true,
    },
    {
      title: "Word Document",
      description: "Editable format for further customization",
      icon: FileText,
      format: "DOCX",
      recommended: false,
    },
    {
      title: "Plain Text",
      description: "For online applications and forms",
      icon: FileText,
      format: "TXT",
      recommended: false,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl mb-6">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Resume is Ready!</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Download your AI-optimized resume in your preferred format or share it directly.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Options */}
        <div className="space-y-6">
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Download Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {exportOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-violet-300 hover:bg-violet-50/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                      <option.icon className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-slate-900">{option.title}</h3>
                        {option.recommended && <Badge className="bg-violet-600 text-white text-xs">Recommended</Badge>}
                      </div>
                      <p className="text-sm text-slate-600">{option.description}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-violet-200 text-violet-700 hover:bg-violet-50">
                    <Download className="w-4 h-4 mr-2" />
                    {option.format}
                  </Button>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          {/* Email Option */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Mail className="w-5 h-5 mr-2 text-violet-600" />
                Email to Yourself
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleEmailSend}
                    disabled={!email.trim() || isEmailSent}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    {isEmailSent ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-600">We'll send you all formats via email for easy access</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Share */}
        <div className="space-y-6">
          {/* Optimization Summary */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-gradient-to-br from-violet-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-violet-900">Optimization Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-2xl font-bold text-violet-600">92%</div>
                  <div className="text-sm text-slate-600">Match Score</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-2xl font-bold text-violet-600">15</div>
                  <div className="text-sm text-slate-600">Keywords Added</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-2xl font-bold text-violet-600">8</div>
                  <div className="text-sm text-slate-600">Improvements</div>
                </div>
                <div className="text-center p-3 bg-white/60 rounded-lg">
                  <div className="text-2xl font-bold text-violet-600">85%</div>
                  <div className="text-sm text-slate-600">ATS Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Share Options */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Share2 className="w-5 h-5 mr-2 text-violet-600" />
                Share & Collaborate
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg">
                <Input value="https://resume-optimizer.com/share/abc123" readOnly className="flex-1 bg-white" />
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-slate-600">Share this link to get feedback from mentors or colleagues</p>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Next Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-slate-700">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Tailor your cover letter to match the optimized resume</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Practice interview questions based on the job requirements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Update your LinkedIn profile with optimized keywords</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <Button onClick={onBack} variant="outline" className="px-6 py-3 rounded-xl font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Preview
        </Button>
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-violet-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-violet-600/30">
          Start New Optimization
        </Button>
      </div>
    </div>
  )
}
