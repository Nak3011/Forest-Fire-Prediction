"use client";
import { useState } from "react";
import InputField from "./components/InputField";
import ResultCard from "./components/ResultCard";
import Layout from "./components/Layout";

export default function Home() {
  const featureKeys = [
    { key: "temp", label: "Temperature" },
    { key: "RH", label: "Humidity (RH)" },
    { key: "wind", label: "Wind Speed" },
    { key: "rain", label: "Rain" },
    { key: "FFMC", label: "FFMC" },
    { key: "DMC", label: "DMC" },
    { key: "DC", label: "DC" },
    { key: "ISI", label: "ISI" },
    { key: "month", label: "Month (numeric)" },
    { key: "day", label: "Day (numeric)" },
    { key: "area", label: "Area" },
    { key: "region", label: "Region (numeric)" }
  ];

  const [input, setInput] = useState(
    Object.fromEntries(featureKeys.map(f => [f.key, ""]))
  );
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => {
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Build numeric body
    const body = {};
    for (const f of featureKeys) {
      const v = parseFloat(input[f.key]);
      if (Number.isNaN(v)) {
        setError(`Invalid numeric value for ${f.label}`);
        return;
      }
      body[f.key] = v;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Prediction request failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResult({
        label: data.label,
        probability: typeof data.probability === "number" ? data.probability : null
      });
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 style={{ marginBottom: 8 }}>Forest Fire Classifier</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Enter the 12 features and get a Yes / No prediction with confidence.
      </p>

      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 720 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 12
        }}>
          {featureKeys.map((f, idx) => (
            <InputField
              key={f.key}
              name={f.key}
              label={f.label}
              value={input[f.key]}
              onChange={(val) => handleChange(f.key, val)}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 18px",
              border: "none",
              background: "#0f172a",
              color: "white",
              borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600
            }}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>

          <button
            type="button"
            onClick={() => {
              setInput(Object.fromEntries(featureKeys.map(f => [f.key, ""])));
              setResult(null);
              setError("");
            }}
            style={{
              padding: "10px 12px",
              border: "1px solid #e6eef8",
              background: "white",
              borderRadius: 8,
              cursor: "pointer"
            }}
          >
            Reset
          </button>

          {error && <div style={{ color: "crimson", marginLeft: 8 }}>{error}</div>}
        </div>
      </form>

      <div style={{ marginTop: 20 }}>
        {result && <ResultCard label={result.label} probability={result.probability} />}
      </div>
    </Layout>
  );
}
