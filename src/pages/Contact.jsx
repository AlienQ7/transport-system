import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function Contact() {
  return (
    <div className="legal-page">
      <div className="legal-container">

        <Link to="/" className="legal-back-link">
          ← Back to Home
        </Link>

        <div className="legal-header">
          {/* <span className="legal-badge">CONTACT US</span> */}
          <h1>Contact Us</h1>
          <p>
            We're available to help with your booking and service questions.
          </p>
        </div>

        <div className="legal-content">

          <section>
            <h2>Customer Support</h2>
            <p>
              If you have questions about a booking, payment, ticket,
              cancellation or transportation service, please contact us
              using the information below.
            </p>
          </section>

          <section>
            <h2>Contact Information</h2>

            <div className="contact-box">
              <strong>Business</strong>
              <span>EasyReach</span>

              <strong>Email</strong>
              <span>easyreach010@gmail.com</span>

              <strong>Phone</strong>
              <span>+91 7640867132</span>

              <strong>Address</strong>
              <span>
                EasyReach <br />
                Near cultural Hall <br />
                Kohima ,Nagaland-797001 <br />
                India
              </span>
            </div>
          </section>

          <section>
            <h2>Booking Support</h2>
            <p>
              For booking-related questions, please provide your Booking ID
              when contacting us. This helps us locate your booking and
              respond more efficiently.
            </p>
          </section>

          <section>
            <h2>Payment Support</h2>
            <p>
              If you experience a payment problem, please contact us with
              your Booking ID and available transaction details.
            </p>

            <p>
              Online payments are processed through Cashfree Payments.
            </p>
          </section>

          <section>
            <h2>Cancellation & Refunds</h2>
            <p>
              For cancellation or refund requests, please review our
              Refund & Cancellation Policy and contact our support team
              with your Booking ID.
            </p>

            <p>
              <Link to="/refund-policy" className="legal-inline-link">
                View Refund & Cancellation Policy →
              </Link>
            </p>
          </section>

        </div>

        <div className="legal-footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/services">Services</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund & Cancellation</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

      </div>
    </div>
  );
}

