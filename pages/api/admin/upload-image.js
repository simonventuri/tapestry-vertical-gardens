import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { requireAuth } from '../../../lib/auth';

// Configure multer for file uploads
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = './public/images';
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        // Only allow image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Helper to promisify multer
const uploadSingle = upload.single('image');

async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Handle file upload
        await new Promise((resolve, reject) => {
            uploadSingle(req, res, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return the file path relative to public directory
        const filePath = `./images/${req.file.filename}`;

        res.status(200).json({
            message: 'File uploaded successfully',
            filePath: filePath,
            fileName: req.file.filename
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            message: 'Upload failed',
            error: error.message
        });
    }
}

export default requireAuth(handler);

export const config = {
    api: {
        bodyParser: false,
    },
};
