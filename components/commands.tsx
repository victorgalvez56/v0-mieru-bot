'use client'

import { Sparkles, HelpCircle, BookOpen, EyeOff, FileText, MessageCircle } from 'lucide-react'

export function Commands() {
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
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Chat with Mieru
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
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
                className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-6 hover:border-neutral-700 transition-colors backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-sm font-mono text-red-400 block mb-2 break-all">
                      {cmd.command}
                    </code>
                    <p className="text-sm text-neutral-400">
                      {cmd.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Note */}
        <p className="text-center text-sm italic text-neutral-500 max-w-2xl mx-auto">
          Or assign &apos;mieru-bot&apos; in the PR Reviewers sidebar — same effect as @mieru-bot review.
        </p>
      </div>
    </section>
  )
}
