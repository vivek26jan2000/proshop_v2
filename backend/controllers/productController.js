import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch all the products
// @route Get/api/products
// @access Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  // res.status(401);
  // throw new Error("not auth");
  res.json(products);
});

// @desc create product
// @route POST/api/products
// @access PRIVATE/ADMIN
export const createProduct = asyncHandler(async (req, res) => {
  const newProduct = new Product({
    name: "sample",
    user: req.user._id,
    brand: "sample",
    description: "sample description",
    image: "/images/airpods.jpg",
    countInStock: 0,
    category: "sample",
    price: 0,
  });

  const product = await newProduct.save();
  res.status(201).json(product);
});

// @desc Fetch singel product
// @route Get/api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("product not found");
  }
});

// @desc update Product
// @route PUT/api/products/:id
// @access PRivate/admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, brand, description, countInStock, category, image } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.image = image;
    product.price = price;
    product.countInStock = countInStock;
    product.user = req.user._id;

    const updatedProduct = await product.save();

    res.status(200).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("No product is Found");
  }
});
