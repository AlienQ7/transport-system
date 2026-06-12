import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Hono } from "hono";
const SESSION_DURATION = "8h";
//const SESSION_DURATION = "10s";
const auth = new Hono();

auth.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  const user = await c.env.transport_db
    .prepare("SELECT * FROM users WHERE email = ?")
    .bind(email)
    .first();
    console.log("USER:", user);
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }
  const now = new Date();

  if (
    (user as any).locked_until &&
    new Date((user as any).locked_until) > now
  ) {
    return c.json(
  {
    error: "Account locked. Try again in 30 minutes.",
    locked: true,
    locked_until: (user as any).locked_until,
  },
  403
);
  }
  const valid = await bcrypt.compare(
    password,
    (user as any).password_hash
  );

  if (!valid) {
  const attempts =
    ((user as any).failed_login_attempts || 0) + 1;

  if (attempts >= 5) {
  const lockedUntil = new Date(
    Date.now() + 30 * 60 * 1000
  ).toISOString();

  await c.env.transport_db
    .prepare(
      `UPDATE users
       SET failed_login_attempts = ?,
           locked_until = ?
       WHERE id = ?`
    )
    .bind(attempts, lockedUntil, user.id)
    .run();

  return c.json(
    {
      error: "Account locked for 30 minutes.",
      locked: true,
      locked_until: lockedUntil,
    },
    403
  );
}

await c.env.transport_db
  .prepare(
    `UPDATE users
     SET failed_login_attempts = ?
     WHERE id = ?`
  )
  .bind(attempts, user.id)
  .run();

return c.json(
  {
    error: "Invalid credentials",
    remainingAttempts: 5 - attempts,
  },
  401
);
}
  await c.env.transport_db
    .prepare(
      `UPDATE users
       SET failed_login_attempts = 0,
           locked_until = NULL
       WHERE id = ?`
    )
    .bind(user.id)
    .run();
  
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    c.env.JWT_SECRET,
    { expiresIn: SESSION_DURATION }
  );

  return c.json({
    token,
    role: (user as any).role,
  });
});

export default auth;
