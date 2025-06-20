"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Download, Copy, TrendingUp, Target, Zap } from "lucide-react"
import { ResumeUpload } from "@/components/resume-upload"
import { JobDescriptionInput } from "@/components/job-description-input"
import { AnalysisResults } from "@/components/analysis-results"
import { ResumeEditor } from "@/components/resume-editor"
import { OptimizationStats } from "@/components/optimization-stats"
import InlineNavbar from "@/components/InlineNavbar"

// DUMMY AI FUNCTIONS - Replace these with real AI integration
// --- Rule-based JD/Resume Matcher (no AI) ---
const STOPWORDS = [
  'the', 'and', 'with', 'for', 'from', 'that', 'this', 'will', 'are', 'but', 'can', 'you', 'your', 'our', 'has', 'have', 'all', 'any', 'not', 'may', 'etc', 'their', 'they', 'who', 'what', 'when', 'where', 'which', 'how', 'why', 'was', 'were', 'been', 'being', 'more', 'than', 'such', 'other', 'also', 'use', 'used', 'using', 'on', 'in', 'to', 'of', 'as', 'by', 'is', 'it', 'an', 'or', 'a'
];

// List of main technical skills/concepts to match (can be expanded)
const SKILLS_DICTIONARY = [
  'react', 'react.js', 'typescript', 'javascript', 'html5', 'css3', 'redux', 'state management',
  'rest', 'rest apis', 'api', 'jest', 'testing', 'git', 'ci/cd', 'pipelines', 'frontend',
  'css', 'html', 'node.js', 'version control', 'react testing library', 'third-party', 'integration'
];

function extractKeywords(text: string): string[] {
  // Extract words/phrases from text, filter by SKILLS_DICTIONARY
  const words = Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[.,;:()\-\[\]{}!"'`~@#$%^&*_+=<>?/\\|]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOPWORDS.includes(word))
    )
  );
  // Also match multi-word skills/phrases
  const textLower = text.toLowerCase();
  const foundSkills = new Set<string>();
  // Check for phrase matches first
  SKILLS_DICTIONARY.forEach(skill => {
    if (skill.includes(' ')) {
      if (textLower.includes(skill)) foundSkills.add(skill);
    }
  });
  // Check for single-word matches
  words.forEach(word => {
    if (SKILLS_DICTIONARY.includes(word)) foundSkills.add(word);
  });
  return Array.from(foundSkills);
}


function findMissingKeywords(jd: string, resume: string): string[] {
  const jdKeywords = extractKeywords(jd);
  const resumeText = resume.toLowerCase();
  return jdKeywords.filter(keyword => !resumeText.includes(keyword));
}

function computeKeywordDensity(jd: string, resume: string): Record<string, { resume: number; jd: number; status: string }> {
  const jdKeywords = extractKeywords(jd);
  const resumeWords = resume.toLowerCase().split(/\s+/);
  const jdWords = jd.toLowerCase().split(/\s+/);
  const density: Record<string, { resume: number; jd: number; status: string }> = {};
  jdKeywords.forEach(keyword => {
    const resumeCount = resumeWords.filter(w => w === keyword).length;
    const jdCount = jdWords.filter(w => w === keyword).length;
    density[keyword] = {
      resume: resumeCount,
      jd: jdCount,
      status: resumeCount > 0 ? 'good' : 'missing',
    };
  });
  return density;
}

function computeMatchScore(jd: string, resume: string): number {
  const jdKeywords = extractKeywords(jd);
  if (jdKeywords.length === 0) return 0;
  const found = jdKeywords.filter(k => resume.toLowerCase().includes(k)).length;
  return Math.round((found / jdKeywords.length) * 100);
}

function extractExperiencePhrases(text: string): string[] {
  // Extract common experience/responsibility phrases (simple heuristic)
  const EXPERIENCE_PHRASES = [
    'responsive web applications',
    'collaborate with designers',
    'collaborate with developers',
    'optimize applications',
    'write clean code',
    'maintainable code',
    'well-documented code',
    'work with rest apis',
    'integrate third-party services',
    'testing frameworks',
    'ci/cd pipelines',
    'version control',
    'state management',
    'api integration',
    'code reviews',
    'scalability',
    'performance',
    'collaborate',
    'documentation'
  ];
  const textLower = text.toLowerCase();
  return EXPERIENCE_PHRASES.filter(phrase => textLower.includes(phrase));
}

function findMissingExperience(jd: string, resume: string): string[] {
  const jdExp = extractExperiencePhrases(jd);
  const resumeLower = resume.toLowerCase();
  return jdExp.filter(phrase => !resumeLower.includes(phrase));
}

interface Suggestion {
  section: 'Skills' | 'Experience';
  current: string;
  suggested: string;
  reason: string;
}

function suggestImprovements(jd: string, resume: string): Suggestion[] {
  const missingSkills = findMissingKeywords(jd, resume);
  const missingExperience = findMissingExperience(jd, resume);
  const suggestions: Suggestion[] = [];
  if (missingSkills.length) {
    suggestions.push({
      section: 'Skills',
      current: '-',
      suggested: missingSkills.join(', '),
      reason: 'Add these skills/technologies to better match the job description.'
    });
  }
  if (missingExperience.length) {
    suggestions.push({
      section: 'Experience',
      current: '-',
      suggested: missingExperience.join('; '),
      reason: 'Consider adding experience or achievements related to these responsibilities or content areas.'
    });
  }
  return suggestions;
}


interface AnalysisResults {
  matchScore: number;
  missingSkills: string[];
  suggestedImprovements: Suggestion[];
  keywordDensity: Record<string, { resume: number; jd: number; status: string }>;
}

const analyzeResumeAndJD = async (resume: string, jobDescription: string): Promise<AnalysisResults> => {
  // No delay, instant rule-based scan
  const missingSkills = findMissingKeywords(jobDescription, resume);
  return {
    matchScore: computeMatchScore(jobDescription, resume),
    missingSkills,
    suggestedImprovements: suggestImprovements(jobDescription, resume),
    keywordDensity: computeKeywordDensity(jobDescription, resume),
  };
}

export default function JDOptimizerPage() {
  const [step, setStep] = useState<"input" | "analyzing" | "results">("input")
  const [resume, setResume] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [optimizedResume, setOptimizedResume] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showJson, setShowJson] = useState(false);
  // Structured resume object for JSON output (if available)
  // If ResumeData type is available, import and use it
  // import type { ResumeData } from "@/components/resume-form"
  // const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  // For now, use a minimal type to avoid lint errors
  type ResumeData = Record<string, unknown>;
  const [resumeData] = useState<ResumeData | null>(null); // Removed unused setResumeData

  // Example: If you have a ResumeUpload or ResumeForm component that can provide structured data, set it here
  // e.g. <ResumeForm data={resumeData} onChange={setResumeData} />


  const handleAnalyze = async () => {
    if (!resume || !jobDescription) return

    setIsAnalyzing(true)
    setStep("analyzing")

    try {
      // DUMMY AI CALL - Replace with real AI service
      const results = await analyzeResumeAndJD(resume, jobDescription)
      setAnalysisResults(results)
      setOptimizedResume(resume) // Start with original resume
      setStep("results")
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleApplySuggestion = (suggestion: Suggestion) => {
    let updatedResume = optimizedResume;
    if (suggestion.section === 'Skills') {
      // Try to find a Skills section and append, else add a new section
      const skillsHeader = /skills[:\n]/i;
      if (skillsHeader.test(updatedResume)) {
        updatedResume = updatedResume.replace(skillsHeader, match => match + ' ' + suggestion.suggested + ', ');
      } else {
        updatedResume += `\n\nSkills: ${suggestion.suggested}`;
      }
    } else if (suggestion.section === 'Experience') {
      // Try to find an Experience or Achievements section and append as bullet(s)
      const expHeader = /experience[:\n]/i;
      const achievementsHeader = /achievements[:\n]/i;
      const bullet = suggestion.suggested
  .split(';')
  .map((s: string) => s.trim())
  .filter(Boolean)
  .map((s: string) => `- ${s}`)
  .join('\n');
      if (expHeader.test(updatedResume)) {
        updatedResume = updatedResume.replace(expHeader, match => match + '\n' + bullet + '\n');
      } else if (achievementsHeader.test(updatedResume)) {
        updatedResume = updatedResume.replace(achievementsHeader, match => match + '\n' + bullet + '\n');
      } else {
        updatedResume += `\n\nExperience:\n${bullet}`;
      }
    }
    setOptimizedResume(updatedResume);
  }

  const handleDownload = () => {
    const blob = new Blob([optimizedResume], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "optimized-resume.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedResume)
  }

  if (step === "analyzing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Analyzing Your Resume</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is comparing your resume with the job description...
                </p>
              </div>
              <Progress value={65} className="w-full" />
              <p className="text-xs text-muted-foreground">This may take a few moments</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setStep("input")} className="mb-4">
              ← Back to Input
            </Button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Optimization Results
                </h1>
                <p className="text-muted-foreground">AI-powered resume analysis and suggestions</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopy} variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button onClick={handleDownload} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setShowJson((v) => !v)} variant="outline" size="sm">
                  {showJson ? "Show UI" : "Show JSON"}
                </Button>
              </div>
            </div>
          </div>

          {analysisResults && (
            showJson ? (
              <pre className="p-4 bg-gray-100 rounded text-xs overflow-auto max-h-[600px] border">
                {resumeData
                  ? JSON.stringify(resumeData, null, 2)
                  : 'Structured JSON is not available for plain text resumes.'}
              </pre>
            ) : (
              <>
                <OptimizationStats results={analysisResults} />
                <div className="grid lg:grid-cols-2 gap-6 mt-6">
                  <AnalysisResults results={analysisResults} onApplySuggestion={handleApplySuggestion} />
                  <ResumeEditor resume={optimizedResume} onChange={setOptimizedResume} />
                </div>
              </>
            )
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            JD Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tailor your resume to any job description using AI. Increase your chances of passing ATS and impressing
            recruiters.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI compares your resume with job requirements to identify gaps and opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">ATS Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Ensure your resume passes Applicant Tracking Systems with keyword optimization.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Editing</h3>
              <p className="text-sm text-muted-foreground">
                Apply AI suggestions instantly and see your resume improve in real-time.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Input Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          <ResumeUpload resume={resume} onResumeChange={setResume} />

          <JobDescriptionInput jobDescription={jobDescription} onJobDescriptionChange={setJobDescription} />
        </div>

        {/* Analyze Button */}
        <div className="text-center mt-8">
          <Button
            onClick={handleAnalyze}
            disabled={!resume || !jobDescription || isAnalyzing}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isAnalyzing ? "Analyzing..." : "Optimize My Resume"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">AI analysis typically takes 30-60 seconds</p>
        </div>
      </div>
      <InlineNavbar />
    </div>
  )
}
