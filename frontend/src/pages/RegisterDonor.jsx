import React, { useState } from "react";
import "./RegisterDonor.css";

function RegisterDonor() {
  const [formData, setFormData] = useState({
    full_name: "",
    age: "",
    blood_group: "O+",
    phone: "",
    location: "",
    last_donation_date: "",
    availability_status: "available",
    consent_to_contact: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/donors/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            age: Number(formData.age)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(JSON.stringify(data.detail));
        return;
      }

      alert("Donor registered successfully!");
    } catch (error) {
      alert("Cannot connect to backend. Check whether it is running.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🩸 BLOOD AI</h1>
        <h2>Donor Registration</h2>
        <p>Join our blood donation community</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="full_name" value={formData.full_name}
              onChange={handleChange} placeholder="Enter your name" required />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" min="18" max="120"
              value={formData.age} onChange={handleChange}
              placeholder="Enter your age" required />
          </div>

          <div className="form-group">
            <label>Blood Group</label>
            <select name="blood_group" value={formData.blood_group}
              onChange={handleChange}>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group =>
                <option key={group} value={group}>{group}</option>
              )}
            </select>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input name="phone" value={formData.phone}
              onChange={handleChange} placeholder="Enter phone number" required />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input name="location" value={formData.location}
              onChange={handleChange} placeholder="Enter your city" required />
          </div>

          <div className="form-group">
            <label>Last Donation Date (Optional)</label>
            <input type="date" name="last_donation_date"
              value={formData.last_donation_date} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select name="availability_status"
              value={formData.availability_status} onChange={handleChange}>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>

          <label className="consent">
            <input type="checkbox" name="consent_to_contact"
              checked={formData.consent_to_contact} onChange={handleChange} />
            I consent to being contacted about donation requests.
          </label>

          <button type="submit" className="register-btn">
            Register as Donor
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterDonor;