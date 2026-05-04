'use client'

import { Button } from '@/components/ui/button'
import { Github, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'

export function AnimatedHero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 bg-white dark:bg-gradient-to-b dark:from-neutral-950 dark:via-black dark:to-neutral-950">
      {/* Animated background grid - light mode */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none light" style={{
        backgroundImage: 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
      
      {/* Animated background grid - dark mode */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none dark" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Animated kanji watermark */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${mounted ? 'dark:opacity-[0.08] opacity-[0.03]' : 'opacity-0'}`} aria-hidden="true">
        <div className="text-[40vw] font-bold dark:text-white text-neutral-900 leading-none animate-pulse-glow">見える</div>
      </div>

      {/* Animated glow orbs - light mode */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-float opacity-20 pointer-events-none light" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-float opacity-10 pointer-events-none light" style={{ animationDelay: '1s' }} aria-hidden="true" />
      
      {/* Animated glow orbs - dark mode */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-float opacity-30 pointer-events-none dark" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-float opacity-20 pointer-events-none dark" style={{ animationDelay: '1s' }} aria-hidden="true" />
      
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge with animation */}
        <div className={`mb-6 flex justify-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-1.5 text-sm text-neutral-600 dark:text-neutral-300 backdrop-blur-sm hover:border-red-500/50 hover:bg-neutral-100 dark:hover:bg-neutral-900/70 transition-colors">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          </div>
        </div>

        {/* Main headline with staggered animation */}
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-balance transition-all duration-1000 text-neutral-900 dark:text-white ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '0.4s' }}>
          <span className="block mb-2">Mieru-bot</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-shimmer">見える</span>
        </h1>

        {/* Subheading with animation - with emphasis on key phrases */}
        <p className={`text-lg sm:text-xl text-neutral-600 dark:text-neutral-300 mb-10 max-w-3xl mx-auto text-balance font-light transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.6s' }}>
          Inline accessibility reviews on every pull request.{' '}
          <span className="text-neutral-900 dark:text-white font-semibold">Zero config.</span> <span className="text-neutral-900 dark:text-white font-semibold">Apply fixes with one click.</span>
        </p>

        {/* Hero Video */}
        <div className={`mb-10 relative w-full max-w-5xl mx-auto transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.8s' }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl shadow-red-950/30 dark:shadow-red-950/30"
            aria-label="Mieru-bot demo: an inline accessibility suggestion is applied with one click"
          >
            <source src="https://v0-mieru-bot.vercel.app/hero-loop.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute inset-x-0 -bottom-10 mx-auto h-40 max-w-3xl bg-red-500/10 blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />
        </div>

        {/* CTA Buttons with animation */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 mt-12 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1s' }}>
          <Button size="lg" asChild className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-red-600/50">
            <a href="https://github.com/apps/mieru-bot" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              Install on GitHub →
            </a>
          </Button>
          <Button size="lg" asChild variant="outline" className="border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto">
            <a href="https://github.com/victorgalvez56/v0-mieru-bot" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </Button>
        </div>

        {/* Real stats with animation and stagger */}
        <div className={`mt-12 flex justify-center gap-8 text-sm border-t border-neutral-200 dark:border-neutral-800 pt-8 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1.2s' }}>
          {[
            { value: 'Zero', label: 'config' },
            { value: 'One-click', label: 'to apply any fix' },
            { value: 'WCAG 2.1', label: 'AA coverage' }
          ].map((stat, index) => (
            <div key={index} className="transform transition-all duration-500 hover:scale-110 hover:text-red-400 cursor-default" style={{ transitionDelay: `${1.4 + index * 0.1}s` }}>
              <div className="text-2xl font-semibold text-neutral-900 dark:text-white">{stat.value}</div>
              <div className="text-neutral-600 dark:text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Floating eye icon */}
        <div className="absolute top-1/4 -left-20 opacity-10 pointer-events-none animate-float" aria-hidden="true">
          <Eye className="w-40 h-40 text-red-500" />
        </div>
        <div className="absolute bottom-1/4 -right-20 opacity-10 pointer-events-none animate-float" style={{ animationDelay: '2s' }} aria-hidden="true">
          <Eye className="w-40 h-40 text-red-500" />
        </div>
      </div>
    </section>
  )
}
