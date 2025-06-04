"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Brain, CheckCircle, Clock, Zap, ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "../components/ui/progress"

interface OptimizationStepProps {
  onNext: () => void
  onBack: () => void
  state: any
  actions: any
}

const optimizationSteps = [
  { id: 1, title: "Analyzing Job Requirements", description: "Extracting key skills and requirements", duration: 2000 },
  { id: 2, title: "Scanning Your Resume", description: "Identifying strengths and gaps", duration: 2500 },
  { id: 3, title: "Matching Keywords", description: "Optimizing for ATS systems", duration: 3000 },
  { id: 4, title: "Enhancing Content", description: "Improving descriptions and impact", duration: 2000 },
  { id: 5, title: "Final Optimization", description: "Polishing and formatting", duration: 1500 },
]

export function OptimizationStep({ onNext, onBack, state, actions }: OptimizationStepProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (currentStepIndex < optimizationSteps.length) {
      const currentStep = optimizationSteps[currentStepIndex]
      const timer = setTimeout(() => {
        setCurrentStepIndex((prev) => prev + 1)
        setProgress(((currentStepIndex + 1) / optimizationSteps.length) * 100)
      }, currentStep.duration)

      return () => clearTimeout(timer)
    } else {
      setIsComplete(true)
      // Simulate setting optimized resume
      actions.setOptimizedResume({
        content: "Optimized resume content...",
        improvements: [
          "Added 15 relevant keywords",
          "Enhanced 8 bullet points",
          "Improved ATS compatibility by 85%",
          "Strengthened impact statements",
        ],
        score: 92,
      })
    }
  }, [currentStepIndex, actions])

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl mb-6">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">AI is Optimizing Your Resume</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Our advanced AI is analyzing the job requirements and tailoring your resume for maximum impact. This will take
          just a moment.
        </p>
      </motion.div>

      <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Optimization Progress</span>
                <span className="text-slate-900 font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Optimization Steps */}
            <div className="space-y-4">
              {optimizationSteps.map((step, index) => {
                const isActive = index === currentStepIndex
                const isCompleted = index < currentStepIndex
                const isUpcoming = index > currentStepIndex

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                      isActive ? "bg-emerald-50 border border-emerald-200" : isCompleted ? "bg-slate-50" : "bg-white"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? "bg-emerald-600"
                          : isActive
                            ? "bg-emerald-100 border-2 border-emerald-600"
                            : "bg-slate-200"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : isActive ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                          <Clock className="w-4 h-4 text-emerald-600" />
                        </motion.div>
                      ) : (
                        <span className="text-slate-500 text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-medium ${
                          isActive ? "text-emerald-900" : isCompleted ? "text-slate-700" : "text-slate-500"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isActive ? "text-emerald-700" : isCompleted ? "text-slate-500" : "text-slate-400"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Completion Message */}
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200"
              >
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-emerald-900 mb-2">Optimization Complete!</h3>
                <p className="text-emerald-700">
                  Your resume has been successfully optimized with AI-powered enhancements.
                </p>
              </motion.div>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button onClick={onBack} variant="outline" className="px-6 py-3 rounded-xl font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!isComplete}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Preview
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
