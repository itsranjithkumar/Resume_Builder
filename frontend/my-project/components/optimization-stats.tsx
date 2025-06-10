"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, AlertTriangle, CheckCircle } from "lucide-react"

interface KeywordDensityData {
  resume: number;
  jd: number;
  status: string;
}

interface AnalysisResults {
  matchScore: number;
  missingSkills: string[];
  suggestedImprovements: unknown[];
  keywordDensity: Record<string, KeywordDensityData>;
}

interface OptimizationStatsProps {
  results: AnalysisResults;
}

export function OptimizationStats({ results }: OptimizationStatsProps) {
  if (!results) return null

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />
    if (score >= 60) return <TrendingUp className="w-5 h-5 text-yellow-600" />
    return <AlertTriangle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Match Score</span>
            {getScoreIcon(results.matchScore)}
          </div>
          <div className="space-y-2">
            <div className={`text-2xl font-bold ${getScoreColor(results.matchScore)}`}>{results.matchScore}%</div>
            <Progress value={results.matchScore} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Missing Skills</span>
            <Target className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-orange-600">{results.missingSkills.length}</div>
          <p className="text-xs text-muted-foreground">Skills to add</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Improvements</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">{results.suggestedImprovements.length}</div>
          <p className="text-xs text-muted-foreground">Suggestions available</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Keywords</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {Object.values(results.keywordDensity).filter((k: KeywordDensityData) => k.status === "good").length}
          </div>
          <p className="text-xs text-muted-foreground">Well matched</p>
        </CardContent>
      </Card>
    </div>
  )
}
