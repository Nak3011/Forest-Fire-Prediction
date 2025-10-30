"use client";
import React from "react";

export default function ResultCard({ label, probability }) {
  const positive = String(label).toLowerCase() === "yes";
  return (
    <div style={{
      display: "inline-block",
      padding: 18,
      borderRadius: 12,
      background: positive ? "#fff7f7" : "#f7fbff",
      border: "1px solid",
      borderColor: positive ? "#ffdede" : "#dceeff",
      minWidth: 260,
      textAlign: "center",
      boxShadow: "0 6px 18px rgba(2,6,23,0.06)"
    }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: positive ? "#8b2323" : "#0b63d6" }}>
        {positive ? "Fire Risk: YES" : "Fire Risk: NO"}
      </div>
      {typeof probability === "number" && (
        <div style={{ marginTop: 8, color: "#334155" }}>
          Confidence: {(probability * 100).toFixed(1)}%
        </div>
      )}
    </div>
  );
}
