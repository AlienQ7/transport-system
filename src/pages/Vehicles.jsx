/*import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [routeId, setRouteId] = useState("");
  const [travelDate, setTravelDate] =
    useState("");

  const [departureTime, setDepartureTime] =
    useState("");

  const [editingId, setEditingId] = useState(null);

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
    setCapacity(vehicle.capacity);
    setRouteId(vehicle.route_id);

    setTravelDate(
      vehicle.travel_date || ""
    );

    setDepartureTime(
      vehicle.departure_time || ""
    );
  }
  function resetForm() {
    setEditingId(null);

    setName("");
    setCapacity("");
    setRouteId("");

    setTravelDate("");
    setDepartureTime("");
  }

  return (
    <div>
      <h1>Vehicles</h1>

      <form
        onSubmit={
          editingId
            ? updateVehicle
            : createVehicle
        }
      >
        <input
          placeholder="Vehicle Number"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />
        <input
  type="date"
  value={travelDate}
  onChange={(e) =>
    setTravelDate(e.target.value)
  }
/>

<input
  type="time"
  value={departureTime}
  onChange={(e) =>
    setDepartureTime(e.target.value)
  }
/>

        <input
          type="number"
          min="1"
          placeholder="Capacity"
          value={capacity}
          onChange={(e) =>
            setCapacity(e.target.value)
          }
        />

        <select
          value={routeId}
          onChange={(e) =>
            setRouteId(e.target.value)
          }
        >
          <option value="">
            Select Route
          </option>

          {routes.map((route) => (
            <option
              key={route.id}
              value={route.id}
            >
              {route.source} → {route.destination}
            </option>
          ))}
        </select>

        <button type="submit">
          {editingId
            ? "Update Vehicle"
            : "Add Vehicle"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      <table border="1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehicle</th>
            <th>Capacity</th>
            <th>Travel Date</th>
            <th>Departure Time</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.name}</td>
              <td>{vehicle.capacity}</td>
              <td>{vehicle.travel_date}</td>
              <td>{vehicle.departure_time}</td>
              <td>{vehicle.source}</td>
              <td>{vehicle.destination}</td>

              <td>
                <button
                  onClick={() =>
                    editVehicle(vehicle)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteVehicle(vehicle.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
*/
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/vehicles.css"; // Imports matching variable styles

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);

  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [routeId, setRouteId] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const [editingId, setEditingId] = useState(null);

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
    setCapacity(vehicle.capacity);
    setRouteId(vehicle.route_id);
    setTravelDate(vehicle.travel_date || "");
    setDepartureTime(vehicle.departure_time || "");
  }
  
  function resetForm() {
    setEditingId(null);
    setName("");
    setCapacity("");
    setRouteId("");
    setTravelDate("");
    setDepartureTime("");
  }

  return (
    <div className="container-fluid px-0 text-white">
      
      {/* Page Title Header Block */}
      <div className="mb-4">
        <h1 className="fw-bold m-0 vehicles-page-title">Fleet Management</h1>
        <p className="text-secondary m-0 mt-1">Configure registered transport vehicles, adjust capacity thresholds, and assign active routes.</p>
      </div>

      {/* Deployment & Modification Input Panel Card */}
      <div className="card vehicles-management-card p-4 mb-4 shadow-sm">
        <h5 className="fw-semibold mb-3 text-white">
          {editingId ? "🔧 Update Fleet Specifications" : "➕ Register New Fleet Asset"}
        </h5>
        
        <form onSubmit={editingId ? updateVehicle : createVehicle}>
          <div className="row g-3">
            
            <div className="col-12 col-md-4">
              <label className="form-label text-secondary small fw-semibold">Vehicle Code / ID plate</label>
              <input
                className="form-control dark-form-input"
                placeholder="e.g., BUS-094"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-secondary small fw-semibold">Scheduled Date of Transit</label>
              <input
                type="date"
                className="form-control dark-form-input"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-secondary small fw-semibold">Target Departure Time</label>
              <input
                type="time"
                className="form-control dark-form-input"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-secondary small fw-semibold">Max Seat Capacity Limit</label>
              <input
                type="number"
                min="1"
                className="form-control dark-form-input"
                placeholder="Maximum passengers allowed"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-secondary small fw-semibold">Assigned Transit Route Link</label>
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
                  <td colSpan="8" className="text-center py-4 text-secondary small">
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
