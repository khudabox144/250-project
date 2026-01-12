const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "explore_app",
      },
      (error, result) => {
        if (result) {
          // return both url and public_id for later deletions
          resolve({ url: result.secure_url, public_id: result.public_id });
        } else {
          reject(error);
        }
      }
    );

    // support both Buffer and stream input
    if (Buffer.isBuffer(buffer)) {
      streamifier.createReadStream(buffer).pipe(uploadStream);
    } else if (buffer && typeof buffer.pipe === "function") {
      buffer.pipe(uploadStream);
    } else {
      reject(new Error("Invalid buffer/stream passed to uploadImage"));
    }
  });
};

const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

module.exports = { uploadImage, deleteImage };
