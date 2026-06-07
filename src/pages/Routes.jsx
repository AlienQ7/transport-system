/*import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function Routes() {
  const [routes, setRoutes] = useState([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    const res = await apiFetch("/api/routes");
    const data = await res.json();
    setRoutes(data);
  }

  async function createRoute(e) {
    e.preventDefault();

    const fareValue = Number(fare);

    if (fareValue < 0) {
       alert("Fare cannot be negative");
       return;
    }

    await apiFetch("/api/routes", {
      method: "POST",
      body: JSON.stringify({
        source,
        destination,
        fare: Number(fare),
      }),
    });

    resetForm();
    loadRoutes();
  }

  async function updateRoute(e) {
    e.preventDefault();

    const fareValue = Number(fare);

    if (fareValue < 0) {
    alert("Fare cannot be negative");
    return;
    }

    await apiFetch(`/api/routes/${editingId}`, {
      method: "PUT",
      body: JSON.stringify({
        source,
        destination,
        fare: Number(fare),
      }),
    });

    resetForm();
    loadRoutes();
  }

  async function deleteRoute(id) {
    if (!window.confirm("Delete this route?")) {
      return;
    }

    await apiFetch(`/api/routes/${id}`, {
      method: "DELETE",
    });

    loadRoutes();
  }

  function editRoute(route) {
    setEditingId(route.id);
    setSource(route.source);
    setDestination(route.destination);
    setFare(route.fare);
  }

  function resetForm() {
    setEditingId(null);
    setSource("");
    setDestination("");
    setFare("");
  }

  return (
    <div>
      <h1>Routes</h1>

      <form
        onSubmit={
          editingId
            ? updateRoute
            : createRoute
        }
      >
        <input
          placeholder="Source"
          value={source}
          onChange={(e) =>
            setSource(e.target.value)
          }
        />

        <input
          placeholder="Destination"
          value={destination}
          onChange={(e) =>
            setDestination(e.target.value)
          }
        />

        <input
  	type="number"
  	min="0"
  	step="1"
 	 placeholder="Fare"
  	value={fare}
  	onChange={(e) => setFare(e.target.value)}
	/>

        <button type="submit">
          {editingId
            ? "Update Route"
            : "Add Route"}
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
            <th>Source</th>
            <th>Destination</th>
            <th>Fare</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {routes.map((route) => (
            <tr key={route.id}>
              <td>{route.id}</td>
              <td>{route.source}</td>
              <td>{route.destination}</td>
              <td>{route.fare}</td>

              <td>
                <button
                  onClick={() =>
                    editRoute(route)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteRoute(route.id)
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
}*/
import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/routes.css"; // Imports the newly structured variable styles

export default function Routes() {
  const [routes, setRoutes] = useState([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  async function loadRoutes() {
    const res = await apiFetch("/api/routes");
    const data = await res.json();
    setRoutes(data);
  }

  async function createRoute(e) {
    e.preventDefault();
    const fareValue = Number(fare);

    if (fareValue < 0) {
       alert("Fare cannot be negative");
       return;
    }

    await apiFetch("/api/routes", {
      method: "POST",
      body: JSON.stringify({
        source,
        destination,
        fare: Number(fare),
      }),
    });

    resetForm();
    loadRoutes();
  }

  async function updateRoute(e) {
    e.preventDefault();
    const fareValue = Number(fare);

    if (fareValue < 0) {
      alert("Fare cannot be negative");
      return;
    }

    await apiFetch(`/api/routes/${editingId}`, {
      method: "PUT",
      body: JSON.stringify({
        source,
        destination,
        fare: Number(fare),
      }),
    });

    resetForm();
    loadRoutes();
  }

  async function deleteRoute(id) {
    if (!window.confirm("Delete this route?")) {
      return;
    }

    await apiFetch(`/api/routes/${id}`, {
      method: "DELETE",
    });

    loadRoutes();
  }

  function editRoute(route) {
    setEditingId(route.id);
    setSource(route.source);
    setDestination(route.destination);
    setFare(route.fare);
  }

  function resetForm() {
    setEditingId(null);
    setSource("");
    setDestination("");
    setFare("");
  }

  return (
    <div className="container-fluid px-0 text-white">
      
      {/* Dynamic Action Header Title Row */}
      <div className="mb-4">
        <h1 className="fw-bold m-0 routes-page-title">Routes Management</h1>
        <p className="text-white m-0 mt-1">Configure locations, adjust operational fares, and manage active system transits.</p>
      </div>

      {/* Management Control Input Card */}
      <div className="card routes-management-card p-4 mb-4 shadow-sm">
        <h5 className="fw-semibold mb-3 text-white">
          {editingId ? "🔧 Modify Existing Route" : "Register New Route"}
        </h5>
        
        <form onSubmit={editingId ? updateRoute : createRoute}>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label text-white small fw-semibold">Starting Location</label>
              <input
                className="form-control dark-form-input"
                placeholder="e.g.,Kohima"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-white small fw-semibold">Destination</label>
              <input
                className="form-control dark-form-input"
                placeholder="e.g.,Mon"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label text-white small fw-semibold">Route Fare Cost</label>
              <input
                type="number"
                min="0"
                step="1"
                className="form-control dark-form-input"
                placeholder="0.00"
                value={fare}
                onChange={(e) => setFare(e.target.value)}
                required
              />
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
              {editingId ? "Update Route Properties" : "Deploy Route"}
            </button>
          </div>
        </form>
      </div>

      {/* Responsive Fleet Routes Grid Viewport */}
      <div className="card routes-management-card shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-bottom" style={{ borderColor: "var(--border-muted)" }}>
          <h5 className="m-0 fw-semibold text-white">System Active Manifest</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-dark custom-dark-table m-0">
            <thead>
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Starting Source</th>
                <th>Destination Target</th>
                <th>Standard Fare</th>
                <th className="text-end" style={{ width: "200px" }}>Management Actions</th>
              </tr>
            </thead>

            <tbody>
              {routes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-white small">
                    No active transport routes loaded in system registry.
                  </td>
                </tr>
              ) : (
                routes.map((route) => (
                  <tr key={route.id}>
                    <td className="fw-semibold text-white">{route.id}</td>
                    <td>{route.source}</td>
                    <td>{route.destination}</td>
                    <td>
                      <span className="text-warning fw-medium">₹{Number(route.fare).toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-outline-warning px-3"
                          style={{ borderRadius: "6px", fontWeight: "500" }}
                          onClick={() => editRoute(route)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger px-3"
                          style={{ borderRadius: "6px", fontWeight: "500" }}
                          onClick={() => deleteRoute(route.id)}
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
