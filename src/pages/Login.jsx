//~ import { useState } from "react";
//~ import { useNavigate } from "react-router-dom";
//~ import "bootstrap/dist/css/bootstrap.min.css";
//~ import "../styles/login.css";

//~ export default function Login() {
  //~ const [email, setEmail] = useState("");
  //~ const [password, setPassword] = useState("");
  //~ const [showPassword, setShowPassword] = useState(false);
  //~ const navigate = useNavigate();

  //~ const login = async (e) => {
    //~ e.preventDefault();

    //~ const res = await fetch(
      //~ "https://transport-system.celestialq7.workers.dev/api/auth/login", // http://localhost:8787/apo/auth/login
      //~ {
        //~ method: "POST",
        //~ headers: {
          //~ "Content-Type": "application/json",
        //~ },
        //~ body: JSON.stringify({
          //~ email,
          //~ password,
        //~ }),
      //~ }
    //~ );

    //~ const data = await res.json();

    //~ if (data.token) {
      //~ localStorage.setItem("token", data.token);
      //~ const emailLower = email.toLowerCase();

     //~ if (emailLower.includes("staff")) {
       //~ localStorage.setItem("role", "staff");
       //~ navigate("/staff");
    //~ }
    //~ else if (emailLower.includes("driver")) {
      //~ localStorage.setItem("role", "driver");
      //~ navigate("/driver");
    //~ }
    //~ else {
      //~ localStorage.setItem("role", "admin");
      //~ navigate("/dashboard");
    //~ };

    //~ } else {
      //~ alert("Login failed");
    //~ }
  //~ };

  //~ return (
    //~ <div className="login-wrapper">
      //~ {/* Bootstrap Grid for Responsiveness (Mobile, Tablet, PC) */}
      //~ <div className="container">
        //~ <div className="row justify-content-center align-items-center min-vh-100">
          //~ <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            
            //~ <div className="login-card">
              //~ {/* Back / Close button */}
              //~ <button type="button" className="back-btn" onClick={() => navigate("/")}>
                //~ &times;
              //~ </button>

              //~ <h1>Transport Login</h1>

              //~ <form onSubmit={login}>
                //~ <input
                  //~ placeholder="Email"
                  //~ value={email}
                  //~ onChange={(e) => setEmail(e.target.value)}
                //~ />

                //~ {/* Password field container for icon placement */}
                //~ <div className="password-container">
                  //~ <input
                    //~ type={showPassword ? "text" : "password"}
                    //~ placeholder="Password"
                    //~ value={password}
                    //~ onChange={(e) => setPassword(e.target.value)}
                  //~ />
                  //~ {/* Toggle view/hide button */}
                  //~ <button
                    //~ type="button"
                    //~ className="toggle-password-btn"
                    //~ onClick={() => setShowPassword(!showPassword)}
                    //~ aria-label={showPassword ? "Hide password" : "Show password"}
                  //~ >
                    //~ {showPassword ? "Hide" : "Show"}
                  //~ </button>
                //~ </div>

                //~ <button type="submit">
                  //~ Login
                //~ </button>
              //~ </form>
            //~ </div>

          //~ </div>
        //~ </div>
      //~ </div>
    //~ </div>
  //~ );
//~ }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [remainingAttempts, setRemainingAttempts] = useState(null);
  const [locked, setLocked] = useState(false);
  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:8787"
      : "https://transport-system.celestialq7.workers.dev";

  const navigate = useNavigate();

  const login = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.token) {
      setError(data.error || "Login failed");

      if (data.remainingAttempts !== undefined) {
        setRemainingAttempts(data.remainingAttempts);
      }

      if (data.locked) {
        setLocked(true);
      }

      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    if (data.role === "admin") {
      navigate("/dashboard");
    } else if (data.role === "staff") {
      navigate("/bookings");
    } else if (data.role === "driver") {
      navigate("/driver");
    } else {
      alert("Unknown role");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
  } catch (error) {
    console.error(error);
    setError("Unable to login");
  }
};
  return (
    <div className="login-wrapper">
      <div className="container">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="login-card">
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate("/")}
              >
                &times;
              </button>

              <h1>SmartDesk Login</h1>

              <form onSubmit={login}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="toggle-password-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <button type="submit" disabled={locked}>
                 {locked ? "Account Locked" : "Login"}
                </button>
                {error && (
                 <div className="mt-3 text-danger">
                {error}
                 </div>
                  )}

                 {remainingAttempts !== null && remainingAttempts > 0 && (
                 <div className="mt-2 text-warning">
                  Attempts remaining: {remainingAttempts}
                  </div>
                  )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
