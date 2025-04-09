import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

const Updatedatamapping = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const navigate = useNavigate();

  const destinationQueryParam = queryParams.get("destination") || ""; // Get destination query param

  const [rows, setRows] = useState(() => {
    const source = queryParams.get("source") || "";
    const type = queryParams.get("type") || "";
    const destination = queryParams.get("destination") || "";
    const extraParams = {};

    for (const [key, value] of queryParams.entries()) {
      if (!["source", "type", "destination"].includes(key)) {
        extraParams[key] = value;
      }
    }

    return [{ Source: source, Type: type, Destination: destination, ...extraParams }];
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleAddRow = () => {
    const updatedRows = [...rows, { Source: "", Type: "", Destination: "" }];
    setRows(updatedRows);
  };

  const handleRemoveRow = () => {
    if (rows.length > 1) {
      const updatedRows = rows.slice(0, -1);
      setRows(updatedRows);
    }
  };

  const handleRowChange = (index, field, value) => {
    const updatedRows = rows.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/dataMapping/${destinationQueryParam}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: rows }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setSnackbarMessage("Data updated successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        setTimeout(() => {
          navigate("/data-mapping");
        }, 3000);
      } else {
        setSnackbarMessage("Failed to update data!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred while submitting data!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const renderExtraFields = (row, index) => {
    return Object.keys(row)
      .filter((key) => !["Source", "Type", "Destination"].includes(key))
      .map((key) => (
        <TableCell key={key} align="center">
          <TextField
            label={key}
            value={row[key] || ""}
            onChange={(e) => handleRowChange(index, key, e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
          />
        </TableCell>
      ));
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "row", margin: "10% 1px", width: "calc(100% - 2px)", boxSizing: "border-box" }}>
      <section style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px" }}>
        <div style={{ width: "100%", maxWidth: "1200px", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", borderRadius: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ flexGrow: 1, fontFamily: "Nunito, sans-serif", color: "#001f3d", fontWeight: "normal", fontSize: "18px", marginLeft: "16px" }}>
              Data Mapping
            </h3>
          </div>

          <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontSize: "16px" }}>Source</TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>Type</TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>Destination</TableCell>
                  {rows.length > 0 &&
                    Object.keys(rows[0])
                      .filter((key) => !["Source", "Type", "Destination"].includes(key))
                      .map((key) => (
                        <TableCell key={key} align="center" style={{ fontSize: "16px" }}>
                          {key}
                        </TableCell>
                      ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <TextField
                        value={row.Source}
                        onChange={(e) => handleRowChange(index, "Source", e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={row.Type}
                        onChange={(e) => handleRowChange(index, "Type", e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="small"
                        style={{ width: "150px" }}
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="string">string</MenuItem>
                        <MenuItem value="Array">Array</MenuItem>
                        <MenuItem value="Object">Object</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={row.Destination}
                        onChange={(e) => handleRowChange(index, "Destination", e.target.value)}
                        displayEmpty
                        variant="outlined"
                        size="small"
                        style={{ width: "150px" }}
                      >
                        <MenuItem value={destinationQueryParam}>{destinationQueryParam}</MenuItem>
                      </Select>
                    </TableCell>
                    {renderExtraFields(row, index)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: "20px", display: "flex", marginLeft: "750px" }}>
            <a href="/data-mapping" style={{ textDecoration: "none" }}>
              <button style={{ backgroundColor: "#459af5", color: "white", border: "none", padding: "10px 20px", fontSize: "16px", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>
                Back
              </button>
            </a>
            <button
              style={{ backgroundColor: "#459af5", color: "white", border: "none", padding: "10px 20px", fontSize: "16px", borderRadius: "5px", cursor: "pointer" }}
              onClick={handleSubmit}
            >
              Update
            </button>
          </div>
        </div>
      </section>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Updatedatamapping;
