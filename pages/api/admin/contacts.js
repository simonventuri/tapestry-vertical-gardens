import { getContacts } from '../../../lib/database.js';
import { requireAuth } from '../../../lib/auth.js';

export default async function handler(req, res) {
    // Check authentication
    try {
        await requireAuth(req, res);
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const contacts = await getContacts();
            res.status(200).json(contacts);
        } catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ message: 'Failed to fetch contacts' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
