//~ import { useEffect, useState } from "react";
//~ import { Link } from "react-router-dom";
//~ import { apiFetch } from "../services/api";
//~ import "bootstrap/dist/css/bootstrap.min.css";
//~ import "../styles/dashboard.css"; 

//~ export default function Dashboard() {
  //~ const [stats, setStats] = useState({
    //~ routes: 0,
    //~ vehicles: 0,
    //~ bookings: 0,
  //~ });

  //~ useEffect(() => {
    //~ loadStats();
  //~ }, []);

  //~ async function loadStats() {
    //~ try {
      //~ const res = await apiFetch("/api/stats");
      //~ const data = await res.json();
      //~ setStats(data);
    //~ } catch (err) {
      //~ console.error("Failed to load statistics:", err);
    //~ }
  //~ }

  //~ return (
    //~ <div className="container-fluid dashboard-page-wrapper px-0">
      //~ {/* Header section */}
      //~ <div className="mb-4 dashboard-header">
        //~ <h1 className="fw-bold m-0">EasyReach Dashboard</h1>
        //~ <p className="text-secondary m-0 mt-1">System Operational And Management.</p>
      //~ </div>

      //~ {/* Grid Dashboard System Metrics */}
      //~ <div className="row g-4">
        
        //~ {/* Routes Metric Card */}
        //~ <div className="col-12 col-md-4">
          //~ <div className="dashboard-metric-card">
            //~ <div className="card-metric-info">
              //~ <span className="metric-label">Total Active Routes</span>
              //~ <h2 className="metric-count">{stats.routes}</h2>
            //~ </div>
            //~ <Link to="/routes" className="btn btn-dashboard-action w-100 mt-3">
              //~ Manage Routes &rarr;
            //~ </Link>
          //~ </div>
        //~ </div>

        //~ {/* Vehicles Metric Card */}
        //~ <div className="col-12 col-md-4">
          //~ <div className="dashboard-metric-card">
            //~ <div className="card-metric-info">
              //~ <span className="metric-label">Registered Fleet Vehicles</span>
              //~ <h2 className="metric-count">{stats.vehicles}</h2>
            //~ </div>
            //~ <Link to="/vehicles" className="btn btn-dashboard-action w-100 mt-3">
              //~ Manage Fleet &rarr;
            //~ </Link>
          //~ </div>
        //~ </div>

        //~ {/* Bookings Metric Card */}
        //~ <div className="col-12 col-md-4">
          //~ <div className="dashboard-metric-card">
            //~ <div className="card-metric-info">
              //~ <span className="metric-label">Processed Passenger Bookings</span>
              //~ <h2 className="metric-count">{stats.bookings}</h2>
            //~ </div>
            //~ <Link to="/bookings" className="btn btn-dashboard-action w-100 mt-3">
              //~ Manage Bookings &rarr;
            //~ </Link>
          //~ </div>
        //~ </div>

      //~ </div>
    //~ </div>
  //~ );
//~ }

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/dashboard.css";

const sections = [
  {
    title: "Route Management",
    description: "Manage travel routes and route information.",
    path: "/routes",
    action: "View routes",
    icon: "R",
  },
  {
    title: "Fleet Management",
    description: "Review registered vehicles and maintain fleet records.",
    path: "/vehicles",
    action: "View vehicles",
    icon: "V",
  },
  {
    title: "Booking Management",
    description: "Review passenger bookings and manage their status.",
    path: "/bookings",
    action: "View bookings",
    icon: "B",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    routes: 0,
    vehicles: 0,
    bookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        setError("");

        const res = await apiFetch("/api/stats");

        if (!res.ok) {
          throw new Error("Unable to load dashboard statistics.");
        }

        const data = await res.json();

        setStats({
          routes: Number(data.routes) || 0,
          vehicles: Number(data.vehicles) || 0,
          bookings: Number(data.bookings) || 0,
        });
      } catch (err) {
        console.error("Failed to load statistics:", err);
        setError("Dashboard statistics could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const metrics = [
    {
      label: "Active Routes",
      value: stats.routes,
      description: "Routes in the system",
      path: "/routes",
      action: "Manage routes",
      icon: "R",
    },
    {
      label: "Fleet Vehicles",
      value: stats.vehicles,
      description: "Registered vehicles",
      path: "/vehicles",
      action: "Manage fleet",
      icon: "V",
    },
    {
      label: "Passenger Bookings",
      value: stats.bookings,
      description: "Bookings recorded",
      path: "/bookings",
      action: "Manage bookings",
      icon: "B",
    },
  ];

  return (
    <main className="container-fluid dashboard-page-wrapper px-0">
      <section className="dashboard-welcome">
        <div>
          <span className="dashboard-eyebrow">EASYREACH / ADMINISTRATION</span>
          <h1>Dashboard</h1>
          <p>Monitor your transport operations from one place.</p>
        </div>

        <div className="dashboard-status">
          <span className="dashboard-status-dot" />
          Administration panel
        </div>
      </section>

      {error && (
        <div className="dashboard-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="dashboard-retry"
          >
            Retry
          </button>
        </div>
      )}

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>System overview</h2>
            <p>Current totals across your management modules.</p>
          </div>
          <span className="dashboard-live-label">LIVE DATA</span>
        </div>

        <div className="row g-4">
          {metrics.map((metric) => (
            <div className="col-12 col-md-6 col-xl-4" key={metric.label}>
              <article className="dashboard-metric-card">
                <div className="dashboard-metric-top">
                  <span className="dashboard-metric-icon">
                    {metric.icon}
                  </span>
                  <span className="dashboard-metric-caption">
                    {metric.description}
                  </span>
                </div>

                <p className="metric-label">{metric.label}</p>

                <div className="metric-count">
                  {loading ? (
                    <span className="dashboard-loading">...</span>
                  ) : (
                    metric.value.toLocaleString()
                  )}
                </div>

                <Link to={metric.path} className="dashboard-card-link">
                  {metric.action}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="dashboard-section-heading">
          <div>
            <h2>Quick access</h2>
            <p>Go directly to a management area.</p>
          </div>
        </div>

        <div className="row g-3">
          {sections.map((section) => (
            <div className="col-12 col-lg-4" key={section.path}>
              <article className="dashboard-quick-card">
                <div className="dashboard-quick-icon">{section.icon}</div>
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <Link to={section.path} className="btn btn-dashboard-action">
                  {section.action} <span aria-hidden="true">→</span>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        <span>EasyReach Management System</span>
        <span>Routes · Fleet · Bookings</span>
      </footer>
    </main>
  );
}
