# Mieru-bot 見える

**Accessibility reviews that make the invisible, visible.**

A GitHub App that reviews every pull request for WCAG 2.1 violations using
Claude. Lives where developers already work — no new tool to install,
no dashboard to check.

## Demo

🌐 **Live:** https://v0-mieru-bot.vercel.app
📦 **Demo repo:** https://github.com/victorgalvez56/a11y-bot-demo
🤖 **Install:** https://github.com/apps/mieru-bot

## Install (any repo)

1. Visit https://github.com/apps/mieru-bot
2. Click **Install** → choose your repos
3. Open a PR — Mieru reviews it automatically
4. Or comment `@mieru review` to trigger manually

## How it works

1. Developer opens a pull request (or comments `@mieru review`)
2. GitHub App webhook fires to `/api/github-webhook`
3. Claude analyzes the diff with a WCAG 2.1 expert prompt
4. Bot posts a structured review with severity badges, WCAG citations,
   and code suggestions

## Stack

- **v0** for landing page generation
- **Next.js 15** App Router on **Vercel**
- **AI SDK 6** with `generateText` + `Output.object()`
- **Claude** (claude-sonnet-4-5) as the reviewer
- **@octokit/app** for GitHub App authentication
- **Zod** for structured output validation

## Track

**Track 3 — Chat SDK Agents (Multiplataforma)**

Today Mieru lives in GitHub. Tomorrow it posts blocker summaries in Slack
and creates Linear issues — same codebase, multiple surfaces, via the
Chat SDK adapter pattern.

## Architecture

The bot is a single Next.js API route (`/api/github-webhook`) that:

1. Authenticates per-installation using `@octokit/app`
2. Filters PR diffs to frontend files
3. Calls Claude with a structured output schema (Zod)
4. Posts a markdown-formatted comment with severity-coded issues

No database. No queue. No cron. Stateless and serverless.

## Setup for development

Required env vars:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `GITHUB_APP_ID` | GitHub App numeric ID |
| `GITHUB_PRIVATE_KEY` | Full PEM contents of the App's private key |

Local dev:

```bash
pnpm install
pnpm dev
```

For local webhook testing, use [smee.io](https://smee.io) or `ngrok` to
forward GitHub webhooks to `localhost:3000`.

## Why "Mieru"?

見える (mieru) — Japanese verb meaning *"to be visible, to be able to be seen."*

Accessibility issues are invisible to developers without disabilities.
Mieru surfaces them.

## Roadmap

- [ ] Webhook signature verification (HMAC)
- [ ] Per-installation configuration (severity thresholds, ignored rules)
- [ ] Inline review comments on specific lines (not just PR-level)
- [ ] Chat SDK adapters for Slack, Linear, Discord
- [ ] Auto-fix mode: open PRs with the suggested code changes
- [ ] WCAG 2.2 + WCAG 3.0 draft support

## License

MIT — use it, fork it, ship it.

---

Built for **v0 Build Week 2026** · Bogotá + Lima · May 2, 2026
