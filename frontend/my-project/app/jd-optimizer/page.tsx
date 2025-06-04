'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StepIndicator } from '@/components/step-indicator'
import { JDInputStep } from '@/components/jd-input-step'
import { ResumeInputStep } from '@/components/resume-input-step'
import { OptimizationStep } from '@/components/optimization-step'
import { PreviewStep } from '@/components/preview-step'
import { ExportStep } from '@/components/export-step'
import { useJDOptimizer } from '@/hooks/use-jd-optimizer'

const steps = [
  { id: 1, title: 'Job Description', description: 'Paste or upload the job description' },
  { id: 2, title: 'Your Resume', description: 'Upload your current resume' },
  { id: 3, title: 'AI Optimization', description: 'Let AI analyze and optimize' },
  { id: 4, title: 'Live Preview', description: 'Review optimized resume' },
  { id: 5, title: 'Export', description: 'Download your tailored resume' }
]

export default function JDOptimizerPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { state, actions } = useJDOptimizer()

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <JDInputStep onNext={() => setCurrentStep(2)} state={state} actions={actions} />
      case 2:
        return <ResumeInputStep onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} state={state} actions={actions} />
      case 3:
        return <OptimizationStep onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} state={state} actions={actions} />
      case 4:
        return <PreviewStep onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} state={state} actions={actions} />
      case 5:
        return <ExportStep onBack={() => setCurrentStep(4)} state={state} actions={actions} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JD</span>
              </div>
              <h1 className="text-xl font-semibold text-slate-900">Resume Optimizer</h1>
            </div>
            <div className="text-sm text-slate-500">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StepIndicator steps={steps} currentStep={currentStep} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}
