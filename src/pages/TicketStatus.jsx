import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function TicketStatus() {
  const { code } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    loadTicket();
  }, []);

  async function loadTicket() {
    const response = await apiFetch(
      `/api/bookings/verify/${code}`
    );

    const result = await response.json();

    setData(result);
  }

  if (!data) {
  return (
    <div className="container py-5 text-center text-white">
      <h3>Loading...</h3>
    </div>
  );
}

return (
  <div className="container py-5">
    <div
      className="card bg-dark border-warning shadow-lg mx-auto"
      style={{ maxWidth: "600px" }}
    >
      <div className="card-body text-center text-white">

        <h2 className="text-warning fw-bold mb-4">
          Ticket Status
        </h2>

        <h1 className="text-warning fw-bold mb-4">
          {data.status}
        </h1>

        {data.booking && (
          <>
            <p className="fs-5">
              <strong className="text-warning">
                Name:
              </strong>{" "}
              {data.booking.customer_name}
            </p>

            <p className="fs-5">
              <strong className="text-warning">
                Seat:
              </strong>{" "}
              {data.booking.seat_no}
            </p>

            <p className="fs-5">
              <strong className="text-warning">
                Date:
              </strong>{" "}
              {data.booking.travel_date}
            </p>

            <p className="fs-5">
              <strong className="text-warning">
                Time:
              </strong>{" "}
              {data.booking.departure_time}
            </p>
          </>
        )}
      </div>
    </div>
  </div>
);
