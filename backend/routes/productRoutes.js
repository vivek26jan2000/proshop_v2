import express from "express";

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middelware/authMiddelware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct);
router.route("/:id").get(getProductById).put(protect, admin, updateProduct);

export default router;
