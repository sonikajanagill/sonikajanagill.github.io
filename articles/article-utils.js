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

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeImageTooltips();
    
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
