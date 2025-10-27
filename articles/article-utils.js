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
 * Initialize image lightbox modal for clickable full-size viewing
 */
function initializeImageLightbox() {
    // Create modal container if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="image-modal-content">
                <span class="image-modal-close">&times;</span>
                <img id="modalImage" src="" alt="">
                <div class="image-modal-caption" id="modalCaption"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.image-modal-close');

    // Add click listeners to all blog images
    document.querySelectorAll('.blog-content img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            modal.classList.add('active');
            modalImage.src = img.src;
            modalCaption.textContent = img.alt || '';
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking the X button
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
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
    initializeImageLightbox();
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
