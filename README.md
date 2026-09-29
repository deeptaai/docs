# Klaritics documentation

Source for the Klaritics product guides, published with [Mintlify](https://mintlify.com).

Klaritics is a self-hosted product analytics platform. These guides cover the analytics modules, dashboards, SDK integration, and self-hosted deployment.

## Deployment

**Pushing to `main` deploys to production.** The Mintlify GitHub app watches this repo and rebuilds the site on every push to the default branch. Work on a branch, preview locally, and merge once verified.

## Local preview

```bash
npm i -g mint
mint dev
```

Then open `http://localhost:3000`. Run `mint dev` from the repo root, where `docs.json` lives.

If the dev server misbehaves, run `mint update` to get the latest CLI. A page that 404s usually means you are not in a directory with a valid `docs.json`.

## Repo layout

```
docs.json                 Navigation, redirects, theme, branding
index.mdx                 Landing page
quickstart.mdx            Deploy → instrument → first dashboard
release-notes.mdx         Version history (authoritative on what shipped)

analysis/                 Chart Analysis, Funnels, Retention, Cohorts, User Flows,
                          Engagement Matrix, Impact Analysis, Pivot Tables, User Sessions
data/                     Event Taxonomy, Real-Time Events, User Profiles
dashboards/               Saved dashboards: create, lay out, share, export
widgets/                  Chart, metric, table, and custom widgets
templates/                Pre-built dashboards
alerts/                   Widget alerting
integrations/             Third-party cohort import
user-management/          Roles and users
sdk/                      Web, Android, iOS, React Native, Flutter, Kotlin Multiplatform
deployment/               Self-hosted deployment

AGENTS.md                 Writing conventions and terminology — read before editing
CONTENT-GAPS.md           Per-page status: which pages are verified vs. placeholder
```

## Contributing

Read `AGENTS.md` first. It records the terminology rules (`project_id` not `app_id`, "Chart Analysis" not "Insights"), the heading conventions Mintlify requires, and the pre-commit checks.

Check `CONTENT-GAPS.md` before editing a page. Some pages are placeholder-quality and should not be deepened without the underlying product detail.

## Resources

- [Mintlify documentation](https://mintlify.com/docs)
- [Klaritics](https://klaritics.com)
