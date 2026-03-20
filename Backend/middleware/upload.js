const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Sanitize filename: remove extension and replace spaces with underscores
    const sanitizedName = file.originalname
      .split('.')
      .slice(0, -1)
      .join('.')
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_-]/g, '');

    return {
      folder: "uniportal",
      resource_type: "raw", // CRITICAL: Use 'raw' to avoid 401/ACL issues on this account
      public_id: `${Date.now()}-${sanitizedName}`
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter
});

module.exports = upload;
