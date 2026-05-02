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
Tu trabajo es analizar diffs de Pull Requests y detectar violaciones de accesibilidad.

Categorías que revisas:
- Alt text en imágenes (<img>, <picture>, SVG decorativo vs informativo)
- Labels en form controls (<input>, <select>, <textarea>, <button>)
- ARIA roles, states y properties (aplicados correctamente o faltantes)
- Contraste de colores (estima desde valores hex/rgb del CSS o style)
- Navegación por teclado (tabindex, focus visible, onKeyDown faltante)
- Semántica HTML (jerarquía h1-h6, landmarks, listas, botones vs divs)
- onClick en divs/spans sin equivalente de teclado
- Lang attributes faltantes en <html> o secciones multiidioma
- Texto solo visual sin alternativa para screen readers
- Animaciones sin prefers-reduced-motion
- Iframes sin title

Severidad:
- blocker: bloquea uso para personas con discapacidad (ej: botón sin keyboard support, contraste <3:1)
- warning: degrada experiencia significativamente (ej: contraste 3:1-4.5:1, jerarquía de headings rota)
- suggestion: mejora opcional (ej: aria-label más descriptivo, texto alternativo más rico)

Para cada issue:
- Cita la regla WCAG exacta (ej: "WCAG 2.1 · 1.1.1 Non-text Content")
- Explica el impacto real en usuarios (ej: "Lectores de pantalla anunciarán 'imagen' sin contexto")
- Da código corregido completo en code_suggestion (no descripción genérica)

Tono: directo, técnico, accionable. Sin adornos. Sin disculpas.
Score 0-100 según qué tan accesible quedó el código del diff.
Si no hay issues, devuelve issues: [] y score: 100.`;

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

export async function POST(req: Request) {
  try {
    console.log("ENV CHECK — GITHUB_APP_ID:", process.env.GITHUB_APP_ID ?? "UNDEFINED");
    console.log("ENV CHECK — GITHUB_PRIVATE_KEY:", process.env.GITHUB_PRIVATE_KEY ? "SET" : "UNDEFINED");
    console.log("ENV CHECK — OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "SET" : "UNDEFINED");

    const event = req.headers.get("x-github-event");
    const payload = await req.json();

    // Handler 1: comment with @mieru in a PR
    if (event === "issue_comment" && payload.action === "created") {
      if (!payload.issue.pull_request) {
        return Response.json({ skipped: "not a PR comment" });
      }

      const comment = payload.comment.body as string;
      if (!comment.toLowerCase().includes("@mieru")) {
        return Response.json({ skipped: "no @mieru mention" });
      }

      // Avoid loops: ignore bot's own comments
      if (payload.comment.user.type === "Bot") {
        return Response.json({ skipped: "bot comment" });
      }

      const installationId = payload.installation.id;
      const octokit = await getApp().getInstallationOctokit(installationId);
      const [owner, name] = payload.repository.full_name.split("/");
      const pr_number = payload.issue.number;

      // Immediate 👀 reaction as feedback
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
      } catch (e) {
        console.warn("Could not add reaction:", e);
      }

      const cmd =
        comment.toLowerCase().match(/@mieru\s+(\w+)/)?.[1] || "review";

      if (cmd === "help") {
        await octokit.request(
          "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
          {
            owner,
            repo: name,
            issue_number: pr_number,
            body: `## Mieru-bot · 見える

Hi! I review your code for accessibility issues. Here's what I can do:

- \`@mieru review\` — Full WCAG 2.1 review of this PR
- \`@mieru help\` — Show this message

Just mention me anywhere in this PR.`,
          },
        );
        return Response.json({ ok: true, command: "help" });
      }

      if (cmd === "review") {
        await runReview(octokit, owner, name, pr_number);
        return Response.json({ ok: true, command: "review" });
      }

      // Unknown command
      await octokit.request(
        "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
        {
          owner,
          repo: name,
          issue_number: pr_number,
          body: `Mieru-bot: I don't know the command \`${cmd}\`. Try \`@mieru review\` or \`@mieru help\`.`,
        },
      );
      return Response.json({ ok: true, command: "unknown" });
    }

    // Handler 2: PR opened/updated/reopened → auto review
    if (
      event === "pull_request" &&
      ["opened", "synchronize", "reopened"].includes(payload.action)
    ) {
      const installationId = payload.installation.id;
      const octokit = await getApp().getInstallationOctokit(installationId);
      const [owner, name] = payload.repository.full_name.split("/");

      await runReview(octokit, owner, name, payload.pull_request.number);
      return Response.json({ ok: true, auto: true });
    }

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
  const { data: files } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    { owner, repo: name, pull_number: pr_number },
  );

  const FRONTEND_EXT = /\.(tsx?|jsx?|html|css|vue|svelte)$/;
  const diff = files
    .filter((f: any) => FRONTEND_EXT.test(f.filename))
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

  const body = `## Mieru-bot review · 見える
*Making the invisible visible.*

**Score: ${review.score}/100**

${review.summary}

${issuesMarkdown}

---
*Mieru 見える · Powered by GPT-4o · v0 Build Week 2026*

💬 Mention me again with \`@mieru review\` after pushing fixes.`;

  await octokit.request(
    "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
    { owner, repo: name, issue_number: pr_number, body },
  );
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
