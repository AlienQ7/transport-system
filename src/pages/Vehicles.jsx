// DEPLOY TEST JUNE 2026
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/vehicles.css";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [name, setName] = useState("");
  //const [capacity, setCapacity] = useState("");
  const [routeId, setRouteId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [editingId, setEditingId] = useState(null);
  // seat layout
  const [layout, setLayout] = useState(``);
  const capacity =
  (layout.match(/[SR]/g) || []).length;
  
  let seatCounter = 1;

  useEffect(() => {
    loadVehicles();
    loadRoutes();
  }, []);

  async function loadVehicles() {
    const res = await apiFetch("/api/vehicles");
    const data = await res.json();
    setVehicles(data);
  }

  async function loadRoutes() {
    const res = await apiFetch("/api/routes");
    const data = await res.json();
    setRoutes(data);
  }

  async function createVehicle(e) {
    e.preventDefault();
    const capacityValue = Number(capacity);

    if (capacityValue <= 0) {
      alert("Capacity must be greater than zero");
      return;
    }

    await apiFetch("/api/vehicles", {
      method: "POST",
      body: JSON.stringify({
        name,
        capacity: capacityValue,
        layout,
        route_id: Number(routeId),
        travel_date: travelDate,
        departure_time: departureTime,
      }),
    });

    resetForm();
    loadVehicles();
  }

  async function updateVehicle(e) {
    e.preventDefault();
    const capacityValue = Number(capacity);

    if (capacityValue <= 0) {
      alert("Capacity must be greater than zero");
      return;
    }

    await apiFetch(`/api/vehicles/${editingId}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        capacity: capacityValue,
        layout,
        route_id: Number(routeId),
        travel_date: travelDate,
        departure_time: departureTime,
      }),
    });

    resetForm();
    loadVehicles();
  }

  async function deleteVehicle(id) {
    if (!window.confirm("Delete vehicle?")) {
      return;
    }

    await apiFetch(`/api/vehicles/${id}`, {
      method: "DELETE",
    });

    loadVehicles();
  }

  function editVehicle(vehicle) {
    setEditingId(vehicle.id);
    setName(vehicle.name);
    setLayout(vehicle.layout || "");
    setRouteId(vehicle.route_id);
    setTravelDate(vehicle.travel_date || "");
    setDepartureTime(vehicle.departure_time || "");
  }
  
  function resetForm() {
    setEditingId(null);
    setName("");
    setLayout("");
    setRouteId("");
    setTravelDate("");
    setDepartureTime("");
  }

  return (
    <div className="container-fluid px-0 text-white">
      
      {/* Page Title Header Block */}
      <div className="mb-4">
        <h1 className="fw-bold m-0 vehicles-page-title">Fleet Management</h1>
        <p className="text-white m-0 mt-1">Configure registered transport vehicles, adjust capacity thresholds, and assign active routes.</p>
      </div>

      {/* Deployment & Modification Input Panel Card */}
      <div className="card vehicles-management-card p-4 mb-4 shadow-sm">
        <h5 className="fw-semibold mb-3 text-white">
          {editingId ? "🔧 Update Fleet Specifications" : "Register New Fleet Asset"}
        </h5>
        
        <form onSubmit={editingId ? updateVehicle : createVehicle}>
          <div className="row g-3">
            
            <div className="col-12 col-md-4">
              <label className="form-label text-white small fw-semibold">Vehicle Code / ID plate</label>
              <input
                className="form-control dark-form-input"
                placeholder="e.g, NL8787"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-white small fw-semibold">Scheduled Date</label>
              <input
                type="date"
                className="form-control dark-form-input"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-white small fw-semibold">Target Departure Time</label>
              <input
                type="time"
                className="form-control dark-form-input"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-white small fw-semibold">Assigned Route </label>
              <select
                className="form-select dark-form-select"
                value={routeId}
                onChange={(e) => setRouteId(e.target.value)}
                required
              >
                <option value="">Select Operational Route...</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.source} &rarr; {route.destination}
                  </option>
                ))}
              </select>
            </div>
            {/* Layout preivew*/}
<div className="col-12">
  <label className="form-label text-white small fw-semibold">
    Vehicle Layout Preview
  </label>

  <div
    className="p-3 rounded"
    style={{
      background: "#111827",
      overflowX: "auto",
    }}
  >
    
    {layout.split("\n").map((row, rowIndex) => (
      <div
        key={rowIndex}
        className="d-flex justify-content-center gap-1 mb-1"
      >
        {row.split("").map((cell, cellIndex) => {
          let bg = "transparent";
          let text = "";
          if (cell === "S") {
  bg = "#198754";
  text = seatCounter++;
}

if (cell === "R") {
  bg = "#6c757d";
  text = seatCounter++;
}
      

          if (cell === "D") {
            bg = "#495057";
            text = "D";
          }

          return (
            <div
              key={cellIndex}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                backgroundColor: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                color: "white",
              }}
            >
              {text}
            </div>
          );
        })}
      </div>
    ))}
  </div>
</div>
            <div className="col-12">
  <label className="form-label text-white small fw-semibold">
    Vehicle Layout
  </label>

  <textarea
    className="form-control dark-form-input"
    rows="5"
    value={layout}
    onChange={(e) => setLayout(e.target.value.toUpperCase())}
  />
</div>

{/*Button fo BNRD */}
<div className="d-flex gap-2 mb-2">
  <button
    type="button"
    className="btn btn-success"
    onClick={() => setLayout(layout + "S")}
  >
    (S)Seat
  </button>

  <button
    type="button"
    className="btn btn-secondary"
    onClick={() => setLayout(layout + "R")}
  >
    (R)Reserved
  </button>

  <button
    type="button"
    className="btn btn-dark"
    onClick={() => setLayout(layout + "D")}
  >
    (D)Driver
  </button>

  <button
    type="button"
    className="btn btn-light"
    onClick={() => setLayout(layout + "N")}
  >
    Empty
  </button>

  <button
    type="button"
    className="btn btn-primary"
    onClick={() => setLayout(layout + "\n")}
  >
    New Row
  </button>
</div>
<div className="col-12">
  <div className="alert alert-info py-2 mb-0">
    Total Seats Available: <strong>{capacity}</strong>
  </div>
</div>

          </div>

          {/* Form Action Triggers */}
          <div className="d-flex justify-content-end gap-2 mt-4">
            {editingId && (
              <button
                type="button"
                className="btn btn-outline-secondary px-4 fw-medium"
                onClick={resetForm}
                style={{ borderRadius: "8px" }}
              >
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-gold-action px-4">
              {editingId ? "Save Fleet Changes" : "Deploy Fleet Unit"}
            </button>
          </div>
        </form>
      </div>

      {/* Main Responsive Fleet Matrix Panel */}
      <div className="card vehicles-management-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-bottom" style={{ borderColor: "var(--border-muted)" }}>
          <h5 className="m-0 fw-semibold text-white">Active Operational Fleet Registry</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-dark custom-dark-table m-0">
            <thead>
              <tr>
                <th style={{ width: "70px" }}>ID</th>
                <th>Vehicle Plate</th>
                <th>Capacity Limit</th>
                <th>Travel Date</th>
                <th>Departure</th>
                <th>Origin Source</th>
                <th>Destination</th>
                <th className="text-end" style={{ width: "180px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-white small">
                    No registered operational vehicles tracked in registry.
                  </td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td className="fw-semibold text-white">#{vehicle.id}</td>
                    <td className="text-white fw-medium">{vehicle.name}</td>
                    <td>
                      <span className="badge bg-dark border text-light px-2.5 py-1.5" style={{ borderColor: "var(--border-muted)" }}>
                        {vehicle.capacity} Seats
                      </span>
                    </td>
                    <td>{vehicle.travel_date}</td>
                    <td>{vehicle.departure_time}</td>
                    <td>{vehicle.source}</td>
                    <td>{vehicle.destination}</td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-warning px-3"
                          style={{ borderRadius: "6px", fontWeight: "500" }}
                          onClick={() => editVehicle(vehicle)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger px-3"
                          style={{ borderRadius: "6px", fontWeight: "500" }}
                          onClick={() => deleteVehicle(vehicle.id)}
                        >
                          Delete
                        </button>
                      </div>
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
