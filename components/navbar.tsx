'use client'

import { useState, useEffect } from 'react'
import { Eye, Github, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [stars, setStars] = useState<number | null>(null)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Fetch GitHub stars
    fetch('https://api.github.com/repos/victorgalvez56/v0-mieru-bot')
      .then(res => res.json())
      .then(data => setStars(data.stargazers_count))
      .catch(() => setStars(null))

    // Check system preference
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark')
      setIsDark(isDarkMode)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    html.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <header className="fixed top-0 w-full bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 font-bold text-lg">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-neutral-900 dark:text-white">Mieru</span>
        </div>

        {/* Center nav items */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#features" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
            Features
          </a>
          <a href="#how-it-works" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
            How it works
          </a>
          <a href="#docs" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition">
            Docs
          </a>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-4">
          {/* GitHub Stars */}
          {stars !== null && (
            <a
              href="https://github.com/victorgalvez56/v0-mieru-bot"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-sm hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
            >
              <Github className="w-4 h-4" />
              <span className="font-medium">{stars}</span>
            </a>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="w-9 h-9 px-0"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-neutral-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-600" />
            )}
          </Button>

          {/* Install CTA */}
          <Button
            size="sm"
            asChild
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <a href="https://github.com/apps/mieru-bot" target="_blank" rel="noopener noreferrer">
              Install
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
