'use client'

export function Config() {
  const yamlContent = `# .mieru.yaml — drop at the root of your repo
# Every field is optional. Defaults work great out of the box.

# Auto-review every PR when it opens or gets new commits
auto_review: true

# After every review, also open a stacked fix PR with all
# suggested changes pre-applied
auto_fix_pr: false

# Hide noise. Options: blocker, warning, suggestion (default)
severity_threshold: warning

# Glob patterns of files to skip
ignore_paths:
  - "**/*.test.tsx"
  - "components/legacy/**"

# Specific WCAG rules to skip (handled elsewhere, e.g. by design system)
ignore_rules:
  - "WCAG 1.4.3"`

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Customize for your repo
          </h2>
          <p className="text-lg text-neutral-400">
            Optional. Drop a .mieru.yaml at the root of your repo. Solo devs and OSS maintainers don&apos;t need to touch this.
          </p>
        </div>

        {/* Code block */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
          <pre className="p-6 overflow-x-auto text-sm leading-relaxed">
            <code className="font-mono text-neutral-300 whitespace-pre">
              {yamlContent.split('\n').map((line, idx) => {
                // Simple syntax highlighting
                let highlighted = line
                
                // Comments
                if (line.trim().startsWith('#')) {
                  highlighted = <span key={idx} className="text-neutral-600">{line}</span>
                }
                // Keys (before colon)
                else if (line.includes(':')) {
                  const [key, ...rest] = line.split(':')
                  highlighted = (
                    <span key={idx}>
                      <span className="text-purple-400">{key}</span>
                      <span className="text-neutral-300">:{rest.join(':')}</span>
                    </span>
                  )
                }
                // String values
                else if (line.includes('"')) {
                  highlighted = line.replace(/"([^"]*)"/g, (match, p1) => 
                    `"<span class="text-yellow-400">${p1}</span>"`
                  )
                  highlighted = <span key={idx} dangerouslySetInnerHTML={{ __html: highlighted }} />
                }
                
                return (
                  <div key={idx}>
                    {highlighted || line}
                  </div>
                )
              })}
            </code>
          </pre>
        </div>

        {/* Note */}
        <p className="mt-6 text-sm text-neutral-500">
          This file is optional. Mieru-bot works out of the box with sensible defaults.
        </p>
      </div>
    </section>
  )
}
