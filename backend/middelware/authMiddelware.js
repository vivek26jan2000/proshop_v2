import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// protected middelware to protect route(only login and authorised user can access)
const protect = asyncHandler(async (req, res, next) => {
  // get token from the cookie
  const token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SCERET);
      const currentUser = await User.findById(decoded.userId).select(
        "-password"
      );
      req.user = currentUser;
      next();
    } catch (error) {
      console, log(error);
      res.status(401);
      throw new Error("Not Authorised,Invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not Authorised, No token");
  }
});

// admin middelware (check if the user is admin or not)
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorised as Admin");
  }
};

export { admin, protect };
