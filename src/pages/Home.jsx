import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div className="logo">
          SumuDesk
        </div>
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
           ☰
        </button>

        <div
          className={`nav-links ${
            menuOpen ? "active" : ""
          }`}
        >
          <a className="gold-bg" href="#home">Home</a>
          <a className="gold-bg" href="#about">About</a>
          <a className="gold-bg" href="#contact">Contact</a>

          <Link to="/book" className="gold-bg" >
            Book Now
          </Link>

          <Link to="/login" className="gold-bg">
            Admin Login
          </Link>

          <Link to="/operator-login" className="gold-bg">
            Staff
          </Link>

          <Link to="/driver-login"className="gold-bg">
            Driver
          </Link>
        </div>
      </nav>

      <section
        id="home"
        className="hero"
      >
        <h1>
          FUTURE OF
          <br />
          TRANSPORT
        </h1>

        <p>
          Smart Fleet Management,
          Intelligent Route Planning,
          Real-Time Booking and
          Connected Mobility.
        </p>

        <div className="hero-buttons">
          <Link
            to="/book"
            className="hero-btn"
          >
            Book Ticket
          </Link>
        </div>
      </section>

      <section
        id="about"
        className="features"
      >
        <div className="feature-card">
          <h3>
            Smart Routes
          </h3>

          <p>
            Route planning and
            optimization.
          </p>
        </div>

        <div className="feature-card">
          <h3>
            Fleet Control
          </h3>

          <p>
            Vehicle tracking and
            management.
          </p>
        </div>

        <div className="feature-card">
          <h3>
            Online Booking
          </h3>

          <p>
            Fast and reliable
            ticket booking.
          </p>
        </div>
      </section>

      <section
        id="contact"
        className="contact-section"
      >
        <h2>Contact</h2>

        <p>
          support@sumudesk.com
        </p>

        <p>
          +91 76408#7###
        </p>
      </section>
    </div>
  );
}
