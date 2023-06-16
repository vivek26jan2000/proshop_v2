import express from "express";

import {
  createProduct,
  createProductReview,
  deleteProduct,
  getAllProducts,
  getProductById,
  getTopProducts,
  updateProduct,
} from "../controllers/productController.js";

import { protect, admin } from "../middelware/authMiddelware.js";

const router = express.Router();

router.route("/").get(getAllProducts).post(protect, admin, createProduct);
router.get("/top", getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createProductReview);

export default router;
