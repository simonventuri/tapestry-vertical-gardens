import { getPortfolioItems } from '../../lib/database';

export default async function handler(req, res) {
    try {
        const projects = await getPortfolioItems();
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://tapestryverticalgardens.com'
            : 'http://localhost:3000';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Static Pages -->
    <url>
        <loc>${baseUrl}/home</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${baseUrl}/contact</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${baseUrl}/privacy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${baseUrl}/portfolio</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${baseUrl}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    
    <!-- Dynamic Project Pages -->
    ${projects.map(project => `
    <url>
        <loc>${baseUrl}/projects/${project.slug}</loc>
        <lastmod>${project.updatedAt || project.createdAt}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.9</priority>
    </url>`).join('')}
</urlset>`;

        res.setHeader('Content-Type', 'text/xml');
        res.status(200).send(sitemap);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.status(500).json({ error: 'Failed to generate sitemap' });
    }
}
