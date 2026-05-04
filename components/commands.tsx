'use client'

import { Sparkles, HelpCircle, BookOpen, EyeOff, FileText, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Commands() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const commands = [
    {
      icon: Sparkles,
      command: '@mieru-bot review',
      description: 'Full accessibility review with inline suggestions',
    },
    {
      icon: HelpCircle,
      command: '@mieru-bot why <line>',
      description: 'Explain a specific issue in depth',
    },
    {
      icon: BookOpen,
      command: '@mieru-bot explain <wcag-rule>',
      description: 'Learn about a WCAG rule with examples',
    },
    {
      icon: EyeOff,
      command: '@mieru-bot ignore <line>',
      description: 'Add an ignore comment for false positives',
    },
    {
      icon: FileText,
      command: '@mieru-bot summary',
      description: 'Walkthrough only, no inline comments',
    },
    {
      icon: MessageCircle,
      command: '@mieru-bot help',
      description: 'Show every command',
    },
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '0.1s' }}>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
            Chat with Mieru
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Mention @mieru-bot anywhere — typos like @mieru-but and variants like @mierubot work too.
          </p>
        </div>

        {/* Commands grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {commands.map((cmd, idx) => {
            const Icon = cmd.icon
            return (
              <div
                key={idx}
                className={`bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-lg p-6 hover:border-red-500/50 hover:shadow-md hover:shadow-red-500/20 dark:hover:shadow-red-500/10 transition-all duration-300 backdrop-blur-sm transform hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${0.15 + idx * 0.05}s`, animationFillMode: 'both' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono text-red-600 dark:text-red-400 block mb-2 break-all hover:text-red-700 dark:hover:text-red-300 transition-colors">
                      {cmd.command}
                    </code>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors">
                      {cmd.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <p className="text-center text-sm italic text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto">
          Or assign &apos;mieru-bot&apos; in the PR Reviewers sidebar — same effect as @mieru-bot review.
        </p>
      </div>
    </section>
  )
}
