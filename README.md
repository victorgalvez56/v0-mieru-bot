# Mieru-bot 見える

**Make accessibility visible.** Inline WCAG 2.1 accessibility reviews powered by AI on every GitHub pull request.

> Built for the **Vercel Zero to Agent** hackathon event.

---

## Quick Start

### 1. **Install the Mieru-bot GitHub App**

The easiest way to get started:

1. Go to the [GitHub App installation page](https://github.com/apps/mieru-bot) *(coming soon)*
2. Click **"Install"**
3. Select the repository or organization where you want Mieru to review PRs
4. Done! Mieru-bot will automatically review every new pull request

### 2. **Use Mieru in Your PR**

That's it—no configuration needed! Mieru-bot will:

- Automatically scan your PR when it opens
- Leave inline comments on accessibility issues
- Suggest one-click fixes you can apply instantly

---

## How It Works

### Step 1: Open a PR
Push your branch as you normally would. No setup, no extra commands.

### Step 2: Mieru Reviews
The bot leaves inline comments on every accessibility issue with one-click GitHub suggestions you can apply instantly.

### Step 3: Chat with the Bot
Ask follow-up questions like:
- `@mieru-bot why?` — Explain a specific issue
- `@mieru-bot explain WCAG 2.1.1` — Learn about a WCAG rule
- `@mieru-bot ignore <line>` — Mark a false positive

---

## Available Commands

Use these commands in PR comments by mentioning `@mieru-bot`:

| Command | Purpose |
|---------|---------|
| `@mieru-bot review` | Run a full accessibility review with inline suggestions |
| `@mieru-bot why <line>` | Get an explanation for a specific issue |
| `@mieru-bot explain <wcag-rule>` | Learn about a WCAG rule with examples |
| `@mieru-bot ignore <line>` | Ignore an issue (useful for false positives) |

---

## Customize for Your Team

Create a `.mieru.yaml` file in your repo root:

```yaml
# .mieru.yaml
severity:
  blocker: true      # Fail PR on blocker issues
  warning: true      # Fail PR on warnings
  suggestion: false  # Allow suggestions

ignore_paths:
  - "node_modules/"
  - ".next/"
  - "build/"

wcag_level: "AA"     # AA or AAA
auto_fix: false      # true = auto-fix PR, false = suggestions only
```

---

## What Mieru Checks

Mieru scans for WCAG 2.1 Level AA compliance:

- ✓ Color contrast ratios
- ✓ Alt text for images
- ✓ ARIA labels and roles
- ✓ Form labels and validation
- ✓ Keyboard navigation
- ✓ Semantic HTML
- ✓ Focus indicators
- ✓ And more...

---

## Development

### Local Setup

```bash
# Clone the repo
git clone https://github.com/victorgalvez56/v0-mieru-bot.git
cd v0-mieru-bot

# Install dependencies
pnpm install

# Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Project Structure

```
v0-mieru-bot/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── api/github-webhook/      # GitHub webhook handler
│   └── layout.tsx               # Root layout
├── components/
│   ├── hero.tsx                 # Hero section
│   ├── how-it-works.tsx          # 3-step workflow
│   ├── demo.tsx                 # PR comment demo
│   └── footer.tsx               # Footer CTA
└── public/                       # Static assets
```

### Tech Stack

- **Next.js 15** — React framework with App Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **shadcn/ui** — Component library
- **Lucide React** — Icons

---

## GitHub Webhook

The bot listens for GitHub webhook events at `/api/github-webhook`.

**Events handled:**
- `pull_request.opened` — Triggers review on PR open
- `pull_request.synchronize` — Re-reviews on new commits
- `pull_request_review_comment.created` — Handles chat commands

---

## Built with v0

This project was bootstrapped with [v0](https://v0.app) and is deployed on [Vercel](https://vercel.com).

Continue developing: [Open in v0 →](https://v0.app/chat/projects/prj_ulZrB6rRgteC5n05mwfp8q1WkBlW)

---

## Contributing

Have ideas for Mieru? Found a bug? Open an issue or PR in the [GitHub repo](https://github.com/victorgalvez56/v0-mieru-bot).

---

## License

MIT — Build with it, learn from it, share it.

---

**Mieru — to see, to be seen, to be understood.**
