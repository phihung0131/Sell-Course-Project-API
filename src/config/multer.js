const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cấu hình Multer với Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Lấy định dạng file từ tên file gốc hoặc có thể dựa trên yêu cầu từ req
    const format = file.mimetype.split("/")[1];

    return {
      folder: "uploads",
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "avi", "mkv"], // Thêm các định dạng video
      resource_type: "auto", // Cho phép tự động nhận diện loại file (image, video, raw, etc.)
      public_id: `file-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${format}`,
    };
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
