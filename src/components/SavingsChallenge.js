import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./challenge.css";

function SavingsChallenge() {
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [error, setError] = useState("");

  const challenges = [
    { amount: 100, label: "Save ₹100 Challenge" },
    { amount: 500, label: "Save ₹500 Challenge" },
    { amount: 1000, label: "Save ₹1000 Challenge" },
  ];

  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "challenges", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSelected(data.selected || null);
          setProgress(data.progress || 0);
          setHistory(data.history || []);
        }
      } catch (err) {
        console.error("Error fetching challenge:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const saveChallengeToDB = async (newProgress, newHistory, selectedChallenge) => {
    if (!user) return;
    try {
      await setDoc(
        doc(db, "challenges", user.uid),
        {
          selected: selectedChallenge,
          progress: newProgress,
          history: newHistory,
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving challenge:", err);
    }
  };

  const handleSelect = (challenge) => {
    setError("");
    setSelected(challenge);
    setProgress(0);
    setHistory([]);
    saveChallengeToDB(0, [], challenge);
  };

  const handleCreateCustom = () => {
    setError("");
    const amt = parseInt(customAmount, 10);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }
    const customChallenge = { amount: amt, label: `Custom: ₹${amt}` };
    handleSelect(customChallenge);
    setCustomAmount("");
    setShowCustomInput(false);
  };

  const handleSave = (value) => {
    if (!selected) return;
    const newProgress = Math.min(progress + value, selected.amount);
    const newHistory = [...history, { amount: value, date: new Date().toLocaleDateString() }];
    setProgress(newProgress);
    setHistory(newHistory);
    saveChallengeToDB(newProgress, newHistory, selected);
  };

  const resetChallenge = () => {
    setSelected(null);
    setProgress(0);
    setHistory([]);
    saveChallengeToDB(0, [], null);
  };

  if (loading) return <p>Loading your challenge...</p>;

  return (
    <div className="challenge-page">
      <h2>💰 Savings Challenge</h2>

      {!selected ? (
        <div className="challenge-card select-card">
          <h4>Select a Challenge</h4>

          {challenges.map((c, i) => (
            <button key={i} className="btn btn-outline-primary challenge-btn" onClick={() => handleSelect(c)}>
              {c.label}
            </button>
          ))}

          <div className="custom-section">
            {!showCustomInput ? (
              <button className="btn btn-outline-secondary challenge-btn" onClick={() => setShowCustomInput(true)}>
                ➕ Create Custom Challenge
              </button>
            ) : (
              <div className="custom-input-row">
                <input
                  type="number"
                  min="1"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="form-control"
                  placeholder="Enter custom amount (₹)"
                />
                <button className="btn btn-primary" onClick={handleCreateCustom}>Create</button>
              </div>
            )}
            {error && <div className="text-danger mt-2">{error}</div>}
          </div>
        </div>
      ) : (
        <div className="challenge-card active-card">
          <h4>{selected.label}</h4>
          <p>Progress: ₹{progress} / ₹{selected.amount}</p>

          <div className="progress mb-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${(progress / selected.amount) * 100}%` }}
            >
              {Math.round((progress / selected.amount) * 100)}%
            </div>
          </div>

          {progress < selected.amount ? (
            <div className="save-buttons">
              <button className="btn btn-success" onClick={() => handleSave(10)}>Save ₹10</button>
              <button className="btn btn-primary" onClick={() => handleSave(50)}>Save ₹50</button>
              <button className="btn btn-warning" onClick={() => handleSave(100)}>Save ₹100</button>
            </div>
          ) : (
            <div className="mt-3 complete-block">
              <p className="text-success fw-bold">🎉 Congratulations! You completed the {selected.label}.</p>
              <button className="btn btn-outline-dark" onClick={resetChallenge}>🔄 Start New Challenge</button>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="challenge-history">
          <h5>Savings History</h5>
          <ul className="list-group">
            {history.map((h, i) => (
              <li key={i} className="list-group-item">
                Saved ₹{h.amount} on {h.date}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SavingsChallenge;
