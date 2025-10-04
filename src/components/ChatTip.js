import React, { useState } from "react";

function ChatTip() {
  const [tip, setTip] = useState("");

  const tips = [
    "Save 20% of income monthly.",
    "Avoid unnecessary debt.",
    "Track all expenses daily.",
    "Invest early for long-term growth."
  ];

  const getTip = () => {
    const random = Math.floor(Math.random() * tips.length);
    setTip(tips[random]);
  };

  return (
    <div>
      <h3>Smart Money Mentor</h3>
      <button className="btn btn-info mb-3" onClick={getTip}>Get Tip</button>
      {tip && <p className="alert alert-success">{tip}</p>}
    </div>
  );
}

export default ChatTip;
