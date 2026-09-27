# Brand Kit — sonikajanagill.com ("Emerald Dawn")

Locked 12 July 2026. Every visual on the site and every AI-generated blog image follows this kit so the whole portfolio reads as one family.

**Hard rule: NO yellow or yellow-green tones anywhere** — no gold, lime, sand or mustard. Applies to the site, illustrations, and all AI-generated imagery.

## Palette

### Light theme

| Token | Hex | Use |
|---|---|---|
| Emerald | `#0F8A6D` | Primary actions, interactive states |
| Emerald hover | `#0C7157` | Hover state for primary |
| Horizon teal | `#16808F` | Hyperlinks, illustration line work |
| Sunrise apricot | `#F2A05F` | Highlights, tag chips, sun motifs — never body text |
| Pastel lavender | `#C9B8E8` | Secondary highlights, illustration fills — never body text |
| Mint mist | `#F4F7F3` | Page background |
| Evergreen ink | `#17251E` | Primary text |
| Pale sage | `#DDE9E1` | Section tints |
| Peach | `#FAE0C8` | Soft chips |
| Lilac | `#E2DAF2` | Soft chips |
| Sky wash | `#BFDDE4` | Soft chips |

### Dark theme

| Token | Hex |
|---|---|
| Emerald (dark) | `#4FC3A1` |
| Teal (dark) | `#5FB7C4` |
| Apricot / lavender | unchanged (`#F2A05F` / `#C9B8E8`) |
| Background | `#0E1713` |
| Card | `#1A2A22` |
| Text | `#E4EEE8` |

All body text must meet WCAG AA contrast (4.5:1) in both themes.

## Typography

- **Headings / article titles**: Fraunces (variable optical size, weights 400–500)
- **UI labels, nav, buttons**: Space Grotesk (500–600)
- **Body**: Inter
- **Code**: JetBrains Mono
- Sentence case for headings; no all-caps except tiny labels.

## Logo / monogram

`img/brand/sj-monogram.svg` — "SJ" in Fraunces inside a sun/leaf ring (emerald ring, apricot rays, leaf at top-right). `img/brand/favicon.svg` is the tile version used as the site favicon. Use the monogram as a watermark on blog covers: **bottom-right, ~5% of image width**.

## Motif set

Reused across the site and blog imagery (`img/brand/`):

- `sun.svg` — sun disc with teal rays
- `leaf.svg` — thin-line leaf with pale sage fill
- `turbine.svg` — wind turbine with lavender blades
- `circuit-leaf.svg` — circuit trace that ends in a leaf
- `horizon.svg` — horizon line with rising sun

Style rules: thin line art in horizon teal `#16808F` at 1.5px strokes, flat pastel fills, no photorealism.

## Cover image prompt template

Use this for every AI-generated article cover — swap only the `[SUBJECT]`:

> "Flat vector illustration in solarpunk style, [SUBJECT e.g. 'a data pipeline flowing through a greenhouse of servers'], thin line art with pastel fills, colour palette #0F8A6D emerald, #16808F teal, #F2A05F apricot, #C9B8E8 lavender, #DDE9E1 pale sage, mint-white background #F4F7F3, strictly no yellow or gold tones, wind turbines and foliage motifs in the background, clean composition, generous negative space top-left for title text, no text in image, 1200x630"

## Cover image rules

1. Same palette every time — regenerate if the model sneaks in yellow/gold.
2. No text baked into images (titles are overlaid by the platform).
3. 1200×630 for social cards (`og:image`).
4. SJ monogram bottom-right at 5% size.
5. Save to `img/` and set the article's `og:image` to the absolute URL (`https://sonikajanagill.com/img/...`).
6. Reference the cover in `articles-data.js` (`image` field) so listings pick it up.
