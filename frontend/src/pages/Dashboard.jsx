import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import API_URL from "../api";
import "./Dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard`);

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.detail || "Unable to load dashboard");
        }

        setData(result);
      } catch (err) {
        setError(err.message || "Unable to connect to backend");
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <h2 className="dashboard-error">{error}</h2>;
  }

  if (!data) {
    return <h2 className="dashboard-loading">Loading Dashboard...</h2>;
  }

  const recentDonors = data.recent_donors || [];
  const recentRequests = data.recent_requests || [];

  const bloodGroups = [
    "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"
  ];

  const bloodGroupCounts = bloodGroups.map((group) =>
    recentDonors.filter(
      (donor) => donor.blood_group?.toUpperCase() === group
    ).length
  );

  const chartData = {
    labels: bloodGroups,
    datasets: [
      {
        data: bloodGroupCounts,
        backgroundColor: [
          "#dc2626",
          "#f97316",
          "#2563eb",
          "#9333ea",
          "#16a34a",
          "#0891b2",
          "#e11d48",
          "#64748b"
        ],
        borderWidth: 2,
        borderColor: "#ffffff"
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="dashboard-heading">
        <h1>🩸 BLOOD AI Dashboard</h1>
        <p>Blood Donation Management Overview</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>{data.total_donors}</h2>
          <p>Total Donors</p>
        </div>

        <div className="dashboard-card">
          <h2>{data.total_requests}</h2>
          <p>Blood Requests</p>
        </div>

        <div className="dashboard-card">
          <h2>{data.total_hospitals}</h2>
          <p>Registered Hospitals</p>
        </div>
      </div>

      <div className="chart-section">
        <h2>Blood Group Distribution</h2>

        <div className="chart-box">
          <Doughnut
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom"
                }
              }
            }}
          />
        </div>

        <p className="chart-note">
          Distribution is calculated from the recent donor records returned by the API.
        </p>
      </div>

      <h2 className="section-title">Recent Donors</h2>

      <div className="dashboard-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Group</th>
              <th>Location</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentDonors.map((donor) => (
              <tr key={donor._id}>
                <td>{donor.full_name}</td>
                <td>{donor.blood_group}</td>
                <td>{donor.location}</td>
                <td>{donor.availability_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="section-title">Recent Blood Requests</h2>

      <div className="dashboard-table">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Blood Group</th>
              <th>Units</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {recentRequests.map((request) => (
              <tr key={request._id}>
                <td>{request.patient_name}</td>
                <td>{request.blood_group}</td>
                <td>{request.units_required}</td>
                <td>{request.priority}</td>
                <td>{request.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;