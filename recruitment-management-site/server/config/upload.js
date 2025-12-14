import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directories if they don't exist
const uploadsDir = path.join(__dirname, '../uploads/profiles');
const cvDocsDir = path.join(__dirname, '../uploads/cvs');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(cvDocsDir)) {
    fs.mkdirSync(cvDocsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: userId-timestamp.ext
        const uniqueName = `${req.params.userId || req.body.userId}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Upload middleware for profile pictures
export const uploadProfilePicture = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

// Storage configuration for CV documents
const cvStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, cvDocsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `cv-${req.body.userId || 'user'}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// File filter for CV documents - allow PDF, DOC, DOCX, images
const cvFileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /pdf|msword|vnd.openxmlformats|image/.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, DOCX, and image files are allowed'));
    }
};

// Upload middleware for CV documents
export const uploadCVFiles = multer({
    storage: cvStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit for documents
    },
    fileFilter: cvFileFilter
});

