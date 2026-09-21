import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/payment-portal.css";

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cashfree, setCashfree] = useState(null);

  // Load Cashfree SDK
  useEffect(() => {
    async function loadCashfree() {
      try {
        const instance = await load({
          mode: "sandbox",
        });

        setCashfree(instance);
      } catch (err) {
        console.error("Failed to load Cashfree SDK:", err);
        setError("Unable to load payment gateway.");
      }
    }

    loadCashfree();
  }, []);

  async function startPayment() {
    if (!id) {
      setError("Invalid booking ID.");
      return;
    }

    if (!cashfree) {
      setError("Payment gateway is still loading. Please try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Ask backend to create Cashfree order
      const res = await apiFetch(
        `/api/bookings/${id}/cashfree-order`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Cashfree order error:", data);

        setError(
          data?.details?.message ||
          data?.error ||
          "Failed to create payment order."
        );

        setLoading(false);
        return;
      }

      if (!data.payment_session_id) {
        setError("Cashfree payment session was not created.");
        setLoading(false);
        return;
      }

      // Open Cashfree hosted checkout
      await cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      });

    } catch (err) {
      console.error("Payment error:", err);
      setError("Unable to start payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div
      className="w-100 px-3 text-white d-flex flex-column align-items-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#12141c",
        paddingTop: "30px",
        position: "absolute",
        left: 0,
        top: 0,
      }}
    >
      {/* Back button */}
      <div
        className="w-100 mb-3"
        style={{ maxWidth: "550px" }}
      >
        <button
          onClick={() => navigate("/")}
          className="btn btn-back-arrow d-flex align-items-center gap-2 py-2 px-3"
          type="button"
          disabled={loading}
        >
          <span>&larr;</span> Back
        </button>
      </div>

      {/* Page title */}
      <div
        className="mb-4 text-center"
        style={{ maxWidth: "550px" }}
      >
        <h1 className="fw-bold m-0 payment-page-title">
          Safe Journey
        </h1>
      </div>

      {/* Payment card */}
      <div
        className="card payment-container-card p-4 shadow-sm text-center w-100"
        style={{ maxWidth: "550px" }}
      >
        <h5 className="fw-semibold mb-4 text-white">
          Secure Online Payment
        </h5>

        {/* Booking ID */}
        <div
          className="p-3 mb-4 rounded-3 d-flex justify-content-between align-items-center"
          style={{
            backgroundColor: "var(--bg-app-dark)",
            border: "1px solid var(--border-muted)",
          }}
        >
          <span className="small text-white fw-semibold">
            Booking ID
          </span>

          <span className="small fw-bold text-warning">
            {id}
          </span>
        </div>

        {/* Payment information */}
        <div
          className="p-4 mb-4 rounded-3"
          style={{
            backgroundColor: "var(--bg-app-dark)",
            border: "1px solid var(--border-muted)",
          }}
        >
          <h6 className="fw-bold mb-3 payment-page-title">
            Pay securely with Cashfree
          </h6>

          <p className="text-white small mb-2">
            You will be redirected to Cashfree's secure checkout
            page.
          </p>

          <p className="text-white small mb-0">
            Available payment methods may include UPI, cards,
            net banking and other supported methods.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="alert alert-danger text-start small"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Pay button */}
        <button
          type="button"
          className="btn btn-gold-action w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
          onClick={startPayment}
          disabled={loading || !cashfree}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm"
                aria-hidden="true"
              ></span>

              <span>Opening Secure Checkout...</span>
            </>
          ) : (
            <span>Proceed to Pay &rarr;</span>
          )}
        </button>

        {!cashfree && !error && (
          <div className="text-muted small mt-3">
            Loading secure payment gateway...
          </div>
        )}

        <div className="text-muted mt-4" style={{ fontSize: "11px" }}>
          Payments are securely processed by Cashfree.
        </div>
      </div>
    </div>
  );
}
