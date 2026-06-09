// DEPLOY TEST JUNE 2026
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/booking.css"; 

export default function Booking() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [selectedFare, setSelectedFare] = useState(0);
  const [routeId, setRouteId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [seatNo, setSeatNo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const selectedVehicle =
      vehicles.find(v => String(v.id) === String(vehicleId));

  const vehicleLayout =
     selectedVehicle?.layout || "";
     useEffect(() => {
      loadRoutes();
      loadVehicles();
    }, []);
    //after backend fecth remove
   useEffect(() => {
     setOccupiedSeats([2, 5, 8, 13, 21]);
    }, []);
    
   const parsedLayout =
  vehicleLayout
    ? vehicleLayout
        .trim()
        .split("\n")
        .map(row => row.trim().split(""))
    : [];
 // S number
   let seatCounter = 1;

const numberedLayout =

  parsedLayout.map(row =>
    row.map(cell => {

      if (cell === "S") {
        return {
          type: "S",
          seatNo: seatCounter++
        };
      }

      if (cell === "R") {
        return {
          type: "R",
          seatNo: seatCounter++
        };
      }

      return {
        type: cell
      };
    })
  );
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

  async function submitBooking(e) {
    e.preventDefault();

    if (!customerName.trim()) { alert("Enter customer name"); return; }
    if (!routeId) { alert("Select route"); return; }
    if (!vehicleId) { alert("Select vehicle"); return; }
    if (Number(seatNo) <= 0) { alert("Seat number must be greater than 0"); return; }
    if (!travelDate) { alert("Select travel date"); return; }
    if (!departureTime) { alert("Select departure time"); return; }
    if (!phone.trim()) { alert("Enter phone number"); return; }

    const res = await apiFetch("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        customer_name: customerName,
        route_id: Number(routeId),
        vehicle_id: Number(vehicleId),
        seat_no: Number(seatNo),
        travel_date: travelDate,
        departure_time: departureTime,
        phone_number: phone,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error);
      return;
    }
    navigate(`/payment/${data.id}`);
    //alert("Booking Successful");
    //setCustomerName("");
    //setRouteId("");
    //setVehicleId("");
    //setSeatNo("");
    //setTravelDate("");
    //setDepartureTime("");
    //setSelectedFare(0);
  }

  return (
    <div className="w-100 px-0 text-white" style={{ minHeight: "100vh", backgroundColor: "var(--bg-app-dark)" }}>
      
      {/* 3. SNAP-TO-LEFT BACK BUTTON CONTAINER WRAPPER */}
      <div className="w-100 d-flex justify-content-start mb-3">
        <button 
          onClick={() => navigate("/")} 
          className="btn btn-back-arrow d-inline-flex align-items-center gap-2 py-2 px-3"
          type="button"
        >
          <span>&larr;</span> Back
        </button>
      </div>

      {/* Top Title Header */}
      <div className="mb-4 text-center text-lg-start">
        <h1 className="fw-bold m-0 booking-page-title">Book Ticket</h1>
        <p className="text-white m-0 mt-1">Issue fresh seats, assign active passenger, and generate transit records.</p>
      </div>

      {/* Main Integrated Grid Panel */}
      <div className="card booking-container-card p-4 shadow-sm">
        <form onSubmit={submitBooking}>
          <div className="row g-4 align-items-stretch">
            
            {/* Left Data Entry Fields Form Column */}
            <div className="col-12 col-lg-8">
              <h5 className="fw-semibold mb-3 text-white text-center text-lg-start">Passenger Details & Operations</h5>
              
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label text-white small fw-semibold">Customer Full Name</label>
                  <input
                    className="form-control dark-form-input "
                    placeholder="Enter full legal passenger name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label text-white small fw-semibold">Phone Number</label>
                  <input
						type="text" 
						className="form-control dark-form-input"
						placeholder="Enter Valid Phone number"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						maxLength={14} 
						pattern="^[+]*[0-9\s\-]{10,14}$" 
						title="Please enter a valid phone number (numbers, spaces, or country code allowed)"
						required
				/>
				</div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-white small fw-semibold">Route</label>
                  <select
                    className="form-select dark-form-select"
                    value={routeId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setRouteId(id);
                      const route = routes.find((r) => String(r.id) === id);
                      setSelectedFare(route ? route.fare : 0);
                    }}
                    required
                  >
                    <option value="">Select Target Route...</option>
                    {routes.map((route) => (
                      <option key={route.id} value={route.id}>
                        {route.source} &rarr; {route.destination}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-12 col-md-6">
                  <label className="form-label text-white small fw-semibold">Vehicle</label>
                  <select
                    className="form-select dark-form-select"
                    value={vehicleId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setVehicleId(id);
                      const vehicle = vehicles.find((v) => String(v.id) === String(id));
                      setTravelDate(vehicle?.travel_date || "");
                      setDepartureTime(vehicle?.departure_time || "");
                    }}
                    required
                  >
                    <option value="">Select Assigned Vehicle...</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </option>
                    ))}
                  </select>
                </div>

               {/*render layout*/} 
             <div className="d-flex flex-column gap-2">
  
{numberedLayout.map((row, rowIndex) => (
  <div
    key={rowIndex}
    className="d-flex gap-1 justify-content-center"
  >
    {row.map((cell, cellIndex) => {

      if (cell.type === "N") {
  return (
    <div
      key={`n-${rowIndex}-${cellIndex}`}
            style={{
              width: 32,
              height: 32
            }}
          />
        );
      }

      if (cell.type === "D") {
  return (
    <div
      key={`d-${rowIndex}-${cellIndex}`}
            className="seat-driver"
          >
            D
          </div>
        );
      }

      if (cell.type === "R") {
  return (
    <div
      key={`r-${rowIndex}-${cellIndex}`}
      className="seat-reserved"
    >
      {cell.seatNo}
    </div>
  );
}

      if (cell.type !== "S") {
  return null;
}

const currentSeatNo = cell.seatNo;

const isBooked =
  occupiedSeats.includes(currentSeatNo);

const isSelected =
  selectedSeat === currentSeatNo;

      return (
  <button
    key={`${rowIndex}-${cellIndex}`}
    type="button"
          disabled={isBooked}
          className={
            isBooked
              ? "seat booked"
              : isSelected
              ? "seat selected"
              : "seat available"
          }
          onClick={() => {
            setSelectedSeat(currentSeatNo);
            setSeatNo(currentSeatNo);
          }}
        >
          {currentSeatNo}
        </button>
      );
    })}
  </div>
))}
<div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">

  <div>
    🟢 Available
  </div>

  <div>
    🔴 Booked
  </div>

  <div>
    🟡 Selected
  </div>

  <div>
    ⚫ Driver
  </div>

  <div>
    ⚪ Reserved
  </div>

</div>
</div>
{/*below legend*/}
<div className="text-center mt-3">
  <h6 className="text-warning">
    Selected Seat:
    {" "}
    {selectedSeat || "None"}
  </h6>
</div>
		</div></div>
						{/* Right Quick Summary Dashboard Badge Column */}
				<div className="col-12 col-lg-4 d-flex flex-column">
					<h5 className="fw-semibold mb-3 text-white text-center text-lg-start">Invoice Overview</h5>
              
				<div className="ticket-summary-badge flex-grow-1 d-flex flex-column justify-content-between">
                
                <div className="mb-4 text-center py-2">
                  <span className="text-secondary small d-block text-uppercase tracking-wider fw-semibold mb-1">Standard Route Fare</span>
                  <h2 className="m-0 fw-extrabold text-warning" style={{ fontSize: "36px" }}>
                    ₹{Number(selectedFare).toLocaleString("en-IN")}
                  </h2>
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="meta-schedule-box d-flex justify-content-between align-items-center">
                    <span className="small text-secondary fw-medium">📅 Travel Date</span>
                    <span className="small fw-semibold text-light">{travelDate}</span>
                  </div>
                  <div className="meta-schedule-box d-flex justify-content-between align-items-center">
                    <span className="small text-secondary fw-medium">⏰ Departure</span>
                    <span className="small fw-semibold text-light">{departureTime}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Submission Row Area */}
          <div className="d-flex justify-content-center justify-content-lg-end mt-4 pt-3 border-top" style={{ borderColor: "var(--border-muted)" }}>
            <button type="submit" className="btn btn-confrim px-5 fw-bold w-100 w-lg-auto">
              Confirm Ticket Issuance &rarr;
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
