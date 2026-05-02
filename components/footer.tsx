import { Button } from '@/components/ui/button'
import { Github } from 'lucide-react'

export function Footer() {
  return (
    <section className="border-t border-neutral-800 bg-neutral-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Left side: Main CTA */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              Make accessibility visible.
            </h2>
            <p className="text-sm text-red-400 mb-4 font-medium">Mieru — to see, to be seen, to be understood.</p>
            <p className="text-lg text-neutral-400 mb-6">
              Get started in minutes. No credit card required.
            </p>
            <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 w-full sm:w-auto">
              <Github className="w-5 h-5 mr-2" />
              Install from GitHub Marketplace
            </Button>
          </div>

          {/* Right side: Features */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-1">✓ Free for open source</h3>
              <p className="text-sm text-neutral-500">Public repos included at no cost</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">✓ Privacy first</h3>
              <p className="text-sm text-neutral-500">Your code stays in your GitHub workspace</p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">✓ WCAG 2.1 AA compliant</h3>
              <p className="text-sm text-neutral-500">Catches 90% of common a11y issues</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">WCAG Guide</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">Discord</a></li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-500">
            <div>© 2024 Mieru-bot. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neutral-300 transition">Status</a>
              <a href="#" className="hover:text-neutral-300 transition">Feedback</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
