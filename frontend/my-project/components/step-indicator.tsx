"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          const isUpcoming = step.id > currentStep

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              <motion.div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  {
                    "bg-gradient-to-r from-blue-600 to-purple-600 border-transparent text-white": isCompleted,
                    "bg-white border-blue-600 text-blue-600 shadow-lg shadow-blue-600/20": isCurrent,
                    "bg-white border-slate-300 text-slate-400": isUpcoming,
                  },
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : <span className="text-sm font-semibold">{step.id}</span>}
              </motion.div>

              <div className="mt-3 text-center max-w-24">
                <p
                  className={cn("text-sm font-medium transition-colors", {
                    "text-slate-900": isCompleted || isCurrent,
                    "text-slate-500": isUpcoming,
                  })}
                >
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 hidden sm:block">{step.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
