import { useState } from "react";
import API_URL from "../api";
import "./DonorMatching.css";

function DonorMatching() {
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [location, setLocation] = useState("");
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const findDonors = async (e) => {
    e.preventDefault();

    if (!location.trim()) {
      setError("Please enter a location.");
      return;
    }

    setLoading(true);
    setError("");
    setDonors([]);
    setSearched(false);

    try {
      const response = await fetch(
        `${API_URL}/donors/match?blood_group=${encodeURIComponent(
          bloodGroup
        )}&location=${encodeURIComponent(location.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to find donors.");
      }

      setDonors(data.matching_donors || []);
      setSearched(true);

    } catch (err) {
      setError(err.message || "Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="matching-page">
      <header className="matching-header">
        <h1>🩸 BLOOD AI</h1>
        <p>Smart Donor Matching System</p>
      </header>

      <section className="matching-container">
        <h2>Find Blood Donors</h2>

        <p className="matching-description">
          Search available donor records using blood group and location.
        </p>

        <form onSubmit={findDonors} className="matching-form">
          <label>Required Blood Group</label>

          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
          >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
              (group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              )
            )}
          </select>

          <label>Location</label>

          <input
            type="text"
            placeholder="Enter city e.g. Hyderabad"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Find Donors"}
          </button>
        </form>

        {error && <p className="matching-error">{error}</p>}

        {searched && (
          <div className="matching-results">
            <h2>Matching Results</h2>

            <p className="result-count">
              Total Matching Records: {donors.length}
            </p>

            {donors.length === 0 ? (
              <p className="no-donors">
                No matching donor records found.
              </p>
            ) : (
              <div className="donor-grid">
                {donors.map((donor) => (
                  <div className="donor-card" key={donor.donor_id}>
                    <div className="blood-icon">
                      {donor.blood_group}
                    </div>

                    <h3>{donor.name}</h3>

                    <p>
                      <strong>Blood Group:</strong> {donor.blood_group}
                    </p>

                    <p>
                      <strong>Location:</strong> {donor.location}
                    </p>

                    <span className="verification-status">
                      {donor.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <p className="matching-note">
          Donor records are preliminary matches only. Blood compatibility,
          donor eligibility and availability must be confirmed by qualified
          blood-bank professionals.
        </p>
      </section>
    </div>
  );
}

export default DonorMatching;