# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A **Markdown-based slide system for university courses**, built on
[Slidev](https://sli.dev/). The goal is to author and maintain lecture decks as
plain Markdown so that an LLM assistant can read, diff, and edit them reliably —
replacing a previous PowerPoint (`.pptx`) workflow, where the binary format made
AI-assisted editing impractical.

Slidev was chosen over Marp for its stronger code/diagram support and its MCP
integration for AI workflows. The audience is university students; decks are in
**Spanish** (slide titles are often kept in English, matching the source plan).

## Structure

```
package.json              One shared Slidev install + per-deck run/export scripts
README.md                 Human-facing usage (run, export, LLM workflow, MCP server)
decks/
  docker/                 The "Docker / Containers" course (2 sessions × 3 h)
    session-1.md          Slidev deck — fundamentals, execution, persistence
    session-2.md          Slidev deck — bind mounts, Dockerfile, Compose  (pending)
    style.css             Shared visual theme for this course (auto-loaded by Slidev)
    images/               Screenshots / figures for this course
containers/               ORIGINAL SOURCE MATERIAL — do not modify
    Containers.pptx       Legacy PowerPoint deck
    docker_deck_table.md  The content plan / source of truth (slide-by-slide table)
```

- One Slidev install at the repo root serves every deck. Each lecture is a single
  `.md` file that Slidev is pointed at directly.
- `containers/` is the **source of truth** for content. Treat it as read-only.
- New courses go under `decks/<course>/` with their own `style.css`.

## Commands

```bash
npm run docker:s1        # live preview of Session 1 at localhost:3030 (hot reload)
npm run docker:s2        # live preview of Session 2
npm run docker:s1:pdf    # export Session 1 to PDF
```

Ad-hoc export to PNG (used to visually verify slides):

```bash
npx slidev export decks/docker/session-1.md --format png --output <dir>
```

Export requires `playwright-chromium` (already a devDependency) plus its browser
binary: `npx playwright install chromium`.

Note: Node 22.16 triggers a Slidev engine warning but works fine.

## How the styling works (important)

- A plain `<style>` block inside a slide's Markdown is **scoped to that one
  slide only** in Slidev. It does NOT go global.
- For deck-wide styling, use `decks/<course>/style.css`, which Slidev
  auto-loads. That file holds the color theme (Docker blue `#2496ED` / navy
  `#0B214A`), table/heading/blockquote styling, the diagram component classes
  (`.cmp/.stack/.layer`, `.flow/.node`), and the activity button (`.repo-btn`).
- Diagrams are built as styled HTML (divs with these classes), not ASCII art and
  not default Mermaid — the user found those too plain.

## Authoring conventions (per user feedback)

- **Clean, lightly colored look.** Use color as accent (headings, table headers,
  callouts, diagrams), not everywhere. Avoid over-decoration.
- **No click-to-reveal.** Do NOT use `<v-clicks>` / `<v-click>`; show all content
  at once.
- **Teach, don't list.** Each content slide should present the *concept* (a real
  explanation) AND a *concrete example* (usually a `bash` block with sample
  output). The source table is intentionally terse — slides need more depth.
- **Activities are link-outs.** Activity slides must NOT describe steps. They use
  the `section-slide` layout with a `.repo-btn` placeholder (`href="#"`) that the
  instructor later points at a repo containing the instructions and code. Keep
  the `<!-- TODO -->` marker on the link.
- **Diagrams** use the HTML/CSS classes in `style.css`. When a new diagram is
  needed, prefer extending those classes over inventing per-slide styles.

## Status

- Session 1: fully authored (35 slides), themed, verified via PNG export.
- Session 2: not yet converted from `containers/docker_deck_table.md`
  (31 slides — bind mounts, Dockerfile, Docker Compose).
