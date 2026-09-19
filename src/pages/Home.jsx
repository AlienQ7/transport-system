import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="home-page-template">
      {/* 1. Header Navigation */}
      <nav className="home-navbar">
        <div className="logo">EasyReach</div>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a className="gold-bg" href="#home">Home</a>
          <a className="gold-bg" href="#about">About</a>
          <a className="gold-bg" href="#services">Services</a>
          <a className="gold-bg" href="#contact">Contact</a>
          <Link to="/book" className="gold-bg">Book Now</Link>

          {!token ? (
            <>
              <Link to="/login" className="gold-bg">Admin Dashboard</Link>
              <Link to="/login" className="gold-bg">Operator Dashboard</Link>
              <Link to="/login" className="gold-bg">Fleet Portal</Link>
            </>
          ) : (
            <Link
              to={
                role === "admin"
                  ? "/dashboard"
                  : role === "staff"
                  ? "/bookings"
                  : "/driver"
              }
              className="gold-bg"
            >
              Open Dashboard
            </Link>
          )}
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="separator-skew2"></div>
      <section id="home" className="hero-split">
        <div className="hero-content">
          <span className="route-badge">📍 Dimapur • Kohima • Mokokchung • More</span>
          <h1>
            Reliable Sumo &<br />
            Passenger Services
          </h1>
          <p>
            Connecting Nagaland for over 10 years. Daily passenger Sumos,
            night buses, and parcel delivery services running on time, every time.
          </p>
          <div className="hero-actions">
            <Link to="/book" className="hero-btn">
              Book Ticket Now
            </Link>
            <a href="#about" className="hero-btn">
              Explore Routes →
            </a>
          </div>

          <div className="hero-sub-features">
            <div>
              <strong>Live Seat Layouts</strong>
              <p>Real-time availability</p>
            </div>
            <div>
              <strong>QR e-Tickets</strong>
              <p>Instant digital boarding</p>
            </div>
            <div>
              <strong>Hybrid Service</strong>
              <p>Online & counter booking</p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-image-wrapper">
          <div className="hero-gold-backdrop"></div>
          <img
            src="https://dimapurlibrary.com/wp-content/uploads/2020/08/TATA-Sumo-counter-for-Zunheboto-to-dimapur-sumo-counter-dimapur-to-zunheboto-Nagaland.jpg"
            alt="Lim Travels Sumo Vehicle"
            className="hero-vehicle-img"
          />
        </div>
      </section>
      
      {/* 3. Dark Banner Strip */}
      <div className="separator-skew"></div>
      <section className="dark-banner">
        <div className="banner-text">
          <h2>Why Lim Travels is the best in Nagaland</h2>
          <p>Over 30 years of safe, reliable travel and parcel delivery across all major routes.</p>
        </div>
        <div className="banner-pills">
          <div className="banner-pill highlight">
            <span>🛡️</span>
            <div>
              <strong>Safe Driving</strong>
              <p>Experienced hill operators</p>
            </div>
          </div>
          <div className="banner-pill highlight">
            <span>🚀</span>
            <div>
              <strong>Ship Anywhere</strong>
              <p>Express counter parcels</p>
            </div>
          </div>
        </div>
      </section>
      <div className="separator-skew2"></div>
      
      {/* 4. Core Features Section (Symmetric 3x2 Grid) */}
<section id="services" className="features-section">
  <div className="section-header">
    <span className="gold-badge">POWERFUL CAPABILITIES</span>
    <h2>Everything you need for smart transport & logistics</h2>
    <p>Seamlessly bridging online reservations with counter dispatch operations.</p>
  </div>

  <div className="features-grid">
    <div className="feature-card highlight-card">
      <div className="card-top">
        <span className="feature-icon">💺</span>
        <span className="card-tag">Live Sync</span>
      </div>
      <h3>Real-Time Seat Matrix</h3>
      <p>Interactive vehicle layout selection. Lock your exact preferred window or aisle seat instantly.</p>
    </div>

    <div className="feature-card highlight-card">
      <div className="card-top">
        <span className="feature-icon">⚡</span>
        <span className="card-tag">Instant</span>
      </div>
      <h3>Automated UPI Payments</h3>
      <p>Instant UPI dynamic QR and card checkouts with automatic booking confirmation receipts.</p>
    </div>

    <div className="feature-card highlight-card">
      <div className="card-top">
        <span className="feature-icon">📱</span>
        <span className="card-tag">Paperless</span>
      </div>
      <h3>QR Digital Pass</h3>
      <p>Scan-and-go e-tickets delivered to your phone for rapid counter-free boarding validation.</p>
    </div>

    <div className="feature-card highlight-card">
      <div className="card-top">
        <span className="feature-icon">🌐</span>
        <span className="card-tag">24/7 Access</span>
      </div>
      <h3>Online Reservations</h3>
      <p>Reserve Sumo seats and schedule cargo pickups anytime from your phone or laptop.</p>
    </div>

    <div className="feature-card highlight-card">
      <div className="card-top">
        <span className="feature-icon">🏢</span>
        <span className="card-tag">Hybrid Sync</span>
      </div>
      <h3>Offline Counter Network</h3>
      <p>Walk-in counter bookings dynamically sync with online systems to prevent double booking.</p>
    </div>

    <div className="feature-card highlight-card">
      <div className="card-top">
        <span className="feature-icon">📦</span>
        <span className="card-tag">Express</span>
      </div>
      <h3>Parcel & Cargo Dispatch</h3>
      <p>Tracked counter-to-counter parcel express with instant SMS status notifications upon arrival.</p>
    </div>
  </div>
</section>

      {/* 5. Impact Numbers Section */}
      <div className="separator-skew"></div>
      <section className="impact-section">
        <div className="impact-cards">
          <div className="stat-card">
            <h3>30+</h3>
            <p>Years of Service</p>
          </div>
          <div className="stat-card">
            <h3>5+</h3>
            <p>Major Districts Covered</p>
          </div>
          <div className="stat-card">
            <h3>100%</h3>
            <p>Safe & Timely Delivery</p>
          </div>
        </div>
        <div className="impact-info">
          <span className="gold-text">| Our Impact</span>
          <h2>Our Impact in Numbers is Amazing</h2>
          <p>
            Serving thousands of passengers and shipments daily across Nagaland's key transit hubs with reliable time-tested routes.
          </p>
        </div>
      </section>
       <div className="separator-skew2"></div>
       
      {/* 6. Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Need Assistance?</h2>
        <p>support@easyreach.com</p>
        <p>+91 7640867132</p>
      </section>
    </div>
  );
}
