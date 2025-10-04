import React, { useState } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! I’m your finance buddy. Ask me anything about saving or investing." }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    let botReply = "I’ll think about that...";

    if (input.toLowerCase().includes("save")) {
      botReply = "Try saving at least 20% of your income. Automating savings helps!";
    } else if (input.toLowerCase().includes("invest")) {
      botReply = "Consider starting with safe index funds or SIPs for long-term growth.";
    } else if (input.toLowerCase().includes("debt")) {
      botReply = "Always pay off high-interest debt first before investing.";
    }

    setMessages([...messages, userMsg, { sender: "bot", text: botReply }]);
    setInput("");
  };

  return (
    <div>
      <h3>🤖 Finance Chatbot</h3>
      <div className="chat-box card p-3 mb-3" style={{height: "300px", overflowY: "auto"}}>
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "bot" ? "text-primary" : "text-success"}>
            <b>{m.sender === "bot" ? "Bot" : "You"}:</b> {m.text}
          </div>
        ))}
      </div>
      <div className="d-flex">
        <input className="form-control me-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chatbot;
