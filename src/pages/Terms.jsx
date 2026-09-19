import { Link } from "react-router-dom";
import "../styles/LegalPages.css";

export default function Terms() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <Link to="/" className="legal-back-link">
          ← Back to Home
        </Link>

        <div className="legal-header">
          {/* <span className="legal-badge">TERMS & CONDITIONS</span> */ }
          <h1>Terms & Conditions</h1>
          <p>
            Terms governing the use of EasyReach booking and transportation
            services.
          </p>
        </div>

        <div className="legal-content">
          <section>
            <h2>Acceptance of Terms</h2>
            <p>
              By using the EasyReach website or booking services, you agree to
              these Terms & Conditions. If you do not agree with these terms,
              please do not use our booking services.
            </p>
          </section>

          <section>
            <h2>Booking Information</h2>
            <p>
              Customers are responsible for providing accurate information when
              making a booking, including their name, phone number and other
              required booking details.
            </p>
            <p>
              A booking is subject to seat availability and successful
              completion or verification of the applicable payment process.
            </p>
          </section>

          <section>
            <h2>Seat Reservation</h2>
            <p>
              Selected seats may be temporarily reserved while a payment is
              pending. A temporary reservation does not constitute a confirmed
              paid ticket.
            </p>
            <p>
              If the payment is not completed within the applicable payment
              hold period, the temporary reservation may expire and the seat
              may become available again.
            </p>
          </section>

          <section>
            <h2>Payments</h2>
            <p>
              Online payments are processed through Cashfree Payments and are
              subject to the applicable payment provider's terms and
              conditions.
            </p>
            <p>
              A booking becomes confirmed only after the applicable payment
              has been successfully completed and verified.
            </p>
          </section>

          <section>
            <h2>Tickets and Travel</h2>
            <p>
              Customers should keep their booking information or digital ticket
              available when required for travel or boarding verification.
            </p>
            <p>
              Customers are responsible for checking their selected route,
              travel date, departure time and other booking details before
              travel.
            </p>
          </section>

          <section>
            <h2>QR Ticket Verification</h2>
            <p>
              Where a digital ticket contains a QR code, the QR code may be
              used to verify the associated booking during the applicable
              transportation process.
            </p>
            <p>
              Customers should not share ticket or QR information with
              unauthorized persons.
            </p>
          </section>

          <section>
            <h2>Cancellation and Refunds</h2>
            <p>
              Cancellation and refund requests are handled according to our
              applicable Refund & Cancellation Policy.
            </p>
            <p>
              For details, please review our{" "}
              <Link to="/refund-policy" className="legal-inline-link">
                Refund & Cancellation Policy →
              </Link>
            </p>
          </section>

          <section>
            <h2>Service Changes</h2>
            <p>
              Transportation schedules, routes, vehicles and departure times
              may be subject to operational changes.
            </p>
            <p>
              Where a service is changed or cancelled, EasyReach will provide
              applicable support regarding the available options.
            </p>
          </section>

          <section>
            <h2>Acceptable Use</h2>
            <p>
              Customers must not use the website or booking system for
              fraudulent, unlawful or unauthorized purposes.
            </p>
            <p>
              Any attempt to interfere with the booking system, manipulate
              availability, misuse tickets or gain unauthorized access may
              result in cancellation of the affected booking and appropriate
              action.
            </p>
          </section>

          <section>
            <h2>Website Availability</h2>
            <p>
              We work to keep the EasyReach website and booking services
              available and reliable. However, temporary interruptions may
              occur because of maintenance, technical issues, network
              problems or circumstances outside our control.
            </p>
          </section>

          <section>
            <h2>Changes to These Terms</h2>
            <p>
              EasyReach may update these Terms & Conditions when necessary to
              reflect changes to our services, booking process or applicable
              requirements.
            </p>
            <p>
              Updated terms will be published on this page.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have questions about these Terms & Conditions, please
              contact our support team.
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
          <Link to="/refund-policy">Refund & Cancellation</Link>
        </div>
      </div>
    </div>
  );
}
