import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/Routes";
import Vehicles from "./pages/Vehicles";
import Bookings from "./pages/Bookings";
import Booking from "./pages/Booking";
import Layout from "./components/Layout";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";
import Scanner from "./pages/Scanner";
import ProtectedRoute from "./components/ProtectedRoute";
import Staff from "./pages/Staff";
import Driver from "./pages/Driver";
import TicketStatus from "./pages/TicketStatus";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/ticket/:code" element={<TicketStatus />} />

        {/* STAFF + DRIVER (now correctly inside Routes) */}
        <Route path="/operator-login" element={
          <ProtectedRoute>
            <Staff />
          </ProtectedRoute>
        } />

        <Route path="/driver-login" element={
          <ProtectedRoute>
            <Driver />
          </ProtectedRoute>
        } />

        {/* LAYOUT WRAPPED ROUTES */}
        <Route path="/" element={<Layout />}>
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="routes" element={
            <ProtectedRoute>
              <RoutesPage />
            </ProtectedRoute>
          } />

          <Route path="vehicles" element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          } />

          <Route path="/bookings" element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          } />

          <Route path="/scanner" element={
            <ProtectedRoute>
              <Scanner />
            </ProtectedRoute>
          } />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}
