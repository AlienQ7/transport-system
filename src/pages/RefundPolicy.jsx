import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function RefundPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back-link">
          ← Back to Home
        </Link>

        <div className="legal-header">
          {/*<span className="legal-badge">REFUND & CANCELLATION</span> */}
          <h1>Refund & Cancellation Policy</h1>
          <p>
            Information about booking cancellation, payment expiry and refunds.
          </p>
        </div>

        <div className="legal-content">
          <section>
            <h2>Payment-Pending Bookings</h2>
            <p>
              When a customer creates a booking, the selected seat may be
              temporarily reserved while payment is pending.
            </p>
            <p>
              If payment is not completed within the applicable payment hold
              period, the temporary reservation may expire and the seat may
              become available for other customers.
            </p>
          </section>

          <section>
            <h2>Cancellation of Confirmed Bookings</h2>
            <p>
              Cancellation requests for confirmed and paid bookings are subject
              to the applicable cancellation conditions of the transportation
              service.
            </p>
            <p>
              Customers should contact EasyReach support with their Booking ID
              when requesting cancellation.
            </p>
          </section>

          <section>
            <h2>Refunds</h2>
            <p>
              Where a refund is approved, the refund will normally be processed
              through the original payment method or payment channel used for
              the transaction.
            </p>
            <p>
              The time required for a refund to appear in the customer's
              account may depend on the payment provider and the customer's
              bank or financial institution.
            </p>
          </section>

          <section>
            <h2>Payment Failure</h2>
            <p>
              If a payment attempt fails or remains incomplete, the booking may
              remain in a payment-pending state until the applicable hold period
              expires.
            </p>
            <p>
              Customers should not make repeated payments for the same booking
              without first checking the booking or payment status.
            </p>
          </section>

          <section>
            <h2>Service Changes or Cancellation</h2>
            <p>
              If EasyReach or the applicable transportation operator cancels or
              materially changes a service, customers will be provided with
              applicable support regarding rebooking or refund options.
            </p>
          </section>

          <section>
            <h2>How to Request a Refund</h2>
            <p>
              To request a cancellation or refund, contact our support team and
              provide your Booking ID and relevant transaction information.
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
          <Link to="/services">Services</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}
