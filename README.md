# Mieru-bot 見える

**Inline accessibility reviews on every pull request. Zero config. Apply fixes with one click.**

A GitHub App that reviews every PR for WCAG 2.1 violations using GPT-4o,
posts inline suggestions on the exact lines, and lets you apply the fixes
with a single click — directly inside GitHub. No new tool to install.
No dashboard to check.

🤖 **Install:** https://github.com/apps/mieru-bot
🌐 **Site:** https://v0-mieru-bot.vercel.app

---

## Install in 30 seconds

1. Visit https://github.com/apps/mieru-bot
2. Click **Install** → choose your repos
3. Open a PR — Mieru reviews it automatically
4. Click `Commit suggestion` on any inline comment to apply the fix

That's it. No config file, no commands, no setup.

## What you get on every PR

**Walkthrough summary** at the top of the PR — score (0-100), severity
counts, file-by-file breakdown.

**Inline comments** on the exact lines that have issues. Each one shows:
- 🚫 Blocker / ⚠️ Warning / 💡 Suggestion badge
- The exact WCAG 2.1 rule violated (with citation)
- A one-line description of the user impact
- A `suggestion` block with the fix → click **Commit suggestion** to apply
- A collapsible "Why this matters" with deeper context

**Status check** — when blockers exist, the review is posted with
`REQUEST_CHANGES` so the PR is blocked from merging until they're resolved.

## Chat with the bot

Mieru is conversational. Mention it anywhere on a PR:

| Where | Command | What it does |
|---|---|---|
| PR comment | _(nothing)_ | Auto-review fires when you open or push to the PR |
| PR comment | `@mieru-bot review` | Re-run the review (e.g. after pushing fixes) |
| PR comment | `@mieru-bot summary` | Walkthrough only, no inline comments |
| PR comment | `@mieru-bot explain WCAG 1.4.3` | Learn about a specific rule with examples |
| PR comment | `@mieru-bot help` | Full command reference |
| Inline thread | `@mieru-bot why` | Deeper explanation of a flagged issue |
| Inline thread | `@mieru-bot ignore` | Show how to mark a finding as a false positive |

Mention parsing is fuzzy — typos like `@mieru-but` and variants like
`@mierubot` or `@mieru_bot` all work.

## Assign as a reviewer

Type `mieru-bot` into the **Reviewers** sidebar of a PR. Mieru runs the
same review on demand. Useful when auto-review is disabled or you want a
fresh pass after manual fixes.

## Configure (optional, for teams)

Drop a `.mieru.yaml` (or `.mieru.yml`) at the root of your repo. Every
field is optional:

```yaml
auto_review: true                # default true — set false to disable auto-review
severity_threshold: warning      # only show blockers and warnings, hide suggestions
ignore_paths:
  - "**/*.test.tsx"
  - "components/legacy/**"
ignore_rules:
  - "WCAG 1.4.3"                 # skip color contrast — handled by design system
auto_fix_pr: false               # set true to also open a stacked PR with all fixes pre-applied
```

When `auto_fix_pr` is on, after the review Mieru opens a fix PR (named
`mieru/fix-pr-<n>`) that targets your feature branch — merge it into your
branch, then merge your branch into main. One clean PR reaches main with
accessibility already fixed.

## How accuracy stays high

Mieru does a **two-pass review** on every PR. Pass 1 finds the obvious
issues. Pass 2 explicitly asks the model "what did you miss?" with a
checklist of commonly-missed categories: every color/background pair,
every `<span onClick>` (not just the `<div>` ones), heading hierarchy
across the whole file, modals missing `role="dialog"` / focus trap / ESC
handler, animations that ignore `prefers-reduced-motion`, icon-only
buttons missing `aria-label`. New issues from pass 2 are deduped against
pass 1 and added to the review.

The model receives the **full file content** (not just diff hunks), with
a `>` gutter marker on lines that were added or modified. This gives it
the semantic context — heading structure, full color palette, surrounding
JSX — needed to catch issues that span lines.

## What categories Mieru reviews

WCAG 2.1 level AA, exhaustively:

- **Images & media** — `alt` text, decorative SVG, `<picture>`, captions
- **Form controls** — labels, `placeholder`-as-label, accessible names
- **Keyboard interaction** — `<div onClick>` without `role`, `tabIndex`,
  `onKeyDown`; missing focus rings; misuse of `<a href="#">`
- **Semantic structure** — heading hierarchy (h1 → h2 → h3), landmarks,
  list semantics, `<button>` vs `<div>`
- **Color contrast** — every text/background pair, normal text 4.5:1,
  large text 3:1, UI 3:1
- **ARIA & screen readers** — `aria-*` correctness, `<iframe>` titles,
  visual-only content alternatives
- **i18n & motion** — `lang` attribute, `prefers-reduced-motion`

## Stack

- **Next.js 15** App Router on **Vercel** — single API route, no DB, no
  queue, no cron
- **AI SDK 6** (`generateText` + `Output.object()`) for the model layer
- **OpenAI gpt-4o** as the reviewer + chat brain
- **@octokit/app** for per-installation GitHub App authentication
- **Zod** for structured output validation
- **js-yaml** for `.mieru.yaml` config parsing

## Architecture

```
GitHub PR event
    │
    ▼
/api/github-webhook  ──────  pull_request  ─────  auto-review
                       │
                       ├───  issue_comment ─────  @mieru-bot chat
                       │     (review|summary|explain|help)
                       │
                       └───  pull_request_review_comment ──── inline reply
                             (@mieru-bot why|ignore)
    │
    ▼
GitHub App auth (per-installation)
    │
    ▼
Fetch PR + full file contents
    │
    ▼
Two-pass review (gpt-4o)
    │
    ▼
Filter by .mieru.yaml + drop comments outside diff range
    │
    ▼
POST review with inline suggestion blocks (one-click apply)
```

Stateless. Serverless. Each webhook is a single function invocation.

## Track

**Track 3 — Chat SDK Agents (Multiplataforma)**

Today Mieru lives in GitHub. Tomorrow it posts blocker summaries in Slack,
creates Linear issues for blockers, and pings on-call in Discord — same
codebase, multiple surfaces, via the Chat SDK adapter pattern.

## Why "Mieru"?

見える (mieru) — Japanese verb meaning *"to be visible, to be able to be
seen."*

Accessibility issues are invisible to developers without disabilities.
Mieru makes them visible — exactly where developers already work.

## Local development

```bash
pnpm install
pnpm dev
```

Required env vars:

| Variable | Where it comes from |
|---|---|
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `GITHUB_APP_ID` | The numeric App ID at github.com/settings/apps/mieru-bot |
| `GITHUB_PRIVATE_KEY` | Full PEM contents of the App's private key |

For local webhook testing, use [smee.io](https://smee.io) or `ngrok` to
forward GitHub webhooks to `localhost:3000`.

## Roadmap

Already shipped (post-hackathon polish):

- [x] Inline review comments with `suggestion` blocks
- [x] Walkthrough summary with file-by-file breakdown
- [x] `REQUEST_CHANGES` review event when blockers are present
- [x] Bot assignable as a PR reviewer
- [x] Conversational chat (`why`, `explain`, `ignore`, `summary`, `help`)
- [x] Inline thread replies
- [x] Two-pass review with verification step
- [x] Full file context (not just diff)
- [x] `.mieru.yaml` per-repo config
- [x] Optional auto-fix PR (stacked onto your feature branch)
- [x] Smart skip: cleanup PRs, deletions-only, bot-authored PRs

Coming next:

- [ ] Webhook HMAC signature verification
- [ ] Chat SDK adapters: Slack `#a11y` channel, Linear blocker issues,
  Discord pings
- [ ] WCAG 2.2 and WCAG 3.0 draft support
- [ ] Multi-model: route easy reviews to a smaller model, blockers to the
  strongest available
- [ ] Public dashboard: accessibility score trend per repo over time
- [ ] Learn from `@mieru-bot ignore` replies to reduce false positives
  per repo

## License

MIT — use it, fork it, ship it.

---

Built for **v0 Build Week 2026** · Bogotá + Lima · May 2, 2026
