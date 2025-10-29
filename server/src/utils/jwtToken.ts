import jwt from "jsonwebtoken";

// Define a token payload interface with only what you want in the token
export interface JwtUserPayload {
  email: string;
  name: string;
  avatarUrl?: string;
}

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

export function signToken(user: JwtUserPayload) {
  return jwt.sign(
    { email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
}

export function signRefreshToken(user: JwtUserPayload) {
  return jwt.sign(
    { email: user.email, name: user.name, avatarUrl: user.avatarUrl },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}
