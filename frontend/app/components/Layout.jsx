"use client";
import React from "react";

export default function Layout({ children }) {
  return (
    <div style={{
      maxWidth: 940,
      margin: "36px auto",
      padding: 22,
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      color: "#0f172a",
      background: "#fbfdff",
      borderRadius: 12
    }}>
      <header style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 14, color: "#64748b", fontWeight: 600 }}>Forest Fire Classifier</div>
      </header>
      <main>{children}</main>
    </div>
  );
}
