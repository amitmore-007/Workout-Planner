const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
const uploadToCloudinary = async (file, folder = 'diet-plans') => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'fill' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });
    return result;
  } catch (error) {
    throw new Error('Error uploading to Cloudinary: ' + error.message);
  }
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Error deleting from Cloudinary: ' + error.message);
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary
};
