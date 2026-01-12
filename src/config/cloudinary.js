const cloudinary = require("cloudinary").v2;

// Support multiple env var naming conventions (some environments use CLOUDINARY_API_KEY etc.)
const cloudName = process.env.CLOUDINARY_NAME || process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUDNAME;
const apiKey = process.env.CLOUDINARY_KEY || process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_KEY_ID;
const apiSecret = process.env.CLOUDINARY_SECRET || process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET_KEY;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Cloudinary credentials missing: cloud_name/api_key/api_secret may be undefined.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = cloudinary;
