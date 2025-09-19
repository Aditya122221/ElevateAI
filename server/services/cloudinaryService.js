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
        folder: 'Elevate AI/profile-pictures',
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
        folder: 'Elevate AI/project-images',
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
        folder: 'Elevate AI/certificates',
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
        console.log('Attempting to delete image with public ID:', publicId);
        const result = await cloudinary.uploader.destroy(publicId);
        console.log('Cloudinary delete result:', result);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Helper function to upload base64 image to Cloudinary
const uploadBase64Image = async (base64Data, folder = 'Elevate AI/profile-pictures') => {
    try {
        const result = await cloudinary.uploader.upload(base64Data, {
            folder: folder,
            transformation: [
                { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                { quality: 'auto' }
            ]
        });
        return result;
    } catch (error) {
        console.error('Error uploading base64 image to Cloudinary:', error);
        throw error;
    }
};

// Helper function to extract public ID from Cloudinary URL
const extractPublicId = (url) => {
    if (!url || !url.includes('cloudinary.com')) return null;

    try {
        // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
        // or: https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{format}
        const urlParts = url.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');

        if (uploadIndex === -1) return null;

        // Get all parts after 'upload'
        const afterUpload = urlParts.slice(uploadIndex + 1);

        // Skip version number if present (starts with 'v' followed by digits)
        let startIndex = 0;
        if (afterUpload[0] && afterUpload[0].startsWith('v') && /^\d+$/.test(afterUpload[0].slice(1))) {
            startIndex = 1;
        }

        // Join all remaining parts to get the full public ID with folder structure
        const publicIdWithFormat = afterUpload.slice(startIndex).join('/');

        if (!publicIdWithFormat) return null;

        // Remove file extension to get public ID
        const lastSlashIndex = publicIdWithFormat.lastIndexOf('/');
        if (lastSlashIndex !== -1) {
            const folderPath = publicIdWithFormat.substring(0, lastSlashIndex);
            const filename = publicIdWithFormat.substring(lastSlashIndex + 1);
            const publicId = filename.split('.')[0];
            return `${folderPath}/${publicId}`;
        } else {
            // No folder structure, just filename
            return publicIdWithFormat.split('.')[0];
        }
    } catch (error) {
        console.error('Error extracting public ID from URL:', url, error);
        return null;
    }
};

module.exports = {
    cloudinary,
    uploadProfilePicture,
    uploadProjectImage,
    uploadCertificateImage,
    deleteImage,
    extractPublicId,
    uploadBase64Image
};
