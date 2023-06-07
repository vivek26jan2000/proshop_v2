import express from "express";

import {
  getAllOrders,
  getOrderById,
  getMyOrders,
  updateOrderToDelivered,
  updateOrderToPay,
  addOrderItems,
} from "../controllers/orderController.js";
import { protect, admin } from "../middelware/authMiddelware.js";
const router = express.Router();

router
  .route("/")
  .get(protect, admin, getAllOrders)
  .post(protect, addOrderItems);

router.get("/myorders", protect, getMyOrders);

router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPay);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;
