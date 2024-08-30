const mongoose = require("mongoose");
const { Category } = require("../models");

const { connectionDatabase } = require("../config/database");

connectionDatabase();

// Danh sách các danh mục mẫu
const categories = [
  { name: "Phát triển Web" },
  { name: "Phát triển Ứng dụng Di động" },
  { name: "Lập trình" },
  { name: "IT & Phần mềm" },
  { name: "Thiết kế" },
  { name: "Marketing" },
  { name: "Kinh doanh" },
  { name: "Tài chính & Kế toán" },
  { name: "Phát triển cá nhân" },
  { name: "Nhiếp ảnh & Video" },
  { name: "Âm nhạc" },
  { name: "Sức khỏe & Thể dục" },
  { name: "Giảng dạy & Học thuật" },
  { name: "Ngoại ngữ" },
  { name: "Khoa học Dữ liệu" },
  { name: "Trí tuệ Nhân tạo" },
];

// Hàm để thêm các danh mục vào cơ sở dữ liệu
const seedCategories = async () => {
  try {
    for (const category of categories) {
      const newCategory = new Category(category);
      await newCategory.save();
      console.log(`Đã thêm danh mục: ${category.name}`);
    }
    console.log("Đã thêm tất cả danh mục thành công!");
  } catch (error) {
    console.error("Lỗi khi thêm danh mục:", error);
  } finally {
    mongoose.disconnect();
  }
};

module.exports = {
  seedCategories,
};
