import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import ExpenseForm from "./components/ExpenseForm";
import ExpenseChart from "./components/ExpenseChart";
import Quiz from "./components/Quiz";
import ChatTip from "./components/ChatTip";
import InvestmentTips from "./components/InvestmentTips";
import SavingsChallenge from "./components/SavingsChallenge";
import Dashboard from "./pages/Dashboard";
import CSVUpload from "./components/CSVUpload";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

import { useAuth } from "./context/AuthContext";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

import "./styles.css";

function App() {
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <Router>
      <div className="app-layout">
        {user && (
          <aside className="sidebar">
            <div className="sidebar-profile">
              <Link to="/profile" className="profile-link">
                <div className="avatar">
                  {userData?.photoURL ? (
                    <img
                      src={userData.photoURL}
                      alt="Profile"
                      className="sidebar-avatar-img"
                    />
                  ) : (
                    (userData?.username?.[0] || user?.email?.[0] || "U").toUpperCase()
                  )}
                </div>
              </Link>
              <div className="profile-info">
                <p className="user-name">{userData?.username || "User"}</p>
                <small className="status">🟢 Online</small>
              </div>
            </div>

            <h2 className="sidebar-logo">💰 FinBuddy</h2>
            <nav className="sidebar-nav">
              <Link to="/">🏠 Dashboard</Link>
              <Link to="/add-expense">➕ Add Expense</Link>
              <Link to="/chart">📊 Chart</Link>
              <Link to="/quiz">🎯 Quiz</Link>
              <Link to="/smart-tip">💡 Smart Tip</Link>
              <Link to="/investment">📈 Investment</Link>
              <Link to="/challenge">🏆 Challenge</Link>
              <Link to="/upload-csv">📂 Upload CSV</Link>
              <button onClick={logout} className="btn btn-danger mt-3">
                🚪 Logout
              </button>
            </nav>
          </aside>
        )}

        <main className="main-content">
          <div className="card shadow p-4">
            <Routes>
              {!user ? (
                <>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Navigate to="/login" />} />
                </>
              ) : (
                <>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/add-expense" element={<ExpenseForm />} />
                  <Route path="/chart" element={<ExpenseChart />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/smart-tip" element={<ChatTip />} />
                  <Route path="/investment" element={<InvestmentTips />} />
                  <Route path="/challenge" element={<SavingsChallenge />} />
                  <Route path="/upload-csv" element={<CSVUpload />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              )}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
