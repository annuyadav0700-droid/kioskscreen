import React, { useState } from "react";
import axios from "axios";

function KioskApp() {
  const [screen, setScreen] = useState("welcome");
  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState("");

  // Start button click
  const handleStart = () => {
    setOrderCode("");
    setError("");
    setScreen("enterCode");
  };

  // Submit order code
  const handleSubmit = async () => {
    try {
      const res = await axios.post("https://a4stationbackend.onrender.com/verify-order", {
        code: orderCode,
      });

      if (res.data.valid) {
        setError("");

        const fileUrl = res.data.fileUrl; // Backend se file URL

        // Open file in new tab/window
        const printWindow = window.open(fileUrl, "_blank");

        // Wait for file to load then print
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();

          // After printing, go back to welcome screen
          printWindow.onafterprint = () => {
            setScreen("welcome");
          };
        };

      } else {
        setError("Invalid Order Code");
      }
    } catch (err) {
      setError("Error verifying order");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "100px" }}>
      {screen === "welcome" && (
        <div>
          <h1>Welcome to A4Station</h1>
          <button
            onClick={handleStart}
            style={{ fontSize: "24px", padding: "20px 40px", cursor: "pointer" }}
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
            style={{ fontSize: "24px", padding: "10px", width: "300px" }}
          />
          <br />
          <button
            onClick={handleSubmit}
            style={{ fontSize: "24px", padding: "15px 30px", marginTop: "20px", cursor: "pointer" }}
          >
            Submit
          </button>
          {error && <p style={{ color: "red", fontSize: "20px" }}>{error}</p>}
        </div>
      )}
    </div>
  );
}

export default KioskApp;
