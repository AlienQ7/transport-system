import { useEffect, useState } from "react";
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
  const role = localStorage.getItem("role");

  if (role !== "driver") {
    return <div>Access Denied</div>;
  }

  useEffect(() => {
    loadBookings();
    loadRoutes();
    loadVehicles();
  }, []);

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
        payment_status: "pending",
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
    await apiFetch(`/api/bookings/${id}/approve`, {
      method: "PUT",
    });

    loadBookings();
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
        <div className="col-12 col-xl-4">
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

        {/* Table Content Window Data Layout */}
        <div className="col-12 col-xl-8">
          <div className="bookings-card data-card">
            <div className="table-responsive-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Seat</th>
                    <th>Travel Date</th>
                    <th>Departure Time</th>
                    <th>Vehicle</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>UTR</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>{booking.customer_name}</td>
                      <td>{booking.phone_number}</td>
                      <td>{booking.seat_no}</td>
                      <td>{booking.travel_date}</td>
                      <td>{booking.departure_time}</td>
                      <td>{booking.vehicle_name}</td>
                      <td>
                        {booking.source} {" → "} {booking.destination}
                      </td>
                      <td>
                        <span className={`badge-status ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
						<span className={`badge-payment ${booking.payment_status}`}>
							{booking.payment_status}
						</span>
					</td>

					<td>
							{booking.payment_utr || "-"}
					</td>

					<td>
						<button onClick={() => editBooking(booking)}>
							Edit
						</button>

					   <button onClick={() => deleteBooking(booking.id)}>
							Delete
					   </button>

						{booking.payment_status !== "paid" &&
							booking.payment_utr && (
					   <button
						   onClick={() =>
						   approvePayment(booking.id)
					   }
					   >
				    	   	Approve
					   </button>
					   )}
					   {booking.payment_status === "paid" && (
					   <button
					    	onClick={() =>
		    		  window.open(`/ticket/${booking.id}`, "_blank")
				    	}
				    	>
				    		View Ticket
				     	</button>
						)}
						</td>
                      <td>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
