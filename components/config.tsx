'use client'

export function Config() {
  const yamlContent = `# .mieru.yaml
# Configuration file for Mieru-bot

severity:
  blocker: true        # Fail PR on blocker issues
  warning: true        # Fail PR on warnings
  suggestion: false    # Allow suggestions

ignore_paths:
  - "node_modules/"
  - ".next/"
  - "build/"
  - "dist/"

wcag_level: "AA"       # AA or AAA
auto_fix: false        # true = auto-fix PR, false = suggestions only

# Add specific WCAG rules to ignore (optional)
# ignore_rules:
#   - "1.4.3"          # Color contrast`

  return (
    <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Configure for your team
          </h2>
          <p className="text-lg text-neutral-400">
            Drop a .mieru.yaml at the root of your repo to set severity thresholds, ignore paths, and choose between inline suggestions or auto-fix PRs.
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
