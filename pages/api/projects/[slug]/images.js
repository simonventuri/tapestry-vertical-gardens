// API route to return gallery images for a project
import { getPortfolioItem } from '../../../../lib/database';

export default async function handler(req, res) {
  const {
    query: { slug },
  } = req;
  // Log incoming request for debugging
  console.log('[API] /api/projects/[slug]/images called', { slug, method: req.method });
  // Disable caching for this API route
  res.setHeader('Cache-Control', 'no-store');
  try {
    const project = await getPortfolioItem(slug);
    if (!project || !project.images) {
      console.log('[API] Project not found or no images', { slug });
      return res.status(404).json({ images: [] });
    }
    console.log('[API] Returning images', { slug, count: project.images.length });
    res.status(200).json({ images: project.images });
  } catch (e) {
    console.error('[API] Error fetching images', { slug, error: e });
    res.status(500).json({ images: [] });
  }
}
