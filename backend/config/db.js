import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);

    console.log("DB connected successfully");
  } catch (error) {
    console.log("Error:", error.message);
  }
};

export default connectDB;
