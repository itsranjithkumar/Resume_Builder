"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, User, ArrowLeft, Sparkles, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ResumeInputStepProps {
  onNext: () => void
  onBack: () => void
  state: any
  actions: any
}

export function ResumeInputStep({ onNext, onBack, state, actions }: ResumeInputStepProps) {
  const [inputMethod, setInputMethod] = useState<"upload" | "paste">("upload")
  const [resumeText, setResumeText] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNext = () => {
    if (resumeText.trim()) {
      actions.setResumeContent(resumeText)
      onNext()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setFileError(null)
    setFileName(file.name)

    try {
      // Check file type
      if (file.type === "application/pdf") {
        // For PDF files, we'll use pdf-parse
        const text = await extractTextFromPDF(file)
        setResumeText(text)
        setInputMethod("paste") // Switch to paste view to show the extracted text
      } else if (
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        // For Word files
        setFileError("Word parsing is limited. Some formatting may be lost.")
        const text = await extractTextFromWord(file)
        setResumeText(text)
        setInputMethod("paste") // Switch to paste view to show the extracted text
      } else if (file.type === "text/plain") {
        // For text files
        const text = await file.text()
        setResumeText(text)
        setInputMethod("paste") // Switch to paste view to show the extracted text
      } else {
        setFileError("Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.")
        setFileName(null)
      }
    } catch (error) {
      console.error("Error processing file:", error)
      setFileError("Error processing file. Please try again or paste the content manually.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to extract text from PDF
  const extractTextFromPDF = async (file: File): Promise<string> => {
    // In a real implementation, you would use a library like pdf-parse
    // For this demo, we'll simulate PDF parsing with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a simulation - in a real app, you'd use actual PDF parsing
        resolve(`EXTRACTED FROM PDF: ${file.name}

JOHN DOE
Senior Software Engineer
john.doe@example.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years developing web applications and leading teams.

SKILLS
JavaScript, React, Node.js, TypeScript, Git, REST APIs

EXPERIENCE
Senior Software Engineer
Tech Company Inc. | 2020 - Present
• Led development of microservices architecture
• Implemented CI/CD pipelines
• Mentored junior developers

Software Engineer
Previous Company | 2017 - 2020
• Developed frontend applications using React
• Worked on backend services with Node.js
• Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2013 - 2017`)
      }, 1500)
    })
  }

  // Function to extract text from Word documents
  const extractTextFromWord = async (file: File): Promise<string> => {
    // In a real implementation, you would use a library for Word parsing
    // For this demo, we'll simulate Word parsing with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // This is a simulation - in a real app, you'd use actual Word parsing
        resolve(`EXTRACTED FROM WORD: ${file.name}

JOHN DOE
Senior Software Engineer
john.doe@example.com | (555) 123-4567 | linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years developing web applications and leading teams.

SKILLS
JavaScript, React, Node.js, TypeScript, Git, REST APIs

EXPERIENCE
Senior Software Engineer
Tech Company Inc. | 2020 - Present
• Led development of microservices architecture
• Implemented CI/CD pipelines
• Mentored junior developers

Software Engineer
Previous Company | 2017 - 2020
• Developed frontend applications using React
• Worked on backend services with Node.js
• Collaborated with cross-functional teams

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2013 - 2017`)
      }, 1500)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = files
        handleFileChange({ target: { files } } as any)
      }
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
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
              <div
                className={`border-2 border-dashed ${
                  fileError ? "border-red-300" : "border-slate-300 hover:border-purple-400"
                } rounded-xl p-16 text-center transition-colors group`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                />

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-purple-700 font-medium">Processing your resume...</p>
                  </div>
                ) : fileName ? (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">File Uploaded</h3>
                    <p className="text-purple-600 mb-4">{fileName}</p>
                    {fileError && (
                      <Alert variant="destructive" className="mt-4 bg-red-50 text-red-800 border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{fileError}</AlertDescription>
                      </Alert>
                    )}
                    <Button
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 mt-4"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFileName(null)
                        setFileError(null)
                        if (fileInputRef.current) fileInputRef.current.value = ""
                      }}
                    >
                      Choose Another File
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform">
                      <Upload className="w-10 h-10 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Upload Your Resume</h3>
                    <p className="text-slate-600 mb-4">Drop your resume here or click to browse</p>
                    <p className="text-sm text-slate-500 mb-6">Supports PDF, DOC, DOCX, TXT files up to 10MB</p>
                    <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                      Choose File
                    </Button>
                  </>
                )}
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
              disabled={!resumeText.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-purple-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
