export interface JobRequirement {
    skill: string
    importance: "high" | "medium" | "low"
    category: "technical" | "soft" | "experience"
    keywords: string[]
  }
  
  export interface OptimizationSuggestion {
    type: "keyword" | "format" | "content" | "structure"
    priority: "high" | "medium" | "low"
    description: string
    before?: string
    after?: string
    section?: string
  }
  
  export interface AnalysisResult {
    requirements: JobRequirement[]
    suggestions: OptimizationSuggestion[]
    matchScore: number
    optimizedContent: string
    improvements: string[]
    missingSkills: string[]
    foundSkills: string[]
    keyMetrics: {
      skillsMatched: number
      totalSkills: number
      quantifiedAchievements: number
      totalBulletPoints: number
      improvementsMade: number
      readabilityScore: number
    }
  }
  
  export class ResumeOptimizer {
    // Extract skills and requirements from job description
    static analyzeJobDescription(jobDescription: string): JobRequirement[] {
      const requirements: JobRequirement[] = []
      const text = jobDescription.toLowerCase()
  
      // Technical skills patterns
      const technicalSkills = [
        { skill: "React", keywords: ["react", "reactjs", "react.js"] },
        { skill: "JavaScript", keywords: ["javascript", "js", "ecmascript"] },
        { skill: "TypeScript", keywords: ["typescript", "ts"] },
        { skill: "Node.js", keywords: ["node", "nodejs", "node.js"] },
        { skill: "Python", keywords: ["python", "py"] },
        { skill: "Java", keywords: ["java", "java programming"] },
        { skill: "SQL", keywords: ["sql", "mysql", "postgresql", "database"] },
        { skill: "AWS", keywords: ["aws", "amazon web services", "cloud"] },
        { skill: "Docker", keywords: ["docker", "containerization", "container"] },
        { skill: "Kubernetes", keywords: ["kubernetes", "k8s", "container orchestration"] },
        { skill: "Git", keywords: ["git", "version control", "github", "gitlab"] },
        { skill: "REST API", keywords: ["rest", "api", "restful", "web services"] },
        { skill: "GraphQL", keywords: ["graphql", "graph ql", "gql"] },
        { skill: "MongoDB", keywords: ["mongodb", "mongo", "nosql", "document database"] },
        { skill: "Vue.js", keywords: ["vue", "vuejs", "vue.js"] },
        { skill: "Angular", keywords: ["angular", "angularjs", "ng"] },
        { skill: "Express", keywords: ["express", "expressjs", "express.js"] },
        { skill: "Next.js", keywords: ["next", "nextjs", "next.js"] },
        { skill: "CI/CD", keywords: ["ci/cd", "continuous integration", "continuous deployment", "pipeline"] },
        { skill: "DevOps", keywords: ["devops", "dev ops", "development operations"] },
        { skill: "Machine Learning", keywords: ["machine learning", "ml", "ai", "artificial intelligence"] },
        { skill: "Data Science", keywords: ["data science", "data analysis", "analytics"] },
        { skill: "UI/UX", keywords: ["ui", "ux", "user interface", "user experience", "design"] },
        { skill: "Mobile Development", keywords: ["mobile", "android", "ios", "react native", "flutter"] },
        { skill: "Testing", keywords: ["testing", "test", "qa", "quality assurance", "unit test"] },
      ]
  
      // Soft skills patterns
      const softSkills = [
        { skill: "Leadership", keywords: ["lead", "leadership", "manage", "mentor", "guide"] },
        { skill: "Communication", keywords: ["communication", "collaborate", "present", "articulate"] },
        { skill: "Problem Solving", keywords: ["problem solving", "analytical", "troubleshoot", "debug"] },
        { skill: "Teamwork", keywords: ["team", "collaboration", "cross-functional", "cooperative"] },
        { skill: "Project Management", keywords: ["project management", "agile", "scrum", "kanban"] },
        { skill: "Time Management", keywords: ["time management", "deadline", "prioritize", "schedule"] },
        { skill: "Adaptability", keywords: ["adapt", "adaptability", "flexible", "versatile"] },
        { skill: "Creativity", keywords: ["creative", "creativity", "innovative", "innovation"] },
        { skill: "Critical Thinking", keywords: ["critical thinking", "analysis", "evaluate", "assess"] },
        { skill: "Attention to Detail", keywords: ["detail", "meticulous", "thorough", "precise"] },
      ]
  
      // Experience patterns
      const experienceSkills = [
        { skill: "Agile", keywords: ["agile", "scrum", "sprint", "kanban", "jira"] },
        { skill: "Team Leadership", keywords: ["team lead", "leadership", "manager", "director"] },
        { skill: "Product Development", keywords: ["product development", "product management", "roadmap"] },
        { skill: "Startup Experience", keywords: ["startup", "founder", "entrepreneurial"] },
        { skill: "Enterprise Experience", keywords: ["enterprise", "corporate", "large scale"] },
        { skill: "Client Management", keywords: ["client", "customer", "stakeholder", "relationship"] },
        { skill: "Remote Work", keywords: ["remote", "distributed team", "virtual", "work from home"] },
        { skill: "International", keywords: ["international", "global", "multicultural", "diverse"] },
        { skill: "Mentorship", keywords: ["mentor", "coaching", "training", "teaching"] },
        { skill: "Research", keywords: ["research", "r&d", "investigation", "study"] },
      ]
  
      // Check for technical skills
      technicalSkills.forEach(({ skill, keywords }) => {
        const found = keywords.some((keyword) => text.includes(keyword))
        if (found) {
          const importance = this.determineImportance(text, keywords)
          requirements.push({ skill, importance, category: "technical", keywords })
        }
      })
  
      // Check for soft skills
      softSkills.forEach(({ skill, keywords }) => {
        const found = keywords.some((keyword) => text.includes(keyword))
        if (found) {
          const importance = this.determineImportance(text, keywords)
          requirements.push({ skill, importance, category: "soft", keywords })
        }
      })
  
      // Check for experience skills
      experienceSkills.forEach(({ skill, keywords }) => {
        const found = keywords.some((keyword) => text.includes(keyword))
        if (found) {
          const importance = this.determineImportance(text, keywords)
          requirements.push({ skill, importance, category: "experience", keywords })
        }
      })
  
      // If no requirements were found (empty job description), add some defaults
      if (requirements.length === 0) {
        requirements.push(
          { skill: "Communication", importance: "high", category: "soft", keywords: ["communication"] },
          { skill: "Problem Solving", importance: "medium", category: "soft", keywords: ["problem solving"] },
          { skill: "Teamwork", importance: "medium", category: "soft", keywords: ["teamwork"] },
        )
      }
  
      return requirements
    }
  
    // Determine importance based on frequency and context
    static determineImportance(text: string, keywords: string[]): "high" | "medium" | "low" {
      let count = 0
      keywords.forEach((keyword) => {
        const matches = text.match(new RegExp(keyword, "gi"))
        count += matches ? matches.length : 0
      })
  
      // Check if keywords appear in important sections
      const inRequirements = /requirements|qualifications|must have|essential/i.test(text)
      const inTitle = /title|position|role/i.test(text)
  
      if (count >= 3 || (count >= 1 && (inRequirements || inTitle))) return "high"
      if (count >= 2) return "medium"
      return "low"
    }
  
    // Analyze resume and generate specific suggestions
    static generateOptimizationSuggestions(resume: string, requirements: JobRequirement[]): OptimizationSuggestion[] {
      const suggestions: OptimizationSuggestion[] = []
      const resumeLower = resume.toLowerCase()
  
      // Find missing skills
      const missingSkills = requirements.filter(
        (req) => !req.keywords.some((keyword) => resumeLower.includes(keyword.toLowerCase())),
      )
  
      // Add missing high-priority skills
      missingSkills.forEach((skill) => {
        if (skill.importance === "high") {
          suggestions.push({
            type: "keyword",
            priority: "high",
            description: `Add "${skill.skill}" to your skills section - this is a key requirement`,
            section: "skills",
          })
        } else if (skill.importance === "medium") {
          suggestions.push({
            type: "keyword",
            priority: "medium",
            description: `Consider adding "${skill.skill}" to your skills if you have experience with it`,
            section: "skills",
          })
        }
      })
  
      // Check for unquantified achievements
      const bulletPoints = resume.match(/[•\-*]\s*(.+)/g) || []
      bulletPoints.forEach((bullet) => {
        const content = bullet.replace(/[•\-*]\s*/, "")
        if (!/\d+%?|\$[\d,]+|[\d,]+\s*(users?|customers?|projects?|years?|months?)/.test(content)) {
          const quantifiedExample = this.generateQuantifiedExample(content)
          suggestions.push({
            type: "content",
            priority: "medium",
            description: `Quantify this achievement: "${content.substring(0, 50)}${content.length > 50 ? "..." : ""}"`,
            before: content,
            after: quantifiedExample,
            section: "experience",
          })
        }
      })
  
      // Check for weak action verbs
      const weakVerbs = ["worked on", "helped with", "was responsible for", "did", "made", "assisted", "participated in"]
  
      weakVerbs.forEach((weakVerb) => {
        if (resumeLower.includes(weakVerb)) {
          const strongVerbs = this.getStrongActionVerbs(weakVerb)
          suggestions.push({
            type: "content",
            priority: "medium",
            description: `Replace weak verb "${weakVerb}" with stronger action verbs like "${strongVerbs.join('", "')}"`,
            section: "experience",
          })
        }
      })
  
      // Check for missing professional summary
      if (!resumeLower.includes("summary") && !resumeLower.includes("objective") && !resumeLower.includes("profile")) {
        suggestions.push({
          type: "structure",
          priority: "high",
          description: "Add a professional summary at the top highlighting your key qualifications",
          section: "summary",
        })
      }
  
      // Check for ATS optimization
      if (!this.hasProperSectionHeadings(resume)) {
        suggestions.push({
          type: "format",
          priority: "high",
          description: "Use clear section headings (EXPERIENCE, EDUCATION, SKILLS) for better ATS parsing",
          section: "format",
        })
      }
  
      // Check for skills section
      if (!this.hasSkillsSection(resume)) {
        suggestions.push({
          type: "structure",
          priority: "high",
          description: "Add a dedicated Skills section to highlight your technical and soft skills",
          section: "skills",
        })
      }
  
      return suggestions
    }
  
    // Check if resume has proper section headings
    static hasProperSectionHeadings(resume: string): boolean {
      const headingPattern = /^(EXPERIENCE|EDUCATION|SKILLS|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)/im
      return headingPattern.test(resume)
    }
  
    // Check if resume has a skills section
    static hasSkillsSection(resume: string): boolean {
      const skillsPattern = /^(SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|EXPERTISE|QUALIFICATIONS)/im
      return skillsPattern.test(resume)
    }
  
    // Get strong action verbs based on weak verb
    static getStrongActionVerbs(weakVerb: string): string[] {
      const verbMap: Record<string, string[]> = {
        "worked on": ["developed", "implemented", "created", "built", "engineered"],
        "helped with": ["supported", "facilitated", "contributed to", "collaborated on", "assisted with"],
        "was responsible for": ["managed", "led", "directed", "oversaw", "coordinated"],
        did: ["executed", "performed", "accomplished", "delivered", "conducted"],
        made: ["created", "developed", "produced", "built", "established"],
        assisted: ["supported", "aided", "contributed to", "collaborated on", "facilitated"],
        "participated in": ["contributed to", "engaged in", "collaborated on", "partnered in", "took part in"],
      }
  
      return verbMap[weakVerb] || ["implemented", "developed", "created", "managed", "led"]
    }
  
    // Generate quantified examples
    static generateQuantifiedExample(content: string): string {
      // Analyze content to generate contextually appropriate quantification
      const contentLower = content.toLowerCase()
  
      if (contentLower.includes("develop") || contentLower.includes("creat") || contentLower.includes("build")) {
        return `${content} resulting in 30% improved performance`
      } else if (contentLower.includes("lead") || contentLower.includes("manage") || contentLower.includes("direct")) {
        return `${content} for a team of 5+ developers`
      } else if (contentLower.includes("reduc") || contentLower.includes("decreas") || contentLower.includes("lower")) {
        return `${content} by 25%`
      } else if (contentLower.includes("increas") || contentLower.includes("improv") || contentLower.includes("enhanc")) {
        return `${content} by 40%`
      } else if (contentLower.includes("customer") || contentLower.includes("client") || contentLower.includes("user")) {
        return `${content} for 10,000+ users`
      } else if (contentLower.includes("budget") || contentLower.includes("cost") || contentLower.includes("revenue")) {
        return `${content} managing $1.5M+ budget`
      } else {
        const examples = [
          `${content}, increasing efficiency by 35%`,
          `${content}, saving the company $50,000 annually`,
          `${content} for 15+ projects`,
          `${content}, resulting in 25% higher customer satisfaction`,
          `${content} across 3 departments`,
        ]
        return examples[Math.floor(Math.random() * examples.length)]
      }
    }
  
    // Calculate dynamic match score
    static calculateMatchScore(resume: string, requirements: JobRequirement[]): number {
      if (requirements.length === 0) {
        // Fallback: if no requirements, return a neutral score (not 0)
        return 70
      }
  
      const resumeLower = resume.toLowerCase()
      let totalWeight = 0
      let matchedWeight = 0
  
      requirements.forEach((req) => {
        const weight = req.importance === "high" ? 3 : req.importance === "medium" ? 2 : 1
        totalWeight += weight

        // Improved skill matching: match whole words, ignore case and extra whitespace
        const skillRegexes = req.keywords.map(
          (keyword) => new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i")
        )
        const hasSkill = skillRegexes.some((regex) => regex.test(resume))
        if (hasSkill) {
          matchedWeight += weight
        }
      })

      // Debug logging
      if (requirements.length === 0) {
        console.warn("[ResumeOptimizer] No requirements extracted from job description.")
      } else {
        console.log("[ResumeOptimizer] Requirements:", requirements)
      }
  
      const baseScore = Math.round((matchedWeight / totalWeight) * 100)
  
      // Bonus points for quantified achievements
      const bulletPoints = resume.match(/[•\-*]\s*(.+)/g) || []
      const quantifiedBullets = bulletPoints.filter((bullet) =>
        /\d+%?|\$[\d,]+|[\d,]+\s*(users?|customers?|projects?|years?|months?)/.test(bullet),
      )
      const quantificationBonus = Math.min(
        10,
        Math.round((quantifiedBullets.length / Math.max(1, bulletPoints.length)) * 10),
      )
  
      // Bonus for having a professional summary
      const summaryBonus = /summary|objective|profile/i.test(resumeLower) ? 5 : 0
  
      // Bonus for proper formatting
      const formattingBonus = this.hasProperSectionHeadings(resume) ? 5 : 0
  
      // Calculate final score
      const finalScore = baseScore + quantificationBonus + summaryBonus + formattingBonus
  
      // Ensure score is within reasonable bounds
      return Math.min(100, Math.max(40, finalScore))
    }
  
    // Optimize resume content
    static optimizeResume(resume: string, suggestions: OptimizationSuggestion[]): string {
      let optimizedResume = resume
  
      // Apply content improvements
      suggestions.forEach((suggestion) => {
        if (suggestion.before && suggestion.after) {
          optimizedResume = optimizedResume.replace(suggestion.before, suggestion.after)
        }
      })
  
      // Add missing skills to skills section
      const skillSuggestions = suggestions.filter((s) => s.type === "keyword" && s.section === "skills")
      if (skillSuggestions.length > 0) {
        const skillsMatch = optimizedResume.match(/(Skills?|Technical Skills?|Core Competencies)[:\s]*([^\n]*)/i)
  
        if (skillsMatch) {
          const newSkills = skillSuggestions
            .map((s) => {
              const match = s.description.match(/Add "([^"]+)"/)
              return match ? match[1] : null
            })
            .filter(Boolean)
  
          const currentSkills = skillsMatch[2] || ""
          const updatedSkills = currentSkills + (currentSkills ? ", " : "") + newSkills.join(", ")
          optimizedResume = optimizedResume.replace(skillsMatch[0], `${skillsMatch[1]}: ${updatedSkills}`)
        } else {
          // Add skills section if it doesn't exist
          const newSkills = skillSuggestions
            .map((s) => {
              const match = s.description.match(/Add "([^"]+)"/)
              return match ? match[1] : null
            })
            .filter(Boolean)
  
          if (newSkills.length > 0) {
            optimizedResume = `SKILLS\n${newSkills.join(", ")}\n\n${optimizedResume}`
          }
        }
      }
  
      // Add professional summary if missing
      const needsSummary = suggestions.some(
        (s) => s.type === "structure" && s.section === "summary" && s.description.includes("professional summary"),
      )
  
      if (needsSummary) {
        // Generate a summary based on the resume content and requirements
        const summary = this.generateProfessionalSummary(resume)
        optimizedResume = `PROFESSIONAL SUMMARY\n${summary}\n\n${optimizedResume}`
      }
  
      return optimizedResume
    }
  
    // Generate a professional summary
    static generateProfessionalSummary(resume: string): string {
      // Extract experience and skills from resume
      const experienceMatch = resume.match(/(\d+)(?:\+)?\s*(?:years?|yrs?)/i)
      const yearsOfExperience = experienceMatch ? experienceMatch[1] : "5+"
  
      // Extract potential job titles
      const titleMatch = resume.match(
        /(Software Engineer|Developer|Designer|Manager|Analyst|Consultant|Director|Specialist|Architect)/i,
      )
      const jobTitle = titleMatch ? titleMatch[1] : "Professional"
  
      // Extract potential skills
      const skillsMatch = resume.match(/Skills?[:\s]*([^\n]*)/i)
      const skills = skillsMatch ? skillsMatch[1].split(/[,;]/).slice(0, 3).join(", ") : "relevant skills"
  
      return `Results-driven ${jobTitle} with ${yearsOfExperience} years of experience. Proven track record of delivering high-quality solutions using ${skills}. Skilled in collaborating with cross-functional teams to achieve business objectives and drive innovation.`
    }
  
    // Calculate readability score (Flesch-Kincaid simplified)
    static calculateReadabilityScore(text: string): number {
      const words = text.split(/\s+/).filter(Boolean).length
      const sentences = text.split(/[.!?]+/).filter(Boolean).length
      const syllables = this.countSyllables(text)
  
      if (sentences === 0 || words === 0) return 60
  
      // Simplified Flesch-Kincaid formula
      const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  
      // Normalize to 0-100 scale
      return Math.min(100, Math.max(0, Math.round(score)))
    }
  
    // Count syllables (simplified)
    static countSyllables(text: string): number {
      const words = text.toLowerCase().split(/\s+/).filter(Boolean)
      let count = 0
  
      words.forEach((word) => {
        // Count vowel groups as syllables
        const vowelGroups = word.match(/[aeiouy]+/g) || []
        let syllableCount = vowelGroups.length
  
        // Adjust for common patterns
        if (word.endsWith("e") && syllableCount > 1) syllableCount--
        if (word.endsWith("le") && word.length > 2) syllableCount++
        if (syllableCount === 0) syllableCount = 1
  
        count += syllableCount
      })
  
      return count
    }
  
    // Complete analysis function
    static analyzeAndOptimize(resume: string, jobDescription: string): AnalysisResult {
      const requirements = this.analyzeJobDescription(jobDescription)
      const suggestions = this.generateOptimizationSuggestions(resume, requirements)
      const optimizedContent = this.optimizeResume(resume, suggestions)
      const matchScore = this.calculateMatchScore(optimizedContent, requirements)
  
      const resumeLower = resume.toLowerCase()
      const foundSkills = requirements
        .filter((req) => req.keywords.some((keyword) => resumeLower.includes(keyword.toLowerCase())))
        .map((req) => req.skill)
  
      const missingSkills = requirements
        .filter((req) => !req.keywords.some((keyword) => resumeLower.includes(keyword.toLowerCase())))
        .map((req) => req.skill)
  
      const improvements = suggestions.map((s) => s.description)
  
      // Calculate key metrics
      const bulletPoints = resume.match(/[•\-*]\s*(.+)/g) || []
      const quantifiedBullets = bulletPoints.filter((bullet) =>
        /\d+%?|\$[\d,]+|[\d,]+\s*(users?|customers?|projects?|years?|months?)/.test(bullet),
      )
  
      const readabilityScore = this.calculateReadabilityScore(resume)
  
      const keyMetrics = {
        skillsMatched: foundSkills.length,
        totalSkills: requirements.length,
        quantifiedAchievements: quantifiedBullets.length,
        totalBulletPoints: bulletPoints.length,
        improvementsMade: suggestions.length,
        readabilityScore,
      }
  
      return {
        requirements,
        suggestions,
        matchScore,
        optimizedContent,
        improvements,
        missingSkills,
        foundSkills,
        keyMetrics,
      }
    }
  }
  