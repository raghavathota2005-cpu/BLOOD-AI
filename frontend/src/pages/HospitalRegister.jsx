import React, { useState } from "react";

function HospitalRegister() {
  const [formData, setFormData] = useState({
    hospital_name: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    available_blood_groups: []
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBloodGroup = (e) => {
    const { value, checked } = e.target;

    setFormData((previous) => ({
      ...previous,
      available_blood_groups: checked
        ? [...previous.available_blood_groups, value]
        : previous.available_blood_groups.filter((group) => group !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/hospitals/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(JSON.stringify(data.detail));
        return;
      }

      alert("Hospital Registered Successfully! Verification Pending.");

      setFormData({
        hospital_name: "",
        address: "",
        city: "",
        phone: "",
        email: "",
        available_blood_groups: []
      });

    } catch (error) {
      alert("Cannot connect to backend!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>🏥 BLOOD AI</h1>
        <h2>Hospital Registration</h2>
        <p>Connect your hospital with BLOOD AI</p>

        <form onSubmit={handleSubmit}>

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
            <label>Address</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter hospital address"
              required
            />
          </div>

          <div className="form-group">
            <label>City</label>
            <input
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter city"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="form-group">
            <label>Available Blood Groups</label>

            <div className="blood-groups">
              {bloodGroups.map((group) => (
                <label key={group}>
                  <input
                    type="checkbox"
                    value={group}
                    checked={formData.available_blood_groups.includes(group)}
                    onChange={handleBloodGroup}
                  />
                  {group}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="register-btn">
            Register Hospital
          </button>

        </form>
      </div>
    </div>
  );
}

export default HospitalRegister;
