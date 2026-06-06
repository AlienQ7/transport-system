import { Hono } from "hono";
//import { authMiddleware } from "../middleware/auth";
import { authMiddleware } from "../../src/middleware/auth";

const bookings = new Hono();

//bookings.use("*", authMiddleware);

// Create Booking
bookings.post("/", async (c) => {
  const {
    customer_name,
    route_id,
    vehicle_id,
    seat_no,
    travel_date,
    departure_time,
    phone_number,
  } = await c.req.json();
  if (Number(seat_no) <= 0) {
    return c.json(
      {
        error: "Seat number must be greater than zero",
      },
      400
    );
  }

  // Check if seat already booked
  const existing = await c.env.transport_db
    .prepare(
      `SELECT id
       FROM bookings
       WHERE vehicle_id = ?
       AND seat_no = ?
       AND travel_date = ?
       AND departure_time = ?
       AND status = 'active'`
    )
    .bind(vehicle_id, seat_no, travel_date, departure_time,)
    .first();

  if (existing) {
    return c.json(
      {
        error: "Seat already booked",
      },
      400
    );
  }

  const result = await c.env.transport_db
    .prepare(
      `INSERT INTO bookings
      (customer_name, route_id, vehicle_id, seat_no, travel_date, departure_time, phone_number)
      VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      customer_name,
      route_id,
      vehicle_id,
      seat_no,
      travel_date,
      departure_time,
      phone_number,
    )
    .run();
  const bookingId =
    result.meta.last_row_id;

  //const ticketCode =
    //`TKT-${bookingId}-${Date.now()}`;
  const ticketCode =
    crypto.randomUUID();
  
  await c.env.transport_db
    .prepare(
     `
     UPDATE bookings
     SET ticket_code=?
     WHERE id=?
   `
   )
   .bind(
     ticketCode,
     bookingId
   )
   .run();

  return c.json({
    success: true,
    id: bookingId,
    ticket_code: ticketCode,
  });
});

// Get All Bookings
//bookings.get("/", async (c) => {
bookings.get("/", authMiddleware, async (c) => {
  const result = await c.env.transport_db
    .prepare(`
      SELECT
	  b.id,
	  b.customer_name,
	  b.route_id,
	  b.vehicle_id,
      b.travel_date,
      b.departure_time,
	  b.seat_no,
	  b.status,
	  b.payment_status,
	  b.payment_utr,
	  b.phone_number,
	  r.source,
	  r.destination,
	  v.name AS vehicle_name
      FROM bookings b
      LEFT JOIN routes r
        ON b.route_id = r.id
      LEFT JOIN vehicles v
        ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `)
    .all();

  return c.json(result.results);
});

// Get Booking By ID
bookings.get("/:id", async (c) => {
  const id = c.req.param("id");

  const booking = await c.env.transport_db
    .prepare(
      "SELECT * FROM bookings WHERE id = ?"
    )
    .bind(id)
    .first();

  if (!booking) {
    return c.json(
      {
        error: "Booking not found",
      },
      404
    );
  }

  return c.json(booking);
});
//UTR Api
bookings.put(
  "/:id/payment",
  async (c) => {
    const id =
      c.req.param("id");

    const {
      payment_utr,
    } = await c.req.json();

    await c.env.transport_db
      .prepare(
        `
        UPDATE bookings
        SET payment_utr=?
        WHERE id=?
      `
      )
      .bind(
        payment_utr,
        id
      )
      .run();

    return c.json({
      success: true,
    });
  }
);
//admin aprrove
bookings.put("/:id/approve", authMiddleware, async (c) => {
    const id =
      c.req.param("id");

    await c.env.transport_db
      .prepare(
        `
        UPDATE bookings
        SET payment_status='paid'
        WHERE id=?
      `
      )
      .bind(id)
      .run();

    return c.json({
      success: true,
    });
  }
);
//Qr verify Api 
bookings.get(
  "/verify/:code",
  async (c) => {
    const code =
      c.req.param("code");

    const booking =
      await c.env.transport_db
        .prepare(
          `
          SELECT *
          FROM bookings
          WHERE ticket_code=?
        `
        )
        .bind(code)
        .first();

    if (!booking) {
      return c.json({
        status:
          "NOT_FOUND",
      });
    }

    if (
      booking.payment_status !==
      "paid"
    ) {
      return c.json({
        status:
          "UNPAID",
      });
    }

    if (
      Number(booking.is_used) === 1
    ) {
      return c.json({
        status:
          "ALREADY_USED",
      });
    }

    return c.json({
      status: "VALID",
      booking,
    });
  }
);
// Ticket used api 
bookings.put(
  "/use/:code",
  async (c) => {
    const code =
      c.req.param("code");

    await c.env.transport_db
      .prepare(
        `
        UPDATE bookings
        SET
          is_used=1,
          used_at=CURRENT_TIMESTAMP
        WHERE ticket_code=?
      `
      )
      .bind(code)
      .run();

    return c.json({
      success: true,
    });
  }
);
// Update Booking
//bookings.put("/:id", async (c) => {
bookings.put("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");

  const {
    customer_name,
    route_id,
    vehicle_id,
    seat_no,
    travel_date,
    departure_time,
    payment_status,
    phone_number,
    status,
  } = await c.req.json();

  if (Number(seat_no) <= 0) {
    return c.json(
      {
        error: "Seat number must be greater than zero",
      },
      400
    );
  }

  const existing = await c.env.transport_db
    .prepare(`
      SELECT id
      FROM bookings
      WHERE vehicle_id = ?
      AND seat_no = ?
      AND travel_date = ?
      AND departure_time = ?
      AND phone_number = ?
      AND status = 'active'
      AND id != ?
    `)
    .bind(
      vehicle_id,
      seat_no,
      travel_date,
      departure_time,
      phone_number,
      id
    )
    .first();

  if (existing) {
    return c.json(
      {
        error: "Seat already booked",
      },
      400
    );
  }

  await c.env.transport_db
    .prepare(`
      UPDATE bookings
      SET
        customer_name=?,
        route_id=?,
        vehicle_id=?,
        seat_no=?,
        travel_date=?,
        departure_time=?,
        payment_status=?,
        phone_number=?,
        status=?
      WHERE id=?
    `)
    .bind(
      customer_name,
      route_id,
      vehicle_id,
      seat_no,
      travel_date,
      departure_time,
      payment_status,
      phone_number,
      status,
      id
    )
    .run();

  return c.json({
    success: true,
  });
});

// Delete Booking
//bookings.delete("/:id", async (c) => {
bookings.delete("/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");

  await c.env.transport_db
    .prepare(
      "DELETE FROM bookings WHERE id=?"
    )
    .bind(id)
    .run();

  return c.json({
    success: true,
  });
});

export default bookings;
