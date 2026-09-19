//~ //transport-system/backend/src/routes/bookings.ts
//~ import { Hono } from "hono";
//~ import { authMiddleware } from "../middleware/auth";

//~ const bookings = new Hono();

//~ //bookings.use("*", authMiddleware);

//~ // Create Booking
//~ bookings.post("/", async (c) => {
  //~ const {
    //~ customer_name,
    //~ route_id,
    //~ vehicle_id,
    //~ seat_no,
    //~ travel_date,
    //~ departure_time,
    //~ phone_number,
  //~ } = await c.req.json();
  //~ if (Number(seat_no) <= 0) {
    //~ return c.json(
      //~ {
        //~ error: "Seat number must be greater than zero",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ // Check if seat already booked
  //~ const existing = await c.env.transport_db
    //~ .prepare(
      //~ `SELECT id
       //~ FROM bookings
       //~ WHERE vehicle_id = ?
       //~ AND seat_no = ?
       //~ AND travel_date = ?
       //~ AND departure_time = ?
       //~ AND status = 'active'`
    //~ )
    //~ .bind(vehicle_id, seat_no, travel_date, departure_time,)
    //~ .first();

  //~ if (existing) {
    //~ return c.json(
      //~ {
        //~ error: "Seat already booked",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ const result = await c.env.transport_db
    //~ .prepare(
      //~ `INSERT INTO bookings
      //~ (customer_name, route_id, vehicle_id, seat_no, travel_date, departure_time, phone_number)
      //~ VALUES (?, ?, ?, ?, ?, ?, ?)`
    //~ )
    //~ .bind(
      //~ customer_name,
      //~ route_id,
      //~ vehicle_id,
      //~ seat_no,
      //~ travel_date,
      //~ departure_time,
      //~ phone_number,
    //~ )
    //~ .run();
  //~ const bookingId =
    //~ result.meta.last_row_id;

  //~ //const ticketCode =
    //~ //`TKT-${bookingId}-${Date.now()}`;
  //~ const ticketCode =
    //~ crypto.randomUUID();
  
  //~ await c.env.transport_db
    //~ .prepare(
     //~ `
     //~ UPDATE bookings
     //~ SET ticket_code=?
     //~ WHERE id=?
   //~ `
   //~ )
   //~ .bind(
     //~ ticketCode,
     //~ bookingId
   //~ )
   //~ .run();

  //~ return c.json({
    //~ success: true,
    //~ id: bookingId,
    //~ ticket_code: ticketCode,
  //~ });
//~ });
//~ // Create Cashfree Payment Order
//~ bookings.post("/:id/cashfree-order", async (c) => {
  //~ const id = c.req.param("id");

  //~ // Get the existing booking
  //~ const booking = await c.env.transport_db
    //~ .prepare(`
      //~ SELECT
        //~ b.id,
        //~ b.customer_name,
        //~ b.phone_number,
        //~ b.route_id,
        //~ b.payment_status,
        //~ r.source,
        //~ r.destination,
        //~ r.fare
      //~ FROM bookings b
      //~ JOIN routes r ON r.id = b.route_id
      //~ WHERE b.id = ?
    //~ `)
    //~ .bind(id)
    //~ .first();

  //~ if (!booking) {
    //~ return c.json(
      //~ {
        //~ error: "Booking not found",
      //~ },
      //~ 404
    //~ );
  //~ }

  //~ // Do not create another payment order if already paid
  //~ if (booking.payment_status === "paid") {
    //~ return c.json(
      //~ {
        //~ error: "Booking is already paid",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ const fare = Number(booking.fare);

  //~ if (!Number.isFinite(fare) || fare <= 0) {
    //~ return c.json(
      //~ {
        //~ error: "Invalid booking fare",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ if (!booking.phone_number) {
    //~ return c.json(
      //~ {
        //~ error: "Customer phone number is missing",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ // Cashfree requires a customer phone number
  //~ const customerPhone = String(booking.phone_number).replace(/\D/g, "");

  //~ if (customerPhone.length < 10) {
    //~ return c.json(
      //~ {
        //~ error: "Invalid customer phone number",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ // Use a unique Cashfree order ID for this booking
  //~ const orderId = `booking_${booking.id}_${crypto.randomUUID()}`;

  //~ console.log(
    //~ "Cashfree App ID exists:",
    //~ !!c.env.CASHFREE_APP_ID
  //~ );

  //~ console.log(
    //~ "Cashfree Secret exists:",
    //~ !!c.env.CASHFREE_SECRET_KEY
  //~ );

  //~ const cashfreeResponse = await fetch(
    //~ "https://sandbox.cashfree.com/pg/orders",
    //~ {
      //~ method: "POST",
      //~ headers: {
        //~ "Content-Type": "application/json",
        //~ "x-api-version": "2025-01-01",
        //~ "x-client-id": c.env.CASHFREE_APP_ID,
        //~ "x-client-secret": c.env.CASHFREE_SECRET_KEY,
        //~ "x-request-id": crypto.randomUUID(),
      //~ },
      //~ body: JSON.stringify({
        //~ order_id: orderId,
        //~ order_amount: fare,
        //~ order_currency: "INR",

        //~ customer_details: {
          //~ customer_id: `customer_${booking.id}`,
          //~ customer_name: booking.customer_name,
          //~ customer_phone: customerPhone,
        //~ },

        //~ order_meta: {
          //~ return_url: `http://localhost:5173/ticket/${booking.id}`,
          //~ // For production:
          //~ // return_url: `https://transport-system-lru.pages.dev/ticket/${booking.id}`,
        //~ },

        //~ order_note: `Transport booking #${booking.id}`,
      //~ }),
    //~ }
  //~ );

  //~ const cashfreeData = await cashfreeResponse.json();

  //~ if (!cashfreeResponse.ok) {
    //~ console.error(
      //~ "Cashfree order creation failed:",
      //~ cashfreeData
    //~ );

    //~ return c.json(
      //~ {
        //~ error: "Failed to create Cashfree payment order",
        //~ details: cashfreeData,
      //~ },
      //~ 502
    //~ );
  //~ }

  //~ // Save the Cashfree order ID against this booking
  //~ await c.env.transport_db
    //~ .prepare(`
      //~ UPDATE bookings
      //~ SET payment_utr = ?
      //~ WHERE id = ?
    //~ `)
    //~ .bind(orderId, id)
    //~ .run();

  //~ return c.json({
    //~ success: true,
    //~ booking_id: booking.id,
    //~ order_id: cashfreeData.order_id,
    //~ payment_session_id: cashfreeData.payment_session_id,
    //~ order_amount: fare,
    //~ order_currency: "INR",
  //~ });
//~ });


//~ // Verify Cashfree Payment
//~ bookings.post("/:id/verify-cashfree", async (c) => {
  //~ const id = c.req.param("id");

  //~ const booking = await c.env.transport_db
    //~ .prepare(`
      //~ SELECT
        //~ id,
        //~ payment_status,
        //~ payment_utr
      //~ FROM bookings
      //~ WHERE id = ?
    //~ `)
    //~ .bind(id)
    //~ .first();

  //~ if (!booking) {
    //~ return c.json(
      //~ {
        //~ error: "Booking not found",
      //~ },
      //~ 404
    //~ );
  //~ }

  //~ if (!booking.payment_utr) {
    //~ return c.json({
      //~ success: false,
      //~ payment_status: "pending",
      //~ message: "Cashfree order ID not found",
    //~ });
  //~ }

  //~ const orderId = String(booking.payment_utr);

  //~ const cashfreeResponse = await fetch(
    //~ `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`,
    //~ {
      //~ method: "GET",
      //~ headers: {
        //~ "Content-Type": "application/json",
        //~ "x-api-version": "2025-01-01",
        //~ "x-client-id": c.env.CASHFREE_APP_ID,
        //~ "x-client-secret": c.env.CASHFREE_SECRET_KEY,
        //~ "x-request-id": crypto.randomUUID(),
      //~ },
    //~ }
  //~ );

  //~ const cashfreeData = await cashfreeResponse.json();

  //~ if (!cashfreeResponse.ok) {
    //~ console.error(
      //~ "Cashfree verification failed:",
      //~ cashfreeData
    //~ );

    //~ return c.json(
      //~ {
        //~ success: false,
        //~ error: "Unable to verify payment with Cashfree",
        //~ details: cashfreeData,
      //~ },
      //~ 502
    //~ );
  //~ }

  //~ const cashfreeStatus = String(
    //~ cashfreeData.order_status || ""
  //~ ).toUpperCase();

  //~ console.log("Cashfree order status:", {
    //~ orderId,
    //~ cashfreeStatus,
  //~ });

  //~ if (cashfreeStatus === "PAID") {
    //~ await c.env.transport_db
      //~ .prepare(`
        //~ UPDATE bookings
        //~ SET payment_status = 'paid'
        //~ WHERE id = ?
      //~ `)
      //~ .bind(id)
      //~ .run();

    //~ return c.json({
      //~ success: true,
      //~ payment_status: "paid",
      //~ cashfree_status: cashfreeStatus,
    //~ });
  //~ }

  //~ return c.json({
    //~ success: true,
    //~ payment_status: "pending",
    //~ cashfree_status: cashfreeStatus,
  //~ });
//~ });

//~ // Get All Bookings
//~ //bookings.get("/", async (c) => {
//~ bookings.get("/", authMiddleware, async (c) => {
  //~ const result = await c.env.transport_db
    //~ .prepare(`
      //~ SELECT
	  //~ b.id,
	  //~ b.customer_name,
	  //~ b.route_id,
	  //~ b.vehicle_id,
      //~ b.travel_date,
      //~ b.departure_time,
	  //~ b.seat_no,
	  //~ b.status,
	  //~ b.payment_status,
	  //~ b.payment_utr,
	  //~ b.phone_number,
	  //~ r.source,
	  //~ r.destination,
	  //~ v.name AS vehicle_name
      //~ FROM bookings b
      //~ LEFT JOIN routes r
        //~ ON b.route_id = r.id
      //~ LEFT JOIN vehicles v
        //~ ON b.vehicle_id = v.id
      //~ ORDER BY b.id DESC
    //~ `)
    //~ .all();

  //~ return c.json(result.results);
//~ });

//~ // Get Booking By ID
//~ bookings.get("/:id", async (c) => {
  //~ const id = c.req.param("id");

  //~ const booking = await c.env.transport_db
    //~ .prepare(`
      //~ SELECT
        //~ b.id,
        //~ b.customer_name,
        //~ b.phone_number,
        //~ b.route_id,
        //~ b.vehicle_id,
        //~ b.seat_no,
        //~ b.status,
        //~ b.payment_status,
        //~ b.created_at,
        //~ b.travel_date,
        //~ b.departure_time,
        //~ b.payment_utr,
        //~ b.ticket_code,
        //~ b.used_at,
        //~ b.is_used,
        //~ r.source,
        //~ r.destination,
        //~ r.fare
      //~ FROM bookings b
      //~ LEFT JOIN routes r
        //~ ON r.id = b.route_id
      //~ WHERE b.id = ?
    //~ `)
    //~ .bind(id)
    //~ .first();

  //~ if (!booking) {
    //~ return c.json({ error: "Booking not found" }, 404);
  //~ }

  //~ return c.json(booking);
//~ });
//~ //UTR Api
//~ bookings.put(
  //~ "/:id/payment",
  //~ async (c) => {
    //~ const id =
      //~ c.req.param("id");

    //~ const {
      //~ payment_utr,
    //~ } = await c.req.json();

    //~ await c.env.transport_db
      //~ .prepare(
        //~ `
        //~ UPDATE bookings
        //~ SET payment_utr=?
        //~ WHERE id=?
      //~ `
      //~ )
      //~ .bind(
        //~ payment_utr,
        //~ id
      //~ )
      //~ .run();

    //~ return c.json({
      //~ success: true,
    //~ });
  //~ }
//~ );
//~ //admin aprrove
//~ bookings.put("/:id/approve", authMiddleware, async (c) => {
    //~ const id =
      //~ c.req.param("id");

    //~ await c.env.transport_db
      //~ .prepare(
        //~ `
        //~ UPDATE bookings
        //~ SET payment_status='paid'
        //~ WHERE id=?
      //~ `
      //~ )
      //~ .bind(id)
      //~ .run();

    //~ return c.json({
      //~ success: true,
    //~ });
  //~ }
//~ );
//~ //Qr verify Api 
//~ bookings.get(
  //~ "/verify/:code",
  //~ async (c) => {
    //~ const code =
      //~ c.req.param("code");

    //~ const booking =
      //~ await c.env.transport_db
        //~ .prepare(
          //~ `
          //~ SELECT *
          //~ FROM bookings
          //~ WHERE ticket_code=?
        //~ `
        //~ )
        //~ .bind(code)
        //~ .first();

    //~ if (!booking) {
      //~ return c.json({
        //~ status:
          //~ "NOT_FOUND",
      //~ });
    //~ }

    //~ if (
      //~ booking.payment_status !==
      //~ "paid"
    //~ ) {
      //~ return c.json({
        //~ status:
          //~ "UNPAID",
      //~ });
    //~ }

    //~ if (
      //~ Number(booking.is_used) === 1
    //~ ) {
      //~ return c.json({
        //~ status:
          //~ "ALREADY_USED",
      //~ });
    //~ }

    //~ return c.json({
      //~ status: "PAID",
      //~ booking,
    //~ });
  //~ }
//~ );
//~ // Ticket used api 
//~ bookings.put(
  //~ "/use/:code",
  //~ async (c) => {
    //~ const code =
      //~ c.req.param("code");

    //~ await c.env.transport_db
      //~ .prepare(
        //~ `
        //~ UPDATE bookings
        //~ SET
          //~ is_used=1,
          //~ used_at=CURRENT_TIMESTAMP
        //~ WHERE ticket_code=?
      //~ `
      //~ )
      //~ .bind(code)
      //~ .run();

    //~ return c.json({
      //~ success: true,
    //~ });
  //~ }
//~ );
//~ // Update Booking
//~ //bookings.put("/:id", async (c) => {
//~ bookings.put("/:id", authMiddleware, async (c) => {
  //~ const id = c.req.param("id");

  //~ const {
    //~ customer_name,
    //~ route_id,
    //~ vehicle_id,
    //~ seat_no,
    //~ travel_date,
    //~ departure_time,
    //~ payment_status,
    //~ phone_number,
    //~ status,
  //~ } = await c.req.json();

  //~ if (Number(seat_no) <= 0) {
    //~ return c.json(
      //~ {
        //~ error: "Seat number must be greater than zero",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ const existing = await c.env.transport_db
    //~ .prepare(`
      //~ SELECT id
      //~ FROM bookings
      //~ WHERE vehicle_id = ?
      //~ AND seat_no = ?
      //~ AND travel_date = ?
      //~ AND departure_time = ?
      //~ AND phone_number = ?
      //~ AND status = 'active'
      //~ AND id != ?
    //~ `)
    //~ .bind(
      //~ vehicle_id,
      //~ seat_no,
      //~ travel_date,
      //~ departure_time,
      //~ phone_number,
      //~ id
    //~ )
    //~ .first();

  //~ if (existing) {
    //~ return c.json(
      //~ {
        //~ error: "Seat already booked",
      //~ },
      //~ 400
    //~ );
  //~ }

  //~ await c.env.transport_db
    //~ .prepare(`
      //~ UPDATE bookings
      //~ SET
        //~ customer_name=?,
        //~ route_id=?,
        //~ vehicle_id=?,
        //~ seat_no=?,
        //~ travel_date=?,
        //~ departure_time=?,
        //~ phone_number=?,
        //~ status=?
      //~ WHERE id=?
    //~ `)
    //~ .bind(
      //~ customer_name,
      //~ route_id,
      //~ vehicle_id,
      //~ seat_no,
      //~ travel_date,
      //~ departure_time,
      //~ phone_number,
      //~ status,
      //~ id
    //~ )
    //~ .run();

  //~ return c.json({
    //~ success: true,
  //~ });
//~ });

//~ // Delete Booking
//~ //bookings.delete("/:id", async (c) => {
//~ bookings.delete("/:id", authMiddleware, async (c) => {
  //~ const id = c.req.param("id");

  //~ await c.env.transport_db
    //~ .prepare(
      //~ "DELETE FROM bookings WHERE id=?"
    //~ )
    //~ .bind(id)
    //~ .run();

  //~ return c.json({
    //~ success: true,
  //~ });
//~ });
//~ //seat display
//~ bookings.get("/seats/:vehicleId", async (c) => {
  //~ const vehicleId = c.req.param("vehicleId");
  //~ const travelDate = c.req.query("travel_date");
  //~ const departureTime = c.req.query("departure_time");

  //~ const result = await c.env.transport_db
    //~ .prepare(`
      //~ SELECT seat_no
      //~ FROM bookings
      //~ WHERE vehicle_id = ?
      //~ AND travel_date = ?
      //~ AND departure_time = ?
      //~ AND status = 'active'
    //~ `)
    //~ .bind(
      //~ vehicleId,
      //~ travelDate,
      //~ departureTime
    //~ )
    //~ .all();

  //~ return c.json(result.results);
//~ });
//~ export default bookings;
//payment logic 
//transport-system/backend/src/routes/bookings.ts
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth";

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

  // Expire old payment holds before checking the seat
  const now = new Date().toISOString();

  await c.env.transport_db
    .prepare(`
      UPDATE bookings
      SET status = 'expired'
      WHERE status = 'payment_pending'
      AND payment_expires_at IS NOT NULL
      AND payment_expires_at <= ?
    `)
    .bind(now)
    .run();

  // Check if the seat is already booked or currently held
  const existing = await c.env.transport_db
    .prepare(`
      SELECT id
      FROM bookings
      WHERE vehicle_id = ?
      AND seat_no = ?
      AND travel_date = ?
      AND departure_time = ?
      AND (
        status = 'active'
        OR status = 'payment_pending'
      )
    `)
    .bind(
      vehicle_id,
      seat_no,
      travel_date,
      departure_time
    )
    .first();

  if (existing) {
    return c.json(
      {
        error: "Seat already booked or temporarily reserved",
      },
      400
    );
  }

  // Hold this seat for 10 minutes
  const paymentExpiresAt = new Date(
    Date.now() + 10 * 60 * 1000
    //Date.now() + 1 * 60 * 1000
  ).toISOString();

  const result = await c.env.transport_db
    .prepare(`
      INSERT INTO bookings
      (
        customer_name,
        route_id,
        vehicle_id,
        seat_no,
        status,
        payment_status,
        payment_expires_at,
        travel_date,
        departure_time,
        phone_number
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      customer_name,
      route_id,
      vehicle_id,
      seat_no,
      "payment_pending",
      "pending",
      paymentExpiresAt,
      travel_date,
      departure_time,
      phone_number
    )
    .run();

  const bookingId = result.meta.last_row_id;

  // Generate ticket code now.
  // The ticket becomes usable only after payment is confirmed.
  const ticketCode = crypto.randomUUID();

  await c.env.transport_db
    .prepare(`
      UPDATE bookings
      SET ticket_code = ?
      WHERE id = ?
    `)
    .bind(
      ticketCode,
      bookingId
    )
    .run();

  return c.json({
    success: true,
    id: bookingId,
    ticket_code: ticketCode,
    status: "payment_pending",
    payment_status: "pending",
    payment_expires_at: paymentExpiresAt,
  });
});
// Create Cashfree Payment Order
bookings.post("/:id/cashfree-order", async (c) => {
  const id = c.req.param("id");

  // Get the existing booking
  const booking = await c.env.transport_db
    .prepare(`
      SELECT
        b.id,
        b.customer_name,
        b.phone_number,
        b.route_id,
        b.payment_status,
        r.source,
        r.destination,
        r.fare
      FROM bookings b
      JOIN routes r ON r.id = b.route_id
      WHERE b.id = ?
    `)
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

  // Do not create another payment order if already paid
  if (booking.payment_status === "paid") {
    return c.json(
      {
        error: "Booking is already paid",
      },
      400
    );
  }

  const fare = Number(booking.fare);

  if (!Number.isFinite(fare) || fare <= 0) {
    return c.json(
      {
        error: "Invalid booking fare",
      },
      400
    );
  }

  if (!booking.phone_number) {
    return c.json(
      {
        error: "Customer phone number is missing",
      },
      400
    );
  }

  // Cashfree requires a customer phone number
  const customerPhone = String(booking.phone_number).replace(/\D/g, "");

  if (customerPhone.length < 10) {
    return c.json(
      {
        error: "Invalid customer phone number",
      },
      400
    );
  }

  // Use a unique Cashfree order ID for this booking
  const orderId = `booking_${booking.id}_${crypto.randomUUID()}`;

  console.log(
    "Cashfree App ID exists:",
    !!c.env.CASHFREE_APP_ID
  );

  console.log(
    "Cashfree Secret exists:",
    !!c.env.CASHFREE_SECRET_KEY
  );

  const cashfreeResponse = await fetch(
    "https://sandbox.cashfree.com/pg/orders",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": c.env.CASHFREE_APP_ID,
        "x-client-secret": c.env.CASHFREE_SECRET_KEY,
        "x-request-id": crypto.randomUUID(),
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount: fare,
        order_currency: "INR",

        customer_details: {
          customer_id: `customer_${booking.id}`,
          customer_name: booking.customer_name,
          customer_phone: customerPhone,
        },

        order_meta: {
          // return_url: `http://localhost:5173/ticket/${booking.id}`,
          return_url: `https://transport-system-lru.pages.dev/ticket/${booking.id}`,
        },

        order_note: `Transport booking #${booking.id}`,
      }),
    }
  );

  const cashfreeData = await cashfreeResponse.json();

  if (!cashfreeResponse.ok) {
    console.error(
      "Cashfree order creation failed:",
      cashfreeData
    );

    return c.json(
      {
        error: "Failed to create Cashfree payment order",
        details: cashfreeData,
      },
      502
    );
  }

  // Save the Cashfree order ID against this booking
  await c.env.transport_db
    .prepare(`
      UPDATE bookings
      SET payment_utr = ?
      WHERE id = ?
    `)
    .bind(orderId, id)
    .run();

  return c.json({
    success: true,
    booking_id: booking.id,
    order_id: cashfreeData.order_id,
    payment_session_id: cashfreeData.payment_session_id,
    order_amount: fare,
    order_currency: "INR",
  });
});


// Verify Cashfree Payment
bookings.post("/:id/verify-cashfree", async (c) => {
  const id = c.req.param("id");

  const booking = await c.env.transport_db
    .prepare(`
      SELECT
        id,
        payment_status,
        payment_utr
      FROM bookings
      WHERE id = ?
    `)
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

  if (!booking.payment_utr) {
    return c.json({
      success: false,
      payment_status: "pending",
      message: "Cashfree order ID not found",
    });
  }

  const orderId = String(booking.payment_utr);

  const cashfreeResponse = await fetch(
    `https://sandbox.cashfree.com/pg/orders/${encodeURIComponent(orderId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2025-01-01",
        "x-client-id": c.env.CASHFREE_APP_ID,
        "x-client-secret": c.env.CASHFREE_SECRET_KEY,
        "x-request-id": crypto.randomUUID(),
      },
    }
  );

  const cashfreeData = await cashfreeResponse.json();

  if (!cashfreeResponse.ok) {
    console.error(
      "Cashfree verification failed:",
      cashfreeData
    );

    return c.json(
      {
        success: false,
        error: "Unable to verify payment with Cashfree",
        details: cashfreeData,
      },
      502
    );
  }

  const cashfreeStatus = String(
    cashfreeData.order_status || ""
  ).toUpperCase();

  console.log("Cashfree order status:", {
    orderId,
    cashfreeStatus,
  });

  if (cashfreeStatus === "PAID") {
    await c.env.transport_db
      .prepare(`
       UPDATE bookings
       SET
        payment_status = 'paid',
        status = 'active',
        payment_expires_at = NULL
       WHERE id = ?
    `)
   .bind(id)
   .run();

    return c.json({
      success: true,
      payment_status: "paid",
      cashfree_status: cashfreeStatus,
    });
  }

  return c.json({
    success: true,
    payment_status: "pending",
    cashfree_status: cashfreeStatus,
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
    .prepare(`
      SELECT
        b.id,
        b.customer_name,
        b.phone_number,
        b.route_id,
        b.vehicle_id,
        b.seat_no,
        b.status,
        b.payment_status,
        b.created_at,
        b.travel_date,
        b.departure_time,
        b.payment_utr,
        b.ticket_code,
        b.used_at,
        b.is_used,
        r.source,
        r.destination,
        r.fare
      FROM bookings b
      LEFT JOIN routes r
        ON r.id = b.route_id
      WHERE b.id = ?
    `)
    .bind(id)
    .first();

  if (!booking) {
    return c.json({ error: "Booking not found" }, 404);
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
      status: "PAID",
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
//seat display
// Seat display
bookings.get("/seats/:vehicleId", async (c) => {
  const vehicleId = c.req.param("vehicleId");
  const travelDate = c.req.query("travel_date");
  const departureTime = c.req.query("departure_time");

  // Expire old payment holds first
  const now = new Date().toISOString();

  await c.env.transport_db
    .prepare(`
      UPDATE bookings
      SET status = 'expired'
      WHERE status = 'payment_pending'
      AND payment_expires_at IS NOT NULL
      AND payment_expires_at <= ?
    `)
    .bind(now)
    .run();

  const result = await c.env.transport_db
    .prepare(`
      SELECT seat_no
      FROM bookings
      WHERE vehicle_id = ?
      AND travel_date = ?
      AND departure_time = ?
      AND (
        status = 'active'
        OR status = 'payment_pending'
      )
    `)
    .bind(
      vehicleId,
      travelDate,
      departureTime
    )
    .all();

  return c.json(result.results);
});
export default bookings;
