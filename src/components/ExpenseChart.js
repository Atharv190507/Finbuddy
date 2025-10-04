import React, { useEffect, useState, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpenseChart() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const snap = await getDocs(collection(db, "users", user.uid, "expenses"));
        setExpenses(snap.docs.map((d) => d.data()));
      } catch (err) {
        console.error("Error fetching expenses:", err);
      }
    };
    fetchData();
  }, []);

  const totals = useMemo(() => {
    return expenses.reduce((acc, e) => {
      const amt = Number(e.amount) || 0;
      acc[e.category] = (acc[e.category] || 0) + amt;
      return acc;
    }, {});
  }, [expenses]);

  const labels = Object.keys(totals);
  const values = Object.values(totals);
  const totalSpending = values.reduce((sum, v) => sum + v, 0);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF"],
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 14,
          padding: 16,
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, i) => {
              const value = dataset.data[i];
              return {
                text: `${label} – ₹${value}`,
                fillStyle: dataset.backgroundColor[i],
                strokeStyle: dataset.backgroundColor[i],
                hidden: isNaN(value) || value <= 0,
                index: i,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.parsed ?? 0;
            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
            const pct = sum ? ((value / sum) * 100).toFixed(1) : "0.0";
            return `${context.label} : ₹${value} (${pct}%)`;
          },
        },
      },
    },
  };

  if (!labels.length) {
    return (
      <div className="card chart-card">
        <h2>📊 Spending by Category</h2>
        <p className="text-muted">No expenses yet. Add some to see your chart.</p>
      </div>
    );
  }

  return (
    <div className="card chart-card">
      <h2>📊 Spending by Category</h2>
      <div className="chart-area">
        <Pie data={chartData} options={options} />
      </div>
      <p style={{ marginTop: "20px", fontWeight: "600", fontSize: "1.2rem" }}>
        💵 Total Spending: ₹{totalSpending}
      </p>
    </div>
  );
}
