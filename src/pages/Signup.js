import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState({ label: "", score: 0 });
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        photoURL: "",
      });

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
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSignup}>
        
          <div className="form-group mb-3">
            <label className="fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

        
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
            Sign Up
          </button>
        </form>

        <p className="auth-switch text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="fw-bold text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
