import React, { useState, useEffect } from "react";

const tips = [
  "💡 Track your expenses daily to find hidden leaks in your budget.",
  "💡 Save at least 20% of your income for future goals.",
  "💡 Avoid using credit cards for wants, use them for needs only.",
  "💡 Build an emergency fund of at least 3–6 months of expenses.",
  "💡 Automate savings to grow your wealth without thinking.",
];

function SmartTip() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card shadow p-4 text-center">
      <h2>💡 Smart Financial Tip</h2>
      <p>{tips[tipIndex]}</p>
    </div>
  );
}

export default SmartTip;
