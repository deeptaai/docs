# Content gaps

Per-page status for the Klaritics docs. Updated 2026-10-01 after the second PRD pass and the follow-up clarifications.

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
| `sdk/*.mdx` | Product. Restructured to the KMP layout; awaiting SDK-team review — see below |
| `integrations/external-api.mdx` | External API guide |

---

## PRD decisions and open questions

Things the PRDs name but do not define. Most are now decided; the record is kept so the reasoning survives, and so nobody re-fills a gap that was closed deliberately.

### Stickiness — "Change Over Time"

**Resolved: removed.** The PRD listed Change Over Time as a second **Shown as** option, but it is not implemented. All references were removed from `analysis/stickiness.mdx`, including the Shown as control itself, since Stickiness was its only working value.

Re-document the control if and when Change Over Time ships.


### Create Chart or Dashboard — category contents

**Resolved.** The three categories are:

1. **Behavior Analytics** — Funnels, Retention, User Paths *(not released)*, Pivot Tables, User Sessions, Stickiness, Engagement Matrix, Compass *(not released)*, Impact Analysis
2. **Charts** — Line, Stacked Line, Bar, Stacked Bar, Pie, Metric, Column, Stacked Column. This category is Chart Analysis; the eight entries are its visualization types, documented in `analysis/chart-analysis.mdx`.
3. **Default Templates** — Flow Analysis, Feature Adoption, Product KPIs, User Activity

Navigation mirrors this. There is no separate page per chart visualization type, since they are options within Chart Analysis rather than distinct analyses.


### IAM PRD gaps

- **Permissions matrix sheet — deferred by decision.** The PRD §3 refers to a sheet listing every permission per role; it was not provided and is intentionally **not** documented yet. `settings/roles.mdx` describes the four default roles at the level the PRD gives. To be added later.
- **Conflict resolution — resolved.** The PRD described "two possible resolution strategies" and defined only one. There is in fact only one: the highest permission among the assigned roles wins. `settings/roles.mdx` states this as the single rule, with no configurable alternative.
- Section numbering jumps from 5 to 8, and the custom role flow jumps from Step 3 to Step 5. Content for the missing sections may exist elsewhere.


### Dashboard & Chart Management PRD contradiction

§3.1 and §28 state Editor has no create permission; §24 Acceptance Criteria states Full Access **or Editor** can create a dashboard. Documented as **Editor cannot create**, per your decision. The PRD itself should be reconciled.

### Product Analytics PRD

The summary table lists five dashboards including Flow Analysis, but the intro says "four distinct dashboards" and the body details only four. Flow Analysis is documented as its own template instead. **Confirm** whether Flow Analysis also appears inside Product Analytics.

---

## SDK review — open questions for SDK teams

The SDK pages were restructured to match `sdk/kmp.mdx` using only facts already on each page. These are the gaps that surfaced:

- **Requirements are missing** for the native Android, iOS, and Web SDKs — minimum `minSdk`, iOS deployment target, Xcode version, supported browsers. The KMP and React Native wrappers state their own minimums, but those don't establish the native ones.
- **Method signatures are derived, not sourced.** Only `logAppEvent`, `logClientEvent`, `setUserIdentifier` and `getDeviceId` (Android) and `logAppEvent` (iOS) came from the original guides. The rest of the mobile method set — `logAggregateEvent`, `setUserCustomInfo`, `setSessionCustomInfo`, `trackScreen`, `logRedirectionEvent`, `reportCustomError`, `getDeviceId` — was written for Android, iOS, React Native and Flutter by applying each platform's existing naming pattern to the KMP API. **Every derived signature needs SDK-team confirmation before merge**, including the Objective-C selectors, Flutter's argument shapes, and whether React Native's `getDeviceId` is async.
- **Flutter names user/session property methods differently** (`setUserAttributes`, `setSessionAttributes`) from the other mobile SDKs (`setUserCustomInfo`, `setSessionCustomInfo`). Kept as documented; confirm which is correct.
- **Web SDK was not aligned** to the mobile method set, since it documents a different API (`logEvent`, `setUserId`, `setUserProperties`). Confirm whether it has equivalents for aggregate events, screens, redirections, and custom errors.
- **KMP API table is internally inconsistent.** Its iOS column marks every method ✅, while the Tip below it talks about methods that are no-ops on iOS — and none of the no-op methods appear in the table.
- **ProGuard rules differ.** Android: `-keep class com.deeptaai.** { *; }`. Flutter: `-keep class com.deeptaai.klaritics.** { *; }`. One is likely stale.
- **Android repository visibility.** The old Android page said "private Maven repository"; the KMP page says both registries allow anonymous read. The Android page now says public — confirm.
- **Android Logcat line** reads `Klaritics(v2**) successfully initialized`. `v2**` looks like a placeholder for a version.
- **Web SDK version is unknown.** The script tag uses `@latest`; no version is stated, so release notes label it "Initial release".
- **Event naming case.** The External API enforces `snake_case`. Do the SDK ingestion paths accept other casing? Examples were switched to `snake_case` for consistency.
- **Release dates** for all v1.0.0 SDKs are unknown, so release-note entries carry no dates.

## Unverified pages

Generated content with no PRD behind it. Every specific is an assumption.

### `deployment/self-hosted.mdx` — content incoming

The install path for a self-hosted product in 57 lines, with no installable detail. "You will receive deployment artifacts and configuration guidance as part of your setup package" stands in for the entire procedure.

**Status: the owner is supplying this.** When it arrives it needs container images and registry, a real compose/Helm manifest, system requirements, datastore dependencies and versions, ports and TLS expectations, where `project_id` and `server_host` come from after install, and the upgrade/rollback procedure.


### `settings/alerts.mdx`

Claims three condition types and hedges Step 5 with "if available". No PRD. Needed: real condition types and operators, notification channels, whether recipients are users/roles/addresses, evaluation frequency, alert history.

### `settings/third-party-cohorts.mdx`

Describes connecting an external source and syncing on a schedule, with imported cohorts read-only. **No third-party system is ever named.** Needed: which integrations exist, how auth is configured, real sync mechanism and cadence.


### `analysis/retention.mdx`, `analysis/cohorts.mdx`

Both give a confident step-by-step build flow that was never observed. Compare either against `analysis/funnels.mdx` or `analysis/stickiness.mdx` for the depth difference. Retention in particular claims day/week/month cohort granularity, and is referenced by the Product Analytics and Feature Adoption pages, which makes getting it right more urgent.

---

## Undocumented product surfaces

Present in the UI screenshot, absent from the docs, with no PRD:

- **Warehouse** (Settings) — **content incoming from the owner.**
- **User Settings** (Settings) — **content incoming from the owner.**
- **Overview** — the project-level page. Its chart-permission behavior is documented in `charts/pin-to-dashboard.mdx` and `dashboards/overview.mdx`, but the page's own features are not.

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
