const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const isCloudConfigured =
  process.env.CLOUD_NAME &&
  process.env.CLOUD_API_KEY &&
  process.env.CLOUD_API_SECRET;

let storage;

if (isCloudConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "wanderlust_DEV",
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });
} else {
  console.warn(
    "Cloudinary env variables are missing. Falling back to local disk storage (public/uploads)."
  );
  storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
      cb(null, path.join(__dirname, "public", "uploads"));
    },
    filename: function (_req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
}

module.exports = {
  cloudinary,
  storage,
};