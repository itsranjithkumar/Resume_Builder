"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, TrendingUp, Plus } from "lucide-react"

interface Suggestion {
  section: 'Skills' | 'Experience';
  current: string;
  suggested: string;
  reason: string;
}

interface KeywordDensityData {
  resume: number;
  jd: number;
  status: string;
}

interface AnalysisResults {
  matchScore: number;
  missingSkills: string[];
  suggestedImprovements: Suggestion[];
  keywordDensity: Record<string, KeywordDensityData>;
}

interface AnalysisResultsProps {
  results: AnalysisResults;
  onApplySuggestion: (suggestion: Suggestion) => void;
}

export function AnalysisResults({ results, onApplySuggestion }: AnalysisResultsProps) {
  if (!results) return null

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          AI Analysis Results
        </CardTitle>
        <CardDescription>Detailed insights and recommendations for your resume</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="missing" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="missing">Missing Skills</TabsTrigger>
            <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
          </TabsList>

          <TabsContent value="missing" className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Skills mentioned in JD but missing from your resume:
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.map((skill: string, index: number) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Consider adding these skills to your resume if you have experience with them.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {results.suggestedImprovements.map((suggestion: Suggestion, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{suggestion.section}</Badge>
                  <Button
                    size="sm"
                    onClick={() => onApplySuggestion(suggestion)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    Apply
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs font-medium text-red-600 mb-1">Current:</p>
                    <p className="text-sm bg-red-50 p-2 rounded border-l-2 border-red-200">{suggestion.current}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-green-600 mb-1">Suggested:</p>
                    <p className="text-sm bg-green-50 p-2 rounded border-l-2 border-green-200">
                      {suggestion.suggested}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-2 rounded">
                    <p className="text-xs text-blue-800">
                      <strong>Why:</strong> {suggestion.reason}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="keywords" className="space-y-4">
            <div className="space-y-3">
              {Object.entries(results.keywordDensity).map(([keyword, data]: [string, KeywordDensityData]) => (
                <div key={keyword} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{keyword}</span>
                    {data.status === "good" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm">
                      Resume: {data.resume} | JD: {data.jd}
                    </div>
                    <Badge variant={data.status === "good" ? "default" : "destructive"} className="text-xs">
                      {data.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
