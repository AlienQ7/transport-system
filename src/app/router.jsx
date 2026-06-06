import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Booking from "../pages/public/Booking";

import Login from "../pages/auth/Login";

import Dashboard from "../pages/admin/Dashboard";
import RoutesPage from "../pages/admin/Routes";
import Vehicles from "../pages/admin/Vehicles";
import Bookings from "../pages/admin/Bookings";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book" element={<Booking />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/bookings" element={<Bookings />} />
      </Routes>
    </BrowserRouter>
  );
}