import React, { useState } from "react";
import {
  fetchGoogleSheetData,
  extractSheetId,
  validateGoogleSheetsUrl,
} from "../services/googleSheetsService";
import {
  validateExcelUrl,
  fetchExcelRowsFromUrl,
  parseExcelFile,
} from "../services/excelService";

const GoogleSheetsIntegration = ({ students, onStudentsUpdate }) => {
  const [sheetUrl, setSheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleFetchFromUrl = async () => {
    if (!sheetUrl.trim()) {
      showMessage("Please enter a Google Sheets or Excel URL", "error");
      return;
    }

    setIsLoading(true);
    try {
      let newStudents = [];

      if (validateGoogleSheetsUrl(sheetUrl)) {
        const sheetId = extractSheetId(sheetUrl);
        if (!sheetId) {
          showMessage(
            "Could not extract Google Sheet ID from URL. Please check the format.",
            "error"
          );
          return;
        }

        const { data } = await fetchGoogleSheetData(sheetId);
        if (data.length === 0) {
          showMessage(
            "No data found in the Google Sheet. Please check if the sheet has responses.",
            "error"
          );
          return;
        }

        for (let i = 0; i < data.length; i++) {
          const row = data[i];
          const rowValues = Object.values(row);
          const firstName = rowValues[2] || "";
          const lastName = rowValues[3] || "";
          if (firstName.trim()) {
            const fullName = lastName.trim()
              ? `${firstName.trim()} ${lastName.trim()}`.trim()
              : firstName.trim();
            newStudents.push({
              id: Date.now() + i,
              name: fullName,
              email: "",
            });
          }
        }
      } else if (validateExcelUrl(sheetUrl)) {
        const { headers, rows } = await fetchExcelRowsFromUrl(sheetUrl);
        if (!rows || rows.length === 0) {
          showMessage(
            "No data found in the Excel file (first sheet).",
            "error"
          );
          return;
        }
        const nombreIndexFromHeader = Array.isArray(headers)
          ? headers.findIndex(
              (h) => (h || "").toString().trim().toLowerCase() === "nombre"
            )
          : -1;
        const nombreIndex =
          nombreIndexFromHeader !== -1 ? nombreIndexFromHeader : 5;
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i] || [];
          const nombre = (row[nombreIndex] || "").toString().trim();
          if (nombre) {
            newStudents.push({
              id: Date.now() + i,
              name: nombre,
              email: "",
            });
          }
        }
      } else {
        showMessage(
          "Invalid link. Provide a Google Sheets URL or a public direct .xlsx link.",
          "error"
        );
        return;
      }

      if (newStudents.length === 0) {
        showMessage(
          "No valid student names found in columns C and D.",
          "error"
        );
        return;
      }

      onStudentsUpdate(newStudents);
      showMessage(
        `Successfully imported ${newStudents.length} students!`,
        "success"
      );
    } catch (error) {
      showMessage("Error fetching data: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setIsLoading(true);
    try {
      const { headers, rows } = await parseExcelFile(file);
      if (!rows || rows.length === 0) {
        showMessage("No data found in the Excel file (first sheet).", "error");
        return;
      }

      const newStudents = [];
      const nombreIndexFromHeader = Array.isArray(headers)
        ? headers.findIndex(
            (h) => (h || "").toString().trim().toLowerCase() === "nombre"
          )
        : -1;
      const nombreIndex =
        nombreIndexFromHeader !== -1 ? nombreIndexFromHeader : 5;
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i] || [];
        const nombre = (row[nombreIndex] || "").toString().trim();
        if (nombre) {
          newStudents.push({
            id: Date.now() + i,
            name: nombre,
            email: "",
          });
        }
      }

      if (newStudents.length === 0) {
        showMessage(
          "No valid student names found (expected 'Nombre' in column 6 for Excel).",
          "error"
        );
        return;
      }

      onStudentsUpdate(newStudents);
      showMessage(
        `Successfully imported ${newStudents.length} students from Excel file!`,
        "success"
      );
    } catch (error) {
      showMessage("Error reading Excel file: " + error.message, "error");
    } finally {
      setIsLoading(false);
      e.target.value = "";
    }
  };

  const removeStudent = (studentId) => {
    const updatedStudents = students.filter(
      (student) => student.id !== studentId
    );
    onStudentsUpdate(updatedStudents);
    showMessage("Student removed successfully", "success");
  };

  const clearAllStudents = () => {
    if (window.confirm("Are you sure you want to remove all students?")) {
      onStudentsUpdate([]);
      showMessage("All students removed", "success");
    }
  };

  return (
    <div className="component-container">
      <h2 className="component-title">📊 Student List</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <div className="section">
        <h3>Import Students from File or Link</h3>
        <div className="form-group" style={{ marginBottom: "14px" }}>
          <label htmlFor="excelFile">Excel file (.xlsx or .xls):</label>
          <input
            type="file"
            id="excelFile"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileUpload}
            disabled={isLoading}
            style={{ marginTop: "6px" }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="sheetUrl">Google Sheets or Excel URL:</label>
          <input
            type="url"
            id="sheetUrl"
            value={sheetUrl}
            onChange={(e) => setSheetUrl(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/ID/edit or https://example.com/file.xlsx"
            style={{ marginBottom: "10px" }}
          />
          <button
            className="btn btn-success"
            onClick={handleFetchFromUrl}
            disabled={isLoading || !sheetUrl.trim()}
          >
            {isLoading ? (
              <>
                <span className="loading"></span>
                📥 Importing...
              </>
            ) : (
              "📥 Import Students"
            )}
          </button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="section">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3>Student List ({students.length} students)</h3>
            <button
              className="btn btn-danger btn-small"
              onClick={clearAllStudents}
            >
              🗑️ Clear All
            </button>
          </div>

          <div className="students-list">
            {students.map((student) => (
              <div key={student.id} className="student-card">
                <div className="student-info">
                  <div className="student-name">{student.name}</div>
                  {student.email && (
                    <div className="student-email">{student.email}</div>
                  )}
                </div>
                <div className="student-actions">
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => removeStudent(student.id)}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleSheetsIntegration;
