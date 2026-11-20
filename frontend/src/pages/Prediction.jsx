import React, { useState } from "react";
import "./Prediction.css";

function Prediction() {
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [day, setDay] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bloodGroups = [
    "A+", "A-", "B+", "B-",
    "AB+", "AB-", "O+", "O-"
  ];

  const handlePrediction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/prediction/demand?blood_group=${encodeURIComponent(bloodGroup)}&day=${day}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Prediction failed");
      }

      setResult(data.prediction);

    } catch (error) {
      setError(error.message || "Cannot connect to backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <div className="prediction-card">

        <h1>🩸 BLOOD AI</h1>
        <h2>AI Blood Demand Prediction</h2>

        <p className="prediction-subtitle">
          Experimental Blood Demand Estimation System
        </p>

        <form onSubmit={handlePrediction}>

          <div className="form-group">
            <label>Select Blood Group</label>

            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
            >
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select Day (1–365)</label>

            <input
              type="number"
              min="1"
              max="365"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="prediction-btn"
            disabled={loading}
          >
            {loading ? "Predicting..." : "Predict Blood Demand"}
          </button>

        </form>

        {error && (
          <div className="prediction-error">
            {error}
          </div>
        )}

        {result && (
          <div className="prediction-result">
            <h3>📊 Prediction Result</h3>

            <p>
              Blood Group:
              <strong> {result.blood_group}</strong>
            </p>

            <p>
              Estimated Demand:
              <strong> {result.predicted_demand}</strong>
            </p>

            <small>{result.note}</small>
          </div>
        )}

        <div className="prediction-info">
          <h3>Supported Blood Groups</h3>
          <div className="blood-group-list">
            {bloodGroups.map((group) => (
              <span key={group}>{group}</span>
            ))}
          </div>
        </div>

        <p className="prediction-disclaimer">
          Note: This is an experimental academic prediction.
          It is not a substitute for real hospital blood-stock
          information or medical decisions.
        </p>

      </div>
    </div>
  );
}

export default Prediction;