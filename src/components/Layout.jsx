/*import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: "220px",
          borderRight: "1px solid #ccc",
          padding: "20px",
        }}
      >
        <h2>Transport</h2>

        <nav>
          <p>
            <Link to="/dashboard">
              Dashboard
            </Link>
          </p>

          <p>
            <Link to="/routes">
              Routes
            </Link>
          </p>

          <p>
            <Link to="/vehicles">
              Vehicles
            </Link>
          </p>

          <p>
            <Link to="/bookings">
              Bookings
            </Link>
          </p>

          <hr />

          <button onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      <main
        style={{
          flex: 1,
          padding: "20px",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}*/

import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../styles/bookings.css"; 

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  // Helper to attach bootstrap 'active' class style selectively
  const isActive = (path) => location.pathname === path ? "active-gold" : "";
  const showBackButton = location.pathname !== "/dashboard" && location.pathname !== "/";

  return (
    <div className="container-fluid w-100 p-0 d-flex flex-column flex-lg-row" style={{ minHeight: "100vh", backgroundColor: "var(--bg-app-dark)" }}>
      
      {/* Mobile Top Navbar Trigger Header Bar */}
      <header className="mobile-header d-lg-none w-100 px-4 py-3 d-flex align-items-center justify-content-between">
        <span className="fs-4 fw-bold text-warning m-0">SumuDesk</span>
        <button 
          className="btn text-warning border-0 p-0 burger-trigger" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className="fs-2">☰</span>
        </button>
      </header>

      {/* Mobile Dark Overlay Layer backdrop */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay d-lg-none" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Modernized Dark & Gold Sidebar */}
      <aside
        className={`sidebar-wrapper d-flex flex-column p-4 text-white ${isSidebarOpen ? "show" : ""}`}
        style={{
          width: "260px",
          backgroundColor: "var(--bg-card-dark)",
          borderRight: "1px solid var(--border-muted)",
        }}
      >
        {/* Brand Logo Header */}
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div>
            <span className="fs-3 fw-bold tracking-wide text-warning d-block text-capitalize">
              Menu
            </span>
            <small className="text-secondary fw-semibold">SumuDesk Admin</small>
          </div>
          <button 
            className="btn text-muted d-lg-none border-0 fs-4 p-0 line-height-1" 
            onClick={() => setIsSidebarOpen(false)}
          >
            &times;
          </button>
        </div>

        <hr style={{ borderColor: "var(--border-muted)" }} />

        {/* Navigation Menu Links */}
        <nav className="nav nav-pills flex-column mb-auto gap-2">
          <Link 
            to="/" 
            className={`nav-link text-white opacity-75 fw-medium custom-sidebar-link py-2 px-3 ${isActive("/")}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`nav-link text-white opacity-75 fw-medium custom-sidebar-link py-2 px-3 ${isActive("/dashboard")}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/routes" 
            className={`nav-link text-white opacity-75 fw-medium custom-sidebar-link py-2 px-3 ${isActive("/routes")}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Routes
          </Link>
          <Link 
            to="/vehicles" 
            className={`nav-link text-white opacity-75 fw-medium custom-sidebar-link py-2 px-3 ${isActive("/vehicles")}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Vehicles
          </Link>
          <Link 
            to="/bookings" 
            className={`nav-link text-white opacity-75 fw-medium custom-sidebar-link py-2 px-3 ${isActive("/bookings")}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Bookings
          </Link>
        </nav>

        <hr style={{ borderColor: "var(--border-muted)" }} />

        {/* Logout Control Area */}
        <div>
          <button 
            onClick={logout} 
            className="btn btn-outline-danger w-100 fw-semibold py-2"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Dynamic Dashboard Page Display Content Window */}
      <main
        className="flex-grow-1 p-4 main-content-window"
        style={{
          overflowY: "auto",
          backgroundColor: "var(--bg-app-dark)",
        }}
      >
        {/* 2. THE ACTUAL DYNAMIC BACK BUTTON ELEMENT RENDERS HERE */}
        {showBackButton && (
          <div className="w-100 d-flex justify-content-start mb-4">
            <button 
              onClick={() => navigate("/dashboard")} 
              className="btn btn-back-arrow d-inline-flex align-items-center gap-2 py-2 px-3"
            >
              <span>&larr;</span> Back
            </button>
          </div>
        )}

        <Outlet />
      </main>
    </div>
  );
}
