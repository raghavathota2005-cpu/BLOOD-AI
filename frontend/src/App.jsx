import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import RegisterDonor from "./pages/RegisterDonor";
import BloodRequest from "./pages/BloodRequest";
import HospitalRegister from "./pages/HospitalRegister";
import Prediction from "./pages/Prediction";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DonorMatching from "./pages/DonorMatching";

import "./App.css";

function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((response) => response.json())
      .then((result) => setData(result))
      .catch((error) => console.log("Dashboard error:", error));
  }, []);

  return (
    <div className="home-page">

      <nav className="navbar">
        <h2>🩸 BLOOD AI</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/register">Register Donor</Link>
          <Link to="/matching">Find Donors</Link>
          <Link to="/request">Blood Request</Link>
          <Link to="/hospital">Hospitals</Link>
          <Link to="/prediction">AI Prediction</Link>
          <Link to="/login">Admin Login</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Every Drop Can Save a Life</h1>

          <p>
            BLOOD AI is an AI-powered blood donation and
            emergency management project.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Become a Donor
            </Link>

            <Link to="/matching" className="secondary-btn">
              Find Donors
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <h2>Our Impact</h2>

        <div className="stats-container">

          <div className="stat-card">
            <h3>{data?.total_donors ?? 0}</h3>
            <p>Registered Donors</p>
          </div>

          <div className="stat-card">
            <h3>{data?.total_requests ?? 0}</h3>
            <p>Blood Requests</p>
          </div>

          <div className="stat-card">
            <h3>{data?.total_hospitals ?? 0}</h3>
            <p>Registered Hospitals</p>
          </div>

        </div>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>

        <div className="services-container">

          <div className="service-card">
            <h3>🩸 Donor Registration</h3>
            <p>Register as a blood donor using our platform.</p>
            <Link to="/register">Register Now →</Link>
          </div>

          <div className="service-card">
            <h3>🔍 Smart Donor Matching</h3>
            <p>Search donor records by blood group and location.</p>
            <Link to="/matching">Find Donors →</Link>
          </div>

          <div className="service-card">
            <h3>🚨 Blood Requests</h3>
            <p>Submit and record blood requirements.</p>
            <Link to="/request">Create Request →</Link>
          </div>

          <div className="service-card">
            <h3>🏥 Hospital Registration</h3>
            <p>Register hospitals for admin verification.</p>
            <Link to="/hospital">Register Hospital →</Link>
          </div>

          <div className="service-card">
            <h3>🤖 AI Demand Prediction</h3>
            <p>Explore experimental blood demand predictions.</p>
            <Link to="/prediction">View Prediction →</Link>
          </div>

          <div className="service-card">
            <h3>📊 Project Dashboard</h3>
            <p>View project statistics and available records.</p>
            <Link to="/dashboard">View Dashboard →</Link>
          </div>

        </div>
      </section>

      <footer className="footer">
        <h3>🩸 BLOOD AI</h3>
        <p>AI Powered Blood Donation and Emergency Management System</p>
        <p>© 2026 BLOOD AI | Academic Project Demo</p>
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<RegisterDonor />} />

        <Route path="/matching" element={<DonorMatching />} />

        <Route path="/request" element={<BloodRequest />} />

        <Route path="/hospital" element={<HospitalRegister />} />

        <Route path="/prediction" element={<Prediction />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;