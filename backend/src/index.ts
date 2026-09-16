import { Hono } from "hono";
import { cors } from "hono/cors";
import auth from "./routes/auth";
import { authMiddleware } from "./middleware/auth";
import routes from "./routes/routes";
import vehicles from "./routes/vehicles";
import bookings from "./routes/bookings";

type Bindings = {
  transport_db: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: (origin) => origin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.get("/api/stats", async (c) => {
  const routes = await c.env.transport_db
    .prepare("SELECT COUNT(*) as count FROM routes")
    .first();

  const vehicles = await c.env.transport_db
    .prepare("SELECT COUNT(*) as count FROM vehicles")
    .first();

  const bookings = await c.env.transport_db
    .prepare("SELECT COUNT(*) as count FROM bookings")
    .first();

  return c.json({
    routes: routes?.count || 0,
    vehicles: vehicles?.count || 0,
    bookings: bookings?.count || 0,
  });
});

app.route("/api/auth", auth);
app.route("/api/routes", routes);
app.route("/api/vehicles", vehicles);
app.route("/api/bookings", bookings);

export default app;
