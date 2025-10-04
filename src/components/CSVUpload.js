import React, { useState } from "react";
import Papa from "papaparse";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function CSVUpload() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileUpload = (e) => {
    setError("");
    setSuccess("");
    const file = e.target.files[0];

    if (!file) {
      setError("No file selected");
      return;
    }

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setError("Please upload a valid .csv file");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        if (result.errors.length) {
          setError("Error parsing CSV file");
        } else {
          let expenses = result.data.map((row) => ({
            category: row.Category?.trim() || "Uncategorized",
            amount: parseFloat(row.Amount) || 0,
            date: row.Date ? new Date(row.Date) : new Date(),
          }));

          expenses = expenses.sort((a, b) => b.date - a.date);
          setData(expenses);

          try {
            const user = auth.currentUser;
            if (!user) {
              setError("You must be logged in to upload expenses.");
              return;
            }

            const expenseRef = collection(db, "users", user.uid, "expenses");

            for (const exp of expenses) {
              await addDoc(expenseRef, {
                category: exp.category,
                amount: exp.amount,
                date: exp.date,
                createdAt: serverTimestamp(),
              });
            }

            setSuccess("✅ Expenses uploaded successfully!");
          } catch (err) {
            console.error("Error saving expenses:", err);
            setError("Failed to save expenses. Try again.");
          }
        }
      },
    });
  };

  return (
    <div className="csv-upload-page">
      <div className="csv-upload-card">
        <h2>📂 Upload Expenses CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="form-control mb-3"
        />
        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}
        {data.length > 0 && (
          <div className="table-responsive mt-3">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date.toLocaleDateString()}</td>
                    <td>{row.category}</td>
                    <td>₹{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CSVUpload;
