import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";


const routes = new Hono();

//routes.use("*", authMiddleware);

// Create Route
routes.post("/", authMiddleware, async (c) => {
  const { source, destination} = await c.req.json();
  const result = await c.env.transport_db
    .prepare(
      "INSERT INTO routes (source, destination) VALUES (?, ?)"
    )
    .bind(source, destination)
    .run();

  return c.json({
    success: true,
    id: result.meta.last_row_id,
  });
});

// List Routes
routes.get("/", async (c) => {
  const result = await c.env.transport_db
    .prepare("SELECT * FROM routes ORDER BY id DESC")
    .all();

  return c.json(result.results);
});

// Get Route By ID
routes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const result = await c.env.transport_db
    .prepare("SELECT * FROM routes WHERE id = ?")
    .bind(id)
    .first();

  if (!result) {
    return c.json(
      {
        error: "Route not found",
      },
      404
    );
  }

  return c.json(result);
});

// Update Route
routes.put("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const { source, destination} = await c.req.json();
  await c.env.transport_db
    .prepare(
      "UPDATE routes SET source=?, destination=? WHERE id=?"
    )
    .bind(
      source,
      destination,
      id
    )
    .run();

  return c.json({
    success: true,
  });
});

// Delete Route
routes.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");

  await c.env.transport_db
    .prepare(
      "DELETE FROM routes WHERE id=?"
    )
    .bind(id)
    .run();

  return c.json({
    success: true,
  });
});

export default routes;
