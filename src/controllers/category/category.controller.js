import { Category } from "../../models/category/category.model.js";
import { deleteTempFiles } from "../../utils/DeleteTempFiles.js";

export const createCategory = async (req, res) => {
  let thumbnailFile = null;

  try {
    const { category_name, description } = req.body;

    if (!category_name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // file upload check
    thumbnailFile = req.files?.["thumbnail"]?.[0];

    const newCategory = await Category.create({
      category_name: category_name.toLowerCase(),
      description: description || "",
      thumbnail_path: thumbnailFile ? thumbnailFile.path : null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    deleteTempFiles(thumbnailFile);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    console.error("Error creating category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  let thumbnailFile = null;

  try {
    const { category_name, description } = req.body;

    thumbnailFile = req.files?.["thumbnail"]?.[0];

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        category_name: category_name?.toLowerCase(),
        description,
        ...(thumbnailFile && { thumbnail_path: thumbnailFile.path }),
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    deleteTempFiles(thumbnailFile);

    console.error("Error updating category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
