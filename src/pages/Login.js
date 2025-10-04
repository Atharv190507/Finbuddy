import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [strength, setStrength] = useState({ label: "", score: 0 }); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("User data:", docSnap.data());
      }

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  
  const checkPasswordStrength = (value) => {
    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    let label = "";
    if (score <= 1) label = "Weak 🔴";
    else if (score === 2) label = "Medium 🟠";
    else if (score >= 3) label = "Strong 🟢";

    setStrength({ label, score });
  };

  return (
    <div className="auth-page d-flex justify-content-center align-items-center vh-100">
      <div className="auth-card shadow-lg p-4 rounded">
        <h2 className="text-center mb-4">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          
          <div className="form-group mb-3">
            <label className="fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

         
          <div className="form-group mb-3 position-relative">
            <label className="fw-semibold">Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  checkPasswordStrength(e.target.value);
                }}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈 Hide" : "👁️ Show"}
              </button>
            </div>

            
            {strength.label && (
              <small
                className={`fw-bold d-block mt-1 ${
                  strength.label.includes("Weak")
                    ? "text-danger"
                    : strength.label.includes("Medium")
                    ? "text-warning"
                    : "text-success"
                }`}
              >
                {strength.label}
              </small>
            )}
            {strength.score > 0 && (
              <div className="progress mt-2" style={{ height: "6px" }}>
                <div
                  className={`progress-bar ${
                    strength.score <= 1
                      ? "bg-danger"
                      : strength.score === 2
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                  role="progressbar"
                  style={{ width: `${(strength.score / 4) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>

        <p className="auth-switch text-center mt-3">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="fw-bold text-decoration-none">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
