import express from "express";
import dotenv from "dotenv";
import products from "./data/products.js";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { errorHandler, notFound } from "./middelware/errorHandler.js";

dotenv.config();

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("server is running");
});

app.use("/api/products", productRoutes);

app.use(notFound);

app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(`server is running in ${process.env.NODE_ENV} mode  on ${port}`)
);
