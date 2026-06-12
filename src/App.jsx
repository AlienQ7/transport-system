//~ import { BrowserRouter, Routes, Route } from "react-router-dom";

//~ import Home from "./pages/Home";
//~ import Login from "./pages/Login";
//~ import Dashboard from "./pages/Dashboard";
//~ import RoutesPage from "./pages/Routes";
//~ import Vehicles from "./pages/Vehicles";
//~ import Bookings from "./pages/Bookings";
//~ import Booking from "./pages/Booking";
//~ import Layout from "./components/Layout";
//~ import Payment from "./pages/Payment";
//~ import Ticket from "./pages/Ticket";
//~ import Scanner from "./pages/Scanner";
//~ import ProtectedRoute from "./components/ProtectedRoute";
//~ import Staff from "./pages/Staff";
//~ import Driver from "./pages/Driver";
//~ import TicketStatus from "./pages/TicketStatus";
//~ import InstallPWAButton from "./components/InstallPWAButton"


//~ export default function App() {
  //~ return (
    //~ <BrowserRouter>
    //~ <InstallPWAButton />
      //~ <Routes>

        //~ {/* PUBLIC */}
        //~ <Route path="/" element={<Home />} />
        //~ <Route path="/payment/:id" element={<Payment />} />
        //~ <Route path="/ticket/:id" element={<Ticket />} />
        //~ <Route path="/login" element={<Login />} />
        //~ <Route path="/book" element={<Booking />} />
        //~ <Route
           //~ path="/ticket-status/:code"
            //~ element={<TicketStatus />}
         //~ />

        //~ {/* STAFF + DRIVER (now correctly inside Routes) */}
        //~ <Route path="/operator-login" element={
          //~ <ProtectedRoute>
            //~ <Staff />
          //~ </ProtectedRoute>
        //~ } />

        //~ <Route path="/driver-login" element={
          //~ <ProtectedRoute>
            //~ <Driver />
          //~ </ProtectedRoute>
        //~ } />

        //~ {/* LAYOUT WRAPPED ROUTES */}
        //~ <Route path="/" element={<Layout />}>
          
          //~ <Route path="/dashboard" element={
            //~ <ProtectedRoute>
              //~ <Dashboard />
            //~ </ProtectedRoute>
          //~ } />

          //~ <Route path="routes" element={
            //~ <ProtectedRoute>
              //~ <RoutesPage />
            //~ </ProtectedRoute>
          //~ } />

          //~ <Route path="vehicles" element={
            //~ <ProtectedRoute>
              //~ <Vehicles />
            //~ </ProtectedRoute>
          //~ } />

          //~ <Route path="/bookings" element={
            //~ <ProtectedRoute>
              //~ <Bookings />
            //~ </ProtectedRoute>
          //~ } />

          //~ <Route path="/scanner" element={
            //~ <ProtectedRoute>
              //~ <Scanner />
            //~ </ProtectedRoute>
          //~ } />

        //~ </Route>

      //~ </Routes>
    //~ </BrowserRouter>
  //~ );
//~ }
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Ticket from "./pages/Ticket";
import TicketStatus from "./pages/TicketStatus";

import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/Routes";
import Vehicles from "./pages/Vehicles";
import Bookings from "./pages/Bookings";
import Scanner from "./pages/Scanner";
import Staff from "./pages/Staff";
import Driver from "./pages/Driver";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import InstallPWAButton from "./components/InstallPWAButton";
import RoleGuard from "./components/RoleGuard";

export default function App() {
  return (
    <BrowserRouter>
      <InstallPWAButton />

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/book" element={<Booking />} />
        <Route path="/payment/:id" element={<Payment />} />
        <Route path="/ticket/:id" element={<Ticket />} />
        <Route path="/ticket-status/:code" element={<TicketStatus />} />

        {/* ================= PROTECTED AREA ================= */}
<Route
  element={
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  }
>

  {/* ADMIN ONLY */}
  <Route
    path="/dashboard"
    element={
      <RoleGuard allowedRoles={["admin"]}>
        <Dashboard />
      </RoleGuard>
    }
  />

  {/* STAFF + ADMIN */}
  <Route
    path="/bookings"
    element={
      <RoleGuard allowedRoles={["admin", "staff"]}>
        <Bookings />
      </RoleGuard>
    }
  />

  {/* DRIVER ONLY */}
  <Route
    path="/driver"
    element={
      <RoleGuard allowedRoles={["driver"]}>
        <Driver />
      </RoleGuard>
    }
  />

  {/* ADMIN + STAFF */}
  <Route
    path="/routes"
    element={
      <RoleGuard allowedRoles={["admin", "staff"]}>
        <RoutesPage />
      </RoleGuard>
    }
  />

  {/* OTHER PROTECTED ROUTES (no restriction yet) */}
  <Route path="/vehicles" element={<Vehicles />} />
  <Route path="/scanner" element={<Scanner />} />

</Route>
      </Routes>
    </BrowserRouter>
  );
}
