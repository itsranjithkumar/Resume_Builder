"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, User, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ResumeInputStepProps {
  onNext: () => void
  onBack: () => void
  state: any
  actions: any
}

export function ResumeInputStep({ onNext, onBack, state, actions }: ResumeInputStepProps) {
  const [inputMethod, setInputMethod] = useState<"upload" | "paste">("upload")
  const [resumeText, setResumeText] = useState("")

  const handleNext = () => {
    if (resumeText.trim()) {
      actions.setResumeContent(resumeText)
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-6">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Now, Upload Your Resume</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Upload your current resume or paste the content. We'll analyze it against the job requirements and optimize it
          for maximum impact.
        </p>
      </motion.div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Paste Content
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-16 text-center hover:border-purple-400 transition-colors group">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                  <Upload className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your Resume</h3>
                <p className="text-slate-600 mb-4">Drop your resume here or click to browse</p>
                <p className="text-sm text-slate-500 mb-6">Supports PDF, DOC, DOCX files up to 10MB</p>
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  Choose File
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="paste" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Resume Content</label>
                <Textarea
                  placeholder="Paste your resume content here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="min-h-[400px] resize-none border-slate-200 focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button onClick={onBack} variant="outline" className="px-6 py-3 rounded-xl font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!resumeText.trim()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-purple-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-purple-600/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Optimization
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
