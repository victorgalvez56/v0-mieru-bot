import { Octokit } from "@octokit/rest";
import { generateText, Output } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { z } from "zod";

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const SYSTEM = `Eres un experto en accesibilidad web (WCAG 2.1 AA).
Analizas diffs de PRs y detectas violaciones de accesibilidad.

Revisas:
- Alt text en imágenes
- Labels en form controls
- ARIA roles/states/properties incorrectos o faltantes
- Contraste de colores (estima desde el CSS)
- Navegación por teclado (tabindex, onKeyDown faltante en handlers)
- Semántica HTML (jerarquía de headings, landmarks, listas)
- onClick en divs/spans sin equivalente de teclado
- Lang attributes faltantes
- Texto solo visual sin alternativa para screen readers

Severidad:
- blocker: bloquea uso para personas con discapacidad
- warning: degrada experiencia significativamente  
- suggestion: mejora opcional

Sé directo, técnico, accionable. Cita la regla WCAG exacta.
Score 0-100 según qué tan accesible está el código.`;

const ReviewSchema = z.object({
  summary: z.string(),
  score: z.number().min(0).max(100),
  issues: z.array(
    z.object({
      file: z.string(),
      severity: z.enum(["blocker", "warning", "suggestion"]),
      wcag: z.string(),
      problem: z.string(),
      fix: z.string(),
      code_suggestion: z.string(),
    }),
  ),
});

export async function POST(req: Request) {
  try {
    const event = req.headers.get("x-github-event");
    const payload = await req.json();

    if (event !== "pull_request") return Response.json({ skipped: "not a PR" });
    if (!["opened", "synchronize", "reopened"].includes(payload.action)) {
      return Response.json({ skipped: payload.action });
    }

    const [owner, name] = payload.repository.full_name.split("/");
    const pr_number = payload.pull_request.number;

    const { data: files } = await octokit.pulls.listFiles({
      owner,
      repo: name,
      pull_number: pr_number,
    });

    const diff = files
      .filter((f) => /\.(tsx?|jsx?|html|css|vue|svelte)$/.test(f.filename))
      .map((f) => `### ${f.filename}\n\`\`\`diff\n${f.patch || ""}\n\`\`\``)
      .join("\n\n");

    if (!diff) {
      await octokit.issues.createComment({
        owner,
        repo: name,
        issue_number: pr_number,
        body: "**Mieru-bot**: No frontend files changed. Skipping review.",
      });
      return Response.json({ ok: true, skipped: "no frontend files" });
    }

    const { output: review } = await generateText({
      model: anthropic("claude-sonnet-4-5"),
      output: Output.object({ schema: ReviewSchema }),
      system: SYSTEM,
      prompt: `Review this PR for accessibility issues:\n\n${diff}`,
    });

    const sevEmoji = { blocker: "🚫", warning: "⚠️", suggestion: "💡" };
    const sevLabel = {
      blocker: "BLOCKER",
      warning: "WARNING",
      suggestion: "SUGGESTION",
    };

    const body = `## Mieru-bot review · 見える

*Making the invisible visible.*

**Score: ${review.score}/100**

${review.summary}

${
  review.issues.length === 0
    ? "✅ No accessibility issues detected."
    : review.issues
        .map(
          (i) => `
### ${sevEmoji[i.severity]} ${sevLabel[i.severity]} — ${i.wcag}
**File:** \`${i.file}\`

${i.problem}

**Fix:** ${i.fix}

\`\`\`tsx
${i.code_suggestion}
\`\`\`
`,
        )
        .join("\n---\n")
}

---
*Mieru 見える · Powered by Claude · v0 Build Week 2026*`;

    await octokit.issues.createComment({
      owner,
      repo: name,
      issue_number: pr_number,
      body,
    });

    return Response.json({ ok: true, issues: review.issues.length });
  } catch (err: any) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    status: "Mieru-bot is watching",
    name: "mieru-bot",
    kanji: "見える",
    meaning: "to be visible / to be seen"
  });
}
