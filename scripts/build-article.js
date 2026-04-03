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
    
    // Code blocks with language
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        const langLabel = lang ? lang.charAt(0).toUpperCase() + lang.slice(1) : 'Code';
        return `<div class="code-block-header">
            <span>${langLabel}</span>
            <div class="code-block-actions">
                <button class="code-btn" onclick="copyCode(this)">Copy</button>
            </div>
        </div>
        <pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Headers
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    
    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
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
    
    for (let line of lines) {
        if (line.includes('<pre>')) inPre = true;
        if (line.includes('</pre>')) inPre = false;
        if (line.includes('<ul>')) inList = true;
        if (line.includes('</ul>')) inList = false;
        
        if (!inPre && !inList && 
            line.trim() && 
            !line.startsWith('<') && 
            !line.match(/^[\s]*$/)) {
            line = `<p>${line}</p>`;
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

// HTML template
function generateHtml(article, bodyHtml) {
    const tags = Array.isArray(article.tags) ? article.tags : [article.tags];
    const tagsHtml = tags.map(tag => 
        `<a href="/articles/?tag=${tag}" class="blog-header-tag">#${tag}</a>`
    ).join('\n                    ');
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${article.title} - Sonika Janagill</title>
    <meta name="description" content="${article.description}">
    <meta name="author" content="Sonika Janagill">
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
    <meta property="og:url" content="https://sonikajanagill.com/${article.url}">
    <meta property="og:image" content="https://sonikajanagill.com/${article.image}">
    
    <!-- Canonical Link -->
    <link rel="canonical" href="https://sonikajanagill.com/${article.url}">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="../../img/Sonika_Salmon.jpeg">

    <!-- Styles -->
    <link rel="stylesheet" href="../../styles.css">
    <link rel="stylesheet" href="../article-styles.css">
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="nav-container">
            <a href="/" class="nav-logo">
                <img src="../../img/Sonika-Logo-Light.jpeg" alt="Sonika Janagill" class="logo-light">
                <img src="../../img/Sonika-Logo-Dark.jpeg" alt="Sonika Janagill" class="logo-dark">
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
                <h2>${article.category || tags[0]}</h2>
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
                    <a href="https://x.com/intent/tweet?url=https://sonikajanagill.com/${article.url}" class="blog-share-btn" title="Share on X" target="_blank" rel="noopener noreferrer">
                        <img src="../../img/x-icon.png" alt="X">
                    </a>
                    <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://sonikajanagill.com/${article.url}" class="blog-share-btn" title="Share on LinkedIn" target="_blank" rel="noopener noreferrer">
                        <img src="../../img/linkedin-icon.png" alt="LinkedIn">
                    </a>
                    <a href="mailto:?subject=Check out this article&body=https://sonikajanagill.com/${article.url}" class="blog-share-btn" title="Share via Email">
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
                <a href="https://x.com/intent/tweet?url=https://sonikajanagill.com/${article.url}" class="blog-share-btn" title="Share on X" target="_blank" rel="noopener noreferrer">
                    <img src="../../img/x-icon.png" alt="X">
                </a>
                <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://sonikajanagill.com/${article.url}" class="blog-share-btn" title="Share on LinkedIn" target="_blank" rel="noopener noreferrer">
                    <img src="../../img/linkedin-icon.png" alt="LinkedIn">
                </a>
                <a href="mailto:?subject=Check out this article&body=https://sonikajanagill.com/${article.url}" class="blog-share-btn" title="Share via Email">
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
            <p>&copy; 2025 Sonika Janagill. All rights reserved.</p>
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
