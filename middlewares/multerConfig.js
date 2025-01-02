const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDirectoryExistence = (filePath) => {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(__dirname, '../uploads/');
        switch (file.fieldname) {
            case 'carouselImage':
                uploadPath += 'carousel/';
                break;
            case 'profilePhoto':
                uploadPath += 'profiles/';
                break;
            case 'newsTitleImage':
            case 'newsImages':
                uploadPath += 'news/';
                break;
            case 'invoice':
                uploadPath += 'invoices/';
                break;
            case 'servicesTitleImage':
                uploadPath += 'services/';
                break;
            case 'doctorImage':
                uploadPath += 'doctors/';
                break;
            default:
                uploadPath += 'others/';
        }
        ensureDirectoryExistence(uploadPath); // Ensure directory exists
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Unsupported file type'), false);
    }
};

// Multer Configuration
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

module.exports = upload;
