"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GoogleAuthButton from "@/components/GoogleAuthButton";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from "next/navigation";
import { setAuthToken } from "../utils/api";

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  const USER_API_BASE_URL = process.env.NEXT_PUBLIC_USER_API_BASE_URL || "http://localhost:8000/api/users";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${USER_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || "Invalid credentials")
      } else {
        // Store JWT token and redirect to home
        localStorage.setItem("token", data.access_token)
        window.location.href = "/"
      }
    } catch {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="hidden md:block"
            >
              <div>
                <div className="w-full h-96 md:h-[500px] border-4 border-blue-400 rounded-2xl bg-gray-200 flex items-center justify-center mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80"
                    alt="Login Illustration"
                    className="object-cover w-full h-full"
                    style={{ aspectRatio: '1/1', minHeight: '100%', minWidth: '100%' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
                </div>
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-black mb-2">Welcome Back</h3>
                  <p className="text-gray-700 text-base">
                    Sign in to access your personalized resume dashboard.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border border-gray-100"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-black mb-2">Welcome back</h2>
                <p className="text-gray-600">Sign in to continue building your career</p>
              </div>

              <div className="mb-4">
                <GoogleAuthButton />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-12 border-gray-200 focus:border-black focus:ring-black"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Password
                    </Label>
                    <Link href="#" className="text-sm text-gray-500 hover:text-black transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-12 border-gray-200 focus:border-black focus:ring-black pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link href="/register" className="text-black font-medium hover:underline">
                    Create an account
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}
