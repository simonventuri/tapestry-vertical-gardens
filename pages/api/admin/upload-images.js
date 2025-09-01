import { requireAuth } from '../../../lib/auth';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

// Disable default body parser to handle multipart/form-data
export const config = {
    api: {
        bodyParser: false,
    },
};

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const form = new IncomingForm({
            uploadDir: path.join(process.cwd(), 'public', 'uploads'),
            keepExtensions: true,
            maxFileSize: 10 * 1024 * 1024, // 10MB per file
        });

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        form.parse(req, (err, fields, files) => {
            if (err) {
                console.error('Error parsing form:', err);
                return res.status(500).json({ message: 'Error uploading files' });
            }

            const uploadedImages = [];

            // Handle single or multiple files
            const imageFiles = Array.isArray(files.images) ? files.images : [files.images].filter(Boolean);

            imageFiles.forEach(file => {
                if (file && file.filepath) {
                    // Generate a unique filename
                    const timestamp = Date.now();
                    const random = Math.random().toString(36).substring(7);
                    const extension = path.extname(file.originalFilename || '');
                    const newFilename = `${timestamp}-${random}${extension}`;
                    const newPath = path.join(uploadDir, newFilename);

                    // Move file to final location
                    fs.renameSync(file.filepath, newPath);

                    // Store relative path for database
                    uploadedImages.push(`/uploads/${newFilename}`);
                }
            });

            res.status(200).json({
                message: 'Images uploaded successfully',
                images: uploadedImages
            });
        });

    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default requireAuth(handler);
