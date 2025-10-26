/* ===========================
   Reusable Article Utilities
   =========================== */

/**
 * Auto-populate tooltips from alt text for blog images
 * Runs on page load
 */
function initializeImageTooltips() {
    document.querySelectorAll('.blog-content img').forEach(img => {
        if (!img.title && img.alt) {
            img.title = img.alt;
        }
    });
}

/**
 * Copy code block to clipboard
 * @param {HTMLElement} button - The copy button element
 */
function copyCode(button) {
    const pre = button.closest('.code-block-header').nextElementSibling;
    const code = pre.querySelector('code').innerText;
    
    navigator.clipboard.writeText(code).then(() => {
        button.textContent = '✓ Copied!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = '📋 Copy';
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
    });
}

/**
 * Inject article hashtags after Back to Home link
 * Hashtags link to articles list page with filter applied
 */
function injectArticleHashtags() {
    // Get article tags from the page URL or data attribute
    const urlPath = window.location.pathname;
    let tags = [];
    
    // Map article URLs to their tags
    const articleTagMap = {
        'composer-vs-vertex-ai-pipelines': ['MLOps', 'AI/ML'],
        'why-hackathons-fast-track-ai-mastery': ['Technology', 'Leadership'],
        'mlops-vertex-ai-best-practices': ['MLOps'],
        'leading-ai-transformation-enterprise-teams': ['Leadership'],
        'building-production-ready-rag-systems': ['AI/ML']
    };
    
    // Find matching article
    for (const [slug, articleTags] of Object.entries(articleTagMap)) {
        if (urlPath.includes(slug)) {
            tags = articleTags;
            break;
        }
    }
    
    if (tags.length === 0) return;
    
    // Create hashtags section
    const hashtagsSection = document.createElement('div');
    hashtagsSection.style.cssText = 'margin-top: 0.5rem; margin-bottom: 1rem; font-size: 0.9rem;';
    
    const tagsHTML = tags.map(tag => 
        `<a href="../?tag=${tag}" style="display: inline-block; margin-right: 1rem; color: var(--primary); text-decoration: none; font-weight: 500; cursor: pointer;">#${tag}</a>`
    ).join('');
    
    hashtagsSection.innerHTML = tagsHTML;
    
    // Find the back link and insert after it
    const backLink = document.querySelector('.back-link') || document.querySelector('a[href*="Back"]');
    if (backLink) {
        backLink.parentNode.insertBefore(hashtagsSection, backLink.nextSibling);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeImageTooltips();
    injectArticleHashtags();
    
    // Initialize Highlight.js for syntax highlighting
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
