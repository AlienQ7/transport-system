import jwt from "jsonwebtoken";
import { Context, Next } from "hono";

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Missing token" }, 401);
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, c.env.JWT_SECRET);
    c.set("user", payload);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}
