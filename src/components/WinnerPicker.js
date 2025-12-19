import React, { useState } from "react";

const WinnerPicker = ({ students, onStudentsUpdate }) => {
  const [isPicking, setIsPicking] = useState(false);
  const [currentWinner, setCurrentWinner] = useState(null);
  const [showWinner, setShowWinner] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(""), 5000);
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const selectAllStudents = () => {
    setSelectedStudents(students.map((student) => student.id));
  };

  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };

  const pickWinner = () => {
    const availableStudents =
      selectedStudents.length > 0
        ? students.filter((student) => selectedStudents.includes(student.id))
        : students;

    if (availableStudents.length < 2) {
      showMessage(
        "Please select at least 2 students to pick a winner!",
        "error"
      );
      return;
    }

    if (isPicking) return;

    setIsPicking(true);
    setShowWinner(false);
    setCurrentWinner(null);

    // Animated selection process
    let counter = 0;
    const maxCount = 30;
    const interval = setInterval(() => {
      const randomStudent =
        availableStudents[Math.floor(Math.random() * availableStudents.length)];
      setCurrentWinner(randomStudent);
      counter++;

      if (counter >= maxCount) {
        clearInterval(interval);

        // Final winner
        const finalWinner =
          availableStudents[
            Math.floor(Math.random() * availableStudents.length)
          ];
        setCurrentWinner(finalWinner);
        setShowWinner(true);
        setIsPicking(false);

        // Create confetti effect
        createConfetti();

        showMessage(`🎉 ${finalWinner.name} is the winner!`, "success");
      }
    }, 100);
  };

  const createConfetti = () => {
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div");
        confetti.className = "confetti";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.backgroundColor = `hsl(${
          Math.random() * 360
        }, 70%, 50%)`;
        confetti.style.animationDuration = Math.random() * 2 + 1 + "s";
        document.body.appendChild(confetti);

        setTimeout(() => {
          confetti.remove();
        }, 3000);
      }, i * 50);
    }
  };

  const removeWinner = (studentId) => {
    const updatedStudents = students.filter(
      (student) => student.id !== studentId
    );
    onStudentsUpdate(updatedStudents);
    setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    showMessage("Student removed from list", "success");
  };

  const resetWinner = () => {
    setCurrentWinner(null);
    setShowWinner(false);
  };

  const getSelectedCount = () => {
    return selectedStudents.length > 0
      ? selectedStudents.length
      : students.length;
  };

  return (
    <div className="component-container">
      <h2 className="component-title">🎯 Student Picker</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      {students.length === 0 ? (
        <div className="section">
          <h3>No Students Available</h3>
          <p>
            Please upload your student list first using the Excel Upload
            feature.
          </p>
        </div>
      ) : (
        <>
          <div className="section">
            <h3>Select Participants</h3>
            <p>
              Choose which students should participate in the drawing, or leave
              all selected for everyone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                flexWrap: "wrap",
              }}
            >
              <button
                className="btn btn-success btn-small"
                onClick={selectAllStudents}
              >
                ✅ Select All
              </button>
              <button
                className="btn btn-secondary btn-small"
                onClick={deselectAllStudents}
              >
                ❌ Deselect All
              </button>
            </div>

            <div className="students-list">
              {students.map((student) => (
                <div
                  key={student.id}
                  className={`student-card ${
                    selectedStudents.length === 0 ||
                    selectedStudents.includes(student.id)
                      ? "selected"
                      : "unselected"
                  }`}
                  style={{
                    opacity:
                      selectedStudents.length === 0 ||
                      selectedStudents.includes(student.id)
                        ? 1
                        : 0.5,
                    cursor: "pointer",
                  }}
                  onClick={() => toggleStudentSelection(student.id)}
                >
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                    {student.email && (
                      <div className="student-email">{student.email}</div>
                    )}
                  </div>
                  <div className="student-actions">
                    {(selectedStudents.length === 0 ||
                      selectedStudents.includes(student.id)) && (
                      <span style={{ color: "#28a745", fontSize: "1.2rem" }}>
                        ✓
                      </span>
                    )}
                    <button
                      className="btn btn-danger btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeWinner(student.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>Pick a Winner</h3>
            <p>
              Ready to pick a winner from {getSelectedCount()} participant(s)?
            </p>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className="btn btn-warning"
                onClick={pickWinner}
                disabled={isPicking || getSelectedCount() < 2}
                style={{ fontSize: "1.2rem", padding: "15px 30px" }}
              >
                {isPicking ? (
                  <>
                    <span className="loading"></span>
                    🎲 Picking Winner...
                  </>
                ) : (
                  "🎯 Pick Winner"
                )}
              </button>

              {showWinner && (
                <button
                  className="btn btn-secondary"
                  onClick={resetWinner}
                  style={{ marginLeft: "10px" }}
                >
                  🔄 Pick Again
                </button>
              )}
            </div>
          </div>

          {showWinner && currentWinner && (
            <div className="winner-section show">
              <h2>🎊 Congratulations! 🎊</h2>
              <div className="winner-name">{currentWinner.name}</div>
              {currentWinner.email && (
                <div
                  style={{
                    fontSize: "1.1rem",
                    opacity: 0.9,
                    marginBottom: "10px",
                  }}
                >
                  {currentWinner.email}
                </div>
              )}
              <div className="winner-stats">
                Winner selected from {getSelectedCount()} participant(s)
              </div>
            </div>
          )}

          {isPicking && currentWinner && (
            <div className="winner-section show">
              <h2>🎲 Selecting Winner...</h2>
              <div className="winner-name">{currentWinner.name}</div>
              <div className="winner-stats">
                Keep watching to see the final winner!
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WinnerPicker;
