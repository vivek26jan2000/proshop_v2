import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import products from "./data/products.js";
import users from "./data/user.js";

import User from "./models/userModel.js";
import Product from "./models/productModel.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return {
        ...product,
        user: adminUser,
      };
    });

    await Product.insertMany(sampleProducts);
    console.log("data imported sucessfully");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    console.log("data deleted sucessfully");
    process.exit(1);
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
