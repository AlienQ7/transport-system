import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back-link">
          ← Back to Home
        </Link>

        <div className="legal-header">
          {/* <span className="legal-badge">PRIVACY POLICY</span> */}
          <h1>Privacy Policy</h1>
          <p>
            Information about how EasyReach collects and uses customer
            information.
          </p>
        </div>

        <div className="legal-content">
          <section>
            <h2>Information We Collect</h2>
            <p>
              When you use EasyReach for transportation bookings and related
              services, we may collect information such as your name, phone
              number, booking details, travel date, departure time, vehicle,
              route and selected seat.
            </p>
            <p>
              We may also receive payment and transaction references required
              to process and verify your booking.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <ul>
              <li>To create and manage transportation bookings.</li>
              <li>To process and verify payments.</li>
              <li>To provide tickets and booking information.</li>
              <li>To respond to customer support requests.</li>
              <li>To maintain booking and transaction records.</li>
              <li>To help prevent fraud and unauthorized activity.</li>
              <li>To improve the reliability and security of our services.</li>
            </ul>
          </section>

          <section>
            <h2>Payment Information</h2>
            <p>
              Online payments are processed through Cashfree Payments. Payment
              processing may involve information being handled by the payment
              service provider according to its applicable privacy and security
              practices.
            </p>
            <p>
              EasyReach does not intentionally store sensitive payment
              credentials such as card CVV, UPI PIN or banking passwords on
              this website.
            </p>
          </section>

          <section>
            <h2>Information Sharing</h2>
            <p>
              We may share necessary information with service providers involved
              in operating our booking and payment services, including payment
              processing providers, where required to complete transactions or
              provide the requested service.
            </p>
            <p>
              We do not sell customer information as a commercial product.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We take reasonable measures to protect customer and booking
              information against unauthorized access, misuse or disclosure.
            </p>
            <p>
              No internet-based system can guarantee absolute security, but we
              work to maintain appropriate safeguards for the information used
              by our services.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              Booking and transaction information may be retained for
              operational, customer-support, accounting, security and legal
              purposes for the period required by applicable requirements.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or how your
              information is handled, please contact us.
            </p>

            <div className="contact-box">
              <strong>Email</strong>
              <span>support@easyreach.com</span>

              <strong>Phone</strong>
              <span>+91 7640867132</span>
            </div>
          </section>
        </div>

        <div className="legal-footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/refund-policy">Refund & Cancellation</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}
