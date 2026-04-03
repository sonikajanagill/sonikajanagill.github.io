#!/usr/bin/env node
/**
 * Generate sitemap.xml from articles-data.js
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');

// Read articles-data.js and extract the array
const articlesDataPath = path.join(__dirname, '..', 'articles-data.js');
const articlesDataContent = fs.readFileSync(articlesDataPath, 'utf8');

// Extract the array from the JS file
const match = articlesDataContent.match(/const articlesData = (\[[\s\S]*?\]);/);
if (!match) {
    console.error('Could not parse articles-data.js');
    process.exit(1);
}

// Parse the array (using eval since it's trusted local data)
const articlesData = eval(match[1]);

// Static pages
const staticPages = [
    { loc: 'https://sonikajanagill.com/', priority: '1.0', changefreq: 'weekly' },
    { loc: 'https://sonikajanagill.com/about.html', priority: '0.9', changefreq: 'monthly' },
    { loc: 'https://sonikajanagill.com/contact.html', priority: '0.8', changefreq: 'monthly' },
    { loc: 'https://sonikajanagill.com/articles/', priority: '0.9', changefreq: 'weekly' },
];

// Convert article date to ISO format (approximate)
function dateToISO(dateStr) {
    const months = {
        'January': '01', 'February': '02', 'March': '03', 'April': '04',
        'May': '05', 'June': '06', 'July': '07', 'August': '08',
        'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
        const month = months[parts[0]] || '01';
        const year = parts[1];
        return `${year}-${month}-15`;
    }
    return new Date().toISOString().split('T')[0];
}

// Generate sitemap XML
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static pages
const today = new Date().toISOString().split('T')[0];
for (const page of staticPages) {
    sitemap += `    <url>
        <loc>${page.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>
    </url>
`;
}

// Add articles
for (const article of articlesData) {
    const lastmod = dateToISO(article.date);
    sitemap += `    <url>
        <loc>https://sonikajanagill.com/${article.url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
`;
}

sitemap += `</urlset>
`;

// Write sitemap
const sitemapPath = path.join(__dirname, '..', 'sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);
console.log(`✓ Generated sitemap.xml with ${staticPages.length + articlesData.length} URLs`);
