//~ import { useState } from "react";
//~ import { useNavigate, useParams } from "react-router-dom";
//~ import { apiFetch } from "../services/api";
//~ import "bootstrap/dist/css/bootstrap.min.css";
//~ import "../styles/payment-portal.css";
//~ import UpiImg from '../assets/upi.jpeg';

//~ export default function Payment() {
  //~ const { id } = useParams();
  //~ const navigate = useNavigate();

  //~ const [utr, setUtr] = useState("");
  //~ const [loading, setLoading] = useState(false);

  //~ async function submitUTR(e) {
    //~ e.preventDefault();

    //~ const cleanUtr = utr.trim();

    //~ const utrRegex = /^\d{12}$/;
    
    //~ if (!utrRegex.test(cleanUtr)) {
      //~ alert("Invalid UTR format! A valid Transaction UTR must be exactly 12 digits long (Numbers only).");
      //~ return;
    //~ }

    //~ setLoading(true);

    //~ const res = await apiFetch(`/api/bookings/${id}/payment`, {
      //~ method: "PUT",
      //~ body: JSON.stringify({
        //~ payment_utr: cleanUtr,
      //~ }),
    //~ });

    //~ setLoading(false);

    //~ if (!res.ok) {
      //~ alert("Failed to submit UTR");
      //~ return;
    //~ }

    //~ alert("Payment submitted successfully. Waiting for admin approval.");
    //~ navigate(`/ticket/${id}`);
  //~ }

  //~ // Helper handling logic to prevent typing characters/letters into the state container
  //~ function handleUtrChange(e) {
    //~ const value = e.target.value;
    //~ // Strip out any characters that are not digits
    //~ const numericValue = value.replace(/\D/g, "");
    
    //~ // Hard limit character capacity to a length of 12 maximum
    //~ if (numericValue.length <= 12) {
      //~ setUtr(numericValue);
    //~ }
  //~ }

  //~ return (
  //~ <div 
    //~ className="w-100 px-3 text-white d-flex flex-column align-items-center" 
    //~ style={{ 
      //~ minHeight: "100vh", 
      //~ width: "100vw", // Explicitly forces calculation to match full monitor pixel width
      //~ backgroundColor: "#12141c", 
      //~ paddingTop: "30px",
      //~ position: "absolute", // Cuts out of restrictive relative parent layouts
      //~ left: 0,
      //~ top: 0
    //~ }}
  //~ >
    
      //~ {/* SNAP-TO-LEFT BACK BUTTON CONTAINER */}
      //~ <div className="w-100 mb-3" style={{ maxWidth: "550px" }}>
        //~ <button 
          //~ onClick={() => navigate("/")} 
          //~ className="btn btn-back-arrow d-flex align-items-center gap-2 py-2 px-3"
          //~ type="button"
        //~ >
          //~ <span>&larr;</span> Back
        //~ </button>
      //~ </div>

      //~ {/* Top Title Header */}
      //~ <div className="mb-4 text-center" style={{ maxWidth: "550px" }}>
        //~ <h1 className="fw-bold m-0 payment-page-title">Complete Payment</h1>
      //~ </div>

      //~ {/* Central Integrated Payment Card */}
      //~ <div className="card payment-container-card p-4 shadow-sm text-center w-100" style={{ maxWidth: "550px" }}>
        //~ <h5 className="fw-semibold mb-4 text-white">Scan QR and Pay</h5>

        //~ {/* QR Code Container Housing Frame */}
        //~ <div className="mb-4">
          //~ <div className="qr-frame-wrapper shadow-inner">
            //~ <img
              //~ src={UpiImg}
              //~ alt="UPI QR"
              //~ className="img-fluid"
              //~ style={{
                //~ maxWidth: "260px",
                //~ borderRadius: "8px",
              //~ }}
            //~ />
          //~ </div>
        //~ </div>

        //~ {/* Dynamic Context Record Information Box */}
        //~ <div className="p-3 mb-4 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "var(--bg-app-dark)", border: "1px solid var(--border-muted)" }}>
          //~ <span className="small text-secondary fw-semibold">Booking ID</span>
          //~ <span className="small fw-bold text-warning">{id}</span>
        //~ </div>

        //~ {/* Form Operations Block */}
        //~ <form onSubmit={submitUTR}>
          //~ <div className="mb-4 text-start">
            //~ <div className="d-flex justify-content-between align-items-center mb-1">
              //~ <label className="form-label text-secondary small fw-semibold m-0">Bank Transaction ID Number (UTR)</label>
              //~ <span className={`small fw-bold ${utr.length === 12 ? 'text-success' : 'text-muted'}`}>
                //~ {utr.length}/12 Digits
              //~ </span>
            //~ </div>
            
            //~ <input
              //~ type="text"
              //~ inputMode="numeric" // Forces number-pad layout visibility on iOS/Android smartphones
              //~ pattern="[0-8]*"
              //~ className="form-control payment-dark-input font-monospace"
              //~ placeholder="Enter 12-digit UTR Number"
              //~ value={utr}
              //~ onChange={handleUtrChange}
              //~ maxLength={12}
              //~ required
            //~ />
            //~ <div className="form-text text-muted mt-1" style={{ fontSize: "11px" }}>
              //~ Please cross-check your banking application history slip for the 12 numerical digits.
            //~ </div>
          //~ </div>

          //~ <button
            //~ type="submit"
            //~ className="btn btn-gold-action w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            //~ disabled={loading || utr.length !== 12} // Keeps button disabled until exactly 12 digits are typed
          //~ >
            //~ {loading ? (
              //~ <>
                //~ <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                //~ <span>Processing Record...</span>
              //~ </>
            //~ ) : (
              //~ <span>Confirm & Submit &rarr;</span>
            //~ )}
          //~ </button>
        //~ </form>
      //~ </div>

    //~ </div>
  //~ );
//~ }
//Adding payment gate way 
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
          Complete Payment
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
          <span className="small text-secondary fw-semibold">
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
          <h6 className="text-white fw-bold mb-3">
            Pay securely with Cashfree
          </h6>

          <p className="text-secondary small mb-2">
            You will be redirected to Cashfree's secure checkout
            page.
          </p>

          <p className="text-secondary small mb-0">
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
