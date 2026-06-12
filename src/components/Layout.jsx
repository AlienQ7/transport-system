import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "../styles/bookings.css"; 

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const role = localStorage.getItem("role");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  }

  const isActive = (path) =>
    location.pathname === path ? "active-gold" : "";

  const showBackButton =
    location.pathname !== "/dashboard" &&
    location.pathname !== "/";

  return (
    <div
      className="container-fluid w-100 p-0 d-flex flex-column flex-lg-row"
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-app-dark)",
      }}
    >
      {/* Mobile Header */}
      <header className="mobile-header d-lg-none w-100 px-4 py-3 d-flex align-items-center justify-content-between">
        <span className="fs-4 fw-bold text-warning m-0">SumuDesk</span>
        <button
          className="btn text-warning border-0 p-0 burger-trigger"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="fs-2">☰</span>
        </button>
      </header>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay d-lg-none"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar-wrapper d-flex flex-column p-4 text-white ${
          isSidebarOpen ? "show" : ""
        }`}
        style={{
          width: "260px",
          backgroundColor: "var(--bg-card-dark)",
          borderRight: "1px solid var(--border-muted)",
        }}
      >
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <div>
            <span className="fs-3 fw-bold text-warning d-block">
              Menu
            </span>
            <small className="text-secondary fw-semibold">
              SumuDesk {role?.toUpperCase()}
            </small>
          </div>

          <button
            className="btn text-muted d-lg-none border-0 fs-4 p-0"
            onClick={() => setIsSidebarOpen(false)}
          >
            &times;
          </button>
        </div>

        <hr style={{ borderColor: "var(--border-muted)" }} />

        {/* ROLE BASED MENU */}
        <nav className="nav nav-pills flex-column mb-auto gap-2">

          {/* ALL ROLES CAN SEE HOME*/}
          <Link
            to="/"
            className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/")}`}
            onClick={() => setIsSidebarOpen(false)}
          >
            Home
          </Link> 

          {/* ADMIN ONLY */}
          {role === "admin" && (
            <>
              <Link
                to="/dashboard"
                className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/dashboard")}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/routes"
                className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/routes")}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                Routes
              </Link>

              <Link
                to="/vehicles"
                className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/vehicles")}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                Vehicles
              </Link>
              
            </>
          )}

          {/* ADMIN + STAFF */}
          {(role === "admin" || role === "staff") && (
            <Link
              to="/bookings"
              className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/bookings")}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              Bookings
            </Link>
            
          )}
{(role === "admin" || role === "staff") && (
  <Link
    to="/scanner"
    className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/scanner")}`}
    onClick={() => setIsSidebarOpen(false)}
  >
    Scanner
  </Link>
)}
          {/* DRIVER LIMITED VIEW once chnage to bookings*/}
          {role === "driver" && (
            <Link
              to="/driver"
              className={`nav-link text-white opacity-75 py-2 px-3 ${isActive("/bookings")}`}
              onClick={() => setIsSidebarOpen(false)}
            >
              My Bookings
            </Link>
          )}

        </nav>

        <hr style={{ borderColor: "var(--border-muted)" }} />

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="btn btn-outline-danger w-100 fw-semibold py-2"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main
        className="flex-grow-1 p-4 main-content-window"
        style={{
          overflowY: "auto",
          backgroundColor: "var(--bg-app-dark)",
        }}
      >
      {showBackButton && (
  <div className="w-100 d-flex justify-content-start mb-4">
    <button
      onClick={() => navigate(-1)}
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
