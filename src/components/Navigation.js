import React from "react";

const Navigation = ({ currentView, onViewChange, studentCount }) => {
  return (
    <nav className="navigation">
      <button
        className={`nav-button ${currentView === "qr" ? "active" : ""}`}
        onClick={() => onViewChange("qr")}
      >
        📱 QR Code Generator
      </button>

      <button
        className={`nav-button ${currentView === "google" ? "active" : ""}`}
        onClick={() => onViewChange("google")}
      >
        📊 Student List
        {studentCount > 0 && <span className="count">{studentCount}</span>}
      </button>

      <button
        className={`nav-button ${currentView === "picker" ? "active" : ""}`}
        onClick={() => onViewChange("picker")}
      >
        🎯 Student Picker
        {studentCount > 0 && <span className="count">{studentCount}</span>}
      </button>
    </nav>
  );
};

export default Navigation;
