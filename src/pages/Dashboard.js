import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Dashboard() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsub();
  }, []);

  const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);
  const topCategoryData = expenses.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});
  const topCategoryName =
    Object.keys(topCategoryData).length > 0
      ? Object.entries(topCategoryData).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  const chartData = {
    labels: expenses.map((e) =>
      e.date ? new Date(e.date).toLocaleDateString() : "N/A"
    ),
    datasets: [
      {
        label: "Spending Trend",
        data: expenses.map((e) => e.amount),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2 className="text-center mb-4">🚀 Welcome to FinBuddy Dashboard</h2>
      <div className="summary-cards">
        <div className="summary-card">
          <h4>💰 Total Spending</h4>
          <p>₹{totalSpending}</p>
        </div>
        <div className="summary-card">
          <h4>🏆 Top Category</h4>
          <p>{topCategoryName}</p>
        </div>
        <div className="summary-card">
          <h4>🧾 Total Expenses</h4>
          <p>{expenses.length}</p>
        </div>
      </div>

      <div className="card shadow p-4 mt-4 chart-container">
        <h4 className="text-center mb-3">📊 Spending Trend</h4>
        <div style={{ width: "100%", height: "400px" }}>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="card shadow p-4 mt-4">
        <h4 className="text-center mb-3">📝 Recent Transactions</h4>
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((e) => (
                <tr key={e.id}>
                  <td>{e.date ? new Date(e.date).toLocaleDateString() : "N/A"}</td>
                  <td>{e.category}</td>
                  <td>₹{e.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No recent transactions
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
