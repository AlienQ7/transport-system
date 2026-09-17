//~ import { useState } from "react";
//~ import { Link } from "react-router-dom";
//~ import "../styles/Home.css";

//~ export default function Home() {
  //~ const token = localStorage.getItem("token");
  //~ const role = localStorage.getItem("role");
  //~ const [menuOpen, setMenuOpen] = useState(false);

  //~ return (
    //~ <div className="home-page">
      //~ {/* 1. Header Navigation */}
      //~ <nav className="home-navbar">
        //~ <div className="logo">EasyReach</div>
        //~ <button
          //~ className="hamburger"
          //~ onClick={() => setMenuOpen(!menuOpen)}
        //~ >
          //~ ☰
        //~ </button>

        //~ <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          //~ <a className="gold-bg" href="#home">Home</a>
          //~ <a className="gold-bg" href="#about">About</a>
          //~ <a className="gold-bg" href="#contact">Contact</a>
          //~ <Link to="/book" className="gold-bg">Book Now</Link>

          //~ {!token ? (
            //~ <>
              //~ <Link to="/login" className="gold-bg">Admin Dashboard</Link>
              //~ <Link to="/login" className="gold-bg">Operator Dashboard</Link>
              //~ <Link to="/login" className="gold-bg">Fleet Portal</Link>
            //~ </>
          //~ ) : (
            //~ <Link
              //~ to={
                //~ role === "admin"
                  //~ ? "/dashboard"
                  //~ : role === "staff"
                  //~ ? "/bookings"
                  //~ : "/driver"
              //~ }
              //~ className="gold-bg"
            //~ >
              //~ Open Dashboard
            //~ </Link>
          //~ )}
        //~ </div>
      //~ </nav>

      //~ {/* 2. Hero Section (Logizai Template Layout with Sumo Image) */}
      //~ <section id="home" className="hero-split">
        //~ <div className="hero-content">
          //~ <span className="route-badge">📍 Dimapur • Kohima • Mokokchung • Mon • Longleng</span>
          //~ <h1>
            //~ Reliable Sumo &<br />
            //~ Passenger Services
          //~ </h1>
          //~ <p>
            //~ Connecting Nagaland for over 30 years. Daily passenger Sumos,
            //~ night buses, and parcel delivery services running on time, every time.
          //~ </p>
          //~ <div className="hero-actions">
            //~ <Link to="/book" className="hero-btn">
              //~ Book Ticket Now
            //~ </Link>
            //~ <a href="#about" className="secondary-btn">
              //~ Explore Routes
            //~ </a>
          //~ </div>
        //~ </div>

        //~ {/* Sumo Visual replacing the Cargo Truck */}
        //~ <div className="hero-image-wrapper">
          //~ <img
            //~ src="https://dimapurlibrary.com/wp-content/uploads/2020/08/TATA-Sumo-counter-for-Zunheboto-to-dimapur-sumo-counter-dimapur-to-zunheboto-Nagaland.jpg"
            //~ alt="Lim Travels Sumo Vehicle"
            //~ className="hero-vehicle-img"
          //~ />
        //~ </div>
      //~ </section>

      //~ {/* 3. Dark Stat Bar (Impact Numbers) */}
      //~ <section className="impact-bar">
        //~ <div className="stat-item">
          //~ <h3>30+</h3>
          //~ <p>Years of Service</p>
        //~ </div>
        //~ <div className="stat-item">
          //~ <h3>3</h3>
          //~ <p>Major Hubs Covered</p>
        //~ </div>
        //~ <div className="stat-item">
          //~ <h3>100%</h3>
          //~ <p>Safe & Timely Delivery</p>
        //~ </div>
      //~ </section>

      //~ {/* 4. Features Section (Grid) */}
      //~ <section id="about" className="features">
        //~ <div className="feature-card">
          //~ <div className="feature-icon">🗺️</div>
          //~ <h3>Smart Routes</h3>
          //~ <p>Optimized travel schedules connecting Dimapur, Kohima, Mokokchung and more daily.</p>
        //~ </div>

        //~ <div className="feature-card">
          //~ <div className="feature-icon">🚘</div>
          //~ <h3>Fleet Control</h3>
          //~ <p>Real-time vehicle management ensuring top safety and vehicle maintenance standards.</p>
        //~ </div>

        //~ <div className="feature-card">
          //~ <div className="feature-icon">🎟️</div>
          //~ <h3>Online Booking</h3>
          //~ <p>Instant seat booking with flexible counter pick-up and parcel drop services.</p>
        //~ </div>
      //~ </section>

      //~ {/* 5. Contact Section */}
      //~ <section id="contact" className="contact-section">
        //~ <h2>Need Assistance?</h2>
        //~ <p>support@easyreach.com</p>
        //~ <p>+91 7640867132</p>
      //~ </section>
    //~ </div>
  //~ );
//~ }

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

      {/* 2. Hero Section (Logizai Light Layout with Gold Card Behind Vehicle) */}
      <section id="home" className="hero-split">
        <div className="hero-content">
          <span className="route-badge">📍 Dimapur • Kohima • Mokokchung • More </span>
          <h1>
            Reliable Sumo &<br />
            Passenger Services
          </h1>
          <p>
            Connecting Nagaland for over 30 years. Daily passenger Sumos,
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
              <strong>Real-Time Tracking</strong>
              <p>Fleet tracking & status</p>
            </div>
            <div>
              <strong>Fast Express</strong>
              <p>Daily counter departures</p>
            </div>
          </div>
        </div>

        {/* Sumo Visual with Gold Background Box (like the Truck in Logizai) */}
        <div className="hero-image-wrapper">
          <div className="hero-gold-backdrop"></div>
          <img
            src="https://dimapurlibrary.com/wp-content/uploads/2020/08/TATA-Sumo-counter-for-Zunheboto-to-dimapur-sumo-counter-dimapur-to-zunheboto-Nagaland.jpg"
            alt="Lim Travels Sumo Vehicle"
            className="hero-vehicle-img"
          />
        </div>
      </section>

      {/* 3. Dark Banner Strip (Why Us) */}
      <section className="dark-banner">
        <div className="banner-text">
          <h2>Why Lim Travels is the best in Nagaland</h2>
          <p>Over 30 years of safe, reliable travel and parcel delivery across all major routes.</p>
        </div>
        <div className="banner-pills ">
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

      {/* 4. Features Section (Light Grid Layout) */}
      <section id="about" className="features-section">
        <div className="section-label">
          <span className="gold-text">| Special Features</span>
          <h2>Features that make your travel smooth & easy</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🗺️</div>
            <h3>Smart Routes</h3>
            <p>Optimized travel schedules connecting Dimapur, Kohima, Mokokchung and more daily.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚘</div>
            <h3>Fleet Control</h3>
            <p>Real-time vehicle management ensuring top safety and vehicle maintenance standards.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Online Booking</h3>
            <p>Instant seat booking with flexible counter pick-up and parcel drop services.</p>
          </div>
        </div>
      </section>

      {/* 5. Impact Numbers Section (Offset White Cards on Dark Section) */}
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

      {/* 6. Contact Section */}
      <section id="contact" className="contact-section">
        <h2>Need Assistance?</h2>
        <p>support@easyreach.com</p>
        <p>+91 7640867132</p>
      </section>
    </div>
  );
}
