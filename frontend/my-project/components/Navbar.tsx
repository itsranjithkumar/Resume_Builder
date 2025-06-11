"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FileText, Sun, Moon, LogIn } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="sticky top-0 z-30 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm no-print print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <FileText className="h-7 w-7 text-blue-600" />
            <Link href="/" className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">Resume Builder</Link>
          </div>
          {/* Desktop Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link href="/resumes" className="hover:text-blue-600 font-medium transition-colors">My Resumes</Link>
            <Link href="/resume-preview" className="hover:text-blue-600 font-medium transition-colors">Preview</Link>
            <Link href="/jd-optimizer" className="hover:text-blue-600 font-medium transition-colors">JD Optimizer</Link>
<button
  onClick={() => router.push('/jd-optimizer')}
  className="ml-2 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow"
>
  JD Resume Optimization
</button>
            <button onClick={() => setDarkMode((d) => !d)} aria-label="Toggle theme" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />}
            </button>
            {/* Auth/User - Placeholder */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow" onClick={() => router.push("/login")}> <LogIn className="h-4 w-4" /> Login </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
