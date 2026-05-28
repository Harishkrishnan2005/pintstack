import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "").trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || "").trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || "").trim();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

if (!cloudName || !apiKey || !apiSecret) {
  console.warn("Cloudinary config is incomplete.");
} else {
  console.log(`Cloudinary configured for cloud: ${cloudName}, key: ${apiKey.slice(0, 4)}...`);
}

export default cloudinary;
