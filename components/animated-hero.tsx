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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Animated kanji watermark */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000 ${mounted ? 'opacity-[0.08]' : 'opacity-0'}`}>
        <div className="text-[40vw] font-bold text-white leading-none animate-pulse-glow" role="img" aria-label="Mieru Kanji, meaning visibility">見える</div>
      </div>

      {/* Animated glow orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-float opacity-30 pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-3xl animate-float opacity-20 pointer-events-none" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge with animation */}
        <div className={`mb-6 flex justify-center transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '0.2s' }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/50 px-4 py-1.5 text-sm text-neutral-300 backdrop-blur-sm hover:border-red-500/50 hover:bg-neutral-900/70 transition-colors">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>WCAG 2.1 powered by AI</span>
          </div>
        </div>

        {/* Main headline with staggered animation */}
        <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4 text-balance transition-all duration-1000 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} style={{ transitionDelay: '0.4s' }}>
          <span className="block mb-2">Mieru-bot</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-shimmer">見える</span>
        </h1>

        {/* Subheading with animation */}
        <p className={`text-lg sm:text-xl text-neutral-300 mb-8 max-w-2xl mx-auto text-balance font-light transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.6s' }}>
          Inline accessibility reviews with one-click fixes — directly in your pull requests.
        </p>

        {/* CTA Buttons with animation */}
        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.8s' }}>
          <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-red-600/50" aria-label="Install on GitHub">
            <Github className="w-5 h-5 mr-2" aria-hidden="true" />
            Install on GitHub →
          </Button>
          <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-900 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto">
            View Documentation
          </Button>
        </div>

        {/* Stats with animation and stagger */}
        <div className={`mt-12 flex justify-center gap-8 text-sm border-t border-neutral-800 pt-8 transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '1s' }}>
          {[
            { value: '500+', label: 'GitHub repos' },
            { value: '50K+', label: 'Violations caught' },
            { value: '10s', label: 'avg fix time' }
          ].map((stat, index) => (
            <div key={index} className="transform transition-all duration-500 hover:scale-110 hover:text-red-400 cursor-default" style={{ transitionDelay: `${1.2 + index * 0.1}s` }}>
              <div className="text-2xl font-semibold text-white">{stat.value}</div>
              <div className="text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Floating eye icon */}
        <div className="absolute top-1/4 -left-20 opacity-10 pointer-events-none animate-float" role="presentation" aria-hidden="true">
          <Eye className="w-40 h-40 text-red-500" />
        </div>
        <div className="absolute bottom-1/4 -right-20 opacity-10 pointer-events-none animate-float" style={{ animationDelay: '2s' }}>
          <Eye className="w-40 h-40 text-red-500" />
        </div>
      </div>
    </section>
  )
}