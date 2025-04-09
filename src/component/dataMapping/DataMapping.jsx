import React, { useState, useEffect } from "react";
import './datamapping.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";

const DataMapping = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dataMapping");
        setApplications(response.data.applications); // Update state with fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Error fetching data"); // Set error if there's an issue
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("applicationdata",applications)
  const handleDelete = async (destination) => {
    try {
   
      await axios.delete(`http://localhost:5000/api/dataMapping/${destination}`);
      
      setApplications((prev) =>
        prev.filter((application) => application.destination !== destination)
      );
    } catch (error) {
      console.error("Error deleting data:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
            maxWidth: "1500px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
            borderRadius: "8px",
            overflowX: "auto",
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
                fontFamily: "Arial, sans-serif",
                fontSize: "18px",
                fontWeight: "400",
                color: "#001f3d",
                margin: "0",
              }}
            >
              Data Mapping{" "}
             
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
    component={Link}
    to="/mapping"
  >
    <i className="fa-solid fa-plus"></i> New Data
  </Button>

  <Button
    variant="contained"
    sx={{
      backgroundColor: "#459af5",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginLeft: "16px",  // Add some gap between the buttons
    }}
    component={Link}
    to="/customproperty"
  >
    CUSTOM PROPERTY
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
                    Destination
                  </TableCell>
                  <TableCell align="center" style={{ fontSize: "16px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {applications.map((row, index) => (
    <TableRow key={index}>
      <TableCell align="center">{row.source}</TableCell>
      <TableCell align="center">{row.destination}</TableCell>
      <TableCell align="center">
        {/* Anchor tag with raw query parameters */}
        <a
          href={`/updatedatamapping?destination=${row.destination}&source=${row.source}&type=${row.type}`}
        >
          <i
            className="fa-solid fa-pencil"
            style={{
              marginRight: "12px",
              cursor: "pointer",
              color: "#459af5",
              fontSize:"18px"
            }}
          ></i>
        </a>

         <i
          className="fa-solid fa-trash"
          style={{
            cursor: "pointer",
            color: "#f00",
          }}
          onClick={() => handleDelete(row.destination)} 
        ></i> 
      </TableCell>
    </TableRow>
  ))}
</TableBody>

            </Table>
          </TableContainer>
        </div>
      </section>
    </div>
  );
};

export default DataMapping;
