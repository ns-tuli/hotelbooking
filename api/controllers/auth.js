import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";

// controllers/authController.js
import { Router } from "express";
const router = Router();

export const register = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
    });

    await newUser.save();
    res.status(200).send("User has been created.");
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.jwt,
      { expiresIn: "1h" }
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res.status(200).json({ token });
  } catch (err) {
    next(err); // This will pass the error to the next error handling middleware
  }
};


// Logout Route: Delete the JWT token (clear from cookies if stored there)
export const logout = (req, res) => {
  // If you are storing the token in cookies, clear it
  res.clearCookie("token");  // Remove the JWT token from cookies
  res.status(200).send("Logged out successfully.");
};

export default router;
