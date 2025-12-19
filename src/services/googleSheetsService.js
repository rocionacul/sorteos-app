// Google Sheets API Service
// Note: This is a simplified version that works with public sheets
// For full OAuth integration, you would need to set up Google Cloud Console credentials

export const fetchGoogleSheetData = async (sheetId) => {
  try {
    // For public sheets, we can use a simple fetch approach
    // This works if the sheet is published to the web
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        "Failed to fetch sheet data. Make sure the sheet is public or shared."
      );
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error("Error fetching Google Sheet:", error);
    throw new Error(
      "Unable to fetch data from Google Sheets. Please ensure the sheet is public or try manual upload."
    );
  }
};

const parseCSV = (csvText) => {
  const lines = csvText.split("\n");
  const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      data.push(row);
    }
  }

  return { headers, data };
};

export const extractSheetId = (url) => {
  const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

export const validateGoogleSheetsUrl = (url) => {
  return url.includes("docs.google.com/spreadsheets/d/");
};
