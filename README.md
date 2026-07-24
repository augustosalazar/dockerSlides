# Course slides (Slidev)

Markdown-based slide decks for university courses. Each deck is plain Markdown,
so an LLM assistant can read, diff, and edit it reliably — unlike `.pptx`.

## Structure

```
decks/<course>/<session>.md   ← the slides (one file per session)
decks/<course>/images/        ← screenshots and figures for that course
containers/                   ← original source material (pptx + planning table)
```

`containers/` holds the *source of truth* for the content plan
(`docker_deck_table.md`) and the legacy PowerPoint. The files under `decks/`
are the generated, presentable product.

## Run a deck (live, hot-reloading)

```bash
npm run docker:s1     # opens Session 1 at http://localhost:3030
npm run docker:s2     # Session 2
```

Edit the `.md` file and the browser updates instantly. Press `e` in the
browser to edit slide text in place; use arrow keys to navigate.

## Export to PDF

```bash
npm run docker:s1:pdf
```

(First PDF export downloads a headless Chromium via Playwright.)

## Export to PowerPoint

For colleagues who need `.pptx`:

```bash
npx slidev export decks/docker/session-1.md --format pptx
```

## Working with an LLM assistant

1. Open the deck's `.md` file.
2. Ask for changes in plain language — "make slide 15 a two-column layout",
   "add a mermaid diagram of the build→run cycle", "tighten the wording on the
   volumes slides".
3. Keep `npm run docker:s1` running to see edits live.

### Slidev MCP server (optional, more integrated)

Slidev ships an MCP server so an assistant can create and preview slides
through tool calls instead of raw file edits. See
<https://sli.dev/guide/work-with-ai>. Add it to your Claude Code MCP config
when you want the assistant to drive the preview directly.

## Slidev features used in these decks

- Fenced code blocks with syntax highlighting
- ` ```mermaid ` diagrams (architecture, flows) rendered from text
- `layout: two-cols`, `layout: center` for structure
- `<v-clicks>` for step-by-step bullet reveals
- UnoCSS utility classes for quick layout tweaks

Docs: <https://sli.dev/>
