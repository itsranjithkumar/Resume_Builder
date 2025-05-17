"use client"
import React, { useEffect, useRef, useState } from "react"

export default function LiveWebcam({ className = "", aspect = "aspect-square" }: { className?: string; aspect?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState("")
  const [streaming, setStreaming] = useState(false)

  useEffect(() => {
    let stream: MediaStream | null = null
    const getWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStreaming(true)
        }
      } catch (err: any) {
        setError("Camera access denied or unavailable.")
      }
    }
    getWebcam()
    return () => {
      if (stream && stream.getTracks) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className={`relative w-full ${aspect} ${className}`}>
      {streaming ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-2xl shadow-2xl object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-gray-200 rounded-2xl text-gray-500 text-lg">
          {error || "Enabling camera..."}
        </div>
      )}
      {/* Overlay for privacy message */}
      <div className="absolute bottom-2 left-2 right-2 text-xs text-gray-700 bg-white/80 rounded px-2 py-1 text-center">
        Live camera preview (not saved)
      </div>
    </div>
  )
}
