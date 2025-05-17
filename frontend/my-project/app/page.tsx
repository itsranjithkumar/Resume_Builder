"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, FileText, Star, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Professional Templates",
      description: "Choose from dozens of professionally designed templates",
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "ATS-Friendly",
      description: "Our resumes are optimized to pass Applicant Tracking Systems",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Recruiter Approved",
      description: "Designed with input from HR professionals and recruiters",
    },
  ]

  const testimonials = [
    {
      quote: "This platform helped me land my dream job at a Fortune 500 company.",
      author: "Alex Johnson",
      role: "Software Engineer",
    },
    {
      quote: "The templates are sleek and professional. I received compliments on my resume from every interviewer.",
      author: "Sarah Williams",
      role: "Marketing Director",
    },
    {
      quote: "I was struggling with my resume for months. This tool made it so simple.",
      author: "Michael Chen",
      role: "Data Analyst",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-black">
                Resume<span className="text-gray-500">Builder</span>
              </span>
            </div>
            <nav className="hidden md:flex space-x-8 items-center">
              <Link href="#features" className="text-gray-600 hover:text-black transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-black transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-black transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-black transition-colors">
                Login
              </Link>
              <Link href="/register">
                <Button variant="default" className="bg-black text-white hover:bg-gray-800">
                  Get Started
                </Button>
              </Link>
            </nav>
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Create a resume that <span className="text-gray-500">stands out</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg">
                Our AI-powered resume builder helps you craft a perfect resume in minutes. Land more interviews and get
                hired faster.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-lg"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span>Build Your Resume</span>
                    <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.2 }}>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </motion.div>
                  </Button>
                </Link>
                <Link href="#templates">
                  <Button variant="outline" className="px-8 py-6 text-lg rounded-lg border-2">
                    View Templates
                  </Button>
                </Link>
              </div>
              <div className="mt-8 flex items-center text-sm text-gray-500">
                <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 mr-2 text-gray-400" />
                <span>Free templates available</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
                <img src="/placeholder.svg?height=600&width=800" alt="Resume Example" className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">4.9/5 from 2,000+ reviews</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Powerful Features for Your Professional Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to create impressive resumes that help you get noticed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-black">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their career with our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-black">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">Ready to build your professional resume?</h2>
              <p className="mt-4 text-lg text-gray-300 max-w-lg">
                Join over 1 million professionals who have used our platform to advance their careers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link href="/register">
                <Button className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-lg rounded-lg">
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-lg border-2 border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <span className="text-xl font-bold text-black">
                Resume<span className="text-gray-500">Builder</span>
              </span>
              <p className="mt-4 text-gray-600 text-sm">Creating professional resumes made simple and effective.</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Examples
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Career Tips
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Interview Prep
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Resume Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-black transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} ResumeBuilder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
