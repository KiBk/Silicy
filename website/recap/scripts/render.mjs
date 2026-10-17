#!/usr/bin/env node
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { marked } from "./vendor/marked.esm.js";

function argumentsMap(argv) {
  const result = {};
  for (let i = 2; i < argv.length; i += 2) result[argv[i].replace(/^--/, "")] = argv[i + 1];
  return result;
}

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function stripMarkdown(value = "") {
  return value.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_~`>#]/g, "").trim();
}

function slugify(value, used = new Set()) {
  const base = stripMarkdown(value).toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  let id = base;
  let suffix = 2;
  while (used.has(id)) id = `${base}-${suffix++}`;
  used.add(id);
  return id;
}

function parseFrontmatter(source) {
  if (!source.startsWith("---\n")) return { metadata: {}, body: source };
  const end = source.indexOf("\n---\n", 4);
  if (end < 0) return { metadata: {}, body: source };
  const metadata = {};
  for (const line of source.slice(4, end).split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) metadata[match[1].toLowerCase()] = match[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return { metadata, body: source.slice(end + 5) };
}

function firstParagraph(body) {
  return body.split(/\n\s*\n/).map(part => part.trim()).find(part => part && !/^(#|[-*+]\s|\d+\.\s|```|>|\|)/.test(part)) || "Published research and planning notes.";
}

function splitSections(markdown) {
  const matches = [...markdown.matchAll(/^##\s+(.+)$/gm)];
  const intro = matches.length ? markdown.slice(0, matches[0].index).trim() : markdown.trim();
  const used = new Set(["top", "route-map"]);
  const sections = matches.map((match, index) => ({
    title: stripMarkdown(match[1]),
    id: slugify(match[1], used),
    markdown: markdown.slice(match.index + match[0].length, matches[index + 1]?.index ?? markdown.length).trim()
  }));
  return { intro, sections };
}

function safeLocalAsset(value = "") {
  if (!value || value.includes("..") || value.includes(":") || value.startsWith("/")) return "";
  return /^[A-Za-z0-9._/-]+$/.test(value) ? value : "";
}

const args = argumentsMap(process.argv);
if (!args.source || !args.output || !args["copy-source"]) throw new Error("usage: render.mjs --source content.md --output public/index.html --copy-source public/source.md");

const sourcePath = resolve(args.source);
const outputPath = resolve(args.output);
const sourceCopyPath = resolve(args["copy-source"]);
const source = (await readFile(sourcePath, "utf8")).replace(/^[\u200B-\u200F\uFEFF]/, "");
const site = JSON.parse(await readFile(resolve("site.json"), "utf8"));
const { metadata, body } = parseFrontmatter(source);
const heading = body.match(/^#\s+(.+)$/m)?.[1] || site.slug.replaceAll("-", " ");
const title = metadata.title || site.title || stripMarkdown(heading);
const summary = metadata.summary || site.summary || stripMarkdown(firstParagraph(body.replace(/^#\s+.*$/m, "")));
const eyebrow = metadata.eyebrow || "Published plan · source preserved";
const bodyWithoutFirstTitle = body.replace(/^\s*#\s+.*\n+/, "");
const { intro, sections } = splitSections(bodyWithoutFirstTitle);
const digest = createHash("sha256").update(Buffer.from(source, "utf8")).digest("hex");
const generatedAt = new Date().toISOString();
const layout = metadata.layout === "document" ? "document" : "landing";
const mapAsset = safeLocalAsset(metadata.map_data);
const mapHeading = metadata.map_heading || "Journey map";
const mapSummary = metadata.map_summary || "Explore the route and its important stops.";

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    html(token) {
      const raw = typeof token === "string" ? token : token.text;
      return `<pre class="raw-html" aria-label="Escaped raw HTML"><code>${escapeHtml(raw)}</code></pre>`;
    }
  }
});

const renderMarkdown = value => marked.parse(value || "");
const introHtml = intro ? `<section class="intro-band" aria-label="Plan context"><div class="intro-inner markdown-body">${renderMarkdown(intro)}</div></section>` : "";
const sectionHtml = sections.map((section, index) => `<section class="landing-section tone-${index % 3}" id="${section.id}" data-page-section>
  <div class="section-shell">
    <header class="section-heading"><span>${String(index + 1).padStart(2, "0")}</span><h2>${escapeHtml(section.title)}</h2></header>
    <article class="markdown-body" data-section-body>${renderMarkdown(section.markdown)}</article>
  </div>
</section>`).join("\n");

const navItems = [
  ...(mapAsset ? [{ id: "route-map", title: "Map" }] : []),
  ...sections.map(({ id, title }) => ({ id, title }))
];
const primaryNav = navItems.slice(0, 4).map(item => `<a href="#${item.id}">${escapeHtml(item.title)}</a>`).join("");
const menuNav = navItems.map((item, index) => `<a href="#${item.id}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(item.title)}</a>`).join("");
const mapHtml = mapAsset ? `<section class="map-section" id="route-map" data-page-section>
  <div class="map-copy"><p class="section-kicker">Interactive route</p><h2>${escapeHtml(mapHeading)}</h2><p>${escapeHtml(mapSummary)}</p><div class="map-legend" data-map-legend></div></div>
  <div class="route-map" data-route-map data-map-src="${escapeHtml(basename(mapAsset))}" aria-label="Interactive map of the total journey"></div>
  <noscript><p class="map-fallback">JavaScript is required for the interactive route map.</p></noscript>
</section>` : "";
const siteJson = JSON.stringify({ title, summary, slug: site.slug, digest, generatedAt, layout, sections: navItems }).replaceAll("<", "\\u003c");

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102b25">
  <meta name="description" content="${escapeHtml(summary)}">
  <title>${escapeHtml(title)}</title>
  ${mapAsset ? '<link rel="stylesheet" href="leaflet.css">' : ""}
  <link rel="stylesheet" href="styles.css?v=${digest.slice(0, 12)}">
  ${mapAsset ? '<script defer src="leaflet.js"></script>' : ""}
  <script defer src="app.js?v=${digest.slice(0, 12)}"></script>
</head>
<body data-source-sha256="${digest}" data-layout="${layout}">
  <div class="reading-progress" aria-hidden="true"><span></span></div>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Back to top"><span aria-hidden="true">↗</span><strong>${escapeHtml(title)}</strong></a>
    <nav class="primary-nav" aria-label="Primary navigation">${primaryNav}</nav>
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-menu"><span>Menu</span><i aria-hidden="true"></i></button>
  </header>
  <div class="site-menu" id="site-menu" data-site-menu aria-hidden="true">
    <div class="menu-panel"><p>Explore the plan</p><nav aria-label="All sections">${menuNav}</nav><div class="menu-tools"><a href="source.md">Source Markdown</a><button type="button" data-share>Share</button><button type="button" data-print>Print</button></div></div>
  </div>
  <main id="top">
    <section class="hero">
      <div class="hero-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="hero-copy"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title)}</h1><p class="lede">${escapeHtml(summary)}</p><div class="hero-actions">${mapAsset ? '<a class="button primary" href="#route-map">Explore the route</a>' : ""}<a class="button ghost" href="#${sections.at(-2)?.id || sections[0]?.id || "top"}">Jump to the decision</a></div></div>
      <div class="hero-meta"><span>Research-backed</span><span>Source-preserved</span><span>Updated ${escapeHtml(generatedAt.slice(0, 10))}</span></div>
    </section>
    ${introHtml}
    ${mapHtml}
    <div class="section-stack">${sectionHtml}</div>
  </main>
  <footer><div><strong>${escapeHtml(title)}</strong><p>Rendered mechanically from <a href="source.md">source Markdown</a>.</p></div><p>Source SHA-256<br><code>${digest}</code></p></footer>
  <script id="site-meta" type="application/json">${siteJson}</script>
</body>
</html>\n`;

await mkdir(dirname(outputPath), { recursive: true });
await mkdir(dirname(sourceCopyPath), { recursive: true });
await writeFile(outputPath, page, "utf8");
await writeFile(sourceCopyPath, source, "utf8");
if (mapAsset) await copyFile(resolve(dirname(sourcePath), mapAsset), resolve(dirname(outputPath), basename(mapAsset)));
console.log(`Rendered ${outputPath}`);
console.log(`Source SHA-256: ${digest}`);
