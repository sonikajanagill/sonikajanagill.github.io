#!/usr/bin/env node
/**
 * Generate RSS feed (feed.xml) from articles-data.js
 * Run: node scripts/generate-feed.js
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

// Site metadata
const site = {
    title: 'Sonika Janagill',
    description: 'Insights on AI, MLOps, Cloud Architecture, and Enterprise Transformation',
    link: 'https://sonikajanagill.com',
    language: 'en-gb',
    author: 'Sonika Janagill',
    email: 'sonika.janagill@gmail.com'
};

// Convert article date to RFC 822 format
function dateToRFC822(dateStr) {
    const months = {
        'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
        'May': 'May', 'June': 'Jun', 'July': 'Jul', 'August': 'Aug',
        'September': 'Sep', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };
    
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
        const month = months[parts[0]] || 'Jan';
        const year = parts[1];
        return `15 ${month} ${year} 12:00:00 GMT`;
    }
    return new Date().toUTCString();
}

// Escape XML special characters
function escapeXml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Generate RSS feed
const buildDate = new Date().toUTCString();

let feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>${escapeXml(site.title)}</title>
    <description>${escapeXml(site.description)}</description>
    <link>${site.link}</link>
    <language>${site.language}</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${site.link}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${site.email} (${site.author})</managingEditor>
    <webMaster>${site.email} (${site.author})</webMaster>
`;

// Add articles as items
for (const article of articlesData) {
    const pubDate = dateToRFC822(article.date);
    const tags = Array.isArray(article.tags) ? article.tags : [article.tag];
    const categories = tags.map(tag => `        <category>${escapeXml(tag)}</category>`).join('\n');
    
    feed += `
    <item>
        <title>${escapeXml(article.title)}</title>
        <description>${escapeXml(article.description)}</description>
        <link>${site.link}/${article.url}</link>
        <guid isPermaLink="true">${site.link}/${article.url}</guid>
        <pubDate>${pubDate}</pubDate>
        <author>${site.email} (${site.author})</author>
${categories}
    </item>
`;
}

feed += `</channel>
</rss>
`;

// Write feed
const feedPath = path.join(__dirname, '..', 'feed.xml');
fs.writeFileSync(feedPath, feed);
console.log(`✓ Generated feed.xml with ${articlesData.length} articles`);
