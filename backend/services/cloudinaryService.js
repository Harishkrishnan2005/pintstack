import cloudinary from "../config/cloudinary.js";

export const destroyCloudinaryAsset = async (publicId) => {
  if (!publicId) {
    return null;
  }

  return cloudinary.uploader.destroy(publicId);
};
