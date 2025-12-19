import * as XLSX from "xlsx";

export const validateExcelUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();

    if (pathname.endsWith(".xlsx") || pathname.endsWith(".xls")) {
      return true;
    }

    const format = parsed.searchParams.get("format");
    if (format && format.toLowerCase() === "xlsx") {
      return true;
    }

    const isKnownHost =
      parsed.host.includes("onedrive") ||
      parsed.host.includes("1drv.ms") ||
      parsed.host.includes("sharepoint") ||
      parsed.host.includes("dropbox");
    const isDownload = parsed.searchParams.get("download") === "1";
    if (isKnownHost && isDownload) {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false;
};

export const fetchExcelRowsFromUrl = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      "Failed to download the Excel file. Ensure the link is public and CORS-enabled."
    );
  }
  const arrayBuffer = await response.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { headers: [], rows: [] };
  }
  const worksheet = workbook.Sheets[firstSheetName];
  const rows2D = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!rows2D || rows2D.length === 0) {
    return { headers: [], rows: [] };
  }

  const [headersRow, ...rows] = rows2D;
  return { headers: headersRow, rows };
};

export const parseExcelFile = async (file) => {
  if (!file) {
    throw new Error("No file provided.");
  }
  const name = file.name?.toLowerCase?.() || "";
  if (!name.endsWith(".xlsx") && !name.endsWith(".xls")) {
    throw new Error("Please select an Excel file (.xlsx or .xls).");
  }

  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    return { headers: [], rows: [] };
  }
  const worksheet = workbook.Sheets[firstSheetName];
  const rows2D = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!rows2D || rows2D.length === 0) {
    return { headers: [], rows: [] };
  }

  const [headersRow, ...rows] = rows2D;
  return { headers: headersRow, rows };
};
