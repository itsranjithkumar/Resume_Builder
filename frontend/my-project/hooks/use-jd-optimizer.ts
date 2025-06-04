"use client"

import { useState, useCallback } from "react"

interface OptimizedResume {
  content: string
  improvements: string[]
  score: number
}

import { ResumeOptimizer, type AnalysisResult } from "@/app/utils/resume-optimizer"

interface JDOptimizerState {
  jobDescription: string
  resumeContent: string
  optimizedResume?: AnalysisResult
  isOptimizing: boolean
  // Optionally, you can add missingSkills here if you want to surface it separately
}

export function useJDOptimizer() {
  const [state, setState] = useState<JDOptimizerState>({
    jobDescription: "",
    resumeContent: "",
    optimizedResume: undefined,
    isOptimizing: false,
  })

  const setJobDescription = useCallback((jobDescription: string) => {
    setState((prev) => ({ ...prev, jobDescription }))
  }, [])

  const setResumeContent = useCallback((resumeContent: string) => {
    setState((prev) => ({ ...prev, resumeContent }))
  }, [])

  const setOptimizedResume = useCallback((optimizedResume?: AnalysisResult) => {
    setState((prev) => ({ ...prev, optimizedResume }))
  }, [])

  const setIsOptimizing = useCallback((isOptimizing: boolean) => {
    setState((prev) => ({ ...prev, isOptimizing }))
  }, [])

  const resetState = useCallback(() => {
    setState({
      jobDescription: "",
      resumeContent: "",
      optimizedResume: undefined,
      isOptimizing: false,
    })
  }, [])

  // Import ResumeOptimizer for AI logic
  // (Import at the top: import { ResumeOptimizer } from "@/app/utils/resume-optimizer")
  // But since this is a code chunk, add here:
  // @ts-ignore
  // eslint-disable-next-line
  // const { ResumeOptimizer } = require("@/app/utils/resume-optimizer")

  // Analyze and optimize resume content against job description
  const optimizeResume = useCallback(() => {
    setIsOptimizing(true)
    try {
      if (state.resumeContent && state.jobDescription) {
        const result = ResumeOptimizer.analyzeAndOptimize(state.resumeContent, state.jobDescription)
        setOptimizedResume(result)
      }
    } catch (error) {
      setOptimizedResume(undefined)
    } finally {
      setIsOptimizing(false)
    }
  }, [state.resumeContent, state.jobDescription, setOptimizedResume, setIsOptimizing])

  return {
    state,
    actions: {
      setJobDescription,
      setResumeContent,
      setOptimizedResume,
      setIsOptimizing,
      resetState,
      optimizeResume,
    },
  }
}
