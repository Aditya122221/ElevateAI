const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for profile pictures
const profilePictureStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'elevate-ai/profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto' }
        ]
    }
});

// Configure storage for project images
const projectImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'elevate-ai/project-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto' }
        ]
    }
});

// Configure storage for certificate images
const certificateImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'elevate-ai/certificates',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: [
            { width: 800, height: 600, crop: 'fill' },
            { quality: 'auto' }
        ]
    }
});

// Create multer upload instances
const uploadProfilePicture = multer({
    storage: profilePictureStorage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const uploadProjectImage = multer({
    storage: projectImageStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const uploadCertificateImage = multer({
    storage: certificateImageStorage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only image and PDF files are allowed'), false);
        }
    }
});

// Helper function to delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
    if (!url) return null;
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    const publicId = filename.split('.')[0];
    const folder = parts[parts.length - 2];
    return `${folder}/${publicId}`;
};

module.exports = {
    cloudinary,
    uploadProfilePicture,
    uploadProjectImage,
    uploadCertificateImage,
    deleteImage,
    extractPublicId
};
