import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/payment-portal.css";
import UpiImg from '../assets/upi.jpeg';

export default function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitUTR(e) {
    e.preventDefault();

    const cleanUtr = utr.trim();

    const utrRegex = /^\d{12}$/;
    
    if (!utrRegex.test(cleanUtr)) {
      alert("Invalid UTR format! A valid Transaction UTR must be exactly 12 digits long (Numbers only).");
      return;
    }

    setLoading(true);

    const res = await apiFetch(`/api/bookings/${id}/payment`, {
      method: "PUT",
      body: JSON.stringify({
        payment_utr: cleanUtr,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      alert("Failed to submit UTR");
      return;
    }

    alert("Payment submitted successfully. Waiting for admin approval.");
    navigate(`/ticket/${id}`);
  }

  // Helper handling logic to prevent typing characters/letters into the state container
  function handleUtrChange(e) {
    const value = e.target.value;
    // Strip out any characters that are not digits
    const numericValue = value.replace(/\D/g, "");
    
    // Hard limit character capacity to a length of 12 maximum
    if (numericValue.length <= 12) {
      setUtr(numericValue);
    }
  }

  return (
  <div 
    className="w-100 px-3 text-white d-flex flex-column align-items-center" 
    style={{ 
      minHeight: "100vh", 
      width: "100vw", // Explicitly forces calculation to match full monitor pixel width
      backgroundColor: "#12141c", 
      paddingTop: "30px",
      position: "absolute", // Cuts out of restrictive relative parent layouts
      left: 0,
      top: 0
    }}
  >
    
      {/* SNAP-TO-LEFT BACK BUTTON CONTAINER */}
      <div className="w-100 mb-3" style={{ maxWidth: "550px" }}>
        <button 
          onClick={() => navigate("/")} 
          className="btn btn-back-arrow d-flex align-items-center gap-2 py-2 px-3"
          type="button"
        >
          <span>&larr;</span> Back
        </button>
      </div>

      {/* Top Title Header */}
      <div className="mb-4 text-center" style={{ maxWidth: "550px" }}>
        <h1 className="fw-bold m-0 payment-page-title">Complete Payment</h1>
      </div>

      {/* Central Integrated Payment Card */}
      <div className="card payment-container-card p-4 shadow-sm text-center w-100" style={{ maxWidth: "550px" }}>
        <h5 className="fw-semibold mb-4 text-white">Scan QR and Pay</h5>

        {/* QR Code Container Housing Frame */}
        <div className="mb-4">
          <div className="qr-frame-wrapper shadow-inner">
            <img
              src={UpiImg}
              alt="UPI QR"
              className="img-fluid"
              style={{
                maxWidth: "260px",
                borderRadius: "8px",
              }}
            />
          </div>
        </div>

        {/* Dynamic Context Record Information Box */}
        <div className="p-3 mb-4 rounded-3 d-flex justify-content-between align-items-center" style={{ backgroundColor: "var(--bg-app-dark)", border: "1px solid var(--border-muted)" }}>
          <span className="small text-secondary fw-semibold">Booking ID</span>
          <span className="small fw-bold text-warning">{id}</span>
        </div>

        {/* Form Operations Block */}
        <form onSubmit={submitUTR}>
          <div className="mb-4 text-start">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <label className="form-label text-secondary small fw-semibold m-0">Bank Transaction ID Number (UTR)</label>
              <span className={`small fw-bold ${utr.length === 12 ? 'text-success' : 'text-muted'}`}>
                {utr.length}/12 Digits
              </span>
            </div>
            
            <input
              type="text"
              inputMode="numeric" // Forces number-pad layout visibility on iOS/Android smartphones
              pattern="[0-8]*"
              className="form-control payment-dark-input font-monospace"
              placeholder="Enter 12-digit UTR Number"
              value={utr}
              onChange={handleUtrChange}
              maxLength={12}
              required
            />
            <div className="form-text text-muted mt-1" style={{ fontSize: "11px" }}>
              Please cross-check your banking application history slip for the 12 numerical digits.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-gold-action w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={loading || utr.length !== 12} // Keeps button disabled until exactly 12 digits are typed
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span>Processing Record...</span>
              </>
            ) : (
              <span>Confirm & Submit &rarr;</span>
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
