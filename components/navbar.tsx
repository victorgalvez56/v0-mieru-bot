'use client'

import { useState, useEffect } from 'react'
import { Github, Moon, Sun } from 'lucide-react'
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

    // Default to dark theme
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark') || !document.documentElement.classList.contains('light')
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-end gap-3">
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
    </header>
  )
}
