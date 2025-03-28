import { User } from "../../models/user/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Utility function to exclude password and refresh token
const getSafeUser = (user) => {
  const { password, refresh_token, ...safeUser } = user._doc;
  return safeUser;
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { user_name, email, f_name, l_name, password } = req.body;

  // Check if all required fields are present
  if (
    [user_name, email, f_name, l_name, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ user_name }, { email }],
  });

  if (existingUser) {
    // throw new ApiError(409, "User with email or username already exists");
    return res.status(409).send({ message: "User with email already exists" });
  }

  // Create user
  const user = await User.create({
    user_name: user_name.toLowerCase(),
    email: email.toLowerCase(),
    f_name: f_name.toLowerCase(),
    l_name: l_name.toLowerCase(),
    password,
  });

  // Get the created user without sensitive info
  const createdUser = await User.findById(user._id).select(
    "-password -refresh_token"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { user_name, email, password } = req.body;

  if (!(user_name || email)) {
    throw new ApiError(400, "Username or email is required");
  }

  // Find user
  const user = await User.findOne({
    $or: [{ user_name }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  // Check password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  // Generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Update refresh token in DB
  user.refresh_token = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Get user without sensitive info
  const loggedInUser = await User.findById(user._id).select(
    "-password -refresh_token"
  );

  // Set cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

// Get All Users (Admin only)
const getAllUsers = asyncHandler(async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Filtering
  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { user_name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { f_name: { $regex: req.query.search, $options: "i" } },
      { l_name: { $regex: req.query.search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .select("-password -refresh_token")
    .lean();

  const totalUsers = await User.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit),
      },
      "Users fetched successfully"
    )
  );
});

// Get User by ID
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const user = await User.findById(id).select("-password -refresh_token");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// Update User
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  // Don't allow password or email updates through this route
  if (updates.password || updates.email) {
    throw new ApiError(
      400,
      "Cannot update password or email through this route"
    );
  }

  // Convert name fields to lowercase
  if (updates.user_name) updates.user_name = updates.user_name.toLowerCase();
  if (updates.f_name) updates.f_name = updates.f_name.toLowerCase();
  if (updates.l_name) updates.l_name = updates.l_name.toLowerCase();

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
  }).select("-password -refresh_token");

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const deletedUser = await User.findByIdAndDelete(id).select(
    "-password -refresh_token"
  );

  if (!deletedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedUser, "User deleted successfully"));
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refresh_token: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export {
  registerUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  logoutUser,
};
