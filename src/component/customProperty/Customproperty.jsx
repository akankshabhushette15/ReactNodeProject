import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import './customproperty.css';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Select, MenuItem, Snackbar, Alert } from "@mui/material";

const menuProps = {
  PaperProps: {
    style: {
      maxHeight: 200,
      marginTop: 10,
    },
  },
  getContentAnchorEl: null,
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
};

const Customproperty = () => {
  const [rows, setRows] = useState([]); // Initialize state without localStorage
  const [backendDestinations, setBackendDestinations] = useState([]);
  const [defaultDestinations, setDefaultDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [userData, setUserData] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false); // To control Snackbar visibility
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Snackbar message
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Snackbar severity (success or error)
    const navigate = useNavigate(); 

  useEffect(() => {
    const fetchBackendDestinations = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dataMapping");
        const data = response.data.applications.map((item) => item.destination);
        setBackendDestinations(data);
        console.log("data", response);
      } catch (error) {
        console.error("Error fetching destinations from backend:", error);
      }
    };

    fetchBackendDestinations();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/userData");
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const userDestinationValues = [
      userData.email,
      userData.employeetype,
      userData.employeeclass,
      userData.employeeid,
      userData.enddate,
      userData.firstname,
      userData.jobdescription,
      userData.lastname,
      userData.phonenumber,
      userData.siteid,
      userData.state,
      userData.street,
      userData.title,
      userData.username,
      "accountIdPath",
      "call",
      "successResponses",
      "unsuccessResponses",
    ];

    console.log("rows",rows)

    const filtered = userDestinationValues.filter(
      (destination) => !backendDestinations.includes(destination)
    );
    setFilteredDestinations(filtered);
    console.log("Filtered Destinations", filtered);
  }, [backendDestinations, userData]);

  const handleAddRow = () => {
    const updatedRows = [...rows, { Source: "", Type: "", Destination: "" }];
    setRows(updatedRows);
  };

  const handleRemoveRow = () => {
    if (rows.length > 0) {
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
      const response = await fetch(`http://localhost:5000/api/customProperty`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: rows }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response Data:", responseData);
        
        // Show success Snackbar
        setSnackbarMessage("Data submitted successfully!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);

        // Redirect to /data-mapping after 2 seconds
        setTimeout(() => {
          navigate("/data-mapping");
        }, 3000);
      } else {
        console.error("Failed to submit data:", response.status);
        
        // Show error Snackbar
        setSnackbarMessage("Failed to update data!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      
      // Show error Snackbar
      setSnackbarMessage("An error occurred while submitting data!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        margin: "10% 1px",
        width: "calc(100% - 2px)",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                flexGrow: 1,
                fontFamily: "Nunito, sans-serif",
                color: "#001f3d",
                fontWeight: "normal",
                fontSize: "18px",
                marginLeft: "16px",
              }}
            >
              Data Mapping
            </h3>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#459af5",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
              onClick={handleAddRow}
            >
              <i className="fa-solid fa-plus"></i>
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f44336",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginLeft: "10px",
              }}
              onClick={handleRemoveRow}
            >
              <i className="fa-solid fa-minus"></i>
            </Button>
          </div>

          <TableContainer component={Paper} style={{ maxHeight: "400px" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    Source
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    Type
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    Destination
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <TextField
                        value={row.Source}
                        onChange={(e) =>
                          handleRowChange(index, "Source", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={row.Type}
                        onChange={(e) =>
                          handleRowChange(index, "Type", e.target.value)
                        }
                        displayEmpty
                        variant="outlined"
                        size="small"
                        style={{ width: "150px" }}
                      >
                        <MenuItem value="">Select Type</MenuItem>
                        <MenuItem value="string">String</MenuItem>
                        <MenuItem value="Array">Array</MenuItem>
                        <MenuItem value="Object">Object</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                    <TextField
                        value={row.Destination}
                        onChange={(e) =>
                          handleRowChange(index, "Destination", e.target.value)
                        }
                        variant="outlined"
                        size="small"
                      />
                     
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ marginTop: "20px", display: "flex", marginLeft: "750px" }}>
            <a href="/data-mapping" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "#459af5",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  fontSize: "16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                Back
              </button>
            </a>
            <button
              style={{
                backgroundColor: "#459af5",
                color: "white",
                border: "none",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </section>

       <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position at the top center
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Customproperty;



