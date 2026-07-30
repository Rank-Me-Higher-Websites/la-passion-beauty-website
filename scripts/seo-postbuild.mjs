#!/usr/bin/env node
/**
 * Fleet SEO applier — deterministic, idempotent, run AFTER any `vite build`.
 *
 * Reads a manifest describing a site's real routes and writes:
 *   1. dist/robots.txt          — correct apex domain + single Sitemap: line
 *   2. dist/sitemap.xml         — every route, correct domain, lastmod
 *   3. dist/<route>/index.html  — per-route HTML whose <head> carries that
 *                                 route's title/description/canonical/OG/JSON-LD
 *                                 so crawlers see it before any JS runs.
 *
 * Also mirrors robots.txt + sitemap.xml into the repo's public/ (or client/public/)
 * so the next `vite build` keeps them.
 *
 * Usage: node apply-seo.mjs <manifest.json> [--dry-run]
 *
 * Manifest shape:
 * {
 *   "site": "truckclinic-website",
 *   "domain": "truckclinic.com",
 *   "distDir": "/opt/sites/truckclinic-website/dist",
 *   "publicDir": "/opt/sites/truckclinic-website/public",   // optional
 *   "disallow": ["/login", "/api/"],                        // optional
 *   "siteName": "Truck Clinic",                             // optional
 *   "ogImage": "/og-image.webp",                            // optional
 *   "routes": [
 *     { "path": "/", "title": "...", "description": "...",
 *       "changefreq": "weekly", "priority": 1.0,
 *       "lastmod": "2026-07-30", "jsonLd": [ {...} ] }
 *   ]
 * }
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const manifestPath = process.argv[2];
const DRY = process.argv.includes("--dry-run");
if (!manifestPath) {
  console.error("usage: node apply-seo.mjs <manifest.json> [--dry-run]");
  process.exit(2);
}

const m = JSON.parse(readFileSync(manifestPath, "utf8"));
const DOMAIN = m.domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
const BASE = `https://${DOMAIN}`;
// Relative paths resolve against cwd so the same config works in-repo
// (distDir: "dist") and standalone (distDir: "/opt/sites/x/dist").
const distDir = resolve(process.cwd(), m.distDir);
const today = m.today || new Date().toISOString().slice(0, 10);

if (!existsSync(join(distDir, "index.html"))) {
  console.error(`FATAL: no index.html in ${distDir} — build first`);
  process.exit(1);
}

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Escape "<" so a JSON string can never break out of its <script> element.
const jsonForScript = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

const normPath = (p) => {
  if (!p || p === "/") return "/";
  let x = p.startsWith("/") ? p : `/${p}`;
  return x.replace(/\/+$/, "") || "/";
};

// De-duplicate routes by path, first occurrence wins.
const seen = new Set();
const routes = [];
for (const r of m.routes || []) {
  const p = normPath(r.path);
  if (seen.has(p)) continue;
  seen.add(p);
  routes.push({ ...r, path: p });
}
if (!routes.some((r) => r.path === "/")) {
  console.error("FATAL: manifest has no '/' route");
  process.exit(1);
}

/* ------------------------------------------------------------------ robots */
const disallow = m.disallow || [];
const robots = [
  `# ${m.siteName || DOMAIN} — robots.txt`,
  `# ${BASE}`,
  ``,
  `User-agent: *`,
  `Allow: /`,
  ...disallow.map((d) => `Disallow: ${d}`),
  ``,
  `Sitemap: ${BASE}/sitemap.xml`,
  ``,
].join("\n");

/* ----------------------------------------------------------------- sitemap */
const sitemap = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...routes.map((r) => {
    const loc = r.path === "/" ? `${BASE}/` : `${BASE}${r.path}`;
    const parts = [`  <url>`, `    <loc>${esc(loc)}</loc>`];
    parts.push(`    <lastmod>${esc(r.lastmod || today)}</lastmod>`);
    parts.push(`    <changefreq>${esc(r.changefreq || "monthly")}</changefreq>`);
    const pr = r.priority !== undefined ? r.priority : r.path === "/" ? 1.0 : 0.7;
    parts.push(`    <priority>${Number(pr).toFixed(1)}</priority>`);
    parts.push(`  </url>`);
    return parts.join("\n");
  }),
  `</urlset>`,
  ``,
].join("\n");

/* --------------------------------------------------- per-route head rewrite */
const template = readFileSync(join(distDir, "index.html"), "utf8");

// Always substitute via a replacer FUNCTION. With a string replacement, JS
// interprets $$, $&, $`, $' and $1 inside it — so a title containing "$40" or a
// priceRange of "$$" would be silently mangled.
const sub = (html, re, replacement) => html.replace(re, () => replacement);

/** Replace an existing tag matched by `re`, else insert before </head>. */
const upsert = (html, re, tag) =>
  re.test(html) ? sub(html, re, tag) : sub(html, /<\/head>/i, `    ${tag}\n  </head>`);

function buildHtml(route) {
  let html = template;
  const canonical = route.canonical || (route.path === "/" ? `${BASE}/` : `${BASE}${route.path}`);
  const title = route.title;
  const desc = route.description;
  const ogImage = route.ogImage || m.ogImage;
  const absOgImage = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${BASE}${ogImage.startsWith("/") ? "" : "/"}${ogImage}`
    : null;

  if (title) html = sub(html, /<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  if (desc)
    html = upsert(
      html,
      /<meta\s+name=["']description["'][^>]*>/i,
      `<meta name="description" content="${esc(desc)}" />`,
    );

  html = upsert(
    html,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${esc(canonical)}" />`,
  );

  // Open Graph / Twitter — keep them consistent with the per-route values.
  if (title) {
    html = upsert(
      html,
      /<meta\s+property=["']og:title["'][^>]*>/i,
      `<meta property="og:title" content="${esc(title)}" />`,
    );
    html = upsert(
      html,
      /<meta\s+name=["']twitter:title["'][^>]*>/i,
      `<meta name="twitter:title" content="${esc(title)}" />`,
    );
  }
  if (desc) {
    html = upsert(
      html,
      /<meta\s+property=["']og:description["'][^>]*>/i,
      `<meta property="og:description" content="${esc(desc)}" />`,
    );
    html = upsert(
      html,
      /<meta\s+name=["']twitter:description["'][^>]*>/i,
      `<meta name="twitter:description" content="${esc(desc)}" />`,
    );
  }
  html = upsert(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${esc(canonical)}" />`,
  );
  if (absOgImage) {
    html = upsert(
      html,
      /<meta\s+property=["']og:image["'][^>]*>/i,
      `<meta property="og:image" content="${esc(absOgImage)}" />`,
    );
    html = upsert(
      html,
      /<meta\s+name=["']twitter:image["'][^>]*>/i,
      `<meta name="twitter:image" content="${esc(absOgImage)}" />`,
    );
  }

  // Route-specific JSON-LD: strip ones we previously injected, then add.
  html = html.replace(
    /\s*<script type="application\/ld\+json" data-seo="route">[\s\S]*?<\/script>/g,
    "",
  );
  const blocks = route.jsonLd || [];
  if (blocks.length) {
    const injected = blocks
      .map(
        (b) =>
          `    <script type="application/ld+json" data-seo="route">${jsonForScript(b)}</script>`,
      )
      .join("\n");
    html = sub(html, /<\/head>/i, `${injected}\n  </head>`);
  }
  return html;
}

/* ------------------------------------------------------------------- write */
const written = [];
if (!DRY) {
  writeFileSync(join(distDir, "robots.txt"), robots);
  writeFileSync(join(distDir, "sitemap.xml"), sitemap);
  // Stale compressed copies would be served in preference to the new files.
  for (const f of ["robots.txt.gz", "robots.txt.br", "sitemap.xml.gz", "sitemap.xml.br"]) {
    const p = join(distDir, f);
    if (existsSync(p)) rmSync(p);
  }
}
written.push("robots.txt", "sitemap.xml");

for (const route of routes) {
  const html = buildHtml(route);
  const outPath =
    route.path === "/" ? join(distDir, "index.html") : join(distDir, route.path, "index.html");
  if (!DRY) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    // A stale .gz/.br sibling would shadow the HTML we just wrote.
    for (const ext of [".gz", ".br"]) {
      const p = outPath + ext;
      if (existsSync(p)) rmSync(p);
    }
  }
  written.push(outPath.replace(distDir, "dist"));
}

// Keep robots/sitemap in the repo so the next build doesn't lose them.
const pub = m.publicDir ? resolve(process.cwd(), m.publicDir) : null;
if (pub && existsSync(pub) && !DRY) {
  writeFileSync(join(pub, "robots.txt"), robots);
  writeFileSync(join(pub, "sitemap.xml"), sitemap);
  written.push("public/robots.txt", "public/sitemap.xml");
}

console.log(
  JSON.stringify(
    {
      ok: true,
      dryRun: DRY,
      site: m.site,
      domain: DOMAIN,
      routeCount: routes.length,
      filesWritten: written.length,
      urls: routes.map((r) => (r.path === "/" ? `${BASE}/` : `${BASE}${r.path}`)),
    },
    null,
    2,
  ),
);
