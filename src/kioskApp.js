import React, { useState } from "react";
import axios from "axios";

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

      // 🔹 Method 1 (Best): iframe print
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.right = "0";
      iframe.style.bottom = "0";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.src = fileUrl;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }, 500);
      };

      alert("✅ File loaded. Please confirm print.");

      // 🔹 वापस welcome
      setTimeout(() => {
        setScreen("welcome");
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      {screen === "welcome" && (
        <div>
          <h1>Welcome to A4Station</h1>
          <button
            onClick={handleStart}
            style={{
              fontSize: "24px",
              padding: "20px 40px",
              cursor: "pointer",
            }}
          >
            Start
          </button>
        </div>
      )}

      {screen === "enterCode" && (
        <div>
          <h2>Enter Order Code</h2>

          <input
            type="text"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
            style={{
              fontSize: "24px",
              padding: "10px",
              width: "300px",
              textAlign: "center",
            }}
          />

          <br />

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              fontSize: "24px",
              padding: "15px 30px",
              marginTop: "20px",
              cursor: "pointer",
            }}
          >
            {loading ? "Checking..." : "Submit"}
          </button>

          {error && (
            <p style={{ color: "red", fontSize: "20px" }}>{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default KioskApp;