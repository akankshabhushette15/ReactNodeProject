import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  IconButton,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null); // Logged-in user details
  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("User is not logged in");
        return;
      }

      try {
        // Fetch logged-in user data
        const userResponse = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loggedInUser = userResponse.data;
        setUser(loggedInUser);
       

        // Fetch all applications
        const appResponse = await axios.get("http://localhost:5000/api/applications");
        const appData = appResponse.data.applications;

        // Filter applications by user role
        const userApplications =
          loggedInUser.role === "admin"
            ? appData // Admin sees all applications
            : appData.filter((app) => app.userId1 === loggedInUser._id); // Normal user sees their applications only

        setApplications(appData);
        setFilteredApplications(userApplications);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteApplication/${id}`);
      setApplications((prev) => prev.filter((item) => item._id !== id));
      setFilteredApplications((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  // Handle edit operation
  const handleEdit = (row) => {
    console.log("Edit clicked for:", row);
    const queryParams = new URLSearchParams(row).toString();
    navigate(`/update?${queryParams}`);
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const updatedFilteredApps = applications.filter((app) =>
      app.appName.toLowerCase().includes(query)
    );

    const finalFilteredApps =
      user?.role === "admin"
        ? updatedFilteredApps
        : updatedFilteredApps.filter((app) => app.userId1 === user._id);

    setFilteredApplications(finalFilteredApps);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row",
        margin: "10% 1% 10% 1%",
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
            <h2 style={{ flexGrow: 1 ,fontFamily: "'Nunito', sans-serif",
        color: "#001f3d",
        fontWeight: "450",
        fontSize: "16px",}}>Application List</h2>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search"
              onChange={handleSearch}
              value={searchQuery}
              style={{ marginRight: "20px" }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: "#459af5", color: "#fff" ,fontFamily: "'Nunito', sans-serif",
                fontWeight: "450",
                fontSize: "16px",
                textTransform: "none"
              }}
              component={Link}
              to="/AddApplication"
            >
              Add Application
            </Button>
          </div>

          <TableContainer component={Paper} style={{ maxHeight: "400px", fontFamily: "'Nunito', sans-serif",
        color: "#001f3d",
        fontWeight: "450",
        fontSize: "16px", }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Application Type</TableCell>
                  <TableCell>Application Status</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredApplications
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.appName}</TableCell>
                      <TableCell>{row.appType}</TableCell>
                      <TableCell>{row.applicationStatus}</TableCell>
                      <TableCell>{row.appConnectedDisconnected}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(row)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(row._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredApplications.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </section>
    </div>
  );
};

export default ApplicationList;
