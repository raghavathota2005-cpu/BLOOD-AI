import { useEffect, useState } from "react";
import API_URL from "../api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchDashboard = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Unable to load dashboard");
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please login as admin first.");
      return;
    }

    fetchDashboard();
  }, [token]);

  const handleVerification = async (hospitalId, action) => {
    setLoadingId(hospitalId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/admin/hospitals/${hospitalId}/${action}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Action failed");
      }

      setMessage(result.message);
      await fetchDashboard();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingId("");
    }
  };

  if (error && !data) {
    return <div className="admin-message">{error}</div>;
  }

  if (!data) {
    return <div className="admin-message">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>🩸 BLOOD AI</h1>
      <h2>Admin Dashboard</h2>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-stats">
        <div className="admin-card">
          <h3>{data.total_donors}</h3>
          <p>Total Donors</p>
        </div>

        <div className="admin-card">
          <h3>{data.total_requests}</h3>
          <p>Blood Requests</p>
        </div>

        <div className="admin-card">
          <h3>{data.total_hospitals}</h3>
          <p>Total Hospitals</p>
        </div>
      </div>

      <h2>Hospital Registrations</h2>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Hospital</th>
              <th>City</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data.hospitals.map((hospital) => (
              <tr key={hospital._id}>
                <td>{hospital.hospital_name}</td>
                <td>{hospital.city}</td>
                <td>{hospital.email}</td>
                <td>{hospital.verification_status}</td>

                <td>
                  {hospital.verification_status === "pending" ? (
                    <>
                      <button
                        className="verify-btn"
                        disabled={loadingId === hospital._id}
                        onClick={() =>
                          handleVerification(hospital._id, "verify")
                        }
                      >
                        Verify
                      </button>

                      <button
                        className="reject-btn"
                        disabled={loadingId === hospital._id}
                        onClick={() =>
                          handleVerification(hospital._id, "reject")
                        }
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("adminToken");
          window.location.href = "/login";
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;