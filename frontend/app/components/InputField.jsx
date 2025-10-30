"use client";
import React from "react";

export default function InputField({ name, label, value, onChange }) {
  return (
    <label style={{ display: "block", fontSize: 14, color: "#0f172a" }}>
      <div style={{ marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <input
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="number"
        step="any"
        inputMode="decimal"
        placeholder={label}
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 10,
          border: "1px solid #e6eef8",
          background: "#fff",
          boxShadow: "inset 0 1px 2px rgba(15,23,42,0.03)"
        }}
      />
    </label>
  );
}
