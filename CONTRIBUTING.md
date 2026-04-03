# Contributing & Building

This document covers the build process and publishing workflow for the site. Not relevant for casual visitors.

## Structure

```
├── articles/                    # Published articles (HTML)
│   ├── [slug]/index.html       # Individual article pages
│   ├── article-styles.css      # Shared article styles
│   ├── article-utils.js        # Shared article utilities
│   └── index.html              # Articles listing page
├── article-drafts/             # Markdown drafts & backlog
│   ├── [slug].md               # Article source (MD + frontmatter)
│   └── BACKLOG.md              # Content pipeline tracking
├── img/                        # Images and assets
├── scripts/                    # Build scripts
│   ├── build-all.js            # Run all generators
│   ├── build-article.js        # MD → HTML converter
│   ├── generate-feed.js        # RSS feed generator
│   └── generate-sitemap.js     # Sitemap generator
├── articles-data.js            # Single source of truth for articles
├── feed.xml                    # RSS feed (auto-generated)
├── sitemap.xml                 # Sitemap (auto-generated)
└── index.html                  # Homepage
```

## Adding a New Article

1. **Add entry to `articles-data.js`:**
   ```javascript
   {
       id: 10,
       title: 'Your Article Title',
       date: 'April 2026',
       tags: ['AI', 'Cloud'],
       readTime: '8 min read',
       description: 'Article description for SEO and cards.',
       url: 'articles/your-article-slug/',
       image: 'img/your_article_image.png'
   }
   ```

2. **Create article HTML:**
   - Copy an existing article as template
   - Or create `article-drafts/your-article-slug.md` and run:
     ```bash
     node scripts/build-article.js your-article-slug
     ```

3. **Regenerate sitemap and RSS:**
   ```bash
   node scripts/build-all.js
   ```

4. **Add hero image** to `img/` directory

## Build Scripts

| Script | Purpose |
|--------|---------|
| `node scripts/build-all.js` | Regenerate sitemap.xml and feed.xml |
| `node scripts/generate-sitemap.js` | Generate sitemap.xml from articles-data.js |
| `node scripts/generate-feed.js` | Generate RSS feed.xml from articles-data.js |
| `node scripts/build-article.js <slug>` | Build HTML from MD draft (experimental) |

## Local Development

```bash
# Simple HTTP server
python3 -m http.server 8000
# or
npx serve .
```

## Deployment

Site is deployed via GitHub Pages. Push to `main` triggers automatic deployment.

## RSS Feed

Subscribe: [sonikajanagill.com/feed.xml](https://sonikajanagill.com/feed.xml)

## License

Content © Sonika Janagill. All rights reserved.
