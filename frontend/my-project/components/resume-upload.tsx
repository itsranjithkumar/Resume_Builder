"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, File } from "lucide-react"

interface ResumeUploadProps {
  resume: string
  onResumeChange: (resume: string) => void
}

export function ResumeUpload({ resume, onResumeChange }: ResumeUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [resumeJson, setResumeJson] = useState<any>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simple parser for demo: extracts name, email, phone, links, summary, skills, experience
  function parseResumeToJson(text: string) {
    const lines = text.split(/\r?\n/).map(line => line.trim());
    let section = 'header';
    let summaryLines: string[] = [];
    let workBlocks: string[][] = [];
    let currentWork: string[] = [];
    let educationBlocks: string[][] = [];
    let currentEducation: string[] = [];
    let skillLines: string[] = [];
    let certificationLines: string[] = [];
    let fullName = '';
    let email = '';
    let phone = '';
    let linkedin = '';
    let github = '';
    let foundName = false;

    const sectionHeaders = [
      { key: 'summary', regex: /^summary$/i },
      { key: 'work', regex: /^(professional |work )?experience$/i },
      { key: 'education', regex: /^education$/i },
      { key: 'skills', regex: /^skills$/i },
      { key: 'certifications', regex: /^certifications$/i },
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!foundName && line && !line.match(/^[📞✉️🔗💻]/)) {
        fullName = line;
        foundName = true;
        continue;
      }
      const emailMatch = line.match(/[\w.-]+@[\w.-]+/);
      if (emailMatch) email = emailMatch[0];
      const phoneMatch = line.match(/\+?\d[\d\s-]{7,}/);
      if (phoneMatch) phone = phoneMatch[0];
      if (/linkedin/i.test(line) && line.includes('linkedin.com')) {
        const match = line.match(/https?:\/\/\S+/);
        linkedin = match ? match[0] : '';
      }
      if (/github/i.test(line) && line.includes('github.com')) {
        const match = line.match(/https?:\/\/\S+/);
        github = match ? match[0] : '';
      }
      // Section switching
      let matchedSection = sectionHeaders.find(h => h.regex.test(line));
      if (matchedSection) {
        section = matchedSection.key;
        continue;
      }
      // Collect lines by section
      if (section === 'summary') {
        if (line) summaryLines.push(line);
      } else if (section === 'work') {
        if (/^\s*$/.test(line)) {
          if (currentWork.length) { workBlocks.push(currentWork); currentWork = []; }
        } else {
          currentWork.push(line);
        }
      } else if (section === 'education') {
        if (/^\s*$/.test(line)) {
          if (currentEducation.length) { educationBlocks.push(currentEducation); currentEducation = []; }
        } else {
          currentEducation.push(line);
        }
      } else if (section === 'skills') {
        if (line) skillLines.push(line);
      } else if (section === 'certifications') {
        if (line) certificationLines.push(line);
      }
    }
    if (currentWork.length) workBlocks.push(currentWork);
    if (currentEducation.length) educationBlocks.push(currentEducation);
    // Flatten skills
    let skills: string[] = [];
    skillLines.forEach(l => {
      // Handle lines like 'Languages: JavaScript, TypeScript, HTML5, CSS3'
      if (l.includes(':')) {
        skills = skills.concat(l.split(':')[1].split(',').map(s => s.trim()));
      } else {
        skills = skills.concat(l.split(',').map(s => s.trim()));
      }
    });
    skills = skills.filter(Boolean);
    // Join blocks into strings for work/education
    const work = workBlocks.map(block => block.join('\n')).filter(Boolean);
    const education = educationBlocks.map(block => block.join('\n')).filter(Boolean);
    const certifications = certificationLines.filter(Boolean);
    return {
      personalInfo: {
        fullName,
        email,
        phone,
        linkedin,
        github,
        summary: summaryLines.join(' '),
      },
      skills,
      work,
      education,
      certifications,
    };
  }

  // Update JSON when resume changes
  React.useEffect(() => {
    if (resume) {
      setResumeJson(parseResumeToJson(resume))
    } else {
      setResumeJson({})
    }
  }, [resume])


  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = async (file: File) => {
    // DUMMY FILE PROCESSING - Replace with real file parsing
    if (file.type === "text/plain") {
      const text = await file.text()
      onResumeChange(text)
    } else {
      // For PDF/DOCX, we'd use a proper parser here
      // For now, just set dummy content
      onResumeChange(
        `[Uploaded file: ${file.name}]\n\nJohn Doe\nSoftware Developer\n\nExperience:\n- Developed web applications using JavaScript\n- Worked with HTML and CSS\n- Built responsive user interfaces\n\nSkills:\n- JavaScript\n- HTML\n- CSS\n- Git\n\nEducation:\n- Bachelor's in Computer Science`,
      )
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Your Resume
        </CardTitle>
        <CardDescription>Upload your resume or paste the text directly</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Text</TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">Drop your resume here</p>
              <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOCX, and TXT files</p>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                <File className="w-4 h-4 mr-2" />
                Choose File
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>

            {resume && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">✓ Resume loaded successfully ({resume.length} characters)</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <Textarea
              placeholder="Paste your resume text here..."
              value={resume}
              onChange={(e) => onResumeChange(e.target.value)}
              className="min-h-[300px] resize-none"
            />
            <p className="text-xs text-muted-foreground">{resume.length} characters</p>
          </TabsContent>
        </Tabs>
      </CardContent>
    {/* Resume JSON Preview */}
    <div style={{ marginTop: 24 }}>
      <h4 className="text-md font-semibold mb-2">Resume JSON</h4>
      <textarea
        value={resume ? JSON.stringify(resumeJson, null, 2) : ''}
        readOnly
        className="w-full min-h-[200px] font-mono bg-gray-50 border border-gray-200 rounded p-2 text-xs"
        style={{ resize: 'vertical' }}
      />
      <p className="text-xs text-muted-foreground mt-1">Copy and use in JSON Resume Editor</p>
    </div>
    </Card>
  )
}
