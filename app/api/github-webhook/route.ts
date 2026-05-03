import { App } from "@octokit/app";
import { generateText, Output } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

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

const SYSTEM = `Eres Mieru-bot 見える, un experto en accesibilidad web (WCAG 2.1 nivel AA).
Tu trabajo es analizar diffs de Pull Requests y detectar TODAS las violaciones de accesibilidad — sin excepción.

REGLA #1: SÉ EXHAUSTIVO. No pares al encontrar 3-5 issues obvios. Revisa CADA línea, CADA elemento, CADA atributo del diff. Si ves 10 violaciones, reportas las 10. Si ves 20, reportas las 20. La completitud es más importante que la brevedad.

PROCESO OBLIGATORIO — revisa cada categoría sistemáticamente, una por una:

1. IMÁGENES Y MEDIA
   - ¿Cada \`<img>\` tiene \`alt\`? (decorativo: \`alt=""\`, informativo: descripción)
   - ¿\`<picture>\`, \`<svg>\` tienen alternativas accesibles?
   - ¿\`<video>\`, \`<audio>\` tienen captions/transcripts?

2. FORM CONTROLS
   - ¿Cada \`<input>\`, \`<select>\`, \`<textarea>\` tiene \`<label>\` asociado o \`aria-label\`?
   - ¿Los \`placeholder\` no se usan COMO label (siempre necesitan label además)?
   - ¿\`<button>\` tiene texto accesible o \`aria-label\`?

3. INTERACTIVIDAD Y TECLADO
   - ¿Cada \`<div onClick>\` o \`<span onClick>\` tiene \`role\`, \`tabIndex={0}\`, Y \`onKeyDown\`?
   - ¿Los elementos con \`outline: none\` tienen estado de focus visible alternativo?
   - ¿\`<a href="#">\` con onClick deberían ser \`<button>\`?

4. SEMÁNTICA Y ESTRUCTURA
   - ¿La jerarquía de headings es correcta? (h1 → h2 → h3, no saltos)
   - ¿Hay h1 en absoluto? ¿Hay landmarks (\`<main>\`, \`<nav>\`, \`<header>\`)?
   - ¿\`<div>\` se usa donde debería ser \`<button>\`, \`<a>\`, \`<ul>\`?

5. CONTRASTE DE COLOR
   - Calcula contraste de CADA combinación de \`color\` + \`background\` que veas
   - Texto normal: ratio ≥ 4.5:1 (AA) — menos = blocker o warning
   - Texto grande (≥18pt): ratio ≥ 3:1
   - Bordes/iconos UI: ratio ≥ 3:1

6. ARIA Y SCREEN READERS
   - ¿Hay \`aria-*\` mal usados o faltantes donde se necesitan?
   - ¿\`<iframe>\` tiene \`title\`?
   - ¿Texto solo visual (iconos, decoración) tiene alternativa para screen readers?

7. INTERNACIONALIZACIÓN Y MOTION
   - ¿\`<html>\` o secciones multilingüe tienen \`lang\`?
   - ¿Animaciones (\`animation:\`, \`transition:\`) respetan \`prefers-reduced-motion\`?

Severidad:
- blocker: bloquea uso para personas con discapacidad (botón sin keyboard support, contraste <3:1, img sin alt informativo, iframe sin title)
- warning: degrada experiencia significativamente (contraste 3:1-4.5:1, jerarquía rota, label faltante en input no crítico)
- suggestion: mejora opcional (aria-label más descriptivo, prefers-reduced-motion en animación decorativa)

Para cada issue:
- Cita la regla WCAG EXACTA con número (ej: "WCAG 2.1 · 1.1.1 Non-text Content")
- Explica el IMPACTO REAL en usuarios (ej: "Lectores de pantalla anunciarán 'imagen' sin contexto, perdiendo información del producto")
- Da CÓDIGO CORREGIDO COMPLETO en code_suggestion — no descripción, código real listo para copiar

Tono: directo, técnico, accionable. Sin adornos. Sin disculpas.
Score 0-100 según qué tan accesible quedó el código del diff.
Si no hay issues, devuelve issues: [] y score: 100.

FORMATO DE TEXTO — IMPORTANTE:
- Siempre usa backticks para mencionar tags HTML, props o código inline. Ejemplo: \`<h1>\`, \`alt\`, \`tabIndex\`.
- Nunca uses tags HTML crudos (<h1>, <div>, etc.) dentro de los campos summary, problem o fix — solo dentro de code_suggestion.

RECUERDA: tu valor está en encontrar TODO. Un developer prefiere 15 issues reales que 3 issues "limpios". No te auto-censures.`;

const ReviewSchema = z.object({
  summary: z.string().describe("One paragraph summary of the review"),
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      file: z.string(),
      severity: z.enum(["blocker", "warning", "suggestion"]),
      wcag: z.string().describe("Exact WCAG rule citation"),
      problem: z.string().describe("What's wrong and impact on users"),
      fix: z.string().describe("Short description of the fix"),
      code_suggestion: z.string().describe("Complete corrected code"),
    }),
  ),
});

type Review = z.infer<typeof ReviewSchema>;

export async function POST(req: Request) {
  try {
    const event = req.headers.get("x-github-event");
    const payload = await req.json();

    // Handler 1: comment with @mieru-bot in a PR
    if (event === "issue_comment" && payload.action === "created") {
      if (!payload.issue.pull_request) {
        return Response.json({ skipped: "not a PR comment" });
      }

      const comment = payload.comment.body as string;
      if (!comment.toLowerCase().includes("@mieru-bot")) {
        return Response.json({ skipped: "no @mieru-bot mention" });
      }

      if (payload.comment.user.type === "Bot") {
        return Response.json({ skipped: "bot comment" });
      }

      const installationId = payload.installation.id;
      const octokit = await getApp().getInstallationOctokit(installationId);
      const [owner, name] = payload.repository.full_name.split("/");
      const pr_number = payload.issue.number;

      try {
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions",
          { owner, repo: name, comment_id: payload.comment.id, content: "eyes" },
        );
      } catch (e) {
        console.warn("Could not add reaction:", e);
      }

      const cmd =
        comment.toLowerCase().match(/@mieru-bot\s+(\w+)/)?.[1] || "review";

      if (cmd === "help") {
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
          {
            owner,
            repo: name,
            issue_number: pr_number,
            body: `## Mieru-bot · 見える

Hi! I review your code for accessibility issues. Here's what I can do:

- \`@mieru-bot review\` — Full WCAG 2.1 review + auto-fix PR
- \`@mieru-bot help\` — Show this message

Just mention me anywhere in this PR.`,
          },
        );
        return Response.json({ ok: true, command: "help" });
      }

      if (cmd === "review") {
        await runReview(octokit, owner, name, pr_number);
        return Response.json({ ok: true, command: "review" });
      }

      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner,
          repo: name,
          issue_number: pr_number,
          body: `Mieru-bot: I don't know the command \`${cmd}\`. Try \`@mieru-bot review\` or \`@mieru-bot help\`.`,
        },
      );
      return Response.json({ ok: true, command: "unknown" });
    }

    // Auto-review disabled — use @mieru-bot review in a PR comment to trigger manually

    return Response.json({ skipped: event });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

async function runReview(
  octokit: any,
  owner: string,
  name: string,
  pr_number: number,
) {
  // Fetch PR details for branch info
  const { data: prDetails } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}",
    { owner, repo: name, pull_number: pr_number },
  );
  const headBranch = prDetails.head.ref;
  const baseBranch = prDetails.base.ref;

  const { data: files } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    { owner, repo: name, pull_number: pr_number },
  );

  const FRONTEND_EXT = /\.(tsx?|jsx?|html|css|vue|svelte)$/;
  const frontendFiles = files.filter((f: any) => FRONTEND_EXT.test(f.filename));
  const diff = frontendFiles
    .map(
      (f: any) =>
        `### ${f.filename}\n\`\`\`diff\n${f.patch || "(no patch)"}\n\`\`\``,
    )
    .join("\n\n");

  if (!diff) {
    await octokit.request(
      "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
      {
        owner,
        repo: name,
        issue_number: pr_number,
        body: "**Mieru**: No frontend files to review in this PR.",
      },
    );
    return;
  }

  const { output: review } = await generateText({
    model: openai("gpt-4o"),
    output: Output.object({ schema: ReviewSchema }),
    system: SYSTEM,
    prompt: `Review this PR for accessibility issues:\n\n${diff}`,
  });

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

  const issuesMarkdown =
    review.issues.length === 0
      ? "✅ No accessibility issues detected."
      : review.issues
          .map(
            (i: any) => `
### ${sevEmoji[i.severity]} ${sevLabel[i.severity]} — ${i.wcag}
**File:** \`${i.file}\`

${i.problem}

**Fix:** ${i.fix}

\`\`\`tsx
${i.code_suggestion}
\`\`\`
`,
          )
          .join("\n---\n");

  console.log(`[runReview] PR #${pr_number} — score: ${review.score}, issues: ${review.issues.length}`);

  // Create fix PR if there are issues
  let fixPrUrl: string | null = null;
  if (review.issues.length > 0) {
    console.log(`[createFixPR] Starting — headBranch: ${headBranch}, baseBranch: ${baseBranch}`);
    try {
      fixPrUrl = await createFixPR(
        octokit,
        owner,
        name,
        pr_number,
        review,
        headBranch,
        baseBranch,
      );
      console.log(`[createFixPR] Done — fixPrUrl: ${fixPrUrl}`);
    } catch (e) {
      console.error("[createFixPR] FAILED:", e);
    }
  }

  const fixSection = fixPrUrl
    ? `\n\n---\n\n## 🔧 Auto-fix ready

I created **${fixPrUrl}** with all fixes applied.

**Merge that PR into \`${headBranch}\`** to apply the fixes to this PR. Then this PR is ready for \`${baseBranch}\`.`
    : "";

  const body = `## Mieru-bot review · 見える
*Making the invisible visible.*

**Score: ${review.score}/100**

${review.summary}

${issuesMarkdown}
${fixSection}

---
*Mieru 見える · Powered by GPT-4o · v0 Build Week 2026*

💬 Mention me again with \`@mieru-bot review\` after pushing fixes.`;

  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { owner, repo: name, issue_number: pr_number, body },
  );
}

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
  console.log(`[createFixPR] fix branch: ${fixBranch}`);

  // Get HEAD SHA of the PR's source branch
  const { data: headRef } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    { owner, repo, ref: `heads/${headBranch}` },
  );
  const headSha = headRef.object.sha;
  console.log(`[createFixPR] headSha: ${headSha}`);

  // Create fix branch (delete first if it already exists)
  try {
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner,
      repo,
      ref: `refs/heads/${fixBranch}`,
      sha: headSha,
    });
    console.log(`[createFixPR] branch created`);
  } catch {
    console.log(`[createFixPR] branch exists, recreating`);
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

  // Apply fixes per file
  const filesWithIssues = [...new Set(review.issues.map((i) => i.file))];
  console.log(`[createFixPR] files to fix: ${filesWithIssues.join(", ")}`);

  for (const filename of filesWithIssues) {
    const fileIssues = review.issues.filter((i) => i.file === filename);
    console.log(`[createFixPR] fixing ${filename} (${fileIssues.length} issues)`);

    try {
      const { data: fileData } = await octokit.request(
        "GET /repos/{owner}/{repo}/contents/{path}",
        { owner, repo, path: filename, ref: headBranch },
      );

      const currentContent = Buffer.from(
        (fileData as any).content,
        "base64",
      ).toString("utf-8");

      console.log(`[createFixPR] got file content for ${filename}, calling GPT-4o with ${fileIssues.length} fixes`);
      const numberedFixes = fileIssues
        .map(
          (i, idx) =>
            `### Fix ${idx + 1} of ${fileIssues.length} — ${i.wcag}\nProblem: ${i.problem}\nWhat to change: ${i.fix}\nSuggestion code:\n${i.code_suggestion}`,
        )
        .join("\n\n");

      const { text: fixedContent } = await generateText({
        model: openai("gpt-4o"),
        system: `You are an expert code editor specialized in accessibility. Your job is to apply EVERY SINGLE accessibility fix listed to the provided file.

CRITICAL RULES:
1. Apply ALL fixes — every single one numbered. Do NOT skip any.
2. Return the COMPLETE file content with all fixes applied — not a snippet.
3. Preserve ALL existing functionality, props, styles, and structure that doesn't need fixing.
4. No markdown formatting, no code fences (no \`\`\`), no explanations, no comments about what you changed.
5. Output ONLY the raw file content, ready to be saved to disk as-is.
6. If a fix conflicts with another, apply the most accessible solution.
7. Maintain the original code style (indentation, quotes, semicolons).

Verify before responding: did you apply all ${fileIssues.length} fixes? If not, apply the missing ones.`,
        prompt: `File: ${filename}

CURRENT FILE CONTENT:
${currentContent}

ACCESSIBILITY FIXES TO APPLY (apply ALL ${fileIssues.length}):

${numberedFixes}

Return the complete fixed file content. All ${fileIssues.length} fixes must be present in the output.`,
      });

      console.log(`[createFixPR] committing fix for ${filename}`);
      await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
        owner,
        repo,
        path: filename,
        message: `fix(a11y): apply WCAG fixes in ${filename}`,
        content: Buffer.from(fixedContent.trim()).toString("base64"),
        branch: fixBranch,
        sha: (fileData as any).sha,
      });
      console.log(`[createFixPR] committed ${filename} ✓`);
    } catch (e) {
      console.error(`[createFixPR] ERROR fixing ${filename}:`, e);
    }
  }

  // Open fix PR
  const issueList = review.issues
    .map((i) => `- **${i.severity.toUpperCase()}** \`${i.file}\` — ${i.wcag}: ${i.fix}`)
    .join("\n");

  const { data: pr } = await octokit.request(
    "POST /repos/{owner}/{repo}/pulls",
    {
      owner,
      repo,
      title: `fix(a11y): apply accessibility fixes to ${headBranch}`,
      body: `## Automated accessibility fixes · Mieru-bot 見える

This PR contains the WCAG 2.1 fixes for **#${pr_number}**.

### How to use this

1. Review the changes below (you can comment, request changes, or just merge)
2. **Merge this PR into \`${headBranch}\`** — the fixes flow into your original PR
3. Then merge **#${pr_number}** into \`${baseBranch}\` as you normally would

That way only **one** clean PR reaches \`${baseBranch}\` — yours, with accessibility already fixed.

### Fixes applied

${issueList}

---
*Mieru 見える · Powered by GPT-4o · v0 Build Week 2026*`,
      head: fixBranch,
      base: headBranch,
    },
  );

  return pr.html_url;
}

export async function GET() {
  return Response.json({
    status: "Mieru-bot is watching",
    name: "mieru-bot",
    kanji: "見える",
    meaning: "to be visible / to be seen",
    install: "https://github.com/apps/mieru-bot",
  });
}
