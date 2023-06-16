import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch all the products
// @route Get/api/products
// @access Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const pages = Math.ceil(count / pageSize);

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, pages, page });
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
// @desc delete Product
// @route DELETE/api/products/:id
// @access PRivate/admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).send({ message: "product deleted successfully" });
  } else {
    res.status(404);
    throw new Error("No product is Found");
  }
});
// @desc create Product reviews
// @route POST/api/products/:id/reviews
// @access PRivate
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const getTopProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find().sort("-rating").limit(3);

  res.status(200).json(products);
});
