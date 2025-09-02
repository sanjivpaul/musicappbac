import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from "../../controllers/user/user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.post("/logout", verifyJWT, logoutUser);
router.get("/", getAllUsers);
router.get("/:id", verifyJWT, getUserById);
router.put("/:id", verifyJWT, updateUser);
router.delete("/:id", verifyJWT, deleteUser);

export default router;
