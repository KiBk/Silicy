import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// All place text and links come from the Along the stage blocks in content.md.
// These are real static pages: deep links, browser Back and reading work without JS.
export async function renderGuides({ stages, metadata, digest, assetVersion, renderMarkdown, escapeHtml, stripMarkdown, slugify, root }) {
  const e = escapeHtml;
  const guides = stages.map(stage => {
    const matches = [...stage.guide.matchAll(/^##### (.+)$/gm)];
    if (matches.length < 3 || matches.length > 4) throw Error(`Stage ${stage.number}: expected 3–4 places`);
    const used = new Set();
    return { ...stage, intro: stage.guide.slice(0, matches[0].index).trim(), places: matches.map((m, i) => ({
      title: stripMarkdown(m[1]), id: slugify(m[1], used),
      html: renderMarkdown(`## ${m[1]}\n\n${stage.guide.slice(m.index + m[0].length, matches[i+1]?.index ?? stage.guide.length).trim()}`)
    })) };
  });
  const stageNav = active => `<nav class="guide-stage-nav" aria-label="Choose a stage guide">${guides.map(s => `<a href="/stages/${s.number}/" aria-label="Stage ${s.number}: ${e(s.title)}"${active === s.number ? ' aria-current="page"' : ''}>${String(s.number).padStart(2, '0')}</a>`).join('')}</nav>`;
  const shell = (title, active, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#253a34"><meta name="description" content="Short local facts, sights and practical stop notes for ${e(title)}."><title>${e(title)} · Sicily field notes</title><link rel="stylesheet" href="/styles.css?v=${assetVersion}"></head>
<body class="guide-page" data-source-sha256="${digest}">
<a class="skip-link" href="#guide-main">Skip to places</a>
<header class="site-header"><a class="brand" href="/"><span aria-hidden="true">↗</span><strong>SICILY<span class="brand-sub">Along the stage</span></strong></a><nav class="guide-header-nav" aria-label="Guide navigation"><a href="/${active ? `#stage/${active}` : '#the-eight-stages'}">← ${active ? 'Stage map' : 'Trip map'}</a>${active ? '<a href="/stages/">All guides</a>' : ''}</nav></header>
<main id="guide-main" class="guide-main">${body}</main>
<footer><span>Place notes checked ${e(metadata.places_checked)}.</span><a href="/${active ? `#stage/${active}` : '#the-eight-stages'}">Back to ${active ? 'this stage' : 'the trip'} ↗</a></footer></body></html>\n`;
  for (const s of guides) {
    const number = String(s.number).padStart(2, '0');
    const jumpLinks = s.places.map((p,i) => `<a href="#${p.id}"><span>${String(i+1).padStart(2,'0')}</span>${e(p.title)}</a>`).join('');
    const cards = s.places.map((p,i) => `<article class="place-card" id="${p.id}"><span class="place-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><div class="place-copy">${p.html}</div></article>`).join('');
    const next = s.number < 8 ? `<a href="/stages/${s.number+1}/">Next · ${e(stages[s.number].title)} →</a>` : '<a href="/stages/">All eight guides →</a>';
    const previous = s.number > 1 ? `<a href="/stages/${s.number-1}/">← Previous stage</a>` : '<a href="/stages/">← All guides</a>';
    const body = `<section class="guide-hero"><p class="eyebrow">Field notes / Stage ${number} / ${e(s.date)}</p><h1>${e(s.title).replace(' → ', '<br><span aria-hidden="true">→ </span>')}</h1><div class="guide-intro">${renderMarkdown(s.intro)}</div><p class="guide-facts">${e(s.distance)} · ↑ ${e(s.climbing)} · ${s.places.length} places</p></section>
${stageNav(s.number)}
<div class="guide-layout"><aside class="guide-jumps"><p class="section-kicker">On this stage</p><nav aria-label="Places on this stage">${jumpLinks}</nav></aside><div class="place-list">${cards}<p class="guide-note">${e(metadata.places_note)}</p></div></div>
<nav class="guide-pagination" aria-label="Adjacent stage guides">${previous}${next}</nav>`;
    await mkdir(resolve(root, 'stages', String(s.number)), { recursive: true });
    await writeFile(resolve(root, 'stages', String(s.number), 'index.html'), shell(s.title, s.number, body));
  }
  const tiles = guides.map(s => `<a class="guide-tile" href="/stages/${s.number}/"><span class="section-kicker">${String(s.number).padStart(2,'0')} · ${e(s.date.replace(' 2026',''))}</span><h2>${e(s.title)}</h2><p>${e(s.places.map(p => p.title.split(' — ')[0]).join(' · '))}</p><span class="guide-tile-cta">${s.places.length} places · Read the stage →</span></a>`).join('');
  const index = `<section class="guide-hero"><p class="eyebrow">Sicily / 5–12 October 2026</p><h1>Along the stage.</h1><p class="guide-intro">A few things to know, a few things to notice. Pick tomorrow's ride or revisit a place you've passed.</p></section><div class="guide-grid">${tiles}</div><p class="guide-note">${e(metadata.places_note)}</p>`;
  await writeFile(resolve(root, 'stages/index.html'), shell('Along the stage', 0, index));
  console.log(`Rendered ${guides.length} static stage guides and index`);
}
