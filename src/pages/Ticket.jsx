import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { apiFetch } from "../services/api";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/ticket-voucher.css"; 

export default function Ticket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  loadTicket();
}, []);

async function loadTicket() {
  try {
    // First load the booking
    const response = await apiFetch(
      `/api/bookings/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load booking");
    }

    // Ask our backend to verify the payment directly with Cashfree
    if (data.payment_status !== "paid") {
      const verifyResponse = await apiFetch(
        `/api/bookings/${id}/verify-cashfree`,
        {
          method: "POST",
        }
      );

      const verifyData = await verifyResponse.json();

      console.log("Cashfree verification:", verifyData);

      if (!verifyResponse.ok) {
        console.error(
          "Cashfree verification failed:",
          verifyData
        );
      }
    }
    // payment_status from pending -> paid.
    const finalResponse = await apiFetch(
      `/api/bookings/${id}`
    );

    const finalData = await finalResponse.json();

    if (!finalResponse.ok) {
      throw new Error(
        finalData.error || "Failed to reload ticket"
      );
    }

    console.log("Final booking:", finalData);

    setBooking(finalData);
  } catch (err) {
    console.error(err);
    alert("Failed to load ticket");
  } finally {
    setLoading(false);
  }
}
  async function downloadTicket() {
  const element = document.getElementById("ticket");

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: "#12141c",
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = 190;
    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;
    const pdf = new jsPDF(
      "p",
      "mm",
      [pdfWidth + 20, pdfHeight + 20]
    );

    pdf.addImage(
      imgData,
      "PNG",
      10,
      10,
      pdfWidth,
      pdfHeight
    );

    pdf.save(`ticket-${booking.ticket_code}.pdf`);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
    alert("Unable to download ticket PDF.");
  }
}
  async function downloadTicketImage() {
  const ticket = document.getElementById("ticket");

  try {
    const canvas = await html2canvas(ticket, {
      backgroundColor: "#12141c",
      scale: 2,
      useCORS: true,
      allowTaint: false,
      logging: false,
      windowWidth: ticket.scrollWidth,
      windowHeight: ticket.scrollHeight,
    });

    const link = document.createElement("a");

    link.download = `${booking.ticket_code}.png`;
    link.href = canvas.toDataURL("image/png");

    link.click();
  } catch (error) {
    console.error("Failed to generate ticket image:", error);
    alert("Unable to download ticket image.");
  }
}
  if (loading) return (
    <div className="w-100 d-flex justify-content-center align-items-center text-white" style={{ minHeight: "100vh", backgroundColor: "var(--bg-app-dark)" }}>
      <div className="spinner-border text-warning" role="status"></div>
    </div>
  );

  if (!booking) return (
    <div className="w-100 d-flex justify-content-center align-items-center text-white" style={{ minHeight: "100vh", backgroundColor: "var(--bg-app-dark)" }}>
      <div>Ticket not found</div>
    </div>
  );
  return (
  <div 
    className="w-100 d-flex flex-column align-items-center px-3" 
    style={{ 
      minHeight: "100vh", 
      width: "100vw", 
      backgroundColor: "#12141c", 
      paddingTop: "40px",
      paddingBottom: "40px",
      position: "absolute", 
      left: 0,
      top: 0
    }}
  >
      {/* SNAP-TO-LEFT NAVIGATION BACK CONTROL */}
      <div className="w-100 mb-3" style={{ maxWidth: "520px" }}>
        <button 
          onClick={() => navigate("/")}
          className="btn btn-back-arrow d-flex align-items-center gap-2 py-2 px-3"
          type="button"
        >
          <span>&larr;</span> Back to Home
        </button>
      </div>

      {/* TARGET DOWNLOAD CONTAINER */}
<div
  id="ticket"
  className="card ticket-voucher-card w-100 shadow-lg mb-4"
  style={{ maxWidth: "520px" }}
>
  {/* HEADER */}
  <div className="ticket-card-header text-center">
    <h2
      className="fw-bold m-0 text-warning text-uppercase"
      style={{ fontSize: "24px" }}
    >
      QR Ticket
    </h2>

    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div className="ticket-qr-container shadow">
        <QRCodeCanvas
          value={`https://transport-system-lru.pages.dev/ticket-status/${booking.ticket_code}`}
          size={220}
        />
      </div>
    </div>

    <p className="text-muted small mt-3 mb-0">
      Scan this QR code to verify ticket
    </p>
  </div>

  {/* TICKET DETAILS */}
  <div className="card-body p-4">

    {/* TICKET ID */}
    <div className="pt-3 border-top border-dark mt-2 mb-4 text-center">
      <p className="small text-white fw-semibold text-uppercase m-0">
        Ticket ID
      </p>

      <p
        className="text-muted m-0 font-monospace text-gold-link mt-1"
        style={{
          fontSize: "11px",
          wordBreak: "break-all",
        }}
      >
        {booking.ticket_code}
      </p>
    </div>

    {/* PASSENGER INFORMATION */}
    <div className="mb-4">
      <h6 className="text-warning fw-bold text-uppercase mb-3">
        Passenger Information
      </h6>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Passenger Name
        </span>

        <span className="fw-bold text-light">
          {booking.customer_name || "N/A"}
        </span>
      </div>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Phone Number
        </span>

        <span className="fw-bold text-light">
          {booking.phone_number || "N/A"}
        </span>
      </div>
    </div>

    {/* JOURNEY INFORMATION */}
    <div className="mb-4">
      <h6 className="text-warning fw-bold text-uppercase mb-3">
        Journey Information
      </h6>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Route
        </span>

        <span className="fw-bold text-light">
          {booking.source && booking.destination
            ? `${booking.source} → ${booking.destination}`
            : "N/A"}
        </span>
      </div>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Seat Number
        </span>

        <span className="fw-bold text-warning">
          {booking.seat_no}
        </span>
      </div>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Travel Date
        </span>

        <span className="fw-bold text-light">
          {booking.travel_date}
        </span>
      </div>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Departure Time
        </span>

        <span className="fw-bold text-light">
          {booking.departure_time}
        </span>
      </div>
    </div>

    {/* PAYMENT INFORMATION */}
    <div className="mb-2">
      <h6 className="text-warning fw-bold text-uppercase mb-3">
        Payment Information
      </h6>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Amount
        </span>

        <span className="fw-bold text-light">
          ₹{booking.fare || "0"}
        </span>
      </div>

      <div className="ticket-meta-row">
        <span className="small text-secondary fw-semibold">
          Payment Status
        </span>

        <span
          className={`status-pill-badge ${
            booking.payment_status === "paid"
              ? "status-paid"
              : "status-pending"
          }`}
        >
          {booking.payment_status}
        </span>
      </div>
    </div>

  </div>
</div>
      {/* OPERATIONS BUTTON LAYOUT DECK */}
      <div className="w-100 d-flex flex-column flex-sm-row gap-2" style={{ maxWidth: "520px" }}>
        <button onClick={downloadTicket} className="btn btn-gold-action flex-grow-1 shadow-sm">
          Download PDF
        </button>
        <button onClick={downloadTicketImage} className="btn btn-gold-action flex-grow-1 shadow-sm">
          Download Image
        </button>
      </div>

    </div>
  );
}
