import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function KioskApp() {
  const [screen, setScreen] = useState("welcome");
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setOrderCode("");
    setError("");
    setScreen("enterCode");
  };

  const handleSubmit = async () => {
    if (!orderCode) return;

    setLoading(true);
    setError("");

    try {
      // 🔹 Backend verify
      const res = await axios.post(
        "https://a4stationbackend.onrender.com/verify-order",
        { code: orderCode }
      );

      if (!res.data.valid) {
        setError("❌ Invalid Order Code");
        setLoading(false);
        return;
      }

      const fileUrl = res.data.fileUrl;

      // 🔹 Backend will trigger print, no popup needed
      
      // Show success screen
      setScreen("success");

      // Go back to welcome screen after 5 seconds
      setTimeout(() => {
        setScreen("welcome");
      }, 5000);

    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className="kiosk-container">
      {screen === "welcome" && (
        <div className="card fade-in">
          <h1 className="title">A4Station <span className="highlight">Kiosk</span></h1>
          <p className="subtitle">Touch to start printing your documents securely</p>
          <button className="btn-primary pulse" onClick={handleStart}>
            Start Printing
          </button>
        </div>
      )}

      {screen === "enterCode" && (
        <div className="card fade-in">
          <h2 className="title">Enter Order Code</h2>
          <p className="subtitle">Please enter the order code generated on your phone</p>

          <input
            type="text"
            className="code-input"
            value={orderCode}
            placeholder="e.g. 123456"
            onChange={(e) => setOrderCode(e.target.value)}
            autoFocus
          />

          <div className="action-buttons">
            <button className="btn-secondary" onClick={() => setScreen("welcome")}>
              Back
            </button>
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={loading || !orderCode}
            >
              {loading ? <span className="spinner"></span> : "Print Now"}
            </button>
          </div>

          {error && (
            <div className="error-message fade-in">
              {error}
            </div>
          )}
        </div>
      )}

      {screen === "success" && (
        <div className="card fade-in success-card">
          <div className="success-icon">✓</div>
          <h2 className="title text-success">Order Verified</h2>
          <p className="subtitle">Your document is now printing!</p>
          <p className="small-text">Please collect your pages below.</p>
        </div>
      )}
    </div>
  );
}

export default KioskApp;