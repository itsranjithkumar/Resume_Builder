"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ResumeForm from "@/components/resume-form"
import ResumePreview from "@/components/resume-preview"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, FileText } from "lucide-react"

export interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
    image: string
  }
  summary: string
  experience: Array<{
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    location: string
    id: string
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
    gpa: string
  }>
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string
    link: string
  }>
  skills: Array<{
    id: string
    category: string
    items: string
  }>
  certifications: Array<{
    id: string
    name: string
    issuer: string
    date: string
    link: string
  }>
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    website: "",
    image: "",
  },
  summary: "",
  experience: [],
  education: [],
  projects: [],
  skills: [],
  certifications: [],
}

export default function ResumePage() {
  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;
      const element = document.getElementById("resume-content");
      if (!element) return;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: element.offsetWidth,
        height: element.offsetHeight,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "in", format: [8.5, 11] });
      const pdfWidth = 8.5;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / (imgWidth / 192);
      const finalWidth = pdfWidth;
      const finalHeight = (imgHeight / 192) * ratio;
      pdf.addImage(imgData, "PNG", 0, 0, finalWidth, finalHeight);
      const fileName = `${resumeData.personalInfo.fullName || "Resume"}_Resume.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      window.print();
    }
  };

  const router = useRouter()
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);

  useEffect(() => {
    // Load user info from localStorage (assume backend sets this on login)
    if (typeof window !== "undefined") {
      const handleStorage = () => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            setUser(JSON.parse(userStr));
            console.log("User loaded:", JSON.parse(userStr));
          } catch {
            setUser(null);
            console.log("User parse error");
          }
        } else {
          setUser(null);
          console.log("No user in localStorage");
        }
      };
      handleStorage();
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("resumeData");
      if (saved) return JSON.parse(saved);
    }
    return initialData;
  });
  const [currentView, setCurrentView] = useState<"form" | "preview">("form")

  // Persist resumeData to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeData", JSON.stringify(resumeData));
    }
  }, [resumeData]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Validate token with backend
    fetch("https://resume-builder-koj8.onrender.com/api/users/validate-token", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          localStorage.removeItem("token");
          router.push("/login");
        }
        // No need to set authChecked
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  const handlePreview = () => {
    setCurrentView("preview")
  }

  const handleBackToForm = () => {
    setCurrentView("form")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-gray-900" />
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/resume-preview")}
                className="flex items-center space-x-2 no-print"
              >
                <span>JSON Resume</span>
              </Button>
              {currentView === "preview" && (
                <Button variant="outline" onClick={handleBackToForm} className="flex items-center space-x-2 no-print">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Form</span>
                </Button>
              )}
              {currentView === "form" && (
                <Button onClick={handlePreview} className="flex items-center space-x-2 bg-gray-900 hover:bg-gray-800">
                  <Eye className="h-4 w-4" />
                  <span>Preview Resume</span>
                </Button>
              )}
              {/* Auth Only: Show Login/Logout, no profile */}
              {user ? (
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              ) : (
                <Button variant="outline" onClick={() => router.push("/login")}>Login</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto py-8">
          {currentView === "form" ? (
            <ResumeForm data={resumeData} onChange={setResumeData} onPreview={handlePreview} />
          ) : (
            <>
              <div className="flex justify-end gap-4 mb-6 no-print print:hidden">
                <Button variant="outline" onClick={handleBackToForm}>
                  Back to Edit
                </Button>
                <Button onClick={handleDownloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                  Download PDF
                </Button>
              </div>
              <ResumePreview data={resumeData} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
