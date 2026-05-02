'use client'

import { AlertCircle, MessageCircle, CheckCircle, Eye } from 'lucide-react'

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

        {/* GitHub-style PR comment */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          {/* Comment header */}
          <div className="border-b border-neutral-800 px-4 sm:px-6 py-4 bg-neutral-950">
            <div className="flex items-center gap-3">
              {/* Bot avatar - Eye icon */}
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  mieru-bot <span className="text-neutral-500 font-normal">@mieru-bot</span>
                </div>
                <div className="text-xs text-neutral-500">
                  Accessibility Review — <span className="text-red-400">3 issues found</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment body */}
          <div className="p-4 sm:p-6 space-y-6">
            {/* Header message */}
            <p className="text-neutral-300 text-sm">
              I found 3 accessibility issues in this PR. Let me make them visible so you can fix them.
            </p>

            {/* Issue 1: BLOCKER */}
            <div className="border-l-4 border-red-500 bg-neutral-950 rounded p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-red-500 bg-red-950 px-2 py-1 rounded text-xs">
                      BLOCKER
                    </span>
                    <span className="text-sm font-semibold text-white">Missing alt text</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">
                    Line 42: Image is missing an alt attribute. All images must have descriptive alt text.
                  </p>
                  <div className="bg-neutral-900 rounded border border-neutral-800 overflow-hidden text-xs font-mono">
                    <div className="bg-red-950 text-red-300 px-4 py-2">
                      - &lt;img src="/dashboard.png" /&gt;
                    </div>
                    <div className="bg-green-950 text-green-300 px-4 py-2">
                      + &lt;img src="/dashboard.png" alt="User dashboard showing sales metrics" /&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue 2: WARNING */}
            <div className="border-l-4 border-yellow-500 bg-neutral-950 rounded p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-yellow-600 bg-yellow-950 px-2 py-1 rounded text-xs">
                      WARNING
                    </span>
                    <span className="text-sm font-semibold text-white">Poor color contrast</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">
                    Line 156: Text color contrast ratio is 3.5:1. WCAG AA requires 4.5:1 for body text.
                  </p>
                  <div className="bg-neutral-900 rounded border border-neutral-800 overflow-hidden text-xs font-mono">
                    <div className="bg-red-950 text-red-300 px-4 py-2">
                      - &lt;p className="text-gray-600"&gt;Account settings&lt;/p&gt;
                    </div>
                    <div className="bg-green-950 text-green-300 px-4 py-2">
                      + &lt;p className="text-gray-400"&gt;Account settings&lt;/p&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue 3: SUGGESTION */}
            <div className="border-l-4 border-blue-500 bg-neutral-950 rounded p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-blue-600 bg-blue-950 px-2 py-1 rounded text-xs">
                      SUGGESTION
                    </span>
                    <span className="text-sm font-semibold text-white">Missing form label</span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-3">
                    Line 89: Input field should have an associated label for better accessibility.
                  </p>
                  <div className="bg-neutral-900 rounded border border-neutral-800 overflow-hidden text-xs font-mono">
                    <div className="bg-red-950 text-red-300 px-4 py-2">
                      - &lt;input type="email" placeholder="Email" /&gt;
                    </div>
                    <div className="bg-green-950 text-green-300 px-4 py-2">
                      + &lt;label htmlFor="email"&gt;Email&lt;/label&gt;&lt;br /&gt;
                    </div>
                    <div className="bg-green-950 text-green-300 px-4 py-2">
                      + &lt;input id="email" type="email" /&gt;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-4 border-t border-neutral-800">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Fix these issues to pass accessibility checks.</span>
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
