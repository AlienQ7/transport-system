import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css"; 
import "../styles/bookings.css"; 

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [departureTime, setDepartureTime] = useState("");
  const [phone, setPhone] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const formRef = useRef(null);
  useEffect(() => {
    loadBookings();
    loadRoutes();
    loadVehicles();
  }, []);
  const filteredBookings = bookings.filter((booking) => {
  const query = searchTerm.trim().toLowerCase();

  if (!query) return true;

  return [
      booking.id,
      booking.customer_name,
      booking.phone_number,
      booking.source,
      booking.destination,
      booking.vehicle_name,
      booking.seat_no,
      booking.status,
      booking.payment_status,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(query)
    );
  });
  async function loadBookings() {
    const res = await apiFetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
  }

  async function loadRoutes() {
    const res = await apiFetch("/api/routes");
    const data = await res.json();
    setRoutes(data);
  }

  async function loadVehicles() {
    const res = await apiFetch("/api/vehicles");
    const data = await res.json();
    setVehicles(data);
  }

  async function createBooking(e) {
    e.preventDefault();
    if (!travelDate || !departureTime) {
      alert("Select travel date and departure time");
      return;
    }
    if (Number(seatNo) <= 0) {
      alert("Seat number must be greater than zero");
      return;
    }

    const res = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        customer_name: customerName,
        route_id: Number(routeId),
        vehicle_id: Number(vehicleId),
        seat_no: Number(seatNo),
        phone_number: phone,
        travel_date: travelDate,
        departure_time: departureTime,
      }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    resetForm();
    loadBookings();
  }

  async function updateBooking(e) {
    e.preventDefault();
    if (!routeId || !vehicleId || !travelDate || !departureTime || !phone) {
      alert("Please fill out all fields");
      return;
    }
    if (Number(seatNo) <= 0) {
      alert("Seat number must be greater than zero");
      return;
    }

    const res = await apiFetch(`/api/bookings/${editingId}`, {
      method: "PUT",
      body: JSON.stringify({
        customer_name: customerName,
        route_id: Number(routeId),
        vehicle_id: Number(vehicleId),
        seat_no: Number(seatNo),
        phone_number: phone,
        travel_date: travelDate,
        departure_time: departureTime,
        status: "active",
      }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }

    resetForm();
    loadBookings();
  }

  async function deleteBooking(id) {
    if (!window.confirm("Delete booking?")) return;
    await apiFetch(`/api/bookings/${id}`, { method: "DELETE" });
    loadBookings();
  }
  async function approvePayment(id) {
  const res = await apiFetch(`/api/bookings/${id}/approve`, {
    method: "PUT",
  });
  const data = await res.json();
  if (!res.ok) {
    alert(data.error || "Failed to approve payment");
    return;
  }
  await loadBookings();
}
  function editBooking(booking) {
    setEditingId(booking.id);
    setCustomerName(booking.customer_name);
    setRouteId(String(booking.route_id));
    setVehicleId(String(booking.vehicle_id));
    setSeatNo(String(booking.seat_no));
    setTravelDate(booking.travel_date || "");
    setDepartureTime(booking.departure_time || "");
    setPhone(booking.phone_number || "");
    formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
    
  }

  function resetForm() {
    setEditingId(null);
    setCustomerName("");
    setRouteId("");
    setVehicleId("");
    setSeatNo("");
    setTravelDate("");
    setDepartureTime("");
    setPhone("");
  }

  return (
    <div className="container-fluid px-0">
      <div className="row g-4">
        {/* Form Content Side Panel Card */}
        <div className="col-12 col-xl-4" ref={formRef}>
          <div className="bookings-card">
            <h1>Bookings</h1>
            <form onSubmit={editingId ? updateBooking : createBooking}>
              <input 
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <input
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <select value={routeId} onChange={(e) => setRouteId(e.target.value)}>
                <option value="">Select Route</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.source} {" → "} {route.destination}
                  </option>
                ))}
              </select>

              <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)}>
                <option value="">Select Vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Seat Number"
                value={seatNo}
                onChange={(e) => setSeatNo(e.target.value)}
              />

              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
              />
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
              
              <button type="submit">
                {editingId ? "Update Booking" : "Add Booking"}
              </button>

              {editingId && (
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </form>
          </div>
        </div>
        
{/* Responsive Booking Cards */}
<div className="col-12 col-xl-8">
  <div className="bookings-card data-card">
    <div className="booking-list-header">
      <div>
        <h2>All Bookings</h2>
        <p>
          {searchTerm.trim()
            ? `${filteredBookings.length} of ${bookings.length} booking(s)`
            : `${bookings.length} booking(s) found`}
        </p>
      </div>
    </div>

    {/* Passenger Search */}
    <div className="booking-search">
      <span className="booking-search-icon" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          width="19"
          height="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m16 16 4 4" />
        </svg>
      </span>

      <input
        type="search"
        placeholder="Search passenger, phone, booking ID, route..."
        aria-label="Search bookings"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <button
          type="button"
          className="booking-search-clear"
          onClick={() => setSearchTerm("")}
          aria-label="Clear search"
        >
          Clear
        </button>
      )}
    </div>

    <div className="booking-cards-list">
      {filteredBookings.length === 0 ? (
        <div className="booking-empty">
          {bookings.length === 0
            ? "No bookings found."
            : "No passengers match your search."}
        </div>
      ) : (
        filteredBookings.map((booking) => (
          <article className="booking-item-card" key={booking.id}>
            {/* Passenger and status */}
            <div className="booking-item-header">
              <div className="booking-passenger">
                <span className="booking-id">
                  Booking #{booking.id}
                </span>

                <h3>{booking.customer_name}</h3>

                <a
                  className="booking-phone"
                  href={`tel:${booking.phone_number || ""}`}
                >
                  {booking.phone_number || "No phone number"}
                </a>
              </div>

              <div className="booking-badges">
                <span
                  className={`badge-status ${(booking.status || "").toLowerCase()}`}
                >
                  {booking.status || "Unknown"}
                </span>

                <span
                  className={`badge-payment ${(booking.payment_status || "").toLowerCase()}`}
                >
                  {booking.payment_status || "Unpaid"}
                </span>
              </div>
            </div>

            {/* Route and seat */}
            <div className="booking-route-row">
              <div className="booking-route-box">
                <span className="booking-detail-label">ROUTE</span>

                <div className="booking-route">
                  <span>{booking.source || "Unknown source"}</span>
                  <span className="booking-route-arrow">→</span>
                  <span>
                    {booking.destination || "Unknown destination"}
                  </span>
                </div>
              </div>

              <div className="booking-seat-box">
                <span className="booking-detail-label">SEAT</span>
                <strong>{booking.seat_no ?? "—"}</strong>
              </div>
            </div>

            {/* Compact travel information */}
            <div className="booking-details-grid">
              <div className="booking-detail">
                <span className="booking-detail-label">VEHICLE</span>
                <strong>{booking.vehicle_name || "—"}</strong>
              </div>

              <div className="booking-detail">
                <span className="booking-detail-label">TRAVEL DATE</span>
                <strong>{booking.travel_date || "—"}</strong>
              </div>

              <div className="booking-detail">
                <span className="booking-detail-label">DEPARTURE</span>
                <strong>{booking.departure_time || "—"}</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="booking-actions">
              <button
                type="button"
                className="booking-btn booking-btn-edit"
                onClick={() => editBooking(booking)}
              >
                Edit
              </button>

              <button
                type="button"
                className="booking-btn booking-btn-delete"
                onClick={() => deleteBooking(booking.id)}
              >
                Delete
              </button>

              {booking.payment_status?.toLowerCase() !== "paid" && (
                <button
                  type="button"
                  className="booking-btn booking-btn-approve"
                  onClick={() => approvePayment(booking.id)}
                >
                  Approve Payment
                </button>
              )}

              {booking.payment_status?.toLowerCase() === "paid" && (
                <button
                  type="button"
                  className="booking-btn booking-btn-ticket"
                  onClick={() =>
                    window.open(`/ticket/${booking.id}`, "_blank")
                  }
                >
                  View Ticket
                </button>
              )}
            </div>
          </article>
        ))
      
      )}
    </div>
  </div>
</div>
</div> 
</div> 
  );
}
