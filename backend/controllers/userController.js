import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc auth user & get token
// routes POST  /api/users/login
// access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // generate the token and save to cookies
    generateToken(res, user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

// @desc register  user
// routes POST /api/users
// access public
const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });

  // check if user is exist in the database already
  if (userExists) {
    res.status(400);
    throw new Error("user already exists.please try new one ");
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  // if user is create successfully
  if (user) {
    // generate token and save token in the cookies
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user Input Data");
  }
});

// @desc logout user / clear cookies
// routes POST /api/users/logout
// access private
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    message: "logout user successfully",
  });
});

// @desc get user profile
// routes GET /api/users/profile
// access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc update user profile
// routes PUT /api/users/profile
// access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.email = req.body.email || user.email;
    user.name = req.body.name || user.name;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("user not found");
  }
});

// @desc get all users
// routes GET /api/users
// access private/admin
const getUsers = asyncHandler(async (req, res) => {
  res.send("get all users");
});

// @desc get all users
// routes GET /api/users/:id
// access private/admin
const getUserById = asyncHandler(async (req, res) => {
  res.send("get user by Id");
});

// @desc delete user
// routes DELETE /api/users/:id
// access private/admin
const deleteUser = asyncHandler(async (req, res) => {
  res.send("delete user");
});

// @desc update user
// routes PUT /api/users/:id
// access private/admin
const updateUser = asyncHandler(async (req, res) => {
  res.send("update user");
});

export {
  updateUser,
  updateUserProfile,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  authUser,
  registerUser,
};
