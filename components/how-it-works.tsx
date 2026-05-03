'use client'

import { CheckCircle, MessageSquare, MessageCircle } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: MessageSquare,
      title: 'Open a PR',
      description: 'Push your branch as you normally would. No setup, no extra commands.',
    },
    {
      icon: CheckCircle,
      title: 'Mention @mieru-bot review',
      description: 'The bot leaves inline comments on every accessibility issue, each with a one-click GitHub suggestion you can apply instantly.',
    },
    {
      icon: MessageCircle,
      title: 'Chat with the bot',
      description: 'Ask follow-up questions like "@mieru-bot why?" or "@mieru-bot explain WCAG 2.1.1". Apply or dismiss suggestions as you go.',
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
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6 relative z-10 -mt-8 -ml-2">
                    <Icon className="w-6 h-6 text-white" />
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
