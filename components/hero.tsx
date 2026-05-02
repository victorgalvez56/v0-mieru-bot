import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Subtle background grid effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Subtle badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/50 px-4 py-1.5 text-sm text-neutral-300 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>WCAG 2.1 powered by AI</span>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
          Accessibility reviews on every{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-300">
            pull request
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto text-balance">
          Catch WCAG violations before they ship. Color contrast, ARIA labels, alt text, and more—reviewed automatically when PRs open.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-neutral-100 w-full sm:w-auto">
            <Github className="w-5 h-5 mr-2" />
            Add to Your Repo
          </Button>
          <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-900 w-full sm:w-auto">
            View Documentation
          </Button>
        </div>

        {/* Quick stats */}
        <div className="mt-12 flex justify-center gap-8 text-sm border-t border-neutral-800 pt-8">
          <div>
            <div className="text-2xl font-semibold text-white">500+</div>
            <div className="text-neutral-500">GitHub repos</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">50K+</div>
            <div className="text-neutral-500">Violations caught</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-white">99%</div>
            <div className="text-neutral-500">Uptime SLA</div>
          </div>
        </div>
      </div>
    </section>
  )
}
