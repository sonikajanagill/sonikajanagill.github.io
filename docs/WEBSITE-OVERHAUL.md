# Website Overhaul Brief — sonikajanagill.com

Spec for Claude Code. Rebrand + restructure of the existing static site. Keep the stack as-is: plain HTML/CSS/JS, no build system, `articles-data.js` as the single source of truth, British English throughout.

## 1. Goals

1. Modern, distinctive look built around a personal brand: "futuristic but sustainable" (solarpunk / the utopian opening of *Abundance* by Ezra Klein).
2. Make it obvious within 5 seconds who Sonika is (Lead Backend Engineer, GDE in Cloud AI and Google Cloud, 20 years' experience) and what a visitor can do: read articles, book her to speak, request mentoring, contact her.
3. Brand system reusable for AI-generated blog images, so every article cover looks like it belongs to the same family.
4. Keep canonical-link publishing flow to Medium/Dev.to untouched.

## 2. Research takeaways (what strong tech personal sites do)

- Clear hero with name, one-line positioning, current focus, and 1–2 CTAs above the fold.
- Selective showcase: 6–10 strong items (articles/talks/projects) beat exhaustive lists; each framed as problem → approach → outcome.
- Social proof surfaced early: certifications, GDE badge, hackathon wins, talk logos.
- Obvious calls to action ("Invite me to speak", "Get in touch") rather than passive footers.
- Grouped skills (AI/ML, Cloud, Backend, DevOps) instead of long flat lists.
- Simple navigation, fast load, restrained animation (reveal-on-scroll is fine; avoid heavy hero animations).
- Consistent branded imagery across blog covers and social cards.

## 3. Information architecture

Navigation (top bar, sticky, with theme toggle):

`Home · Articles · Speaking · Mentoring · About · Contact`

### Home (index.html)
1. **Hero**: name, tagline, sub-line ("Lead Backend Engineer · Google Developer Expert, Cloud AI & Google Cloud · 20 years building enterprise systems"), CTAs: "Read articles" (primary) and "Invite me to speak" (secondary). Brand backdrop illustration (see §6).
2. **Now strip**: one line on current focus (MLOps, embeddings, AI agents) — easy to edit.
3. **Featured articles**: 3 cards from `articles-data.js` (add a `featured: true` flag).
4. **Highlights band**: 4 compact stat/proof cards — GDE (Mar 2026), GCP Professional Architect + Professional ML Engineer, AWS AI hackathon win (Jan 2025), global AI Guild sessions.
5. **Speaking teaser**: next/most recent talk + link to Speaking page.
6. **Connect**: LinkedIn, Medium, Dev.to, GitHub, email, RSS.

### Articles (new listing page: articles/index.html)
- Full listing rendered from `articles-data.js` with tag filter chips (AI Agents, RAG, MLOps, GCP, AWS, Quantum, Career).
- Each card: branded cover image, title, date, read time, tags, canonical badges (Medium/Dev.to icons where cross-posted).

### Speaking (speaking/)
- Hero line: topics she speaks on (AI in SDLC, RAG, AI Agents, QuantumAI, MLOps).
- Past talks from `speaking-data.js` (existing), plus a clear "Book me" CTA linking to Contact with a subject preset.

### Mentoring (new page: mentoring.html)
- Short page: who it's for, what she helps with (career transitions into AI/ML, cloud certifications, women in tech), how to request (contact link). Keep it honest and lightweight.

### About + Contact
- Keep, restyle to new brand. About gets a timeline strip: Java/Insurance (2006) → HCL Commerce (~14 yrs) → AI/Data/ML at WPP Satalia → GDE 2026.

## 4. Colour system — LOCKED: "Emerald Dawn"

Chosen direction (12 Jul 2026): Canopy Tech's green base with Dawn Horizon's apricot and lavender accents.

**Brand rule: NO yellow or yellow-green tones anywhere** (no gold, lime, sand, mustard). Applies to the site, illustrations, and all AI-generated blog imagery.

Replace the current coral palette in `styles.css`. Keep the existing `:root` / `[data-theme="dark"]` variable structure so components inherit automatically.

```css
:root {
    --primary: #0F8A6D;        /* emerald - primary actions */
    --primary-hover: #0C7157;
    --secondary: #16808F;      /* horizon teal - links, illustration lines */
    --accent: #F2A05F;         /* sunrise apricot - highlights, tags */
    --accent-2: #C9B8E8;       /* pastel lavender - secondary highlights */
    --bg-main: #F4F7F3;        /* mint mist */
    --bg-secondary: #EAF0EA;
    --bg-card: #FFFFFF;
    --text-primary: #17251E;   /* evergreen ink */
    --text-secondary: #4E6459;
    --text-tertiary: #7E9186;
    --pastel-1: #DDE9E1;       /* pale sage - section tints */
    --pastel-2: #FAE0C8;       /* peach - soft chips */
    --pastel-3: #E2DAF2;       /* lilac - soft chips */
    --pastel-4: #BFDDE4;       /* sky wash - soft chips */
    --primary-soft: rgba(15, 138, 109, 0.08);
    --glow: rgba(15, 138, 109, 0.12);
}
[data-theme="dark"] {
    --primary: #4FC3A1;
    --primary-hover: #6BD1B3;
    --secondary: #5FB7C4;
    --accent: #F2A05F;
    --accent-2: #C9B8E8;
    --bg-main: #0E1713;
    --bg-secondary: #14211B;
    --bg-card: #1A2A22;
    --text-primary: #E4EEE8;
    --text-secondary: #9AB0A4;
    --text-tertiary: #6E8377;
    --primary-soft: rgba(79, 195, 161, 0.1);
    --glow: rgba(79, 195, 161, 0.15);
}
```

Usage rules: emerald for primary CTAs and interactive states; teal for hyperlinks and line illustrations; apricot and lavender for highlights, tag chips and illustration fills only, never body text. WCAG AA contrast (4.5:1) for all body text in both themes. Keep shadow and radius patterns from the current stylesheet.

## 5. Typography — LOCKED

Headings: **Fraunces** (variable opsz, 400-500) for h1/h2 and article titles — the organic-futuristic serif from the original Solar Meadow direction. **Space Grotesk** (500) for small UI labels, nav links and buttons. Body: **Inter**. Code: **JetBrains Mono**.

- Load via Google Fonts with `display=swap`, subset to `latin`.
- Type scale: hero 3.2rem (clamp down to 2.2rem mobile), h2 2rem, h3 1.4rem, body 1.05rem/1.7.
- Sentence case for headings; avoid all-caps except tiny labels.

## 6. Backdrop and visual language

- **Hero backdrop**: a single wide SVG illustration (inline, themable via CSS variables) of a gentle dawn horizon: rolling green hills, 2–3 wind turbines, canopy/leaf-circuit line motifs, a soft peach-to-sky morning sky (apricot #F2A05F into sky wash #BFDDE4, muted, never yellow). Thin-line style in teal #16808F, 1.5px strokes, flat pastel fills, no photorealism.
- **Section separators**: soft curved dividers (SVG waves), not hard rules.
- **Texture**: very subtle grain/noise overlay on `--bg-main` at ~3% opacity (CSS `background-image` data-URI), optional.
- **Cards**: rounded 1rem, hairline border, small shadow; hover lifts 2px.
- **Motif set** (reused everywhere including blog images): sun disc, leaf, wind turbine, circuit trace that ends in a leaf, horizon line. Create these as small inline SVGs in an `img/brand/` folder.
- **Motion**: keep existing reveal-on-scroll; add `prefers-reduced-motion` guard.

## 7. Brand kit for AI-generated blog images

Create `docs/BRAND.md` containing:

- Final palette hex codes (Emerald Dawn, §4) and font names (Fraunces headings, Space Grotesk UI labels, Inter body, JetBrains Mono code).
- Logo/monogram: a simple "SJ" monogram inside a sun/leaf ring (create as SVG; used as favicon and watermark).
- **Cover image prompt template** for image generation:

> "Flat vector illustration in solarpunk style, [SUBJECT e.g. 'a data pipeline flowing through a greenhouse of servers'], thin line art with pastel fills, colour palette #0F8A6D emerald, #16808F teal, #F2A05F apricot, #C9B8E8 lavender, #DDE9E1 pale sage, mint-white background #F4F7F3, strictly no yellow or gold tones, wind turbines and foliage motifs in the background, clean composition, generous negative space top-left for title text, no text in image, 1200x630"

- Rules: same palette every time, no text baked into images, 1200×630 for social cards, put the SJ monogram bottom-right at 5% size.
- Add `og:image` per article pointing at its branded cover in `img/`.

## 8. Implementation plan (phases for Claude Code)

1. **Phase 1 — Design system**: swap palette + fonts in `styles.css` (Emerald Dawn, §4), update dark theme, add brand SVG motifs and hero backdrop, update nav to new IA.
2. **Phase 2 — Home**: rebuild index.html sections per §3 (hero, now strip, featured, highlights, speaking teaser, connect).
3. **Phase 3 — New pages**: articles listing with tag filters, mentoring.html; restyle about/contact/speaking.
4. **Phase 4 — Brand kit**: BRAND.md, SJ monogram SVG + favicon, og:image wiring, regenerate covers for top articles.
5. **Phase 5 — QA**: Lighthouse (target 95+ across the board), AA contrast check both themes, mobile at 360px, validate feed.xml and sitemap still correct, `prefers-reduced-motion`.

## 9. Constraints

- No frameworks, no build step. Inline SVG over image files where practical.
- Don't break existing article URLs (`articles/[slug]/index.html`) or canonical links.
- `articles-data.js` stays the single source of truth; extend it (add `featured`, `cover`, `tags`) rather than replacing it.
- British English everywhere.
