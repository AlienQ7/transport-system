import { useState } from "react";
import { apiFetch } from "../services/api";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function Scanner() {
  const [result, setResult] = useState("");
  const [verification, setVerification] = useState(null);
  
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
       const code =
        decodedText.split("/").pop();

       setResult(code);

       verifyTicket(code);
     },
     (error) => {
       console.log(error);
     }
   );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  async function verifyTicket(code) {
    try {
      const response = await apiFetch(
        `/api/bookings/verify/${code}`
      );

      const data = await response.json();

      setVerification(data);

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }
  async function boardPassenger(code) {
    try {
      await apiFetch(
        `/api/bookings/use/${code}`,
        {
          method: "PUT",
        }
      );

      alert("Passenger boarded");

      verifyTicket(code);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <h2>Ticket Scanner</h2>
      <div id="reader"></div>

      <input
        value={result}
        onChange={(e) => setResult(e.target.value)}
        placeholder="Paste ticket code"
      />

      <button onClick={() => verifyTicket(result)}>
        Verify
      </button>

      {verification && (
        <div>
          <h3>{verification.status}</h3>

          {verification.booking && (
            <>
              <p>
                Passenger:{" "}
                {verification.booking.customer_name}
              </p>

              <p>
                Seat:{" "}
                {verification.booking.seat_no}
              </p>

              <p>
                Ticket:{" "}
                {verification.booking.ticket_code}
              </p>
              <button
  onClick={() =>
    boardPassenger(
      verification.booking.ticket_code
    )
  }
>
  Board Passenger
</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
