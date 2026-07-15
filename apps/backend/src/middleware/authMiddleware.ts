import jwt from "jsonwebtoken";
import { isTokenBlocked } from "../tokenBlocklist";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No token provided." });
  }

  if (isTokenBlocked(token)) {
    return res
      .status(401)
      .json({ message: "Token has been invalidated. log in again." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
