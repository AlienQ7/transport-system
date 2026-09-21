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
				style={{
					flexDirection: 'column',
					alignItems: 'center',
					background: 'none',
					border: 'none',
					padding: 0,
					cursor: 'pointer'
				}}
			>
				{!menuOpen && (
				<span
				style={{
					fontSize: '0.65rem',
					fontWeight: 'bold',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
					marginBottom: '1px',
					opacity: 0.9
				}}
			>
				menu
				</span>
			)}	
			<span
			style={{
					fontSize: menuOpen ? '2.81rem' : '1.90rem',
					lineHeight: 1,
					marginTop: menuOpen ? '0px' : '-2px'
				}}
			>
				{menuOpen ? 'X' : '☰'}
				</span>
		</button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a className="gold-bg" href="#home">Home</a>
          <Link to="/book" className="gold-bg">Book Now</Link>
          {!token ? (
            <>
              <Link to="/login" className="gold-bg">Admin</Link>
              <Link to="/login" className="gold-bg">Staff</Link>
              <Link to="/login" className="gold-bg">Driver</Link>
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
              Dashboard
            </Link>
          )}
          <a className="gold-bg" href="/about">About</a>
          <a className="gold-bg" href="/services">Services</a>
          <a className="gold-bg" href="/contact">Contact</a>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <div className="separator-skew2"></div>
      <section id="home" className="hero-split">
        <div className="hero-content">
          <span className="route-badge">📍 Kohima • Dimapur • Mokokchung • More</span>
          <h1>
            Reliable Vehicles &<br />
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
      <section id="about" className="dark-banner">
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
              <strong>Ship Goods</strong>
              <p>Parcels Service Available</p>
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
            <h3>10+</h3>
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
       
      
      {/* 7. Footer */}
		<footer className="site-footer"> <div className="footer-main">
			<div className="footer-brand">
			<div className="footer-logo">EasyReach</div>
				<p className="footer-description">
				Reliable passenger transport, online ticket booking and parcel
				services across Nagaland.
				</p>
				<Link to="/book" className="footer-book-btn">
				Book Your Seat
				</Link>
			</div>
			<div className="footer-links-group">
				<h4>Company</h4>
				<Link to="/about">About Us</Link>
				<Link to="/services">Our Services</Link>
				<Link to="/contact">Contact Us</Link>
			</div>
			<div className="footer-links-group">
				<h4>Policies</h4>
					<Link to="/privacy-policy">Privacy Policy</Link>
					<Link to="/refund-policy">Refund & Cancellation</Link>
					<Link to="/terms">Terms & Conditions</Link>
			</div>
			<div className="footer-contact">
				<h4>Get in Touch</h4>
				<a href="mailto:easyreach010@gmail.com">
				easyreach010@gmail.com
				</a>
				<a href="tel:+917640867132">
				+91 7640867132
				</a>
				<span>
				Kohima, Nagaland
				</span>
			</div>
			</div>
				<div className="footer-bottom"> <span>© 2026 EasyReach. All rights reserved.</span>
				</div> </footer>
			</div>
	);
}
