import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Hono } from "hono";

const auth = new Hono();

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = await c.env.transport_db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();

  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const valid = await bcrypt.compare(
    password,
    (user as any).password_hash
  );

  if (!valid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = jwt.sign(
    {
      id: (user as any).id,
      role: (user as any).role,
    },
    "super-secret-key",
    { expiresIn: "1d" }
  );

  return c.json({
    token,
    role: (user as any).role,
  });
});

export default auth;