// middlewares/auth.middleware.js

import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    console.log("Authorization Header:", req.headers.authorization);

    const token = req.headers.authorization?.split(" ")[1];

    console.log("Extracted Token:", token);

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
};