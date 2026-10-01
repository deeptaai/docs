/**
 * scrub-names.example.js — template for the identifying-strings list.
 *
 * Copy to `scrub-names.local.js` and fill in the real values. That filename is
 * gitignored and must stay that way: this list names the organization, the
 * people and the customer whose data the screenshots exist to protect, so
 * committing it would publish exactly what the scrubbing is for.
 *
 * Usage: paste this file into the DevTools console FIRST, then paste
 * screenshot-scrub.js. It warns if the list is empty.
 *
 * Entries are [real, replacement] and are applied longest-first, so list full
 * names before surnames. Matching is case-insensitive and substring-based.
 */
window.__SCRUB_NAMES = [
  // --- operators / teammates whose names appear in Owner, Created By, etc.
  ["Firstname Lastname", "Alex Morgan"],
  ["Firstname", "Alex"],
  ["Lastname", "Morgan"],
  ["firstname.lastname@yourcompany.com", "alex@example.com"],

  // --- your own organization and its domains
  ["Your Company", "Acme Inc"],
  ["yourcompany.com", "example.com"],
  ["yourinstance.example.net", "analytics.example.com"],

  // --- the customer whose project is being captured
  //     Include program/product names that identify them, not just the brand.
  ["Customer Name", "Acme Inc"],
  ["Customer Programme Name", "Core Program"],
];
