#!/usr/bin/env node
/**
 * Build HTML article from Markdown source
 * 
 * Usage: node scripts/build-article.js <slug>
 * Example: node scripts/build-article.js adkbot-personal-ai-agent-adk-cloud-run
 * 
 * Expects:
 *   - article-drafts/<slug>.md with YAML frontmatter
 *   - Entry in articles-data.js
 * 
 * Creates:
 *   - articles/<slug>/index.html
 */

const fs = require('fs');
const path = require('path');

// Simple Markdown to HTML converter (no external dependencies)
function markdownToHtml(md) {
    let html = md;
    
    // Code blocks with language and optional description
    html = html.replace(/```(\w+)?(?:[ \t]+(.*))?\n([\s\S]*?)```/g, (match, lang, desc, code) => {
        let langLabel = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code';
        
        if (desc && desc.trim()) {
            const trimmedDesc = desc.trim();
            if (trimmedDesc.startsWith('-')) {
                langLabel = `${langLabel} ${trimmedDesc}`;
            } else {
                langLabel = `${langLabel} - ${trimmedDesc}`;
            }
        }
        
        return `<div class="code-block-header">
            <span>${langLabel}</span>
            <div class="code-block-actions">
                <button class="code-btn" onclick="copyCode(this)">Copy</button>
            </div>
        </div>
        <pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Tables - must be processed before other conversions
    html = html.replace(/\|(.+)\n\|[-\s|:]+\n((?:\|.+\n?)*)/g, (match) => {
        const lines = match.trim().split('\n');
        let tableHtml = '<table>\n<thead>\n<tr>';
        
        // Header row
        const headerCells = lines[0].split('|').filter(cell => cell.trim());
        headerCells.forEach(cell => {
            tableHtml += `<th>${cell.trim()}</th>`;
        });
        tableHtml += '</tr>\n</thead>\n<tbody>\n';
        
        // Data rows (skip separator line at index 1)
        for (let i = 2; i < lines.length; i++) {
            if (lines[i].trim()) {
                tableHtml += '<tr>';
                const cells = lines[i].split('|').filter(cell => cell.trim());
                cells.forEach(cell => {
                    tableHtml += `<td>${cell.trim()}</td>`;
                });
                tableHtml += '</tr>\n';
            }
        }
        tableHtml += '</tbody>\n</table>';
        return tableHtml;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers (page breaks handled by --- in markdown)
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Images (must be before links to avoid conflicts)
    // Support optional sizing: ![alt](path){50%} or ![alt](path){75%} etc.
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)(?:\{([^}]+)\})?/g, (match, alt, src, sizing) => {
        // Convert relative paths from markdown (../img/) to HTML (../../img/)
        // Markdown is in article-drafts/, HTML is in articles/article-name/
        const imageSrc = src.replace(/^\.\.\/img\//, '../../img/');
        
        // Extract filename without extension for caption
        const filename = imageSrc.split('/').pop().split('.')[0];
        // Convert snake_case to Title Case for caption
        const caption = filename
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        
        // Build style attribute if sizing is specified
        const style = sizing ? ` style="max-width: ${sizing};"` : '';
        
        return `<figure class="article-image">
            <img src="${imageSrc}" alt="${alt}"${style}>
            <figcaption>${caption}</figcaption>
        </figure>`;
    });
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Unordered lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>\n$&</ul>\n');
    
    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr style="margin: 2rem 0; border: none; border-top: 1px solid var(--border);">');
    
    // Paragraphs (lines not already wrapped)
    const lines = html.split('\n');
    const processedLines = [];
    let inList = false;
    let inPre = false;
    let inTable = false;
    let firstParagraph = true;
    
    for (let line of lines) {
        if (line.includes('<pre>')) inPre = true;
        if (line.includes('</pre>')) inPre = false;
        if (line.includes('<ul>')) inList = true;
        if (line.includes('</ul>')) inList = false;
        if (line.includes('<table>')) inTable = true;
        if (line.includes('</table>')) inTable = false;
        
        if (!inPre && !inList && !inTable &&
            line.trim() && 
            !line.trim().startsWith('<') && 
            !line.match(/^[\s]*$/)) {
            // Add drop-cap class to first paragraph
            if (firstParagraph) {
                line = `<p class="drop-cap">${line}</p>`;
                firstParagraph = false;
            } else {
                line = `<p>${line}</p>`;
            }
        }
        processedLines.push(line);
    }
    
    return processedLines.join('\n');
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Parse YAML frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, body: content };
    
    const frontmatter = {};
    const lines = match[1].split('\n');
    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Handle arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(s => s.trim().replace(/['"]/g, ''));
            }
            frontmatter[key] = value;
        }
    }
    
    return { frontmatter, body: match[2] };
}

// Site configuration
const SITE_CONFIG = {
    author: 'Sonika Janagill',
    siteUrl: 'https://sonikajanagill.com',
    favicon: '../../img/Sonika_Salmon.jpeg',
    copyrightYear: '2026',
    logoLight: '../../img/Sonika-Logo-Light.jpeg',
    logoDark: '../../img/Sonika-Logo-Dark.jpeg'
};

// HTML template
function generateHtml(article, bodyHtml) {
    const tags = Array.isArray(article.tags) ? article.tags : [article.tags];
    const tagsHtml = tags.map(tag => 
        `<a href="/articles/?tag=${tag}" class="blog-header-tag">#${tag}</a>`
    ).join('\n                    ');
    
    // Extract short title from full title if it contains a colon
    // e.g., "AdkBot: Building a Personal AI Agent..." → "AdkBot"
    const shortTitle = article.title.includes(':') ? article.title.split(':')[0].trim() : article.title;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - ${SITE_CONFIG.author}</title>
    <meta name="description" content="${article.description}">
    <meta name="author" content="${SITE_CONFIG.author}">
    <meta name="keywords" content="${tags.join(', ')}">

    <!-- Security Headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="DENY">
    <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin">
    <meta name="referrer" content="strict-origin-when-cross-origin">

    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${article.title}">
    <meta property="og:description" content="${article.description}">
    <meta property="og:url" content="${SITE_CONFIG.siteUrl}/${article.url}">
    <meta property="og:image" content="${SITE_CONFIG.siteUrl}/${article.image}">
    
    <!-- Canonical Link -->
    <link rel="canonical" href="${SITE_CONFIG.siteUrl}/${article.url}">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="${SITE_CONFIG.favicon}">

    <!-- Styles -->
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="../article-styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <img src="${SITE_CONFIG.logoLight}" alt="${SITE_CONFIG.author}" class="logo-light">
                <img src="${SITE_CONFIG.logoDark}" alt="${SITE_CONFIG.author}" class="logo-dark">
                <span class="nav-home-text">Home</span>
            </a>
            <ul class="nav-links">
                <li><a href="/about.html">About</a></li>
                <li><a href="/articles/">Articles</a></li>
                <li><a href="/contact.html">Contact</a></li>
                <li>
                    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
                        <img src="../../img/Sun.png" alt="Light mode" class="theme-icon theme-icon-light">
                        <img src="../../img/Moon.png" alt="Dark mode" class="theme-icon theme-icon-dark">
                    </button>
                </li>
            </ul>
        </div>
    </nav>

    <!-- Blog Header -->
    <header class="blog-header">
        <div class="container">
            <div class="blog-header-left">
                <div class="blog-header-tags">
                    ${tagsHtml}
                </div>
                <h2>${article.category || shortTitle}</h2>
                <p class="blog-subtitle">${article.title}</p>
                ${article.subtitle ? `<p><i>${article.subtitle}</i></p>` : ''}

            <div class="blog-header-right">
                <div class="blog-meta">
                    <div class="blog-meta-item">
                        <span>${article.date}</span>
                    </div>
                    <div class="blog-meta-item">
                        <span>${article.readTime}</span>
                    </div>
                </div>
                <div class="blog-share-buttons">
                    <a href="https://x.com/intent/tweet?url=${SITE_CONFIG.siteUrl}/${article.url}" class="blog-share-btn" title="Share on X" target="_blank" rel="noopener noreferrer">
                        <img src="../../img/x-icon.png" alt="X">
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=${SITE_CONFIG.siteUrl}/${article.url}" class="blog-share-btn" title="Share on LinkedIn" target="_blank" rel="noopener noreferrer">
                        <img src="../../img/linkedin-icon.png" alt="LinkedIn">
                    </a>
                    <a href="mailto:?subject=Check out this article&body=${SITE_CONFIG.siteUrl}/${article.url}" class="blog-share-btn" title="Share via Email">
                        <img src="../../img/email-icon.png" alt="Email">
                    </a>
                    <button onclick="copyShareLink(this)" class="blog-share-btn" title="Copy link">
                        <img src="../../img/copy-icon.png" alt="Copy">
                    </button>
                </div>
            </div>
            </div>
        </div>
    </header>

    <div class="article-header-image">
        <img src="../../${article.image}" alt="${article.title}">
        <p>Image generated using <a href="https://gemini.google.com/">Gemini</a></p>
    </div>

    <!-- Blog Content -->
    <main class="blog-content">
        <a href="../" class="back-link">← Back to Articles</a>

${bodyHtml}

        <!-- Share Section -->
        <div class="article-share">
            <p class="share-title">Share this article:</p>
            <div class="share-buttons">
                <a href="https://x.com/intent/tweet?url=${SITE_CONFIG.siteUrl}/${article.url}" class="blog-share-btn" title="Share on X" target="_blank" rel="noopener noreferrer">
                    <img src="../../img/x-icon.png" alt="X">
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=${SITE_CONFIG.siteUrl}/${article.url}" class="blog-share-btn" title="Share on LinkedIn" target="_blank" rel="noopener noreferrer">
                    <img src="../../img/linkedin-icon.png" alt="LinkedIn">
                </a>
                <a href="mailto:?subject=Check out this article&body=${SITE_CONFIG.siteUrl}/${article.url}" class="blog-share-btn" title="Share via Email">
                    <img src="../../img/email-icon.png" alt="Email">
                </a>
                <button onclick="copyShareLink(this)" class="blog-share-btn" title="Copy link">
                    <img src="../../img/copy-icon.png" alt="Copy">
                </button>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-content">
            <p>&copy; ${SITE_CONFIG.copyrightYear} ${SITE_CONFIG.author}. All rights reserved.</p>
        </div>
    </footer>

    <!-- Image Modal -->
    <div id="imageModal" class="image-modal">
        <div class="image-modal-content">
            <span class="image-modal-close">&times;</span>
            <img id="modalImage" src="" alt="">
            <div class="image-modal-caption" id="modalCaption"></div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script src="../article-utils.js"></script>
</body>
</html>`;
}

// Main
function main() {
    const slug = process.argv[2];
    
    if (!slug) {
        console.log('Usage: node scripts/build-article.js <slug>');
        console.log('Example: node scripts/build-article.js adkbot-personal-ai-agent-adk-cloud-run');
        process.exit(1);
    }
    
    // Read markdown source
    const mdPath = path.join(__dirname, '..', 'article-drafts', `${slug}.md`);
    if (!fs.existsSync(mdPath)) {
        console.error(`Error: ${mdPath} not found`);
        process.exit(1);
    }
    
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    const { frontmatter, body } = parseFrontmatter(mdContent);
    
    // Read articles-data.js to get full article metadata
    const articlesDataPath = path.join(__dirname, '..', 'articles-data.js');
    const articlesDataContent = fs.readFileSync(articlesDataPath, 'utf8');
    const match = articlesDataContent.match(/const articlesData = (\[[\s\S]*?\]);/);
    
    if (!match) {
        console.error('Could not parse articles-data.js');
        process.exit(1);
    }
    
    const articlesData = eval(match[1]);
    const article = articlesData.find(a => a.url.includes(slug));
    
    if (!article) {
        console.error(`Error: Article "${slug}" not found in articles-data.js`);
        console.log('Add the article to articles-data.js first.');
        process.exit(1);
    }
    
    // Merge frontmatter with articles-data
    const mergedArticle = { ...article, ...frontmatter };
    
    // Convert markdown body to HTML
    const bodyHtml = markdownToHtml(body);
    
    // Generate full HTML
    const html = generateHtml(mergedArticle, bodyHtml);
    
    // Create output directory
    const outputDir = path.join(__dirname, '..', 'articles', slug);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write HTML
    const outputPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(outputPath, html);
    
    console.log(`✓ Built articles/${slug}/index.html`);
    console.log(`  Title: ${article.title}`);
    console.log(`  Tags: ${article.tags.join(', ')}`);
}

main();
