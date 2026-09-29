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
const stageSection = sections[0];
const stageMatches = [...stageSection.markdown.matchAll(/^### (\d{2}) · (.+)$/gm)];
const stages = stageMatches.map((match, index) => {
  const text = stageSection.markdown.slice(match.index + match[0].length, stageMatches[index+1]?.index ?? stageSection.markdown.length).trim();
  const field = name => text.match(new RegExp(`^${name}: (.+)$`, 'm'))?.[1] || '';
  return {number: Number(match[1]), title: match[2], date: field('Date'), distance: field('Distance'), climbing: field('Climbing'), text};
});
if (stages.length !== 8) throw new Error('Expected eight Markdown stage cards');
const routeData = JSON.parse(await readFile(resolve('public/routes.json'), 'utf8'));
const assetVersion = createHash('sha256').update(source).update(await readFile('public/app.js')).update(await readFile('public/styles.css')).update(JSON.stringify(routeData)).digest('hex').slice(0,12);
const ready = routeData.routes.filter(r => r.status === 'exact').length;
const stageButtons = stages.map(s => `<button type="button" class="stage-choice" data-stage="${s.number}" aria-pressed="false" aria-controls="stage-${s.number}"><span class="stage-date">${escapeHtml(s.date.replace(/^[^ ]+ /, '').replace(' 2026',''))}</span><span class="stage-number">${String(s.number).padStart(2,'0')}</span><strong>${escapeHtml(s.title.split(' → ')[1])}</strong><small>${escapeHtml(s.distance)} <span>· ↑ ${escapeHtml(s.climbing)}</span></small></button>`).join('');
const stagePanels = stages.map(s => {
  const paragraphs = s.text.split(/\n\s*\n/);
  const rendered = paragraphs.map(p => {
    const type = /^(Date|Distance|Climbing): /.test(p) ? 'stage-fact' : /^Stay: /.test(p) ? 'stage-stay' : /^Address: /.test(p) ? 'stage-address' : /^\[Finish \/ /.test(p) ? 'finish-link' : /^\[Garmin/.test(p) ? 'course-link' : /^\[/.test(p) ? 'stop-link' : 'stage-note';
    return `<div class="${type}">${renderMarkdown(p)}</div>`;
  }).join('');
  return `<article class="stage-panel" id="stage-${s.number}" data-stage-panel="${s.number}" hidden aria-labelledby="stage-heading-${s.number}"><p class="section-kicker">Stage ${String(s.number).padStart(2,'0')}</p><h3 id="stage-heading-${s.number}">${escapeHtml(s.title)}</h3>${rendered}<p class="track-note" data-track-note="${s.number}"></p><a class="gpx-download" data-gpx="${s.number}" hidden download>Download GPX ↓</a></article>`;
}).join('');
const explorerHtml = `<section class="route-explorer" id="${stageSection.id}" aria-labelledby="explorer-title">
  <div class="explorer-heading"><h2 id="explorer-title">${escapeHtml(stageSection.title)}</h2><p>Select a stage for its map and stops.</p></div>
  <div class="explorer-controls"><button type="button" id="overview" aria-pressed="true">All stages</button><button type="button" id="replay">↻ Replay route</button><label class="motion-control"><input id="motion" type="checkbox" checked> Animation</label><p id="map-status" role="status">${ready} / 8 exact tracks imported</p></div>
  <label class="mobile-stage">Choose a stage<select id="stage-select"><option value="0">All stages</option>${stages.map(s=>`<option value="${s.number}">${String(s.number).padStart(2,'0')} · ${escapeHtml(s.title)}</option>`).join('')}</select></label>
  <div class="explorer-grid"><div class="map-frame"><div id="stage-map" aria-label="Map of the selected cycling stage"></div><div class="map-label"><span class="map-label-dot"></span><span id="map-caption">Fausto's courses · 5–12 October</span></div><div id="map-message" class="map-message" hidden></div><div class="map-compass" aria-hidden="true">N<br>↑</div></div>
  <aside class="stage-details" aria-label="Selected stage information"><div id="overview-panel"><p class="section-kicker">5–12 October</p><h3>Palermo → Catania<br>→ Modica</h3><div class="overview-stats"><div><strong>${stages.reduce((sum,s)=>sum+parseFloat(s.distance),0).toFixed(2)}</strong><span>kilometres</span></div><div><strong>${stages.reduce((sum,s)=>sum+parseInt(s.climbing.replaceAll(',','')),0).toLocaleString('en')}</strong><span>metres climbing</span></div></div><p>Six stays booked. Catania still to book.</p><p class="overview-warning">${ready}/8 exact GPX tracks imported. Other maps: town markers only.</p><a class="text-link" href="#train-and-pass-pickup">Monday's train & pass pickup ↗</a></div>${stagePanels}</aside></div>
  <nav class="stage-rail" aria-label="Choose cycling stage">${stageButtons}</nav>
  <div class="stage-navigation"><button type="button" id="previous">← Previous</button><p id="selection-summary" aria-live="polite">Choose one of the eight stages</p><button type="button" id="next">Next →</button></div>
  <noscript><p>Enable JavaScript for the stage map. All stage details follow.</p><article class="markdown-body">${renderMarkdown(stageSection.markdown)}</article></noscript>
</section>`;
const introHtml = intro ? `<section class="intro-band" aria-label="Plan context"><div class="intro-inner markdown-body">${renderMarkdown(intro)}</div></section>` : "";
const sectionHtml = sections.slice(1).map((section, index) => `<section class="landing-section tone-${index % 3}" id="${section.id}" data-page-section>
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
const siteJson = JSON.stringify({ title, summary, slug: site.slug, digest, assetVersion, generatedAt, layout, sections: navItems, stages: stages.map(({text,...stage})=>stage) }).replaceAll("<", "\\u003c");

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#102b25">
  <meta name="description" content="${escapeHtml(summary)}">
  <title>${escapeHtml(title)}</title>
  <link rel="stylesheet" href="/leaflet.css">
  <link rel="stylesheet" href="/styles.css?v=${assetVersion}">
  <script defer src="/leaflet.js"></script>
  <script defer src="/app.js?v=${assetVersion}"></script>
</head>
<body data-source-sha256="${digest}" data-layout="${layout}">
  <a class="skip-link" href="#${stageSection.id}">Skip to stages</a>
  <header class="site-header">
    <a class="brand" href="#top" aria-label="Back to top"><span aria-hidden="true">↗</span><strong>SICILY<span class="brand-sub">A journey in eight stages</span></strong></a>
    <nav class="primary-nav" aria-label="Primary navigation">${primaryNav}</nav>
    <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="site-menu"><span>Menu</span><i aria-hidden="true"></i></button>
  </header>
  <div class="site-menu" id="site-menu" data-site-menu hidden>
    <div class="menu-panel"><nav aria-label="All sections">${menuNav}</nav><div class="menu-tools"><button type="button" data-share>Share</button><button type="button" data-print>Print</button></div></div>
  </div>
  <main id="top">
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">${escapeHtml(eyebrow)}</p><h1>${escapeHtml(title).replace(', together.', ',<br> <em>together.</em>')}</h1></div><div class="hero-intro"><p class="lede">${escapeHtml(summary)}</p><a class="text-link" href="#train-and-pass-pickup">Train & pass pickup ↗</a><span class="edition">FAUSTO'S ROUTES / OCTOBER 2026</span></div>
    </section>
    ${explorerHtml}
${introHtml}
    <div class="section-stack">${sectionHtml}</div>
  </main>
  <footer><strong>Sicily · October 2026</strong><a href="#top">Back to top ↑</a></footer>
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
