/**
 * screenshot-scrub.js — make a live Klaritics instance safe to screenshot.
 *
 * Paste this whole file into the DevTools console, then trigger a data refresh
 * so everything flows through the patched transport.
 *
 * IMPORTANT: a full page load (F5, or any navigation that isn't in-app routing)
 * discards this script. Re-paste it after any reload, and navigate using the
 * app's own sidebar/links so the SPA keeps it alive.
 *
 * Scrubbing happens at the NETWORK layer — API responses are rewritten before
 * the app renders them, so real values never enter the DOM. A MutationObserver
 * sweep runs as a second line of defense for anything not delivered as JSON.
 *
 * Replacements are deterministic: the same real value always maps to the same
 * placeholder, so screenshots stay coherent across pages.
 */
(function () {
  // ---------------------------------------------------------------- pools
  const VERBS = ["viewed","clicked","opened","started","completed","submitted","shared","removed","added","searched","played","saved","created","updated","closed","launched"];
  const NOUNS = ["product","cart","checkout","signup","profile","home","article","video","lesson","session","reminder","settings","payment","wishlist","notification","onboarding"];
  const CATS = ["Acquisition","Onboarding","Engagement","Commerce","Content","Notifications","App Lifecycle","Account","Navigation","Retention"];
  const CITIES = ["Springfield","Rivertown","Lakeside","Fairview","Brookfield","Westport","Ashford","Milbrook","Northgate","Eastvale"];
  const COUNTRIES = ["United States","Canada","Germany","France","Japan","Brazil","Australia","Spain"];
  const PEOPLE = ["Alex Morgan","Jordan Ellis","Sam Rivera","Casey Lin","Riley Chen","Morgan Reed","Taylor Brooks","Jamie Park","Avery Quinn","Drew Harper"];

  const hash = (s) => { let x = 2166136261; s = String(s); for (let i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return Math.abs(x); };
  const hexOf = (s, len = 16) => { let out = "", n = hash(s); for (let i = 0; i < len; i++) { n = Math.imul(n ^ (n >>> 13), 1274126177); out += "0123456789abcdef"[Math.abs(n) % 16]; } return out; };
  const titled = (s) => String(s).split(/[_\s]+/).map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(" ");

  const memo = new Map();
  const fakeEvent = (real) => {
    if (memo.has(real)) return memo.get(real);
    const n = hash(real);
    let v = `${NOUNS[n % NOUNS.length]}_${VERBS[(n >> 5) % VERBS.length]}`;
    if ([...memo.values()].includes(v)) v = `${v}_${memo.size % 97}`;
    memo.set(real, v);
    return v;
  };
  const fakePerson = (s) => PEOPLE[hash(s) % PEOPLE.length];
  const initialsOf = (n) => n.split(" ").map(w => w[0]).join("").toUpperCase();

  // ------------------------------------------------- known identifying strings
  // Free-text occurrences the key-based rules cannot catch (prose, headings, URLs).
  //
  // This list is NOT stored here: it would publish the very names it exists to
  // hide. Load `scrub-names.local.js` (gitignored) in the console FIRST, which
  // sets window.__SCRUB_NAMES. See scrub-names.example.js for the shape.
  const NAMED = (window.__SCRUB_NAMES || []).slice().sort((a, b) => b[0].length - a[0].length);
  if (!NAMED.length) {
    console.warn(
      "[scrub] window.__SCRUB_NAMES is empty. Key-based rules still apply, but " +
      "organization, people and customer-specific strings in free text will NOT " +
      "be replaced. Load scrub-names.local.js first."
    );
  }
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const RE = NAMED.map(([f, t]) => [new RegExp(esc(f), "gi"), t]);
  const named = (s) => RE.reduce((a, [re, t]) => a.replace(re, t), s);

  // ------------------------------------------------------------- key routing
  const KEY = {
    person:  /^(owner|owner_?name|created_?by|modified_?by|last_?modified_?by|updated_?by|author|user_?name|full_?name|first_?name|last_?name|shared_?by|member|assignee)$/i,
    id:      /^(user_?id|distinct_?id|device_?id|uid|customer_?id)$/i,
    city:    /^(city|town|locality)$/i,
    country: /^(country|country_?name|region)$/i,
    email:   /^(email|user_?email|mail)$/i,
    display: /^(display_?name|displayname)$/i,
    event:   /^(event_?name|event|name|title|label|chart_?name|dashboard_?name)$/i,
    desc:    /^(description|desc|summary)$/i,
    cat:     /^(category|categories|category_?name|group)$/i,
  };

  function scrub(node, keyHint) {
    if (node === null || node === undefined) return node;
    if (Array.isArray(node)) return node.map(v => scrub(v, keyHint));
    if (typeof node === "object") {
      const out = {};
      for (const [k, v] of Object.entries(node)) out[k] = scrub(v, k);
      return out;
    }
    if (typeof node !== "string") return node;
    const k = keyHint || "", seed = node;
    if (KEY.person.test(k))  return fakePerson(seed);
    if (KEY.id.test(k))      return hexOf(seed, Math.min(Math.max(node.length, 8), 32));
    if (KEY.city.test(k))    return CITIES[hash(seed) % CITIES.length];
    if (KEY.country.test(k)) return COUNTRIES[hash(seed) % COUNTRIES.length];
    if (KEY.email.test(k))   return `user${hash(seed) % 9000 + 1000}@example.com`;
    if (KEY.cat.test(k))     return CATS[hash(seed) % CATS.length];
    if (KEY.display.test(k)) return titled(fakeEvent(seed));
    if (KEY.event.test(k))   return fakeEvent(seed);
    if (KEY.desc.test(k))    { const [n_, v_] = fakeEvent(seed).split("_"); return `User ${v_} the ${n_}.`; }
    return named(node);
  }
  window.__scrubJSON = scrub;

  // --------------------------------------------------------- network layer
  if (!window.__origFetch) window.__origFetch = window.fetch;
  if (!window.__origXHR) window.__origXHR = window.XMLHttpRequest;

  window.fetch = async function (...args) {
    const res = await window.__origFetch.apply(this, args);
    if (!(res.headers.get("content-type") || "").includes("application/json")) return res;
    try {
      const data = await res.clone().json();
      return new Response(JSON.stringify(window.__scrubJSON(data)),
        { status: res.status, statusText: res.statusText, headers: res.headers });
    } catch { return res; }
  };

  const Orig = window.__origXHR;
  function PatchedXHR() {
    const x = new Orig();
    ["response", "responseText"].forEach(prop => {
      const d = Object.getOwnPropertyDescriptor(Orig.prototype, prop)
             || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x), prop);
      if (!d || !d.get) return;
      try {
        Object.defineProperty(x, prop, {
          get() {
            const raw = d.get.call(x);
            if (typeof raw !== "string") return raw;
            try { return JSON.stringify(window.__scrubJSON(JSON.parse(raw))); } catch { return raw; }
          },
          configurable: true,
        });
      } catch {}
    });
    return x;
  }
  PatchedXHR.prototype = Orig.prototype;
  Object.assign(PatchedXHR, Orig);
  window.XMLHttpRequest = PatchedXHR;

  // ------------------------------------------------- DOM sweep (defense #2)
  // Writes to the LONGEST text node in a cell: cells often hold an avatar badge
  // plus the value, and writing to the first node corrupts the badge/layout.
  function setCellText(cell, val, badge) {
    const w = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
    const nodes = []; while (w.nextNode()) if (w.currentNode.nodeValue.trim()) nodes.push(w.currentNode);
    if (!nodes.length) return false;
    let longest = nodes[0];
    for (const nd of nodes) if (nd.nodeValue.trim().length > longest.nodeValue.trim().length) longest = nd;
    for (const nd of nodes) {
      if (nd === longest) nd.nodeValue = val;
      else if (badge && nd.nodeValue.trim().length <= 3) nd.nodeValue = badge;
    }
    return true;
  }

  function sweepTables() {
    let n = 0;
    for (const table of document.querySelectorAll("table")) {
      const heads = [...table.querySelectorAll("thead th, thead td")].map(e => e.innerText.trim().toLowerCase());
      if (!heads.length) continue;
      for (const row of table.querySelectorAll("tbody tr")) {
        const cells = [...row.children];
        const seed = cells.map(c => c.innerText.trim()).join("|").slice(0, 80);
        heads.forEach((h, i) => {
          const cell = cells[i]; if (!cell) return;
          const cur = cell.innerText.trim(); if (!cur || cur === "-") return;
          const hk = h.replace(/\s+/g, "_");
          if (KEY.person.test(hk) || /owner|created by|modified by|shared by|author/.test(h)) {
            const who = fakePerson(cur);
            if (setCellText(cell, who, initialsOf(who))) n++;
          } else if (KEY.id.test(hk) || /user id|distinct id|device id/.test(h)) {
            if (setCellText(cell, hexOf(seed + h, 16))) n++;
          } else if (/city/.test(h))    { if (setCellText(cell, CITIES[hash(seed + "c") % CITIES.length])) n++; }
          else if (/country|region/.test(h)) { if (setCellText(cell, COUNTRIES[hash(seed + "k") % COUNTRIES.length])) n++; }
          else if (/email/.test(h))     { if (setCellText(cell, `user${hash(seed) % 9000 + 1000}@example.com`)) n++; }
          else if (/event name/.test(h)){ if (setCellText(cell, fakeEvent(cur))) n++; }
          else if (/categor/.test(h))   { if (setCellText(cell, CATS[hash(cur) % CATS.length])) n++; }
        });
      }
    }
    return n;
  }

  function sweep() {
    let n = sweepTables();
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    for (const nd of nodes) { const nx = named(nd.nodeValue); if (nx !== nd.nodeValue) { nd.nodeValue = nx; n++; } }
    for (const el of document.querySelectorAll("[title],[aria-label],[placeholder],[alt]"))
      for (const a of ["title", "aria-label", "placeholder", "alt"]) {
        const v = el.getAttribute(a); if (!v) continue;
        const nv = named(v); if (nv !== v) { el.setAttribute(a, nv); n++; }
      }
    document.title = "Analytics";
    return n;
  }

  if (window.__scrubObserver) window.__scrubObserver.disconnect();
  let queued = false;
  const obs = new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      obs.disconnect();
      try { sweep(); } finally {
        obs.observe(document.body, { childList: true, subtree: true, characterData: true });
        queued = false;
      }
    });
  });
  window.__sweep = sweep;
  window.__scrubObserver = obs;
  const first = sweep();
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });

  return `scrub layer installed — network (fetch+XHR) + DOM sweep; ${first} initial DOM replacements`;
})();
