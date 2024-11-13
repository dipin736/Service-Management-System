import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPlus } from "react-icons/fa";
import "./Dashboard.css";
import AddNewDialog from "./AddNewDialog";
import { baseUrl } from "../environment/Baseurl";
import axios from "axios";
import {SalesReport} from "./salesReport";



const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState(null);

  const fetchReport = () => {
    if (!fromDate || !toDate) return; // Ensure dates are set

    axios
      .post(`${baseUrl}report/getSaleReport`, null, {
        params: { fromDate, toDate },
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log('Report data:', response.data.Response); 
        setReportData(response.data.Response);
  
      })
      .catch((error) => console.error("Error fetching report:", error));
  };

  useEffect(() => {
    fetchReport();
  }, [fromDate, toDate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToHome = () => {
    navigate("/dashboard");
  };

  const handleAddNew = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSidebarToggle = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("show");
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="dashboard">
      <aside className={`sidebar ${isMobile ? "" : "show"}`}>
        {isMobile && (
          <button className="toggle-sidebar" onClick={handleSidebarToggle}>
            ☰
          </button>
        )}
        <button className="home-button" onClick={goToHome}>
          Home
        </button>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>
      <main className="content">
        <div className="header">
          <h1>Welcome to the Service Management System</h1>
          <button className="add-new-button" onClick={handleAddNew}>
            <FaPlus /> Add New
          </button>
        </div>

        <div className="date-filters-container">
          <label>
            From Date:
            <input
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </label>
          <label>
            To Date:
            <input
              type="datetime-local"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </label>
          <button className="add-new-button" onClick={fetchReport}>
            View Report
          </button>
        </div>

        {/* Display Report Data */}
        {reportData && <SalesReport reportData={reportData}/>}

        <AddNewDialog open={open} onClose={handleClose} />
      </main>
    </div>
  );
};

export default Dashboard;
