'use client'

import { CheckCircle, GitPullRequest, Zap } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: GitPullRequest,
      title: 'Open a Pull Request',
      description: 'Just push code as you normally would. a11y-bot automatically sets up as a reviewer.',
    },
    {
      icon: Zap,
      title: 'AI Reviews Accessibility',
      description: 'Our AI analyzes your code for WCAG 2.1 violations in real-time. Takes seconds.',
    },
    {
      icon: CheckCircle,
      title: 'Get Inline Feedback',
      description: 'Review suggestions appear right in your PR comments, with links to fixes.',
    },
  ]

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-neutral-950">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Three simple steps to ship accessible web experiences
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting lines (hidden on mobile) */}
          <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-transparent via-neutral-700 to-transparent pointer-events-none" />

          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={idx} className="relative">
                {/* Step card */}
                <div className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-8 backdrop-blur-sm hover:border-neutral-700 transition-colors">
                  {/* Icon circle */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center mb-6 relative z-10 -mt-8 -ml-2">
                    <Icon className="w-6 h-6 text-black" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Step number */}
                <div className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-sm font-semibold text-neutral-300 md:hidden">
                  {idx + 1}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
