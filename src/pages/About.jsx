import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function About() {
  return (
    <div className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back-link">
          ← Back to Home
        </Link>

        <div className="legal-header">
          {/* <span className="legal-badge">ABOUT US</span> */}
          <h1>About EasyReach</h1>
          <p>
            Reliable transportation and passenger services across Nagaland.
          </p>
        </div>

        <div className="legal-content">

          <section>
            <h2>Who We Are</h2>
            <p>
              EasyReach is an online transportation booking platform that
              helps customers find available routes, vehicles, travel dates,
              departure times and seats and make transportation bookings
              conveniently online.
            </p>

            <p>
              Our platform connects online customers with transportation
              services and supports both online reservations and
              counter-based booking operations.
            </p>
          </section>

          <section>
            <h2>Our Services</h2>

            <ul>
              <li>Online passenger ticket booking</li>
              <li>Route and destination information</li>
              <li>Vehicle and departure information</li>
              <li>Live seat availability</li>
              <li>Digital ticket and QR-based ticket verification</li>
              <li>Online payment processing</li>
              <li>Passenger booking support</li>
              <li>Parcel and cargo service information</li>
            </ul>
          </section>

          <section>
            <h2>Our Booking Platform</h2>
            <p>
              Customers can use our website to select an available route,
              vehicle, travel date and seat. After entering the required
              booking information, customers can proceed to online payment.
            </p>

            <p>
              Once payment has been successfully processed and verified, the
              booking is confirmed and the customer can access their digital
              ticket.
            </p>
          </section>

          <section>
            <h2>Our Commitment</h2>
            <p>
              We aim to provide a simple and convenient booking experience
              while making transportation information easier to access for
              passengers.
            </p>

            <p>
              We also work to maintain accurate booking information and
              provide customers with appropriate support for booking,
              payment and ticket-related questions.
            </p>
          </section>

          <section>
            <h2>Online Payments</h2>
            <p>
              Payments made through our website are processed through
              Cashfree Payments. Payment processing is handled through the
              payment service provider's secure payment infrastructure.
            </p>

            <p>
              We do not intentionally collect or store customers' complete
              card credentials, CVV, UPI PIN or banking passwords on our
              website.
            </p>
          </section>

          <section>
            <h2>Customer Support</h2>
            <p>
              If you have questions regarding a booking, payment, ticket or
              transportation service, please contact our support team.
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
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund & Cancellation</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

      </div>
    </div>
  );
}
