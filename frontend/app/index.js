import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [input, setInput] = useState({ temperature: "", humidity: "", wind: "" });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("http://127.0.0.1:5000/predict", {
      temperature: parseFloat(input.temperature),
      humidity: parseFloat(input.humidity),
      wind: parseFloat(input.wind)
    });
    setPrediction(response.data.prediction);
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Forest Fire Prediction</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="temperature"
          placeholder="Temperature"
          value={input.temperature}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          name="humidity"
          placeholder="Humidity"
          value={input.humidity}
          onChange={handleChange}
          required
        /><br /><br />
        <input
          name="wind"
          placeholder="Wind Speed"
          value={input.wind}
          onChange={handleChange}
          required
        /><br /><br />
        <button type="submit">Predict</button>
      </form>

      {prediction !== null && (
        <h2>Fire Risk Prediction: {prediction.toFixed(2)}</h2>
      )}
    </div>
  );
}

export { default } from "./page";
