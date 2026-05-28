import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const ensureCloudinaryConfig = () => {
  const missing = [
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ].filter((key) => !process.env[key]);

  if (missing.length) {
    const error = new Error(
      `Cloudinary is not fully configured. Missing: ${missing.join(", ")}`
    );
    error.statusCode = 500;
    throw error;
  }
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (_req, file) => ({
    folder: process.env.CLOUDINARY_FOLDER || "pinstack/posts",
    format: file.mimetype?.split("/")[1] || "jpg",
    public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
  }),
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed."));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter,
});

const runUpload = (fieldName) => (req, res, next) => {
  try {
    ensureCloudinaryConfig();
  } catch (error) {
    next(error);
    return;
  }

  upload.single(fieldName)(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      const uploadError = new Error(error.message);
      uploadError.statusCode = 400;
      next(uploadError);
      return;
    }

    const uploadMessage =
      error.message ||
      error.error?.message ||
      error.http_code?.toString() ||
      error.name ||
      "Image upload failed.";

    console.error("Upload middleware error:", {
      fieldName,
      message: uploadMessage,
      error,
    });

    const uploadError = new Error(
      uploadMessage
    );
    uploadError.statusCode = error.http_code || error.statusCode || 500;
    uploadError.originalError = error;
    next(uploadError);
  });
};

export const uploadPostImage = runUpload("image");
export const uploadProfileImage = runUpload("profileImage");

export default upload;
