import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function ExpenseForm() {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !date) {
      alert("⚠️ Please fill all fields");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to add an expense.");
        return;
      }

      await addDoc(collection(db, "users", user.uid, "expenses"), {
        amount: parseFloat(amount),
        category,
        date,
        createdAt: serverTimestamp(),
      });

      setAmount("");
      setDate("");
      alert("✅ Expense added!");
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("❌ Failed to add expense. Check console for details.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
      <div className="card shadow-lg p-4" style={{ width: "400px", borderRadius: "20px" }}>
        <h3 className="text-center mb-3">➕ Add Expense</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Shopping">Shopping</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-primary w-100 mt-2" type="submit">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
