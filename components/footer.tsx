import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function Footer() {
  return (
    <section className="border-t border-neutral-800 bg-neutral-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background accent */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left side: Main CTA */}
          <div className="group">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors duration-300">
              Make accessibility visible.
            </h2>
            <p className="text-sm text-red-400 mb-4 font-medium animate-pulse">Mieru — to see, to be seen, to be understood.</p>
            <p className="text-lg text-neutral-400 mb-6">
              Get started in minutes. No credit card required.
            </p>
            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all active:scale-95 w-full sm:w-auto shadow-lg hover:shadow-red-600/50">
              <Github className="w-5 h-5 mr-2" />
              Install from GitHub Marketplace
            </Button>
          </div>

          {/* Right side: Features */}
          <div className="space-y-4">
            {[
              { icon: '✓', title: 'Free for open source', desc: 'Public repos included at no cost' },
              { icon: '✓', title: 'Privacy first', desc: 'Your code stays in your GitHub workspace' },
              { icon: '✓', title: 'WCAG 2.1 AA compliant', desc: 'Catches 90% of common a11y issues' }
            ].map((item, idx) => (
              <div key={idx} className="group cursor-default transition-all duration-300 hover:translate-x-2 hover:text-red-400">
                <h3 className="font-semibold text-white mb-1 group-hover:text-red-400 transition-colors">
                  <span className="text-red-500">{item.icon}</span> {item.title}
                </h3>
                <p className="text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 text-red-400">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Features</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Pricing</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 text-red-400">Resources</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Documentation</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">WCAG Guide</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 text-red-400">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 text-red-400">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">GitHub</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Twitter</a></li>
                <li><a href="#" className="hover:text-red-400 hover:translate-x-1 inline-block transition-all duration-200">Discord</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <div>© 2024 Mieru-bot. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-red-400 transition duration-200">Status</a>
              <a href="#" className="hover:text-red-400 transition duration-200">Feedback</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
