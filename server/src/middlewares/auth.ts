import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtToken";

declare module "express-serve-static-core" {
  interface Request {
    user?: any; // Attach user object from JWT
  }
}

// JWT Authentication Middleware
export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const user = verifyToken(token); // Decoded JWT payload
      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
  return res.status(401).json({ message: "Missing token" });
}
