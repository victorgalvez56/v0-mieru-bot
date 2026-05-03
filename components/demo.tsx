'use client'

import { AlertCircle, CheckCircle, Eye, ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Demo() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Live demo
          </h2>
          <p className="text-lg text-neutral-400">
            This is what Mieru-bot's feedback looks like in your pull request
          </p>
        </div>

        {/* Stacked demo comments */}
        <div className="space-y-6">
          {/* Comment A: Summary Walkthrough */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-neutral-800 px-4 sm:px-6 py-4 bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    mieru-bot <span className="text-neutral-500 font-normal">@mieru-bot</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Accessibility Review Summary
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Score header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-300 mb-2">12 accessibility issues found</p>
                  <div className="inline-block">
                    <div className="text-3xl font-bold text-red-500">42<span className="text-lg text-neutral-500">/100</span></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500 mb-2">Accessibility score</p>
                  <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* File table */}
              <div className="border border-neutral-800 rounded overflow-hidden">
                <div className="grid grid-cols-3 bg-neutral-950">
                  <div className="px-4 py-3 text-xs font-mono text-neutral-500 border-b border-r border-neutral-800">File</div>
                  <div className="px-4 py-3 text-xs font-mono text-neutral-500 border-b border-r border-neutral-800">Issues</div>
                  <div className="px-4 py-3 text-xs font-mono text-neutral-500 border-b border-neutral-800">Severity</div>
                </div>
                <div className="grid grid-cols-3 border-b border-neutral-800">
                  <div className="px-4 py-3 text-xs text-neutral-300">components/Card.tsx</div>
                  <div className="px-4 py-3 text-xs text-neutral-300 border-r border-neutral-800">5</div>
                  <div className="px-4 py-3 text-xs"><span className="bg-red-950 text-red-400 px-2 py-1 rounded">High</span></div>
                </div>
                <div className="grid grid-cols-3 border-b border-neutral-800">
                  <div className="px-4 py-3 text-xs text-neutral-300">pages/dashboard.tsx</div>
                  <div className="px-4 py-3 text-xs text-neutral-300 border-r border-neutral-800">4</div>
                  <div className="px-4 py-3 text-xs"><span className="bg-yellow-950 text-yellow-400 px-2 py-1 rounded">Med</span></div>
                </div>
                <div className="grid grid-cols-3">
                  <div className="px-4 py-3 text-xs text-neutral-300">utils/helpers.ts</div>
                  <div className="px-4 py-3 text-xs text-neutral-300 border-r border-neutral-800">3</div>
                  <div className="px-4 py-3 text-xs"><span className="bg-blue-950 text-blue-400 px-2 py-1 rounded">Low</span></div>
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-2 text-sm text-neutral-300">
                <p className="font-semibold">High-impact changes:</p>
                <ul className="space-y-1 text-neutral-400 list-disc list-inside">
                  <li>Missing alt text on 3 images will block screen reader users</li>
                  <li>Color contrast issues affect users with low vision (WCAG AA fails)</li>
                  <li>Form labels missing — keyboard users can&apos;t identify fields</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comment B: Inline Review */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="border-b border-neutral-800 px-4 sm:px-6 py-3 bg-neutral-950">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    mieru-bot <span className="text-neutral-500 font-normal">@mieru-bot</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Line 42 • BLOCKER
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 sm:p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block bg-red-950 text-red-400 px-2 py-1 rounded text-xs font-semibold">BLOCKER</span>
                  <span className="text-sm font-semibold text-white">Missing alt text on image</span>
                </div>
                <p className="text-sm text-neutral-400">
                  <span className="font-mono text-xs text-neutral-500">WCAG 1.1.1 - Level A:</span> Image elements must have descriptive alternative text. Screen reader users cannot access this image.
                </p>
              </div>

              {/* Code suggestion */}
              <div className="bg-neutral-950 rounded border border-neutral-800 overflow-hidden text-xs font-mono space-y-0">
                <div className="bg-red-950/30 text-red-300 px-4 py-2 border-b border-neutral-800">
                  - &lt;img src="/hero.png" /&gt;
                </div>
                <div className="bg-green-950/30 text-green-300 px-4 py-2">
                  + &lt;img src="/hero.png" alt="Dashboard showing sales metrics and user growth" /&gt;
                </div>
              </div>

              {/* Action button */}
              <Button className="w-full bg-green-600 text-white hover:bg-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Commit suggestion
              </Button>
            </div>
          </div>

          {/* Comment C: Chat Reply */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
            {/* Header - User question */}
            <div className="border-b border-neutral-800 px-4 sm:px-6 py-4 bg-neutral-950">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-neutral-300">
                  VG
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    You <span className="text-neutral-500 font-normal">@developer</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    Replied to mieru-bot
                  </div>
                </div>
              </div>
            </div>

            {/* User message */}
            <div className="px-4 sm:px-6 py-4 border-b border-neutral-800 bg-neutral-900/50">
              <p className="text-sm text-neutral-300 font-mono">
                @mieru-bot why is this an issue for screen readers?
              </p>
            </div>

            {/* Bot reply */}
            <div className="px-4 sm:px-6 py-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0 flex-none">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-white mb-2">mieru-bot</div>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Screen readers announce images to users who are blind or have low vision. Without alt text, they only hear "image" with no context about what it shows. This breaks the user&apos;s ability to understand your dashboard. Descriptive alt text ensures everyone gets the same information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info below demo */}
        <div className="mt-8 text-center text-sm text-neutral-400">
          All issues are detected using WCAG 2.1 AA standards · No manual review needed · Integrates with your existing GitHub workflow
        </div>
      </div>
    </section>
  )
}
