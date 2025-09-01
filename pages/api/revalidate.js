// API route for on-demand ISR revalidation
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Check for authentication (use the same admin token for simplicity)
    const token = req.headers.authorization?.replace('Bearer ', '') || req.cookies.admin_token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { oldSlug, newSlug, projectId } = req.body;

        // Revalidate the affected pages
        const pagesToRevalidate = [];

        // Always revalidate the portfolio page
        pagesToRevalidate.push('/portfolio');

        // If old slug exists, revalidate the old page
        if (oldSlug) {
            pagesToRevalidate.push(`/projects/${oldSlug}`);
        }

        // If new slug exists and is different, revalidate the new page
        if (newSlug && newSlug !== oldSlug) {
            pagesToRevalidate.push(`/projects/${newSlug}`);
        }

        // Revalidate all pages
        const results = await Promise.allSettled(
            pagesToRevalidate.map(async (path) => {
                try {
                    await res.revalidate(path);
                    console.log(`Revalidated: ${path}`);
                    return { path, success: true };
                } catch (err) {
                    console.error(`Failed to revalidate ${path}:`, err);
                    return { path, success: false, error: err.message };
                }
            })
        );

        return res.json({
            revalidated: true,
            pages: pagesToRevalidate,
            results: results.map(r => r.value),
            message: 'Pages revalidation attempted'
        });
    } catch (err) {
        console.error('Revalidation error:', err);
        return res.status(500).json({ message: 'Error revalidating pages', error: err.message });
    }
}
