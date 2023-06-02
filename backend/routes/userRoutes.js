import express from "express";

import {
  updateUser,
  updateUserProfile,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  logoutUser,
  authUser,
  registerUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middelware/authMiddelware.js";
const router = express.Router();

router.post("/logout", logoutUser);
router.post("/login", authUser);

router.route("/").get(protect, admin, getUsers).post(registerUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;
