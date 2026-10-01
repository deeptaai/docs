# Screenshot tooling

`screenshot-scrub.js` makes it safe to capture documentation screenshots from a
live Klaritics instance holding real customer data.

## Why it exists

This repository is **public**. Any screenshot committed here is published
permanently, including in git history. The live instance contains an
organization name, operator names and emails, hundreds of customer-specific
event names, and hundreds of thousands of end-user records.

## Why it scrubs at the network layer

An earlier version rewrote text in the DOM after render. That leaks: on pages
that refresh asynchronously (User Profiles, Real-Time Events) new rows paint
before the rewrite runs, and a screenshot taken in that window captures real
data. This was not theoretical — it happened, and two real city names reached
a saved capture.

This version wraps `fetch` and `XMLHttpRequest` and rewrites API responses
**before** the app renders them, so real values never enter the page. A DOM
sweep is kept as a second line of defense for anything not delivered as JSON.

## Usage

1. Log into the instance in Chrome and select the project to capture.
2. Paste the contents of `screenshot-scrub.js` into the DevTools console.
3. Trigger a data refresh (Refresh Data, or re-navigate) so all data flows
   through the patched transport.
4. Verify on screen before capturing. **Always look at the actual pixels** —
   do not trust the script blindly.
5. Capture at a 1512x950 window, in both light and dark themes.

## Conventions

- Images live in `images/product/<name>-light.jpg` and `-dark.jpg`
- Embed with a `<Frame>` and the paired `block dark:hidden` /
  `hidden dark:block` classes so the screenshot follows the reader's theme
- Replacements are deterministic: the same real value always becomes the same
  placeholder, so screenshots stay coherent across pages

## Known limits

- Live-streaming pages produce different synthetic values on each refresh, so a
  light/dark pair of a streaming table may not show identical rows.
- Numeric values (counts, conversion rates) are **not** scrubbed. They are
  meaningless once labels are synthetic, and altering them would desync the
  rendered chart geometry. Revisit if a figure is itself commercially sensitive.
