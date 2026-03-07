const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const Auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.warn("AuthVerify: missing token for request", req.method, req.originalUrl);
      return res.status(401).json({ message: "No token provided" });
    }

    // support both env var names for backwards compatibility
    const secret = process.env.JWTSECRETKEY || process.env.JWT_SECRET;
    if (!secret) {
      console.error("AuthVerify: JWT secret not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, secret);

    const user = await userModel.findById(decoded._id || decoded.id);
    if (!user) {
      console.warn("AuthVerify: token decoded but user not found", decoded);
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // 🔥 THIS IS important for downstream handlers
    next();
  } catch (error) {
    console.warn("AuthVerify: invalid token", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = Auth;