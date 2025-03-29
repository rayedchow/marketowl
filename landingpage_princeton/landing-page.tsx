"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // 3D vector particles
    class Particle {
      x: number
      y: number
      z: number
      size: number
      speed: number
      color: string

      constructor() {
        // Distribute particles across the entire canvas
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.z = Math.random() * 2000 // Increased depth range
        this.size = Math.random() * 4 + 0.5
        this.speed = Math.random() * 0.8 + 0.2

        // More varied colors with purple/blue theme
        const hue = Math.random() * 60 + 220 // Blue to purple range
        const saturation = Math.random() * 30 + 70
        const lightness = Math.random() * 30 + 60
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.random() * 0.5 + 0.2})`
      }

      update() {
        this.z -= this.speed
        if (this.z <= 0) {
          this.z = 2000
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
        }
      }

      draw() {
        const scale = 1000 / this.z
        const x = this.x * scale + canvas.width / 2 - (this.x * scale) / 2
        const y = this.y * scale + canvas.height / 2 - (this.y * scale) / 2
        const radius = this.size * scale

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create more particles for better coverage
    const particles: Particle[] = []
    for (let i = 0; i < 300; i++) {
      particles.push(new Particle())
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0f0225] via-[#2a0668] to-[#5b23c3] text-white overflow-hidden relative">
      {/* 3D Particles Canvas - Full screen */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 opacity-70" />

      {/* Navigation */}
      <header className="container mx-auto py-6 px-4 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          {/* Logo without rotation animation */}
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-700 rounded-md flex items-center justify-center shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" />
              <path
                d="M2 17L12 22L22 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="font-bold text-xl tracking-tight">RunPod</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="hover:text-purple-300 transition-colors">
            Pricing
          </a>
          <a href="#" className="hover:text-purple-300 transition-colors">
            Serverless
          </a>
          <a href="#" className="hover:text-purple-300 transition-colors">
            Blog
          </a>
          <a href="#" className="hover:text-purple-300 transition-colors">
            Docs
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Contact Sales button with same style as Sign Up */}
          <Button
            variant="outline"
            className="hidden md:flex bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-900/30"
          >
            Contact sales
          </Button>
          <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white border-0 shadow-lg shadow-purple-900/30">
            Sign Up
          </Button>
          <Button variant="link" className="text-white hidden md:flex">
            Login
          </Button>
          <Button variant="ghost" className="md:hidden p-1 text-white hover:bg-white/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center z-10 px-4 mt-12 md:mt-0 relative">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
        >
          All in{" "}
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            one cloud
          </span>
          <span className="text-white/80">.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl mb-10 text-white/90">
            Train, fine-tune and deploy AI models with RunPod.
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
            <Button className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white text-lg px-8 py-6 rounded-md shadow-lg shadow-purple-900/30">
              Get started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        {/* 3D Floating Elements - Distributed across the page */}
        <div className="absolute w-full h-full pointer-events-none overflow-hidden">
          <motion.div
            initial={{ y: 100, x: -100, rotate: 0, opacity: 0.5 }}
            animate={{ y: 50, x: -150, rotate: 360, opacity: 0.7 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute left-1/4 top-1/4 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl backdrop-blur-md"
            style={{ transformStyle: "preserve-3d", perspective: "1000px", transform: "rotateX(45deg) rotateY(45deg)" }}
          />

          <motion.div
            initial={{ y: -50, x: 100, rotate: 0, opacity: 0.3 }}
            animate={{ y: -100, x: 150, rotate: -360, opacity: 0.6 }}
            transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute right-1/4 top-1/3 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full backdrop-blur-md"
            style={{ transformStyle: "preserve-3d", perspective: "1000px", transform: "rotateX(45deg) rotateY(45deg)" }}
          />

          <motion.div
            initial={{ y: 150, x: 100, rotate: 0, opacity: 0.4 }}
            animate={{ y: 100, x: 50, rotate: 360, opacity: 0.7 }}
            transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute right-1/3 bottom-1/4 w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg backdrop-blur-md"
            style={{ transformStyle: "preserve-3d", perspective: "1000px", transform: "rotateX(45deg) rotateY(45deg)" }}
          />

          {/* Additional floating elements for better distribution */}
          <motion.div
            initial={{ y: -80, x: -200, rotate: 0, opacity: 0.3 }}
            animate={{ y: -120, x: -250, rotate: 180, opacity: 0.5 }}
            transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute left-1/6 top-1/6 w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg backdrop-blur-md"
            style={{ transformStyle: "preserve-3d", perspective: "1000px", transform: "rotateX(35deg) rotateY(45deg)" }}
          />

          <motion.div
            initial={{ y: 200, x: 250, rotate: 0, opacity: 0.4 }}
            animate={{ y: 150, x: 200, rotate: -180, opacity: 0.6 }}
            transition={{ duration: 23, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
            className="absolute right-1/6 bottom-1/6 w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 rounded-xl backdrop-blur-md"
            style={{ transformStyle: "preserve-3d", perspective: "1000px", transform: "rotateX(55deg) rotateY(35deg)" }}
          />
        </div>
      </main>

      {/* Cloud Platform Illustration */}
      <div className="relative h-64 w-full overflow-hidden z-10">
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-black/20 rounded-[100%] translate-y-1/2 scale-[1.5] backdrop-blur-md"></div>

        {/* 3D Cloud Elements */}
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -10 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", ease: "easeInOut" }}
          className="absolute bottom-20 left-10 w-20 h-10 bg-gradient-to-r from-purple-900/80 to-purple-700/80 rounded-full shadow-lg"
          style={{ transform: "perspective(1000px) rotateX(60deg)" }}
        />

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -8 }}
          transition={{
            duration: 2.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="absolute bottom-24 left-20 w-16 h-8 bg-gradient-to-r from-purple-800/80 to-purple-600/80 rounded-full shadow-lg"
          style={{ transform: "perspective(1000px) rotateX(60deg)" }}
        />

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -12 }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-16 left-32 w-24 h-12 bg-gradient-to-r from-purple-900/80 to-purple-700/80 rounded-full shadow-lg"
          style={{ transform: "perspective(1000px) rotateX(60deg)" }}
        />

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -10 }}
          transition={{
            duration: 2.2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="absolute bottom-20 right-10 w-24 h-12 bg-gradient-to-r from-purple-900/80 to-purple-700/80 rounded-full shadow-lg"
          style={{ transform: "perspective(1000px) rotateX(60deg)" }}
        />

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: -8 }}
          transition={{
            duration: 2.7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.4,
          }}
          className="absolute bottom-24 right-28 w-20 h-10 bg-gradient-to-r from-purple-800/80 to-purple-600/80 rounded-full shadow-lg"
          style={{ transform: "perspective(1000px) rotateX(60deg)" }}
        />
      </div>
    </div>
  )
}

