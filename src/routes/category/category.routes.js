import express from "express";
import multer from "multer";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../../controllers/category/category.controller.js";

const upload = multer({ dest: "uploads/categories" });

const router = express.Router();

router.post(
  "/add",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  createCategory
);
router.get("/get", getCategories);
router.get("/get/:id", getCategoryById);
router.put(
  "/update/:id",
  upload.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateCategory
);
router.delete("/delete/:id", deleteCategory);

export default router;
