"use client";
import React from "react";

export default function PredictInfo() {
  return (
    <div style={{ maxWidth: 760, margin: "48px auto", padding: 20 }}>
      <h2 style={{ marginTop: 0 }}>Prediction API</h2>
      <p style={{ color: "#475569" }}>
        The frontend uses the internal API at /api/predict which proxies to your Flask backend.
        Use the main form on the home page to send predictions.
      </p>
    </div>
  );
}
