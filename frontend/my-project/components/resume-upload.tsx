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
    // Helper to standardize date (tries to get YYYY-MM or YYYY)
    function normalizeDate(dateStr: string) {
      if (!dateStr) return '';
      const ymd = dateStr.match(/\d{4}[-/]\d{2}/);
      if (ymd) return ymd[0];
      const year = dateStr.match(/\d{4}/);
      return year ? year[0] : dateStr;
    }
    // Helper to extract role(s) from summary or first lines
    function extractRoles(summary: string, lines: string[]) {
      // Try to find roles in summary or first 2 lines
      const roleRegex = /(developer|engineer|manager|designer|analyst|consultant|lead|architect|intern)/i;
      let found: string[] = [];
      if (roleRegex.test(summary)) found.push(summary.match(roleRegex)?.[0] || '');
      for (let i = 0; i < Math.min(2, lines.length); i++) {
        if (roleRegex.test(lines[i])) found.push(lines[i].match(roleRegex)?.[0] || '');
      }
      return Array.from(new Set(found.filter(Boolean)));
    }
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

    // Support emoji and text-based section headers
    const sectionHeaders = [
      { key: 'summary', regex: /^(summary|👨‍💼|professional summary)/i },
      { key: 'work', regex: /^(professional |work )?experience|💼/i },
      { key: 'education', regex: /^education|🎓/i },
      { key: 'skills', regex: /^skills|🧠|technical skills/i },
      { key: 'certifications', regex: /^certifications|📜/i },
    ];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Extract name (first non-empty line, not an icon header)
      if (!foundName && line && !/^([\u{1F300}-\u{1FAFF}]|[\u2600-\u26FF]|[\u2700-\u27BF]|[\uFE0F]|[\u200D]|[\u25A0-\u25FF])/u.test(line)) {
        fullName = line;
        foundName = true;
        continue;
      }
      // Extract email
      const emailMatch = line.match(/[\w.-]+@[\w.-]+/);
      if (emailMatch) email = emailMatch[0];
      // Extract phone (look for numbers that are not years)
      const phoneMatch = line.match(/\+?\d[\d\s-]{7,}/);
      if (phoneMatch && !/\d{4}\s*-\s*\d{4}/.test(phoneMatch[0])) phone = phoneMatch[0];
      // Extract LinkedIn
      if (/linkedin/i.test(line)) {
        const match = line.match(/(linkedin\.com\/[^\s|]+)/i);
        linkedin = match ? (match[0].startsWith('http') ? match[0] : 'https://' + match[0]) : linkedin;
      }
      // Extract GitHub
      if (/github/i.test(line)) {
        const match = line.match(/(github\.com\/[^\s|]+)/i);
        github = match ? (match[0].startsWith('http') ? match[0] : 'https://' + match[0]) : github;
      }
      // Extract website
      if (/www\.[^\s|]+/i.test(line)) {
        // Not LinkedIn or GitHub
        if (!/linkedin|github/i.test(line)) {
          const match = line.match(/www\.[^\s|]+/i);
          // Add https prefix
          safePersonalInfo.website = match ? 'https://' + match[0] : safePersonalInfo.website;
        }
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
    // Group skills by category if possible
    let skillGroups: { category: string, items: string[] }[] = [];
    // Also support bullet-style skills (lines starting with '-')
    skillLines.forEach(l => {
      if (l.includes(':')) {
        const [cat, items] = l.split(':');
        skillGroups.push({
          category: cat.trim(),
          items: items.split(',').map(s => s.trim()).filter(Boolean)
        });
      } else if (/^-/.test(l)) {
        // Bullet line, try to extract category and items
        const bullet = l.replace(/^-\s*/, '');
        // e.g. 'Languages: JavaScript, TypeScript'
        if (bullet.includes(':')) {
          const [cat, items] = bullet.split(':');
          skillGroups.push({
            category: cat.trim(),
            items: items.split(',').map(s => s.trim()).filter(Boolean)
          });
        } else {
          skillGroups.push({
            category: 'General',
            items: bullet.split(',').map(s => s.trim()).filter(Boolean)
          });
        }
      } else {
        // No category, treat as generic
        skillGroups.push({
          category: 'General',
          items: l.split(',').map(s => s.trim()).filter(Boolean)
        });
      }
    });
    // Flatten all skills for summary array
    let skills: string[] = skillGroups.flatMap(g => g.items).filter(Boolean);
    // Remove duplicates
    skills = Array.from(new Set(skills));
    // Parse work blocks into experience objects with highlights and standardized dates
    const experience = workBlocks.map((block, idx) => {
      let position = '';
      let company = '';
      let location = '';
      let startDate = '';
      let endDate = '';
      let current = false;
      let description = '';
      let highlights: string[] = [];
      // Try to detect position and company from first two lines
      if (block.length > 0) position = block[0];
      // Second line: "ABC Technologies, Bangalore — Jan 2022 - Present"
      if (block.length > 1) {
        // Try to match: Company, Location — Dates
        const line = block[1];
        // Try split on em dash, en dash, or hyphen
        const dashSplit = line.split(/[—–-]/);
        let compLoc = '', dur = '';
        if (dashSplit.length >= 2) {
          compLoc = dashSplit[0].trim();
          dur = dashSplit.slice(1).join('-').trim();
        } else {
          compLoc = line;
        }
        // Company, Location
        const compLocSplit = compLoc.split(',');
        company = compLocSplit[0]?.trim() || '';
        location = compLocSplit.slice(1).join(',').trim();
        // Dates
        if (dur) {
          // Try to parse start/end
          const dateParts = dur.split(/to|–|-/i).map(s => s.trim());
          startDate = normalizeDate(dateParts[0] || '');
          endDate = normalizeDate(dateParts[1] || '');
          if (/present/i.test(endDate)) {
            current = true;
            endDate = '';
          }
        }
      }
      if (block.length > 2) {
        // Split description into highlights if lines start with - or •
        const descLines = block.slice(2);
        highlights = descLines.filter(l => /^[-•]/.test(l)).map(l => l.replace(/^[-•]\s*/, ''));
        description = descLines.filter(l => !/^[-•]/.test(l)).join(' ');
      }
      // Always provide a unique, non-empty id
      let id = (position + company + startDate).replace(/\s+/g, '');
      if (!id) id = `exp-${idx}`;
      return {
        id,
        company,
        position,
        location,
        startDate,
        endDate,
        current,
        description,
        highlights
      };
    }).filter(e => e.position);

    // Parse education blocks into objects with standardized dates
    const education = educationBlocks.map((block, idx) => {
      let degree = '';
      let institution = '';
      let field = '';
      let startDate = '';
      let endDate = '';
      let gpa = '';
      let location = '';
      if (block.length > 0) {
        // e.g. 'Bachelor of Technology in Computer Science'
        degree = block[0];
        const fieldMatch = degree.match(/in (.+)/i);
        if (fieldMatch) field = fieldMatch[1];
      }
      if (block.length > 1) {
        // Try to parse: 'ABC University, Chennai — 2017 - 2021'
        const line = block[1];
        const dashSplit = line.split(/[—–-]/);
        let instLoc = '', dur = '';
        if (dashSplit.length >= 2) {
          instLoc = dashSplit[0].trim();
          dur = dashSplit.slice(1).join('-').trim();
        } else {
          instLoc = line;
        }
        // Institution, Location
        const instLocSplit = instLoc.split(',');
        institution = instLocSplit[0]?.trim() || '';
        location = instLocSplit.slice(1).join(',').trim();
        // Dates
        if (dur) {
          const dateParts = dur.split(/to|–|-/i).map(s => s.trim());
          startDate = normalizeDate(dateParts[0] || '');
          endDate = normalizeDate(dateParts[1] || '');
        }
      }
      // Always provide a unique, non-empty id
      let id = (degree + institution + startDate).replace(/\s+/g, '');
      if (!id) id = `edu-${idx}`;
      return {
        id,
        institution,
        degree,
        field,
        startDate,
        endDate,
        gpa,
        location,
      };
    }).filter(e => e.degree);

    const certifications = certificationLines.filter(Boolean);
    // Defensive: ensure all required fields are present in personalInfo
    const safePersonalInfo = {
      fullName: fullName || '',
      email: email || '',
      phone: phone || '',
      location: '',
      linkedin: linkedin || '',
      website: '',
      image: '',
      github: github || '',
    };

    // Experience
    const safeExperience = experience.map((exp, idx) => ({
      id: exp.id || `${Date.now()}${idx}`,
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: !!exp.current,
      description: exp.description || '',
    }));

    // Education
    const safeEducation = education.map((edu, idx) => ({
      id: edu.id || `${Date.now()}${idx}`,
      institution: edu.institution || '',
      degree: edu.degree || '',
      field: edu.field || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      gpa: edu.gpa || '',
      location: edu.location || '',
    }));

    // Parse Projects section if present, extract technologies if possible
    let projectsSection: string[] = [];
    let inProjects = false;
    lines.forEach((line) => {
      if (/^projects?/i.test(line)) {
        inProjects = true;
        return;
      }
      if (inProjects) {
        if (line === '' || /^[A-Z ]+:$/.test(line)) {
          inProjects = false;
          return;
        }
        projectsSection.push(line);
      }
    });
    const projects = projectsSection.map((line, idx) => {
      // Try to parse: 'Portfolio Website | Next.js, React, TailwindCSS | https://myportfolio.com'
      const [name, techs, link] = line.split('|').map(s => s.trim());
      return {
        id: `${Date.now()}${idx}`,
        name: name || '',
        description: '',
        technologies: techs ? techs.split(',').map(t => t.trim()) : [],
        link: link || '',
      };
    }).filter(p => p.name);

    // Skills section as grouped above
    const skillsSection = skillGroups.map((group, idx) => ({
      id: `${Date.now()}${idx}`,
      category: group.category,
      items: group.items
    }));

    // Parse Certifications section if present, try to extract issuer/date if present
    const certificationsSection = certificationLines.map((line, idx) => {
      // Try to parse: 'React Developer Certificate – HackerRank', 'JavaScript Essentials – Coursera'
      let name = line, issuer = '', date = '', link = '';
      // Try to split by dash or pipe
      if (line.includes('–')) {
        const parts = line.split('–').map(s => s.trim());
        if (parts.length === 2) {
          name = parts[0];
          issuer = parts[1];
        }
      } else if (line.includes('|')) {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 2) {
          name = parts[0];
          issuer = parts[1];
          if (parts[2]) date = parts[2];
        }
      }
      return {
        id: `${Date.now()}${idx}`,
        name,
        issuer,
        date,
        link
      };
    });

    // Compose summary
    const summary = summaryLines.join(' ');
    // Extract role(s)
    const roles = extractRoles(summary, lines);

    // Improved JSON structure
    return {
      basics: {
        name: safePersonalInfo.fullName,
        email: safePersonalInfo.email,
        phone: safePersonalInfo.phone,
        location: safePersonalInfo.location,
        summary,
        role: roles,
        linkedin: safePersonalInfo.linkedin,
        github: safePersonalInfo.github
      },
      skills: skillsSection,
      experience: experience.map(e => ({
        company: e.company,
        position: e.position,
        location: e.location,
        startDate: e.startDate,
        endDate: e.endDate,
        current: e.current,
        highlights: e.highlights,
        description: e.description
      })),
      education: education.map(e => ({
        institution: e.institution,
        degree: e.degree,
        field: e.field,
        startDate: e.startDate,
        endDate: e.endDate,
        gpa: e.gpa,
        location: e.location
      })),
      projects: projects,
      certifications: certificationsSection
    };

  } // Fix missing closing brace

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
