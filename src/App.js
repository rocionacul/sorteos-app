import React, { useState, useEffect } from "react";
import "./App.css";
import QRCodeGenerator from "./components/QRCodeGenerator";
import GoogleSheetsIntegration from "./components/GoogleSheetsIntegration";
import WinnerPicker from "./components/WinnerPicker";
import Navigation from "./components/Navigation";

function App() {
  const [currentView, setCurrentView] = useState("qr");
  const [students, setStudents] = useState([]);
  const [attendanceLink, setAttendanceLink] = useState("");

  // Load data from localStorage on app start
  useEffect(() => {
    const savedStudents = localStorage.getItem("sorteosStudents");
    const savedLink = localStorage.getItem("sorteosAttendanceLink");

    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    if (savedLink) {
      setAttendanceLink(savedLink);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sorteosStudents", JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    if (attendanceLink) {
      localStorage.setItem("sorteosAttendanceLink", attendanceLink);
    }
  }, [attendanceLink]);

  const handleStudentsUpdate = (newStudents) => {
    setStudents(newStudents);
  };

  const handleAttendanceLinkUpdate = (newLink) => {
    setAttendanceLink(newLink);
  };

  return (
    <div className="App">
      <div className="app-container">
        <header className="app-header">
          <h1>Class Management Suite</h1>
          <p>Manage your class attendance and pick winners easily!</p>
        </header>

        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          studentCount={students.length}
        />

        <main className="app-main">
          {currentView === "qr" && (
            <QRCodeGenerator
              attendanceLink={attendanceLink}
              onLinkUpdate={handleAttendanceLinkUpdate}
            />
          )}

          {currentView === "google" && (
            <GoogleSheetsIntegration
              students={students}
              onStudentsUpdate={handleStudentsUpdate}
            />
          )}

          {currentView === "picker" && (
            <WinnerPicker
              students={students}
              onStudentsUpdate={handleStudentsUpdate}
            />
          )}
        </main>

        <footer className="app-footer">
          <p>Made with ❤️ for teachers and students</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
