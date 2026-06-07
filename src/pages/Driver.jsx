import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/dashboard.css"; 

export default function Driver() {
  const [assignedShift, setAssignedShift] = useState({
    vehicleName: "Sumu",
    licensePlate: "NL8787",
    route: "Kohima to Mon",
    departureTime: "10:0AM",
    totalPassengers: 0
  });
  
  const [manifest, setManifest] = useState([]);

  useEffect(() => {
    loadDriverManifest();
  }, []);

  async function loadDriverManifest() {
    try {
      // Fetching all bookings to filter out the driver's manifest list
      const res = await apiFetch("/api/bookings");
      const data = await res.json();
      
      // For now, filtering active/paid bookings to show who is riding today
      const confirmedPassengers = data.filter(b => b.status === "active" || b.payment_status === "paid");
      setManifest(confirmedPassengers);
      
      setAssignedShift(prev => ({
        ...prev,
        totalPassengers: confirmedPassengers.length
      }));
    } catch (err) {
      console.error("Failed to load driver manifest data:", err);
    }
  }

  return (
    <div className="container-fluid dashboard-page-wrapper px-0">
      
      {/* Header section */}
      <div className="mb-4 dashboard-header">
        <h1 className="fw-bold m-0">Driver Command Center</h1>
        <p className="text-white m-0 mt-1">Your assigned schedule, fleet vehicle tracking, and details.</p>
      </div>

      {/* Overview Cards Grid */}
      <div className="row g-4 mb-5">
        {/* Route Assignment Info Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="dashboard-metric-card" style={{ borderLeft: "4px solid var(--gold-accent, #ffc107)" }}>
            <div className="card-metric-info">
              <span className="metric-label">Assigned Route</span>
              <h4 className="fw-bold text-white mt-2">{assignedShift.route}</h4>
              <small className="text-warning fw-semibold">Departure: {assignedShift.departureTime}</small>
            </div>
          </div>
        </div>

        {/* Vehicle Assignment Info Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="dashboard-metric-card">
            <div className="card-metric-info">
              <span className="metric-label">Active Fleet Assignment</span>
              <h4 className="fw-bold text-white mt-2">{assignedShift.vehicleName}</h4>
              <small className="text-white">Plate: {assignedShift.licensePlate}</small>
            </div>
          </div>
        </div>

        {/* Total Booked Passengers Card */}
        <div className="col-12 col-md-6 col-lg-4">
          <div className="dashboard-metric-card">
            <div className="card-metric-info">
              <span className="metric-label">Confirmed Passengers</span>
              <h2 className="metric-count">{assignedShift.totalPassengers}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Read-Only Passenger Manifest Table Layout */}
      <div className="bookings-card data-card col-12">
        <div className="mb-3 d-flex align-items-center justify-content-between">
          <h3 className="text-warning fw-bold m-0 fs-4">Passengers (Read-Only)</h3>
          <span className="badge bg-secondary px-3 py-2 rounded-pill fw-semibold">Live manifest updates</span>
        </div>
        
        <div className="table-responsive-container">
          <table className="table table-dark table-hover m-0">
            <thead>
              <tr>
                <th>Seat No</th>
                <th>Passenger Name</th>
                <th>Contact Reference</th>
                <th>Travel Date</th>
                <th>Boarding Status</th>
              </tr>
            </thead>
            <tbody>
              {manifest.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No passengers booked for this run yet.</td>
                </tr>
              ) : (
                manifest.map((passenger) => (
                  <tr key={passenger.id}>
                    <td className="fw-bold text-warning">#{passenger.seat_no}</td>
                    <td>{passenger.customer_name}</td>
                    <td>{passenger.phone_number || "-"}</td>
                    <td>{passenger.travel_date}</td>
                    <td>
                      <span className={`badge-payment ${passenger.payment_status}`}>
                        {passenger.payment_status === "paid" ? "Confirmed Entry" : "Verification Required"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
