# Content gaps

Per-page status for the Klaritics docs. Updated 2026-10-01 after the second PRD pass.

**Rule:** do not deepen, add specifics to, or cite an unverified page. Get the product detail first, then rewrite.

---

## Verified

Written against the real product or a PRD. Safe to edit and cite.

| Page | Source |
| --- | --- |
| `analysis/chart-analysis.mdx` | Product |
| `analysis/funnels.mdx` | Product |
| `analysis/engagement-matrix.mdx` | Product |
| `analysis/impact-analysis.mdx` | Product |
| `analysis/stickiness.mdx` | Stickiness PRD, incl. all 14 formula images |
| `analysis/user-sessions.mdx` | User Sessions PRD |
| `analysis/pivot-tables.mdx` | Pivot Table PRD |
| `data/event-taxonomy.mdx` | Product |
| `data/real-time-events.mdx` | Product |
| `data/real-time-users.mdx` | Product |
| `dashboards/permissions.mdx` | Dashboard & Chart Management PRD |
| `dashboards/sharing.mdx` | Dashboard & Chart Management PRD |
| `charts/*.mdx` (3) | Dashboard & Chart Management PRD |
| `dashboards/overview.mdx`, `create-dashboard.mdx`, `manage-dashboards.mdx` | Dashboard & Chart Management PRD |
| `settings/roles.mdx` | IAM PRD |
| `settings/users.mdx` | IAM PRD |
| `product-analytics/*.mdx` (5) | Product Analytics Dashboards PRD |
| `templates/*.mdx` (5) | Dashboard Templates PRD |
| `sdk/*.mdx` | Product |

---

## Open questions from the PRDs

These are specific things the PRDs name but do not define. Each one is a place where content was deliberately left thin rather than invented.

### Stickiness — "Change Over Time"

The Stickiness PRD §8 says the **Shown as** dropdown has two options, Stickiness and Change Over Time, with Stickiness as the default. Change Over Time is never defined anywhere else in the document — no calculation, no visualization, no example.

`analysis/stickiness.mdx` currently notes that the option exists and nothing more. **Needed:** what Change Over Time computes and how it renders.

### Create Chart or Dashboard — category contents

**Resolved.** The three categories are:

1. **Behavior Analytics** — Funnels, Retention, User Paths *(not released)*, Pivot Tables, User Sessions, Stickiness, Engagement Matrix, Compass *(not released)*, Impact Analysis
2. **Charts** — Line, Stacked Line, Bar, Stacked Bar, Pie, Metric, Column, Stacked Column. This category is Chart Analysis; the eight entries are its visualization types, documented in `analysis/chart-analysis.mdx`.
3. **Default Templates** — Flow Analysis, Feature Adoption, Product KPIs, User Activity

Navigation mirrors this. There is no separate page per chart visualization type, since they are options within Chart Analysis rather than distinct analyses.


### IAM PRD gaps

- §3 refers to "the sheet with all the permissions associated with each role" — **the permissions matrix sheet was not provided.** `settings/roles.mdx` describes the four default roles at the level the PRD gives, with no per-permission detail.
- §9 states the platform "supports two possible resolution strategies" for conflicting inherited roles, then defines only Option 1 (Most Permissive). **Option 2 is missing.**
- Section numbering jumps from 5 to 8, and the custom role flow jumps from Step 3 to Step 5. Content for the missing sections may exist elsewhere.

### Dashboard & Chart Management PRD contradiction

§3.1 and §28 state Editor has no create permission; §24 Acceptance Criteria states Full Access **or Editor** can create a dashboard. Documented as **Editor cannot create**, per your decision. The PRD itself should be reconciled.

### Product Analytics PRD

The summary table lists five dashboards including Flow Analysis, but the intro says "four distinct dashboards" and the body details only four. Flow Analysis is documented as its own template instead. **Confirm** whether Flow Analysis also appears inside Product Analytics.

---

## Unverified pages

Generated content with no PRD behind it. Every specific is an assumption.

### `deployment/self-hosted.mdx` — highest priority

The install path for a self-hosted product in 57 lines, with no installable detail. "You will receive deployment artifacts and configuration guidance as part of your setup package" stands in for the entire procedure.

Needed: container images and registry, a real compose/Helm manifest, system requirements, datastore dependencies and versions, ports and TLS expectations, where `project_id` and `server_host` come from after install, and the upgrade/rollback procedure.

### `settings/alerts.mdx`

Claims three condition types and hedges Step 5 with "if available". No PRD. Needed: real condition types and operators, notification channels, whether recipients are users/roles/addresses, evaluation frequency, alert history.

### `settings/third-party-cohorts.mdx`

Describes connecting an external source and syncing on a schedule, with imported cohorts read-only. **No third-party system is ever named.** Needed: which integrations exist, how auth is configured, real sync mechanism and cadence.


### `analysis/retention.mdx`, `analysis/cohorts.mdx`

Both give a confident step-by-step build flow that was never observed. Compare either against `analysis/funnels.mdx` or `analysis/stickiness.mdx` for the depth difference. Retention in particular claims day/week/month cohort granularity, and is referenced by the Product Analytics and Feature Adoption pages, which makes getting it right more urgent.

---

## Undocumented product surfaces

Present in the UI screenshot, absent from the docs, with no PRD:

- **Warehouse** (Settings) — nothing is known about it
- **User Settings** (Settings)
- **Overview** — the project-level page. Its chart-permission behavior is documented in `dashboards/sharing.mdx`, but the page itself is not.

---

## Not shipped

Held deliberately. Do not write pages for these until they ship.

- **Session Engagement** — a complete template PRD exists (5 charts, User Sessions measures), but the feature is not in v1.0.0. The PRD is ready to turn into a page when it ships.
- **User Paths** (previously documented as "User Flows") — page deleted; `/analysis/user-flows` now redirects to Funnels. Listed as roadmap in `release-notes.mdx`. It belongs to the Behavior Analytics category when it ships.
- **Compass** — belongs to Behavior Analytics when it ships. Roadmap, no PRD.
- **Session Replays** — roadmap, no PRD.

---

## Cross-cutting

### No screenshots anywhere

Zero `<Frame>`, `<img>`, or `![]()` across all 46 pages. `images/image.png` is orphaned.

This costs most on pages describing visual output: the Engagement Matrix quadrant chart, funnel visualizations, the Impact Analysis Day 0 reference line, the Stickiness distribution curve, and every Product Analytics dashboard. The template pages in particular name exact chart labels and titles that a reader cannot match to anything.

### KMP missing from the v1.0.0 release notes

`sdk/kmp.mdx` is a complete guide and `sdk/overview.mdx` lists Kotlin Multiplatform among supported SDKs, but `release-notes.mdx` still says SDKs are available for "Web, Android, iOS, React Native, and Flutter". Whether KMP shipped in v1.0.0 is a version fact still to be confirmed.

### No API or data-model reference

The site documents the UI and client SDKs. There is no reference for an ingestion API, query API, export API, or the event/property data model.
