import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
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
    <aside className="sidebar">
      <div className="sidebar-profile">
        <Link to="/profile" className="profile-link">
          <div className="avatar">
            {userData?.photoURL ? (
              <img src={userData.photoURL} alt="avatar" className="avatar-img" />
            ) : (
              <span>{userData?.username?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>
        </Link>
        <div className="profile-info">
          <p className="user-username">{userData?.username || "User"}</p>
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
        <button onClick={logout} className="btn btn-danger mt-3">🚪 Logout</button>
      </nav>
    </aside>
  );
}

export default Sidebar;
