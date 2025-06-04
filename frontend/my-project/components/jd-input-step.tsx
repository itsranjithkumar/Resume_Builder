"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Link, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface JDInputStepProps {
  onNext: () => void
  state: any
  actions: any
}

export function JDInputStep({ onNext, state, actions }: JDInputStepProps) {
  const [inputMethod, setInputMethod] = useState<"paste" | "upload" | "url">("paste")
  const [jobDescription, setJobDescription] = useState("")
  const [jobUrl, setJobUrl] = useState("")

  const handleNext = () => {
    if (jobDescription.trim() || jobUrl.trim()) {
      actions.setJobDescription(jobDescription || `Job from URL: ${jobUrl}`)
      onNext()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-6">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Let's Start with the Job Description</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Paste the job description, upload a file, or provide a URL. Our AI will analyze the requirements to optimize
          your resume perfectly.
        </p>
      </motion.div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100">
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Paste Text
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                From URL
              </TabsTrigger>
            </TabsList>

            <TabsContent value="paste" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Job Description</label>
                <Textarea
                  placeholder="Paste the complete job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-[300px] resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-2">Drop your file here or click to browse</p>
                <p className="text-sm text-slate-500">Supports PDF, DOC, DOCX, TXT files</p>
                <Button variant="outline" className="mt-4">
                  Choose File
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Job Posting URL</label>
                <Input
                  placeholder="https://company.com/careers/job-posting"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
                <p className="text-sm text-slate-500 mt-2">
                  We'll automatically extract the job description from the URL
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-8">
            <Button
              onClick={handleNext}
              disabled={!jobDescription.trim() && !jobUrl.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Continue to Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
