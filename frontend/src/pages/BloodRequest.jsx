import React, { useState } from "react";
import API_URL from "../api";

function BloodRequest() {
  const initialFormData = {
    patient_name: "",
    blood_group: "O+",
    units_required: 1,
    hospital_name: "",
    location: "",
    contact_number: "",
    priority: "normal",
    status: "pending"
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/requests/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          units_required: Number(formData.units_required)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail || "Request failed")
        );
      }

      alert("Blood Request Submitted Successfully!");
      setFormData(initialFormData);

    } catch (error) {
      alert(error.message || "Cannot connect to backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🩸 BLOOD AI</h1>
        <h2>Blood Request Form</h2>
        <p>Submit your blood requirement details</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Name</label>
            <input
              name="patient_name"
              value={formData.patient_name}
              onChange={handleChange}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
            >
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Units Required</label>
            <input
              type="number"
              name="units_required"
              min="1"
              max="20"
              value={formData.units_required}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Hospital Name</label>
            <input
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              placeholder="Enter hospital name"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />
          </div>

          <div className="form-group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
            />
          </div>

          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="normal">Normal</option>
              <option value="urgent">Urgent</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <button
            type="submit"
            className="register-btn"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Blood Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BloodRequest;