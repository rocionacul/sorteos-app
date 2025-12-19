import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";

const QRCodeGenerator = ({ attendanceLink, onLinkUpdate }) => {
  const [link, setLink] = useState(attendanceLink);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    setLink(attendanceLink);
    setShowQR(!!attendanceLink);
  }, [attendanceLink]);

  const handleLinkChange = (e) => {
    const newLink = e.target.value;
    setLink(newLink);
    onLinkUpdate(newLink);
    setShowQR(!!newLink);
  };

  // eslint-disable-next-line no-unused-vars
  const generateSampleLink = () => {
    const sampleLink = "https://forms.google.com/your-attendance-form";
    setLink(sampleLink);
    onLinkUpdate(sampleLink);
    setShowQR(true);
  };

  const clearLink = () => {
    setLink("");
    onLinkUpdate("");
    setShowQR(false);
  };

  const downloadQR = () => {
    const svg = document.querySelector(".qr-code svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = "attendance-qr-code.png";
        downloadLink.href = pngFile;
        downloadLink.click();
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="component-container">
      <h2 className="component-title">📱 QR Code Generator</h2>

      <div className="section">
        <h3>Generate QR Code for Class Attendance</h3>

        <div className="form-group">
          <label htmlFor="attendanceLink">Attendance Form Link:</label>
          <input
            type="url"
            id="attendanceLink"
            value={link}
            onChange={handleLinkChange}
            placeholder="https://forms.google.com/your-attendance-form"
            required
          />
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* <button className="btn btn-success" onClick={generateSampleLink}>
            📝 Generate Sample Link
          </button> */}

          {showQR && (
            <button className="btn btn-secondary" onClick={downloadQR}>
              💾 Download QR Code
            </button>
          )}

          {link && (
            <button className="btn btn-danger" onClick={clearLink}>
              🗑️ Clear Link
            </button>
          )}
        </div>
      </div>

      {showQR && (
        <div className="qr-container">
          <h3>QR de asistencia</h3>
          <p>Escanea este QR con tu celular para marcar tu asistencia</p>

          <div className="qr-code">
            <QRCode
              value={link}
              size={256}
              level="H"
              includeMargin={true}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>

          <div style={{ marginTop: "20px" }}>
            <strong>Link:</strong> {link}
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeGenerator;
