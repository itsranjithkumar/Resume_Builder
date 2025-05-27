// ResumeData type for the resume builder app
export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  projects: Array<{
    id: string;
    name: string;
    technologies: string[];
    link: string;
    github: string;
    description: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
  }>;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }>;
  [key: string]: any;
}
