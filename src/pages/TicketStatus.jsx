hereimport { useEffect, useState } from "react";
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

  if (!data) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ticket Status</h2>

      <h3>{data.status}</h3>

      {data.booking && (
        <>
          <p>Name: {data.booking.customer_name}</p>
          <p>Seat: {data.booking.seat_no}</p>
          <p>Date: {data.booking.travel_date}</p>
          <p>Time: {data.booking.departure_time}</p>
        </>
      )}
    </div>
  );
}
