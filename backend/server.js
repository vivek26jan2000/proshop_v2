import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler, notFound } from "./middelware/errorHandler.js";

dotenv.config();

connectDB();

const app = express();

// BODY PARSER MIDDELWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// COOKIE PARSER MIDDELWARE
app.use(cookieParser());

// ROUTES
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// ERROR MIDDELWARE
app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(
  port,
  console.log(`server is running in ${process.env.NODE_ENV} mode  on ${port}`)
);
