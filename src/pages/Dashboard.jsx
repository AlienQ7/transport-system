import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/dashboard.css"; 

export default function Dashboard() {
  const [stats, setStats] = useState({
    routes: 0,
    vehicles: 0,
    bookings: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await apiFetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load statistics:", err);
    }
  }

  return (
    <div className="container-fluid dashboard-page-wrapper px-0">
      {/* Header section */}
      <div className="mb-4 dashboard-header">
        <h1 className="fw-bold m-0">SumuDesk Dashboard</h1>
        <p className="text-secondary m-0 mt-1">System Operational And Management.</p>
      </div>

      {/* Grid Dashboard System Metrics */}
      <div className="row g-4">
        
        {/* Routes Metric Card */}
        <div className="col-12 col-md-4">
          <div className="dashboard-metric-card">
            <div className="card-metric-info">
              <span className="metric-label">Total Active Routes</span>
              <h2 className="metric-count">{stats.routes}</h2>
            </div>
            <Link to="/routes" className="btn btn-dashboard-action w-100 mt-3">
              Manage Routes &rarr;
            </Link>
          </div>
        </div>

        {/* Vehicles Metric Card */}
        <div className="col-12 col-md-4">
          <div className="dashboard-metric-card">
            <div className="card-metric-info">
              <span className="metric-label">Registered Fleet Vehicles</span>
              <h2 className="metric-count">{stats.vehicles}</h2>
            </div>
            <Link to="/vehicles" className="btn btn-dashboard-action w-100 mt-3">
              Manage Fleet &rarr;
            </Link>
          </div>
        </div>

        {/* Bookings Metric Card */}
        <div className="col-12 col-md-4">
          <div className="dashboard-metric-card">
            <div className="card-metric-info">
              <span className="metric-label">Processed Passenger Bookings</span>
              <h2 className="metric-count">{stats.bookings}</h2>
            </div>
            <Link to="/bookings" className="btn btn-dashboard-action w-100 mt-3">
              Manage Bookings &rarr;
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
