"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, FileText, Sparkles, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"



const sampleJSON = `{
  "personalInfo": {
    "fullName": "Ranjith Kumar M.S",
    "email": "emma.johnson@example.com",
    "phone": "+1 (444) 987-6543",
    "location": "New York, NY",
    "linkedin": "linkedin.com/in/emmajohnson",
    "website": "www.emmaj.dev",
    "image": ""
  },
  "summary": "Innovative and detail-oriented Full Stack Developer with 4+ years of experience building scalable web applications and designing intuitive user interfaces. Skilled in modern frameworks like React and Next.js with a strong foundation in backend development using Node.js and Django. Passionate about building impactful digital solutions that enhance user experience and drive business success.",
  "experience": [
    {
      "id": "1748435295378",
      "company": "Meta",
      "position": "Frontend Developer",
      "location": "New York, NY",
      "startDate": "2025-01",
      "endDate": "",
      "current": true,
      "description": "Developed and maintained internal dashboards using React and Tailwind CSS\\n\\nImproved rendering speed by 35% using React memoization and lazy loading\\n\\nCollaborated with backend teams to implement GraphQL APIs"
    }
  ],
  "education": [
    {
      "id": "1748514884930",
      "institution": "Massachusetts Institute of Technology",
      "degree": "Bachelor of Science in Computer Science",
      "field": "Computer Science",
      "startDate": "2025-01",
      "endDate": "2025-12",
      "gpa": "3.9/4.0",
      "location": ""
    }
  ],
  "projects": [
    {
      "id": "1748514933312",
      "name": "DevConnect",
      "description": "A developer-focused social platform with real-time messaging and project collaboration features.",
      "technologies": "Next.js, Tailwind CSS, Firebase",
      "link": "https://github.com/emmajohnson/devconnect"
    }
  ],
  "skills": [
    {
      "id": "1748514999860",
      "category": "Frontend",
      "items": "React, Next.js, Tailwind CSS, Redux"
    },
    {
      "id": "1748515013460",
      "category": "Backend",
      "items": "Node.js, Express, Django"
    }
  ],
  "certifications": [
    {
      "id": "1748515050922",
      "name": "Certified Frontend Developer",
      "issuer": "Meta",
      "date": "2025-05",
      "link": "https://certificates.meta.com/verify/abc123"
    }
  ]
}`

export default function ResumePreviewPage() {
  const [jsonInput, setJsonInput] = useState(sampleJSON)
  const [error, setError] = useState("")
  const [isValidJson, setIsValidJson] = useState(true)
  const router = useRouter()

  const validateAndParseJSON = (jsonString: string) => {
    try {
      // Clean up the JSON string
      let cleanedJson = jsonString.trim()

      // Handle common JSON issues
      cleanedJson = cleanedJson.replace(/\\\\/g, "\\") // Fix double escapes

      const parsed = JSON.parse(cleanedJson)

      // Basic validation for required fields
      if (!parsed.personalInfo || !parsed.personalInfo.fullName) {
        throw new Error("Missing required field: personalInfo.fullName")
      }

      setError("")
      setIsValidJson(true)
      return parsed
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid JSON format"
      setError(errorMessage)
      setIsValidJson(false)
      return null
    }
  }

  const handleJsonChange = (value: string) => {
    setJsonInput(value)

    // Real-time validation (debounced)
    if (value.trim()) {
      setTimeout(() => {
        validateAndParseJSON(value)
      }, 500)
    } else {
      setError("")
      setIsValidJson(true)
    }
  }

  const handlePreview = () => {
    const parsed = validateAndParseJSON(jsonInput)

    if (parsed) {
      // Store the resume data in localStorage for the preview page
      localStorage.setItem("resumePreviewData", JSON.stringify(parsed))

      // Navigate to the full preview page
      router.push("/resume-preview/view")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-2xl">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Resume Builder</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your JSON data into a beautiful, professional resume
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-sm border-0 rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8">
              <CardTitle className="text-2xl font-semibold flex items-center gap-3">
                <Sparkles className="h-6 w-6" />
                Resume JSON Editor
              </CardTitle>
              <p className="text-gray-300 mt-2">Paste your resume data in JSON format below</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Resume JSON Data</label>
                    <div className="flex items-center gap-2">
                      {isValidJson ? (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          Valid JSON
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 text-sm">
                          <XCircle className="h-4 w-4" />
                          Invalid JSON
                        </div>
                      )}
                    </div>
                  </div>
                  <Textarea
                    value={jsonInput}
                    onChange={(e) => handleJsonChange(e.target.value)}
                    placeholder="Paste your resume JSON here..."
                    className={`min-h-[500px] font-mono text-sm border-2 rounded-2xl focus:ring-0 transition-colors resize-none ${
                      error ? "border-red-300 focus:border-red-500" : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {error && (
                    <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-red-800">JSON Error</p>
                          <p className="text-sm text-red-600 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handlePreview}
                    disabled={!isValidJson || !jsonInput.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 text-lg"
                  >
                    <Eye className="h-5 w-5 mr-3" />
                    Preview Resume
                  </Button>
                </div>

                {/* JSON Format Help */}
                <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">JSON Format Guide</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>• Make sure your JSON is properly formatted with correct brackets and quotes</p>
                    <p>
                      • Required fields: <code className="bg-blue-100 px-2 py-1 rounded">personalInfo.fullName</code>
                    </p>
                    <p>
                      • Use <code className="bg-blue-100 px-2 py-1 rounded">\n</code> for line breaks in descriptions
                    </p>
                    <p>
                      • Dates should be in format: <code className="bg-blue-100 px-2 py-1 rounded">YYYY-MM</code>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
