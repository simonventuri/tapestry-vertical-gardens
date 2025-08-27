import { deleteContact } from '../../../../lib/database';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Check authentication
    const token = req.cookies.admin_token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ message: 'Contact ID is required' });
        }

        await deleteContact(id);

        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Failed to delete contact' });
    }
}
