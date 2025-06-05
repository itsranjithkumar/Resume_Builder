"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit3, RotateCcw, Save } from "lucide-react"
import { useState } from "react"

interface ResumeEditorProps {
  resume: string
  onChange: (resume: string) => void
}

export function ResumeEditor({ resume, onChange }: ResumeEditorProps) {
  const [originalResume] = useState(resume)
  const [hasChanges, setHasChanges] = useState(false)

  const handleChange = (value: string) => {
    onChange(value)
    setHasChanges(value !== originalResume)
  }

  const handleReset = () => {
    onChange(originalResume)
    setHasChanges(false)
  }

  const handleSave = () => {
    // DUMMY SAVE FUNCTION - Replace with real save to user profile/database
    console.log("Saving optimized resume...")
    setHasChanges(false)
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Optimized Resume
            </CardTitle>
            <CardDescription>Edit your resume and apply AI suggestions</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved changes
              </Badge>
            )}
            <Button onClick={handleReset} variant="outline" size="sm" disabled={!hasChanges}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} size="sm" disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={resume}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[500px] resize-none font-mono text-sm"
            placeholder="Your optimized resume will appear here..."
          />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{resume.length} characters</span>
            <span>Last updated: Just now</span>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-800">
              💡 <strong>Pro Tip:</strong> Apply AI suggestions one by one and review each change. You can always reset
              to the original version.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
