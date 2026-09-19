import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function Services() {
  return (
    <div className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back-link">
          ← Back to Home
        </Link>

        <div className="legal-header">
          <span className="legal-badge">OUR SERVICES</span>
          <h1>Services</h1>
          <p>
            Transportation, passenger booking and related services.
          </p>
        </div>

        <div className="legal-content">

          <section>
            <h2>Passenger Ticket Booking</h2>
            <p>
              Customers can use EasyReach to view available routes, vehicles,
              travel dates and seats and make passenger transportation
              bookings online.
            </p>
          </section>

          <section>
            <h2>Online Seat Reservation</h2>
            <p>
              Our booking system provides available seat information so
              customers can select an available seat before completing their
              booking.
            </p>
          </section>

          <section>
            <h2>Digital Tickets</h2>
            <p>
              After successful payment verification, customers can access
              their digital booking information and ticket through the
              website.
            </p>
          </section>

          <section>
            <h2>QR Ticket Verification</h2>
            <p>
              Digital tickets may include a QR code that can be used for
              ticket and booking verification during the applicable travel
              process.
            </p>
          </section>

          <section>
            <h2>Parcel & Cargo Services</h2>
            <p>
              We also provide information and support for parcel and cargo
              transportation services available through our transportation
              network.
            </p>
          </section>

          <section>
            <h2>Customer Support</h2>
            <p>
              Our support team can assist customers with booking,
              payment, ticket and transportation-related questions.
            </p>

            <div className="contact-box">
              <strong>Email</strong>
              <span>easyreach010@gmail.com</span>

              <strong>Phone</strong>
              <span>+91 7640867132</span>
            </div>
          </section>

        </div>

        <div className="legal-footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund & Cancellation</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

      </div>
    </div>
  );
}

