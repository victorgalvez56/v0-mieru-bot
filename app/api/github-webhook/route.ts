import { App } from "@octokit/app";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import yaml from "js-yaml";

// =============================================================================
// App initialization (lazy — env vars not available at build time)
// =============================================================================

let _app: App | null = null;
function getApp() {
  if (!_app) {
    _app = new App({
      appId: process.env.GITHUB_APP_ID!,
      privateKey: process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    });
  }
  return _app;
}

const FRONTEND_EXT = /\.(tsx?|jsx?|html|css|vue|svelte|astro)$/;
const BOT_LOGINS = ["mieru-bot", "mieru-bot[bot]"];

// Matches @mieru-bot, @mierubot, @mieru_bot, and the common typo @mieru-but
const MENTION_RE = /@mieru[-_]?b[uo]t\b|@mierubot\b/i;
function isMieruMention(text: string): boolean {
  return MENTION_RE.test(text);
}
function parseCommand(text: string): { cmd: string; arg?: string } {
  const m = text.match(/@mieru[-_]?b[uo]t\s+(\w+)(?:\s+(.+))?/i) || text.match(/@mierubot\s+(\w+)(?:\s+(.+))?/i);
  return { cmd: m?.[1]?.toLowerCase() || "review", arg: m?.[2]?.trim() };
}

// =============================================================================
// Schemas
// =============================================================================

const ReviewSchema = z.object({
  summary: z.string().describe("Two-sentence walkthrough of what changed in this PR"),
  walkthrough: z
    .array(z.string())
    .describe("3-5 bullets describing the high-impact accessibility findings"),
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      file: z.string().describe("Exact file path from the diff"),
      line: z
        .number()
        .describe("Line number in the new file where the issue starts (use the [N] markers)"),
      end_line: z
        .number()
        .nullable()
        .describe("If the issue spans multiple lines, the last line. Otherwise null."),
      severity: z.enum(["blocker", "warning", "suggestion"]),
      wcag: z.string().describe("Exact WCAG citation, e.g. 'WCAG 2.1 · 1.1.1 Non-text Content'"),
      problem: z
        .string()
        .describe("One sentence: what is wrong and impact on users with disabilities"),
      suggested_code: z
        .string()
        .describe(
          "EXACT replacement for the lines from `line` to `end_line`. Must be syntactically valid and ready to apply via GitHub suggestion block.",
        ),
      explanation: z
        .string()
        .describe("2-3 sentences for the 'why' deep-dive: who is affected and how"),
    }),
  ),
});

type Review = z.infer<typeof ReviewSchema>;
type Issue = Review["issues"][number];

const ExplainRuleSchema = z.object({
  rule: z.string(),
  what_it_means: z.string(),
  who_it_affects: z.string(),
  good_example: z.string(),
  bad_example: z.string(),
});

// =============================================================================
// System prompts
// =============================================================================

const REVIEW_SYSTEM = `You are Mieru-bot 見える, an expert in web accessibility (WCAG 2.1 level AA).
Your job is to analyze a pull request diff and find EVERY accessibility violation.

OUTPUT FORMAT — CRITICAL (READ CAREFULLY):

Inline suggestions are applied to GitHub by REPLACING lines from 'line' to 'end_line' (inclusive) with 'suggested_code'. Get this wrong and you break the developer's syntax.

The MOST COMMON mistake: identifying only the line containing the offending attribute (e.g., \`onClick=...\`) but providing a suggested_code that includes the FULL surrounding tag. This produces nested broken JSX. DO NOT DO THIS.

Correct approaches:

1. **Atomic attribute change** — when the fix is adding/changing one attribute on the same line:
   - line = end_line = the line with that attribute
   - suggested_code = the full corrected attribute line, indentation preserved
   - Example: replacing \`<img src="/x.png" />\` on line 42 → suggested_code is \`<img src="/x.png" alt="..." />\`

2. **Multi-line JSX element rewrite** — when you must change the tag itself or multiple attributes that span lines:
   - line = the line where the opening \`<\` is
   - end_line = the line where the opening tag's \`>\` closes (NOT the closing \`</tag>\`)
   - suggested_code = the COMPLETE replacement for that exact line range
   - Example: a \`<div onClick={...} style={{...}}>\` that opens on line 100 and the \`>\` closes on line 110 → set line=100, end_line=110, and provide the new \`<button onClick={...} style={{...}}>\` covering all 11 lines

3. **Whole element replacement** — when the entire element from \`<tag>\` to \`</tag>\` should change:
   - line = opening tag start, end_line = closing tag end
   - suggested_code = the complete replacement element

Verify: copy the lines from line→end_line in your head, replace them with suggested_code, and confirm the resulting file is still valid JSX/HTML. If not, expand your range.

Always preserve the original indentation level inside suggested_code.

Other rules:
- Use the exact line numbers from the file (lines starting with \`>\` are eligible for inline comments).
- end_line must be null when single-line, or a number ≥ line when multi-line.
- Always use backticks for inline code mentions (\`<h1>\`, \`alt\`, etc.) in 'problem' and 'explanation'. Never raw HTML in those fields.

RULE #1: BE EXHAUSTIVE. Don't stop at 3-5 obvious issues. Review every line, every element, every attribute. If you see 15 violations, report all 15.

RULE #2: BE SPECIFIC AND ACTIONABLE. Skip findings you can't articulate concretely. Examples of findings to NEVER report:
- "Heading doesn't function semantically as a header" (vague — either the heading level is wrong, or it isn't a heading at all; say which)
- "Interactive elements lack keyboard operability" without naming the specific element
- "Could benefit from more descriptive labels" (without proposing a specific label)
- Generic style/code-quality observations not grounded in WCAG
- Issues you'd flag only because the file looks busy

If you cannot point at the EXACT line, the EXACT element, AND a SPECIFIC fix, do not include the issue.

REQUIRED CHECKLIST — review each category systematically:

1. IMAGES & MEDIA
   - Every \`<img>\` has \`alt\` (decorative: \`alt=""\`, informative: descriptive)
   - \`<picture>\`, \`<svg>\` have accessible alternatives
   - \`<video>\`, \`<audio>\` have captions/transcripts

2. FORM CONTROLS
   - Every \`<input>\`, \`<select>\`, \`<textarea>\` has an associated \`<label>\` or \`aria-label\`
   - \`placeholder\` is NEVER used as a label substitute
   - \`<button>\` has accessible text or \`aria-label\`

3. KEYBOARD INTERACTION
   - Every \`<div onClick>\` or \`<span onClick>\` MUST have \`role\`, \`tabIndex={0}\`, AND \`onKeyDown\`
   - Elements with \`outline: none\` need an alternative visible focus state
   - \`<a href="#">\` with onClick should usually be \`<button>\`

4. SEMANTIC STRUCTURE
   - Heading hierarchy is correct (h1 → h2 → h3, no skips)
   - Page has at least one \`<h1>\` and proper landmarks (\`<main>\`, \`<nav>\`, \`<header>\`)
   - \`<div>\` is not used where \`<button>\`, \`<a>\`, \`<ul>\` should be

5. COLOR CONTRAST
   - Calculate contrast for EVERY color + background combo you see
   - Normal text needs ratio ≥ 4.5:1 (AA) — less is blocker or warning
   - Large text (≥18pt): ratio ≥ 3:1
   - UI borders/icons: ratio ≥ 3:1

6. ARIA & SCREEN READERS
   - \`aria-*\` properly used and not missing where needed
   - \`<iframe>\` has \`title\`
   - Visual-only content (icons, decoration) has screen-reader alternative

7. INTERNATIONALIZATION & MOTION
   - \`<html>\` or multilingual sections have \`lang\`
   - Animations (\`animation:\`, \`transition:\`) respect \`prefers-reduced-motion\`

SEVERITY:
- blocker: blocks usage for people with disabilities (no keyboard support, contrast <3:1, img missing informative alt, iframe without title)
- warning: significantly degrades experience (contrast 3:1-4.5:1, broken heading hierarchy, missing label on non-critical input)
- suggestion: optional improvement (more descriptive aria-label, prefers-reduced-motion on decorative animation)

Tone: direct, technical, actionable. No fluff.
Score 0-100 based on overall accessibility of the changed code.
If no issues, return issues: [] and score: 100.

Remember: your value is finding EVERYTHING. Developers prefer 15 real issues over 3 polished ones.`;

const EXPLAIN_RULE_SYSTEM = `You are an accessibility educator. Explain a WCAG rule to a developer.
Be concise, practical, and use code examples. Avoid jargon. The output is shown as a GitHub comment.`;

// =============================================================================
// Diff helpers — extract added lines with their line numbers in the new file
// =============================================================================

/**
 * Format a file for the reviewer: full file with line numbers, with a `>` gutter
 * marker on lines that were added/modified in the PR. Lines without `>` are
 * existing context — visible to the model but NOT eligible for inline comments.
 */
function formatFileForReview(
  filename: string,
  content: string | null,
  patch: string,
): string {
  if (!content) {
    return `### ${filename}\n(file content unavailable; using diff)\n\n${annotatePatchWithLineNumbers(filename, patch)}`;
  }
  const addedLines = getAddedLineSet(patch);
  const lines = content.split("\n");
  const padWidth = String(lines.length).length;
  const out: string[] = [
    `### ${filename}`,
    `(${addedLines.size} of ${lines.length} lines were added/modified — marked with > in the gutter. You may only comment on > lines.)`,
    "",
  ];
  lines.forEach((line, idx) => {
    const ln = idx + 1;
    const marker = addedLines.has(ln) ? ">" : " ";
    out.push(`${marker} ${String(ln).padStart(padWidth, " ")}: ${line}`);
  });
  return out.join("\n");
}

function annotatePatchWithLineNumbers(filename: string, patch: string): string {
  const lines = patch.split("\n");
  const out: string[] = [`### ${filename}`, ""];
  let newLine = 0;

  for (const line of lines) {
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      newLine = parseInt(hunkMatch[1], 10) - 1;
      out.push(`@@ hunk starting at line ${hunkMatch[1]} @@`);
      continue;
    }
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (line.startsWith("+")) {
      newLine++;
      out.push(`[${newLine}] + ${line.slice(1)}`);
    } else if (line.startsWith("-")) {
      out.push(`      - ${line.slice(1)}`);
    } else {
      newLine++;
      out.push(`[${newLine}]   ${line.slice(1)}`);
    }
  }
  return out.join("\n");
}

function getAddedLineSet(patch: string): Set<number> {
  const set = new Set<number>();
  let newLine = 0;
  for (const line of patch.split("\n")) {
    const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunkMatch) {
      newLine = parseInt(hunkMatch[1], 10) - 1;
      continue;
    }
    if (line.startsWith("+++") || line.startsWith("---")) continue;
    if (line.startsWith("+")) {
      newLine++;
      set.add(newLine);
    } else if (!line.startsWith("-")) {
      newLine++;
    }
  }
  return set;
}

function isAllDeletions(patch: string): boolean {
  if (!patch) return false;
  const lines = patch.split("\n");
  let hasAddition = false;
  for (const l of lines) {
    if (l.startsWith("+++")) continue;
    if (l.startsWith("+")) {
      hasAddition = true;
      break;
    }
  }
  return !hasAddition;
}

// =============================================================================
// Config (.mieru.yaml) — optional per-repo customization
// =============================================================================

type MieruConfig = {
  auto_review?: boolean;
  severity_threshold?: "blocker" | "warning" | "suggestion";
  ignore_paths?: string[];
  ignore_rules?: string[];
  auto_fix_pr?: boolean;
};

async function loadConfig(
  octokit: any,
  owner: string,
  repo: string,
  ref?: string,
): Promise<MieruConfig> {
  for (const path of [".mieru.yaml", ".mieru.yml"]) {
    try {
      const params: any = { owner, repo, path };
      if (ref) params.ref = ref;
      const { data } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        params,
      );
      const text = Buffer.from(data.content, "base64").toString("utf-8");
      return (yaml.load(text) as MieruConfig) || {};
    } catch {
      // file doesn't exist, try next
    }
  }
  return {};
}

function applyConfigFilter(issues: Issue[], config: MieruConfig): Issue[] {
  const order = { blocker: 0, warning: 1, suggestion: 2 };
  const minSev = config.severity_threshold || "suggestion";
  return issues.filter((i) => {
    if (order[i.severity] > order[minSev]) return false;
    if (config.ignore_rules?.some((r) => i.wcag.includes(r))) return false;
    if (
      config.ignore_paths?.some((p) => {
        const re = new RegExp(p.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"));
        return re.test(i.file);
      })
    )
      return false;
    return true;
  });
}

// =============================================================================
// Webhook handler
// =============================================================================

export async function POST(req: Request) {
  try {
    const event = req.headers.get("x-github-event");
    const payload = await req.json();

    // ---------- issue_comment: chat commands at PR level ----------
    if (event === "issue_comment" && payload.action === "created") {
      if (!payload.issue.pull_request) {
        return Response.json({ skipped: "not a PR comment" });
      }
      const comment = payload.comment.body as string;
      if (!isMieruMention(comment)) {
        return Response.json({ skipped: "no mention" });
      }
      if (payload.comment.user.type === "Bot") {
        return Response.json({ skipped: "bot comment" });
      }

      const installationId = payload.installation.id;
      const octokit = await getApp().getInstallationOctokit(installationId);
      const [owner, name] = payload.repository.full_name.split("/");
      const pr_number = payload.issue.number;

      // Eyes reaction immediately
      try {
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
          {
            owner,
            repo: name,
            comment_id: payload.comment.id,
            content: "eyes",
          },
        );
      } catch {}

      const { cmd, arg } = parseCommand(comment);

      console.log(`[chat] cmd=${cmd} arg=${arg ?? ""}`);

      switch (cmd) {
        case "review":
          await runReview(octokit, owner, name, pr_number);
          break;
        case "summary":
          await runReview(octokit, owner, name, pr_number, { summaryOnly: true });
          break;
        case "help":
          await postHelp(octokit, owner, name, pr_number);
          break;
        case "explain":
          await explainRule(octokit, owner, name, pr_number, arg || "WCAG 2.1");
          break;
        case "why":
        case "ignore":
          // These commands work better as inline thread replies; still respond at PR level
          await postSimpleComment(
            octokit,
            owner,
            name,
            pr_number,
            `\`@mieru-bot ${cmd}\` works best as a reply inside an inline review thread. Try replying directly to one of my line-level comments.`,
          );
          break;
        default:
          await postSimpleComment(
            octokit,
            owner,
            name,
            pr_number,
            `Unknown command \`${cmd}\`. Try \`@mieru-bot help\`.`,
          );
      }
      return Response.json({ ok: true, command: cmd });
    }

    // ---------- pull_request_review_comment: replies inside an inline thread ----------
    if (event === "pull_request_review_comment" && payload.action === "created") {
      const comment = payload.comment.body as string;
      if (!isMieruMention(comment)) {
        return Response.json({ skipped: "no mention" });
      }
      if (payload.comment.user.type === "Bot") {
        return Response.json({ skipped: "bot comment" });
      }

      const installationId = payload.installation.id;
      const octokit = await getApp().getInstallationOctokit(installationId);
      const [owner, name] = payload.repository.full_name.split("/");
      const pr_number = payload.pull_request.number;

      const { cmd } = parseCommand(comment);

      try {
        await octokit.request(
          "POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions",
          {
            owner,
            repo: name,
            comment_id: payload.comment.id,
            content: "eyes",
          },
        );
      } catch {}

      switch (cmd) {
        case "why":
        case "explain":
          await replyWhyInThread(octokit, owner, name, pr_number, payload.comment);
          break;
        case "ignore":
          await replyIgnoreInThread(octokit, owner, name, pr_number, payload.comment);
          break;
        default:
          await replyInThread(
            octokit,
            owner,
            name,
            pr_number,
            payload.comment.id,
            `Unknown command \`${cmd}\`. Try \`@mieru-bot why\` or \`@mieru-bot ignore\`.`,
          );
      }
      return Response.json({ ok: true, inline: cmd });
    }

    // ---------- pull_request: auto-review + review_requested ----------
    if (event === "pull_request") {
      const installationId = payload.installation.id;
      const octokit = await getApp().getInstallationOctokit(installationId);
      const [owner, name] = payload.repository.full_name.split("/");
      const pr_number = payload.pull_request.number;

      // Bot was assigned as a reviewer
      if (payload.action === "review_requested") {
        const requested = payload.requested_reviewer;
        if (
          requested &&
          BOT_LOGINS.some((b) => requested.login?.toLowerCase().includes(b.toLowerCase().split("[")[0]))
        ) {
          await runReview(octokit, owner, name, pr_number);
          return Response.json({ ok: true, trigger: "review_requested" });
        }
        return Response.json({ skipped: "review requested for someone else" });
      }

      // Auto-review on open / sync / reopen (default ON, opt-out via .mieru.yaml)
      if (["opened", "synchronize", "reopened"].includes(payload.action)) {
        // Skip the bot's own PRs (avoid loops on fix PRs)
        if (
          payload.pull_request.user?.type === "Bot" ||
          BOT_LOGINS.includes(payload.pull_request.user?.login)
        ) {
          return Response.json({ skipped: "PR opened by bot" });
        }

        const config = await loadConfig(
          octokit,
          owner,
          name,
          payload.pull_request.base.ref,
        );
        if (config.auto_review === false) {
          return Response.json({ skipped: "auto_review disabled in .mieru.yaml" });
        }

        await runReview(octokit, owner, name, pr_number, { auto: true });
        return Response.json({ ok: true, trigger: "auto" });
      }

      return Response.json({ skipped: payload.action });
    }

    return Response.json({ skipped: event });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

// =============================================================================
// Core review flow
// =============================================================================

async function runReview(
  octokit: any,
  owner: string,
  name: string,
  pr_number: number,
  opts: { auto?: boolean; summaryOnly?: boolean } = {},
) {
  console.log(`[runReview] PR #${pr_number} (auto=${opts.auto ?? false})`);

  const { data: prDetails } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    { owner, repo: name, pull_number: pr_number },
  );
  const headBranch = prDetails.head.ref;
  const headSha = prDetails.head.sha;
  const baseBranch = prDetails.base.ref;

  const config = await loadConfig(octokit, owner, name, baseBranch);

  const { data: files } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    { owner, repo: name, pull_number: pr_number },
  );

  // Filter to frontend files
  let frontendFiles = files.filter((f: any) => FRONTEND_EXT.test(f.filename));

  // Apply ignore_paths
  if (config.ignore_paths?.length) {
    frontendFiles = frontendFiles.filter(
      (f: any) =>
        !config.ignore_paths!.some((p) => {
          const re = new RegExp(p.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*"));
          return re.test(f.filename);
        }),
    );
  }

  // Smart skip — auto-review only: silent if nothing relevant to review
  if (frontendFiles.length === 0) {
    if (opts.auto) {
      console.log(`[runReview] silent skip — no frontend files`);
      return;
    }
    await postSimpleComment(
      octokit,
      owner,
      name,
      pr_number,
      "👁️ **Mieru-bot**: No frontend files to review.",
    );
    return;
  }

  // Smart skip — all files only have deletions (cleanup PR)
  const allDeletions = frontendFiles.every((f: any) => isAllDeletions(f.patch || ""));
  if (allDeletions) {
    if (opts.auto) {
      console.log(`[runReview] silent skip — all deletions`);
      return;
    }
    await postSimpleComment(
      octokit,
      owner,
      name,
      pr_number,
      "👁️ **Mieru-bot**: This PR only deletes code, nothing to review.",
    );
    return;
  }

  // Fetch FULL file contents for changed files (not just the diff) so the
  // model has complete context — especially for heading hierarchy, focus traps,
  // semantic structure, and contrast pairs that may span the file.
  console.log(`[runReview] fetching full content for ${frontendFiles.length} file(s)`);
  const fullFiles = await Promise.all(
    frontendFiles.map(async (f: any) => {
      try {
        const { data } = await octokit.request(
          "GET /repos/{owner}/{repo}/contents/{path}",
          { owner, repo: name, path: f.filename, ref: prDetails.head.sha },
        );
        const content = Buffer.from(
          (data as any).content,
          "base64",
        ).toString("utf-8");
        return { filename: f.filename, content, patch: f.patch || "" };
      } catch {
        return { filename: f.filename, content: null, patch: f.patch || "" };
      }
    }),
  );

  const annotated = fullFiles
    .map((f) => formatFileForReview(f.filename, f.content, f.patch))
    .join("\n\n=====\n\n");

  console.log(`[runReview] PASS 1 — initial review`);
  const { output: review } = await generateText({
    model: openai("gpt-4o"),
    output: Output.object({ schema: ReviewSchema }),
    system: REVIEW_SYSTEM,
    prompt: `Review this PR for accessibility issues.

Each file shows: (a) the full file content with line numbers, and (b) which lines were added or modified (marked with > in the gutter). You may ONLY post inline comments on lines marked with >. Use those exact line numbers in 'line' and 'end_line'.

Typical PRs of this size have 8-15 issues. If you find fewer than 5, you are likely missing some — go back and check every category in the checklist again.

${annotated}`,
  });

  console.log(`[runReview] PASS 1 found ${review.issues.length} issues`);

  // PASS 2 — Verification: ask the model what it missed.
  // This catches the "GPT got bored after 5 issues" failure mode.
  let allIssues = review.issues;
  if (review.issues.length > 0) {
    try {
      console.log(`[runReview] PASS 2 — verification`);
      const previousFindings = review.issues
        .map((i) => `- ${i.file}:${i.line} — ${i.severity.toUpperCase()} ${i.wcag}: ${i.problem}`)
        .join("\n");

      const { output: verification } = await generateText({
        model: openai("gpt-4o"),
        output: Output.object({ schema: ReviewSchema }),
        system: REVIEW_SYSTEM,
        prompt: `You already reviewed this PR and found these issues:

${previousFindings}

Now do a SECOND PASS focused on what you missed. Common things models miss:
- ALL color/background contrast pairs (every \`color:\` value, every text element)
- Every \`<div onClick>\` AND every \`<span onClick>\` (not just the obvious one)
- Heading hierarchy across the WHOLE file (h1 → h2 → h3 — count them)
- Modals/dropdowns missing \`role="dialog"\`, \`aria-modal\`, focus trap, or ESC key handler
- Animations and transitions that ignore \`prefers-reduced-motion\`
- Empty button text (icon-only buttons need \`aria-label\`)
- Form fields where \`placeholder\` is the only label

Return ONLY NEW issues you missed. Do not repeat anything from the previous list. If you genuinely missed nothing, return issues: [].

${annotated}`,
      });

      console.log(`[runReview] PASS 2 found ${verification.issues.length} additional issues`);

      // Dedupe: drop any verification issues that overlap with pass 1 (same file+line+wcag prefix)
      const seen = new Set(
        review.issues.map((i) => `${i.file}:${i.line}:${i.wcag.split("·")[1]?.trim() || i.wcag}`),
      );
      const newIssues = verification.issues.filter((i) => {
        const key = `${i.file}:${i.line}:${i.wcag.split("·")[1]?.trim() || i.wcag}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      allIssues = [...review.issues, ...newIssues];
      // Recompute score given more issues
      if (newIssues.length > 0) {
        const sevWeight = { blocker: 15, warning: 7, suggestion: 2 };
        const penalty = allIssues.reduce(
          (acc, i) => acc + (sevWeight[i.severity] || 0),
          0,
        );
        review.score = Math.max(0, 100 - penalty);
      }
    } catch (e) {
      console.warn(`[runReview] verification pass failed:`, e);
    }
  }

  review.issues = allIssues;
  console.log(`[runReview] total issues after verification: ${review.issues.length}, score ${review.score}`);

  // Filter by config
  let filteredIssues = applyConfigFilter(review.issues, config);

  // Validate issues — keep only those with valid line numbers in the diff
  const addedLinesPerFile = new Map<string, Set<number>>();
  for (const f of frontendFiles) {
    addedLinesPerFile.set(f.filename, getAddedLineSet(f.patch || ""));
  }
  filteredIssues = filteredIssues.filter((i) => {
    const set = addedLinesPerFile.get(i.file);
    if (!set) return false;
    if (!set.has(i.line)) {
      console.warn(`[runReview] dropping issue at ${i.file}:${i.line} — not in added lines`);
      return false;
    }
    return true;
  });

  console.log(`[runReview] after filtering: ${filteredIssues.length} issues`);

  await postReviewWithInlineComments(octokit, owner, name, pr_number, headSha, {
    ...review,
    issues: filteredIssues,
  });

  // Optional auto-fix PR (opt-in via .mieru.yaml)
  if (config.auto_fix_pr === true && filteredIssues.length > 0 && !opts.summaryOnly) {
    try {
      await createFixPR(
        octokit,
        owner,
        name,
        pr_number,
        { ...review, issues: filteredIssues },
        headBranch,
        baseBranch,
      );
    } catch (e) {
      console.error("createFixPR failed:", e);
    }
  }
}

// =============================================================================
// Post the GitHub review with inline suggestion comments
// =============================================================================

async function postReviewWithInlineComments(
  octokit: any,
  owner: string,
  repo: string,
  pull_number: number,
  commit_id: string,
  review: Review,
) {
  const sevEmoji: Record<string, string> = {
    blocker: "🚫",
    warning: "⚠️",
    suggestion: "💡",
  };
  const sevLabel: Record<string, string> = {
    blocker: "BLOCKER",
    warning: "WARNING",
    suggestion: "SUGGESTION",
  };

  const counts = review.issues.reduce(
    (acc, i) => {
      acc[i.severity] = (acc[i.severity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // Files breakdown table
  const byFile = review.issues.reduce(
    (acc, i) => {
      if (!acc[i.file]) acc[i.file] = { blocker: 0, warning: 0, suggestion: 0 };
      acc[i.file][i.severity]++;
      return acc;
    },
    {} as Record<string, Record<string, number>>,
  );

  const fileTable = Object.entries(byFile)
    .map(
      ([f, sev]) =>
        `| \`${f}\` | ${sev.blocker || ""} | ${sev.warning || ""} | ${sev.suggestion || ""} |`,
    )
    .join("\n");

  const countsLine = [
    counts.blocker ? `🚫 ${counts.blocker} blocker${counts.blocker > 1 ? "s" : ""}` : null,
    counts.warning ? `⚠️ ${counts.warning} warning${counts.warning > 1 ? "s" : ""}` : null,
    counts.suggestion
      ? `💡 ${counts.suggestion} suggestion${counts.suggestion > 1 ? "s" : ""}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const walkthroughBody =
    review.issues.length === 0
      ? `## 👁️ Mieru-bot review · 見える
*Making the invisible visible.*

**Score: ${review.score}/100** — ✅ no accessibility issues detected

${review.summary}

---
*Mieru-bot 見える · [Install on another repo](https://github.com/apps/mieru-bot) · [Configure with .mieru.yaml](https://github.com/apps/mieru-bot)*`
      : `## 👁️ Mieru-bot review · 見える
*Making the invisible visible.*

**Score: ${review.score}/100** — ${review.issues.length} accessibility issue${review.issues.length === 1 ? "" : "s"} found
${countsLine}

### Walkthrough

${review.summary}

${review.walkthrough.map((w) => `- ${w}`).join("\n")}

### Files reviewed

| File | 🚫 | ⚠️ | 💡 |
|------|----|----|----|
${fileTable}

---

I left **${review.issues.length} inline comment${review.issues.length === 1 ? "" : "s"}** below — each with a one-click \`Apply suggestion\` button.

💬 **Chat with me:**
- Reply \`@mieru-bot why\` on any inline comment for a deeper explanation
- Reply \`@mieru-bot ignore\` to mark a finding as a false positive
- Comment \`@mieru-bot explain WCAG 1.1.1\` to learn about a specific rule
- Comment \`@mieru-bot help\` for the full command list

---
*Mieru-bot 見える · [Install on another repo](https://github.com/apps/mieru-bot) · [Configure with .mieru.yaml](https://github.com/apps/mieru-bot)*`;

  // Build inline comments with suggestion blocks
  const comments = review.issues.map((i) => {
    const isMultiLine = i.end_line && i.end_line > i.line;
    const body = `${sevEmoji[i.severity]} **${sevLabel[i.severity]}** · ${i.wcag}

${i.problem}

\`\`\`suggestion
${i.suggested_code}
\`\`\`

<details><summary>Why this matters</summary>

${i.explanation}
</details>

*Reply \`@mieru-bot why\` for more detail or \`@mieru-bot ignore\` to skip.*`;

    const c: any = {
      path: i.file,
      line: isMultiLine ? i.end_line : i.line,
      side: "RIGHT",
      body,
    };
    if (isMultiLine) {
      c.start_line = i.line;
      c.start_side = "RIGHT";
    }
    return c;
  });

  const reviewEvent = counts.blocker ? "REQUEST_CHANGES" : "COMMENT";

  // If no inline comments, post a regular issue comment instead (no review needed)
  if (comments.length === 0) {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner,
        repo,
        issue_number: pull_number,
        body: walkthroughBody,
      },
    );
    return;
  }

  try {
    await octokit.request(
      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
      {
        owner,
        repo,
        pull_number,
        commit_id,
        event: reviewEvent,
        body: walkthroughBody,
        comments,
      },
    );
  } catch (e: any) {
    console.error("[postReview] failed:", e?.message);
    // Fallback: post just the walkthrough without inline comments
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner,
        repo,
        issue_number: pull_number,
        body:
          walkthroughBody +
          `\n\n⚠️ Could not post inline comments: \`${e?.message ?? "unknown error"}\``,
      },
    );
  }
}

// =============================================================================
// Chat: explain a WCAG rule
// =============================================================================

async function explainRule(
  octokit: any,
  owner: string,
  repo: string,
  pr_number: number,
  rule: string,
) {
  const { output } = await generateText({
    model: openai("gpt-4o"),
    output: Output.object({ schema: ExplainRuleSchema }),
    system: EXPLAIN_RULE_SYSTEM,
    prompt: `Explain the following WCAG rule to a developer: "${rule}". Include code examples and who is affected.`,
  });

  const body = `## 📚 ${output.rule}

**What it means:** ${output.what_it_means}

**Who it affects:** ${output.who_it_affects}

**❌ Bad example:**
\`\`\`tsx
${output.bad_example}
\`\`\`

**✅ Good example:**
\`\`\`tsx
${output.good_example}
\`\`\`

---
*Mieru-bot 見える · [Install](https://github.com/apps/mieru-bot)*`;

  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { owner, repo, issue_number: pr_number, body },
  );
}

// =============================================================================
// Inline thread chat: reply with "why"
// =============================================================================

async function replyWhyInThread(
  octokit: any,
  owner: string,
  repo: string,
  pr_number: number,
  comment: any,
) {
  // Fetch the parent comment (the original mieru-bot inline comment)
  let parentBody = "";
  if (comment.in_reply_to_id) {
    try {
      const { data: parent } = await octokit.request(
        "GET /repos/{owner}/{repo}/pulls/comments/{comment_id}",
        { owner, repo, comment_id: comment.in_reply_to_id },
      );
      parentBody = parent.body || "";
    } catch {}
  }

  // Fetch surrounding code for context
  let codeContext = "";
  try {
    const { data: file } = await octokit.request(
      "GET /repos/{owner}/{repo}/contents/{path}",
      { owner, repo, path: comment.path, ref: comment.commit_id || "HEAD" },
    );
    const content = Buffer.from((file as any).content, "base64").toString("utf-8");
    const allLines = content.split("\n");
    const start = Math.max(0, (comment.line || 1) - 5);
    const end = Math.min(allLines.length, (comment.line || 1) + 5);
    codeContext = allLines
      .slice(start, end)
      .map((l, idx) => `${start + idx + 1}: ${l}`)
      .join("\n");
  } catch {}

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are Mieru-bot, an accessibility expert. A developer is asking for a deeper explanation of an accessibility issue you flagged. Reply in 3-4 sentences. Be specific about the user impact (screen reader users, keyboard users, low vision users, cognitive disabilities). Use markdown. Sign off with: \`— Mieru 見える\`.`,
    prompt: `Original finding I posted:\n${parentBody}\n\nSurrounding code (line ${comment.line} is the issue):\n\`\`\`\n${codeContext}\n\`\`\`\n\nThe developer asked: ${comment.body}\n\nRespond with a deeper explanation.`,
  });

  await replyInThread(octokit, owner, repo, pr_number, comment.id, text);
}

// =============================================================================
// Inline thread chat: reply with ignore guidance
// =============================================================================

async function replyIgnoreInThread(
  octokit: any,
  owner: string,
  repo: string,
  pr_number: number,
  comment: any,
) {
  const body = `Got it — to permanently ignore this finding, you have a few options:

1. **One-line ignore:** add \`{/* mieru-ignore */}\` directly above the line in code.
2. **Repo-wide rule ignore:** add the WCAG number to your \`.mieru.yaml\`:
   \`\`\`yaml
   ignore_rules:
     - "WCAG 1.4.3"  # color contrast
   \`\`\`
3. **Path ignore:** if this whole file should be skipped:
   \`\`\`yaml
   ignore_paths:
     - "${comment.path}"
   \`\`\`

I'll respect any of these on the next review.

— Mieru 見える`;

  await replyInThread(octokit, owner, repo, pr_number, comment.id, body);
}

async function replyInThread(
  octokit: any,
  owner: string,
  repo: string,
  pull_number: number,
  in_reply_to: number,
  body: string,
) {
  await octokit.request(
    "POST /repos/{owner}/{repo}/pulls/{pull_number}/comments",
    {
      owner,
      repo,
      pull_number,
      body,
      in_reply_to,
    },
  );
}

// =============================================================================
// Help, simple comment
// =============================================================================

async function postHelp(
  octokit: any,
  owner: string,
  repo: string,
  pr_number: number,
) {
  const body = `## 👁️ Mieru-bot · 見える

I review every PR for WCAG 2.1 accessibility issues and leave inline suggestions you can apply with one click.

### How to use me

| Where | Command | What it does |
|---|---|---|
| PR comment | _(nothing — automatic)_ | I review every PR I'm installed on, no command needed |
| PR comment | \`@mieru-bot review\` | Re-run the review (e.g. after pushing fixes) |
| PR comment | \`@mieru-bot summary\` | Walkthrough only, no inline comments |
| PR comment | \`@mieru-bot explain <wcag-rule>\` | Learn about a specific WCAG rule with examples |
| PR comment | \`@mieru-bot help\` | Show this message |
| Inline thread | \`@mieru-bot why\` | Deeper explanation of a flagged issue |
| Inline thread | \`@mieru-bot ignore\` | Show how to mark this as a false positive |

### Or assign me as a reviewer

In the **Reviewers** sidebar, type \`mieru-bot\` and assign me. I'll review on demand.

### Customize per repo (optional)

Drop a \`.mieru.yaml\` at the root of your repo:

\`\`\`yaml
auto_review: true                # default true — set false to disable auto-review
severity_threshold: warning      # only show blockers and warnings, hide suggestions
ignore_paths:
  - "**/*.test.tsx"
  - "components/legacy/**"
ignore_rules:
  - "WCAG 1.4.3"                 # skip color contrast — handled by design system
auto_fix_pr: false               # set true to also open a PR with all fixes applied
\`\`\`

---
*Mieru 見える · [Install](https://github.com/apps/mieru-bot)*`;

  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { owner, repo, issue_number: pr_number, body },
  );
}

async function postSimpleComment(
  octokit: any,
  owner: string,
  repo: string,
  pr_number: number,
  body: string,
) {
  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { owner, repo, issue_number: pr_number, body },
  );
}

// =============================================================================
// Auto-fix PR (opt-in via .mieru.yaml — kept for fallback)
// =============================================================================

async function createFixPR(
  octokit: any,
  owner: string,
  repo: string,
  pr_number: number,
  review: Review,
  headBranch: string,
  baseBranch: string,
): Promise<string> {
  const fixBranch = `mieru/fix-pr-${pr_number}`;

  const { data: headRef } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    { owner, repo, ref: `heads/${headBranch}` },
  );
  const headSha = headRef.object.sha;

  try {
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      ref: `refs/heads/${fixBranch}`,
      sha: headSha,
    });
  } catch {
    await octokit.request("DELETE /repos/{owner}/{repo}/git/refs/{ref}", {
      owner,
      repo,
      ref: `heads/${fixBranch}`,
    });
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      ref: `refs/heads/${fixBranch}`,
      sha: headSha,
    });
  }

  const filesWithIssues = [...new Set(review.issues.map((i) => i.file))];

  for (const filename of filesWithIssues) {
    const fileIssues = review.issues.filter((i) => i.file === filename);
    try {
      const { data: fileData } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        { owner, repo, path: filename, ref: headBranch },
      );
      let workingContent = Buffer.from(
        (fileData as any).content,
        "base64",
      ).toString("utf-8");

      // Detect if file is a Next.js Client Component ("use client" directive)
      const isClientComponent =
        /^[\s\S]{0,200}["']use client["'];?/m.test(workingContent);

      // Apply each fix sequentially
      for (let idx = 0; idx < fileIssues.length; idx++) {
        const issue = fileIssues[idx];
        const { text } = await generateText({
          model: openai("gpt-4o"),
          system: `You are a precise code editor working on a Next.js codebase. Apply ONE accessibility fix to a file. Return ONLY the complete file content with the fix applied — no markdown fences, no explanations.

CRITICAL CORRECTNESS RULES (violations break the build or hurt accessibility):

1. NEVER add \`<style jsx>\` or \`<style jsx global>\`. They are styled-jsx, which only works in Client Components and breaks Server Components at build time. For CSS changes, edit a .css file or add a Tailwind class instead.

2. NEVER introduce client-only React APIs (useState, useEffect, useRef, useContext, useMemo, useCallback, event handlers other than form actions, browser globals like \`window\` or \`document\` or \`matchMedia\`) into a file that does NOT start with \`"use client"\`. The current file ${isClientComponent ? "IS" : "is NOT"} a Client Component. ${isClientComponent ? "" : "If the fix would require client APIs, prefer a CSS-only solution (Tailwind motion-reduce: variant, @media query in a CSS file, etc.)."}

3. NEVER add ARIA roles you can't verify are correct in context:
   - \`role="menuitem"\` only works inside a parent with \`role="menu"\` or \`role="menubar"\`. Don't add it to plain links.
   - \`role="button"\` only on elements that don't already act as buttons (don't add to \`<button>\` itself).
   - \`role="dialog"\` requires \`aria-modal\` and a label.
   - When in doubt, use the right HTML element (\`<button>\`, \`<nav>\`, \`<main>\`) instead of an ARIA role.

4. For \`prefers-reduced-motion\` fixes, prefer in this order:
   a) Tailwind's \`motion-reduce:\` variant (e.g. \`motion-reduce:transition-none motion-reduce:animate-none\`)
   b) A CSS \`@media (prefers-reduced-motion: reduce) { ... }\` block in an existing .css file
   c) Only if (a) and (b) impossible AND file is already a Client Component, use \`window.matchMedia("(prefers-reduced-motion: reduce)").matches\` inside a useEffect

5. NEVER convert a \`<div>\` to \`<button>\` if the surrounding code shows it has children that include block-level elements (\`<div>\`, \`<p>\`, \`<h1>\`-\`<h6>\`, \`<section>\`, etc.) — that produces invalid HTML. Add \`role="button"\`, \`tabIndex={0}\`, and \`onKeyDown\` instead.

6. Preserve every other line, prop, style, and import exactly as-is. Maintain original code style (indentation, quotes, semicolons, JSX formatting).

7. If the suggested replacement would clearly conflict with rules 1-5, apply a SAFER variant of the same fix. If no safe fix exists, return the file UNCHANGED.

Return only the raw file content, ready to be saved to disk.`,
          prompt: `File: ${filename}\nFile is a ${isClientComponent ? "Client" : "Server"} Component.\n\nCURRENT:\n${workingContent}\n\nFIX TO APPLY:\n- WCAG: ${issue.wcag}\n- Problem: ${issue.problem}\n- Replacement code for line ${issue.line}${issue.end_line ? `-${issue.end_line}` : ""}:\n${issue.suggested_code}\n\nReturn the complete updated file. Verify the fix obeys the critical rules above.`,
        });
        workingContent = text.trim();
        if (workingContent.startsWith("```")) {
          workingContent = workingContent
            .replace(/^```[a-z]*\n/, "")
            .replace(/\n```\s*$/, "");
        }
      }

      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: filename,
        message: `fix(a11y): apply ${fileIssues.length} WCAG fix(es) in ${filename}`,
        content: Buffer.from(workingContent).toString("base64"),
        branch: fixBranch,
        sha: (fileData as any).sha,
      });
    } catch (e) {
      console.error(`[createFixPR] failed on ${filename}:`, e);
    }
  }

  const issueList = review.issues
    .map((i) => `- **${i.severity.toUpperCase()}** \`${i.file}:${i.line}\` — ${i.wcag}`)
    .join("\n");

  const { data: pr } = await octokit.request(
    "POST /repos/{owner}/{repo}/pulls",
    {
      owner,
      repo,
      title: `fix(a11y): apply accessibility fixes to ${headBranch}`,
      body: `## Automated accessibility fixes · Mieru-bot 見える

Stacked fixes for **#${pr_number}**.

**Merge this PR into \`${headBranch}\`** to apply the fixes to your original PR. Then merge **#${pr_number}** into \`${baseBranch}\` as usual.

### Fixes

${issueList}

---
*Mieru 見える · [Install](https://github.com/apps/mieru-bot)*`,
      head: fixBranch,
      base: headBranch,
    },
  );

  return pr.html_url;
}

// =============================================================================
// GET — health check
// =============================================================================

export async function GET() {
  return Response.json({
    status: "Mieru-bot is watching",
    name: "mieru-bot",
    kanji: "見える",
    meaning: "to be visible / to be seen",
    install: "https://github.com/apps/mieru-bot",
    features: [
      "Auto-review on every PR",
      "Inline suggestions with one-click apply",
      "Walkthrough summary at PR top",
      "Chat with @mieru-bot why / explain / ignore",
      "Assignable as a PR reviewer",
      "Optional .mieru.yaml config",
    ],
  });
}
