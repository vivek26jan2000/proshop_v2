import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc Create new Orders
// @route POST /api/orders
// @access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order Items");
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      taxPrice,
      itemsPrice,
      shippingAddress,
      user: req.user._id,
      paymentMethod,
      totalPrice,
      shippingPrice,
    });

    const createOrder = await order.save();

    res.status(201).json(createOrder);
  }
});

// @desc get logged in user orders
// @route GET /api/orders/myorders
// @access Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json(orders);
});

// @desc get  order by id
// @route GET /api/orders/:id
// @access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error("order not Found");
  }
});

// @desc update order to pay
// @route PUT /api/orders/:id/pay
// @access Private
export const updateOrderToPay = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("No order Found");
  }
});

// @desc update order to delivered
// @route PUT /api/orders/:id/deliver
// @access Private/Admin
export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  res.send("update order to delivered");
});

// @desc get all orders
// @route GET /api/orders
// @access Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  res.send("get all orders");
});
