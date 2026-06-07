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
      const response = await apiFetch(
        `/api/bookings/${id}`
      );

      const data = await response.json();

      console.log(data);

      setBooking(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load ticket");
    } finally {
      setLoading(false);
    }
  }
  async function downloadTicket() {
    const element = document.getElementById("ticket");

    const canvas = await html2canvas(element, { backgroundColor: "#1a1d29" });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();

    pdf.addImage(
      imgData,
      "PNG",
      10,
      10,
      190,
      0
    );
    pdf.save(`ticket-${booking.ticket_code}.pdf`);
  }
  async function downloadTicketImage() {
    const ticket = document.getElementById("ticket");

    const canvas = await html2canvas(ticket, { backgroundColor: "#1a1d29" });

    const link = document.createElement("a");

    link.download = `${booking.ticket_code}.png`;

    link.href = canvas.toDataURL("image/png");

    link.click();
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
  //if (booking.payment_status !== "paid") {
   // return (
     // <div>
      //  <h2>Ticket Pending Approval</h2>
      //  <p>
         // Your payment has been submitted and is awaiting
         // admin approval.
        //</p>
      //</div>
    //);
  //}

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

      {/* TARGET DOWNLOAD CONTAINER REGISTRY CANVAS */}
      <div id="ticket" className="card ticket-voucher-card w-100 shadow-lg mb-4" style={{ maxWidth: "520px" }}>
        
        <div className="ticket-card-header text-center">
          <h2 className="fw-bold m-0 text-warning text-uppercase" style={{ fontSize: "24px" }}>QR Code Ticket</h2>
          
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="ticket-qr-container shadow">
             <QRCodeCanvas
              value={`https://transport-system-lru.pages.dev/ticket/${booking.ticket_code}`}
               size={220}
                />
           </div>
          </div>
        </div>
        <div className="card-body p-4">
  <div className="pt-3 border-top border-dark mt-2 d-flex flex-column align-items-center justify-content-center text-center">
    <p className="small text-white fw-semibold text-uppercase tracking-wider m-0">
      Ticket ID:
    </p>
    <p className="text-muted m-0 font-monospace text-gold-link mt-1" style={{ fontSize: "11px", wordBreak: "break-all" }}>
      {booking.ticket_code}
    </p>
  </div>
          <div className="ticket-meta-row">
            <span className="small text-secondary fw-semibold text-uppercase tracking-wider">Passenger:</span>
            <span className="fw-bold text-light">{booking.customer_name}</span>
          </div>

          <div className="ticket-meta-row">
            <span className="small text-secondary fw-semibold text-uppercase tracking-wider">Seat:</span>
            <span className="fw-bold text-warning">{booking.seat_no}</span>
          </div>

          <div className="ticket-meta-row">
            <span className="small text-secondary fw-semibold text-uppercase tracking-wider">Travel Date:</span>
            <span className="fw-bold text-light">{booking.travel_date}</span>
          </div>

          <div className="ticket-meta-row">
            <span className="small text-secondary fw-semibold text-uppercase tracking-wider">Departure Time:</span>
            <span className="fw-bold text-light">{booking.departure_time}</span>
          </div>

          <div className="ticket-meta-row">
            <span className="small text-secondary fw-semibold text-uppercase tracking-wider">Status:</span>
            <span className="fw-semibold text-info text-capitalize">{booking.status}</span>
          </div>

          <div className="ticket-meta-row">
            <span className="small text-secondary fw-semibold text-uppercase tracking-wider">Payment:</span>
            <span className={`status-pill-badge ${
  booking.payment_status === "paid"
    ? "status-paid"
    : "status-pending"
}`}>
              {booking.payment_status}
            </span>
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
