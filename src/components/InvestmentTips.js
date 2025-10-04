import React from "react";

function InvestmentTips() {
  const tips = [
    { title: "Emergency Fund", text: "Save 3–6 months of expenses in a safe account." },
    { title: "SIP/Index Funds", text: "Start with small monthly investments in SIPs or index funds." },
    { title: "Avoid High-Interest Debt", text: "Pay off credit cards before investing." },
    { title: "Diversify", text: "Never put all money into one stock or asset." }
  ];

  return (
    <div>
      <h3>📈 Investment & Saving Tips</h3>
      <div className="row">
        {tips.map((t, i) => (
          <div key={i} className="col-md-6 mb-3">
            <div className="card p-3 shadow">
              <h5>{t.title}</h5>
              <p>{t.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvestmentTips;
