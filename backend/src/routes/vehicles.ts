import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

//update
const vehicles = new Hono();

//vehicles.use("*", authMiddleware);

// Create Vehicle
vehicles.post("/", authMiddleware, async (c) => {
  const {
    name,
    capacity,
    layout,
    route_id,
    travel_date,
    departure_time,
  } = await c.req.json();

  if (Number(capacity) <= 0) {
    return c.json(
      {
        error:
          "Capacity must be greater than zero",
      },
      400
    );
  }

  const result = await c.env.transport_db
    .prepare(
  "INSERT INTO vehicles (name, capacity, layout, route_id, travel_date, departure_time) VALUES (?, ?, ?, ?, ?, ?)"
)
.bind(
  name,
  capacity,
  layout,
  route_id,
  travel_date,
  departure_time
)
    .run();

  return c.json({
    success: true,
    id: result.meta.last_row_id,
  });
});

// Get All Vehicles
vehicles.get("/", async (c) => {
  const result = await c.env.transport_db
    .prepare(`
      SELECT
        v.id,
        v.name,
        v.capacity,
        v.layout,
        v.route_id,
        v.travel_date,
        v.departure_time,
        r.source,
        r.destination
      FROM vehicles v
      LEFT JOIN routes r
      ON v.route_id = r.id
      ORDER BY v.id DESC
    `)
    .all();

  return c.json(result.results);
});

// Get Vehicle By ID
vehicles.get("/:id", async (c) => {
  const id = c.req.param("id");

  const result = await c.env.transport_db
    .prepare(
      "SELECT * FROM vehicles WHERE id = ?"
    )
    .bind(id)
    .first();

  if (!result) {
    return c.json(
      {
        error: "Vehicle not found",
      },
      404
    );
  }

  return c.json(result);
});

// Update Vehicle
vehicles.put("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");

  const {
    name,
    capacity,
    layout,
    route_id,
    travel_date,
    departure_time,
  } = await c.req.json();

  if (Number(capacity) <= 0) {
    return c.json(
      {
        error:
          "Capacity must be greater than zero",
      },
      400
    );
  }

  await c.env.transport_db
  .prepare(
    "UPDATE vehicles SET name=?, capacity=?,layout=?, route_id=?, travel_date=?, departure_time=? WHERE id=?"
  )
  .bind(
    name,
    capacity,
    layout,
    route_id,
    travel_date,
    departure_time,
    id
  )
  .run();

  return c.json({
    success: true,
  });
});

// Delete Vehicle
vehicles.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");

  await c.env.transport_db
    .prepare(
      "DELETE FROM vehicles WHERE id=?"
    )
    .bind(id)
    .run();

  return c.json({
    success: true,
  });
});

export default vehicles;
