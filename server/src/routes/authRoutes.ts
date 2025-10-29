import { Router, Request, Response } from "express";
import passport from "../config/passport";
import { signToken, signRefreshToken, verifyRefreshToken } from "../utils/jwtToken";
import { authenticateJWT } from "../middlewares/auth";

const router = Router();

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failWithError: true, // triggers error handler below on failure
  }),
  (req: Request, res: Response) => {
    const user = req.user;
    const accessToken = signToken(user);
    const refreshToken = signRefreshToken(user);

    // Use frontend URL from env
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    // Redirect the popup to your SPA, passing tokens in query params
    // IMPORTANT: Consider security risks of placing tokens in URL, use only for dev!
    res.redirect(
      `${FRONTEND_URL}/auth/redirect?accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`
    );
  },
  (err: any, req: Request, res: Response, next: Function) => {
    // Error handler if OAuth fails
    console.error("OAuth Error:", err.message);

    let reason = "unauthorized";
    if (err.message.includes("VES email")) reason = "invalid-email";
    else if (err.message.includes("registered")) reason = "not-registered";

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${FRONTEND_URL}/login?error=${reason}`);
  }
);



// Refresh Token – no DB, use token payload
router.post("/refresh-token", (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: "No token" });

  try {
    const decoded = verifyRefreshToken(refreshToken) as any;
    // Issue a new access token using decoded info
    const newAccessToken = signToken({
      email: decoded.email,
      name: decoded.name,
      avatarUrl: decoded.avatarUrl,
    });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
});

// JWT-protected Profile Route
router.get("/profile", authenticateJWT, (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({
    user: {
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl || user.picture || "",
    }
  });
});

router.post("/logout", (req: Request, res: Response) => {
  res.json({ message: "Logged out" });
});

export default router;
