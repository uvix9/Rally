const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check whether token has been revoked
    const isRevoked = await Token.isTokenRevoked(token);

    if (isRevoked) {
      return res.status(401).json({
        success: false,
        message: "Token has been revoked. Please login again.",
      });
    }

    req.user = decoded;

    next();

  } catch (error) {
  console.error("AUTH MIDDLEWARE ERROR:", error.message);

  return res.status(401).json({
    success: false,
    message: "Invalid or expired token",
  });
}
};

module.exports = authMiddleware;

