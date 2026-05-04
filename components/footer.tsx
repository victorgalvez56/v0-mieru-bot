import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function Footer() {
  return (
    <section className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background accent */}
      <div className="absolute inset-0 opacity-10 dark:opacity-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left side: Main CTA */}
          <div className="group">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-300">
              Make accessibility visible.
            </h2>
            <p className="text-sm text-red-600 dark:text-red-400 mb-4 font-medium animate-pulse">Mieru — to see, to be seen, to be understood.</p>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
              Get started in minutes. No credit card required.
            </p>
            <Button size="lg" asChild className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-red-600/50">
              <a href="https://github.com/apps/mieru-bot" target="_blank" rel="noopener noreferrer">
                <Github className="w-5 h-5 mr-2" />
                Install from GitHub
              </a>
            </Button>
          </div>

          {/* Right side: Features */}
          <div className="space-y-4">
            {[
              { icon: '✓', title: 'Free for everyone', desc: 'no plans, no pricing — install and use' },
              { icon: '✓', title: 'Privacy first', desc: 'your code stays in your GitHub workspace' },
              { icon: '✓', title: 'WCAG 2.1 AA coverage', desc: 'across 7 categories of accessibility' }
            ].map((item, idx) => (
              <div key={idx} className="group cursor-default transition-all duration-300 hover:translate-x-2 hover:text-red-600 dark:hover:text-red-400 transform">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  <span className="text-red-600 dark:text-red-500">{item.icon}</span> {item.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-400 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8">
          {/* Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-8 text-sm">
            <a href="https://github.com/victorgalvez56/v0-mieru-bot" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:translate-x-1 transform">
              GitHub
            </a>
            <a href="https://github.com/apps/mieru-bot" target="_blank" rel="noopener noreferrer" className="text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:translate-x-1 transform">
              Install
            </a>
            <span className="text-neutral-500 dark:text-neutral-600">MIT License</span>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600 dark:text-neutral-500">
            <div>© 2026 Mieru-bot · MIT License</div>
            <div>Built for Vercel Zero to Agent · 見える</div>
          </div>
        </div>
      </div>
    </section>
  )
}
