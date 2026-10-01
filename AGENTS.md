# Documentation project instructions

## About this project

- Product guides for **Klaritics**, a self-hosted product analytics platform by Deepta AI
- Built on [Mintlify](https://mintlify.com). Pages are MDX files with YAML frontmatter
- Configuration lives in `docs.json` — navigation, redirects, theme, and branding
- **Pushing to `main` deploys to production.** Work on a branch and preview with `mint dev` first
- Use the Mintlify MCP server, `https://mcp.mintlify.com`, to edit content and settings via MCP
- Use the Mintlify docs MCP server, `https://www.mintlify.com/docs/mcp`, to query information about using Mintlify via MCP

## Terminology

Get these right — the docs have been inconsistent about them before.

| Use | Not | Note |
| --- | --- | --- |
| Chart Analysis | Insights | Same module. "Insights" was an earlier internal name and must not appear in the docs |
| chart | widget, card, tile | A saved analysis. "Widget" is not a product term — the UI says Saved Charts, Chart Listing, Create Chart |
| `project_id` | `app_id` | The credential every SDK initializes with |
| `server_host` | endpoint, base URL | The URL of the customer's self-hosted instance |
| saved dashboard | board, report | A collection of pinned charts |
| module | section, feature area | A top-level product area (Product Analytics, Data, Templates, …) |
| cohort | segment, audience | A named group of users. Note "segment" *is* a distinct concept in Product Analytics dashboards |
| Full Access / Editor / Viewer | admin, owner | The three dashboard and chart permission levels |
| Settings → Users & Permissions | Access Control | Where roles and users live. The IAM PRD's "Access Control" path is outdated |
| self-hosted | on-prem, on-premise | Klaritics only ships self-hosted |

Module names are title case when naming the product feature (Event Taxonomy, Engagement Matrix). Lowercase when used generically ("build a chart analysis", "the funnel shows…").

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- **Never use a body `#` heading.** Mintlify renders the frontmatter `title` as the page `<h1>`. Body content starts at `##`
- Never skip heading levels (`##` → `####`)
- Every page needs `title`, `sidebarTitle`, and `description` in frontmatter. `description` is the SEO meta tag and the search-result snippet — write a real sentence, not a keyword list
- Internal links are absolute, extension-less, and match the file path: `/analysis/funnels`
- When you move or rename a page, add a `redirects` entry in `docs.json`

## Content boundaries

**Do not invent product behavior.** A large share of this site was originally generated from inference rather than from the product, and correcting that is ongoing work. See `CONTENT-GAPS.md` for the current status of every page.

Source PRDs live in `PRDs/` (gitignored from Mintlify). When a PRD names a feature but does not define it — the Stickiness "Change Over Time" option is the current example — say the option exists and stop there. Do not fill the gap by inference; add it to `CONTENT-GAPS.md` instead.

- Pages listed as **verified** in `CONTENT-GAPS.md` were written against the real product. Edit them freely
- Pages listed as **unverified** are placeholder-quality. Do not deepen them, add specifics to them, or cite them as a source of truth. If asked to improve one, ask for the underlying product detail first
- Do not describe UI labels, menu paths, default values, limits, or pricing you have not been shown
- Do not document modules absent from the current release. `release-notes.mdx` is authoritative on what shipped
- Do not document internal admin or debug tooling

## Before committing

Run these from the repo root:

- `node -e "JSON.parse(require('fs').readFileSync('docs.json'))"` — `docs.json` stays valid
- Confirm every internal link target resolves to a file, and every page appears in `docs.json` navigation exactly once
- Confirm no page has a body `#` heading or a skipped heading level
- `mint dev` and load the affected pages
