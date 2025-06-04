"use client"

import { useState, useCallback } from "react"

interface OptimizedResume {
  content: string
  improvements: string[]
  score: number
}

interface JDOptimizerState {
  jobDescription: string
  resumeContent: string
  optimizedResume: OptimizedResume | null
  isOptimizing: boolean
}

export function useJDOptimizer() {
  const [state, setState] = useState<JDOptimizerState>({
    jobDescription: "",
    resumeContent: "",
    optimizedResume: null,
    isOptimizing: false,
  })

  const setJobDescription = useCallback((jobDescription: string) => {
    setState((prev) => ({ ...prev, jobDescription }))
  }, [])

  const setResumeContent = useCallback((resumeContent: string) => {
    setState((prev) => ({ ...prev, resumeContent }))
  }, [])

  const setOptimizedResume = useCallback((optimizedResume: OptimizedResume) => {
    setState((prev) => ({ ...prev, optimizedResume }))
  }, [])

  const setIsOptimizing = useCallback((isOptimizing: boolean) => {
    setState((prev) => ({ ...prev, isOptimizing }))
  }, [])

  const resetState = useCallback(() => {
    setState({
      jobDescription: "",
      resumeContent: "",
      optimizedResume: null,
      isOptimizing: false,
    })
  }, [])

  const actions = {
    setJobDescription,
    setResumeContent,
    setOptimizedResume,
    setIsOptimizing,
    resetState,
  }

  return { state, actions }
}
