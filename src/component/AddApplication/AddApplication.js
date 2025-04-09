import React, { useState, useEffect } from "react";
import './addApplication.css'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  TextareaAutosize,
  Typography,
  Box,Snackbar,Alert
} from "@mui/material";

const ApplicationForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [apiCount, setApiCount] = useState(0);  // Ensure apiCount is initialized to 0
  const [apiFields, setApiFields] = useState([]);
  const [employee, setEmployee] = useState(''); // Store API details
  const [userId, setUserId] = useState("");
  const [showAppType, setShowAppType] = useState(false);
  const [showAggregation, setShowAggregation] = useState(false);
  const [showEntitlement, setShowEntitlement] = useState(false);
  const [entitlementFields, setEntitlementFields] = useState([]); // New state for entitlement fields
  const [applicationStatus, setSubmitted] = useState('');
  const steps = ["Application Question", "Application Details", "Entitlement Detail"];

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [formValues, setFormValues] = useState({
    appName: "",
    appConnectedDisconnected: "",
    appType: "",
    dataAggregation: "",
    entitlementCount: 1,
    entitlements: [],
    beRequestable: "no", // Default value for 'Is the Application Requestable?'
    userAPI: "",
    groupAPI: "",
    createAccount: "",
    updateAccount: "",
    enableAccount: "",
    disableAccount: "",
    deleteAccount: "",
    addAccess: "",
    removeAccess: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Get JWT token from local storage

    if (!token) {
      console.error("User is not logged in");
      return;
    }
    getUser(token);
  }, []);

  const getUser = (token) => {
    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the Authorization header
      })
      .then((response) => {
        const userData = response.data;
        setUserId(userData._id);
        console.log("userData", userData)

      })
      .catch((error) => console.error("Error fetching user data:", error));
  };

  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));

    if (name === "appConnectedDisconnected") {
      setShowAppType(value === "Connected");
    }

    if (name === "dataAggregation") {
      setShowAggregation(value === "yes");
    }

    if (name === "beRequestable") {
      setShowEntitlement(value === "yes");
    }

    if (name === "apiCount") {
      const count = Number(value);
      setApiCount(count);
      setApiFields(Array.from({ length: count }, () => ({ name: "", description: "" })));
    }

    if (name === "entitlementCount") {
      const count = Number(value);
      setEntitlementFields(Array.from({ length: count }, () => ({ name: "", addAccess: "", removeAccess: "" })));
    }
  };

  const handleApiFieldChange = (index, field, value) => {
    const updatedFields = [...apiFields];
    updatedFields[index][field] = value;
    setApiFields(updatedFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted('submited');
    console.log("applicationStatus", applicationStatus);
  
    const data = {
      ...formValues,
      apiFields,
      entitlementFields,
      userId,
      applicationStatus: 'submitted',
    };
  
    try {
      const response = await fetch("http://localhost:5000/api/createApplication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Check if the response is not OK (non-200 status code)
      if (!response.ok) {
        const result = await response.json();
        
        if (response.status === 400 && result.message.includes('Application with this appName already exists')) {
          // If the error status is 400 and the message indicates that the app name already exists
          setSnackbarMessage("Application name already exists, please try with another name.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        } else {
          // For other errors
          setSnackbarMessage("Failed to create data. Please try again.");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }
        return;  // Exit the function if there's an error
      }
  
      const result = await response.json();
      // If the response is OK, show success message
      setSnackbarMessage("Data Created successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
  
      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/applicationlist");
      }, 3000);
  
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };
  

  const handleEntitlementFieldChange = (index, field, value) => {
    const updatedFields = [...entitlementFields];
    updatedFields[index][field] = value;
    setEntitlementFields(updatedFields);
  };

  const renderApiFields = () =>
    apiFields.map((_, index) => (
      <Box key={index} sx={{ marginBottom: 2 }}>
        <Typography variant="h6">API {index + 1}</Typography>
        <TextField
          fullWidth
          label={`API Name`}
          variant="outlined"
          sx={{ marginBottom: 2 }}
          value={apiFields[index].name}
          onChange={(e) => handleApiFieldChange(index, "name", e.target.value)}
        />
        <TextareaAutosize
          placeholder={`Enter JSON`}
          minRows={3}
          style={{ width: "100%", marginBottom: "10px" }}
          value={apiFields[index].description}
          onChange={(e) => handleApiFieldChange(index, "description", e.target.value)}
        />
      </Box>
    ));

  const renderEntitlementFields = () =>
    entitlementFields.map((_, index) => (
      <Box key={index} sx={{ marginBottom: 4 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Entitlement Type {index + 1}
        </Typography>
        <TextField
          fullWidth
          label={`Enter Entitlement Type ${index + 1}`}
          variant="outlined"
          sx={{ marginBottom: 2 }}
          value={entitlementFields[index].name}
          onChange={(e) => handleEntitlementFieldChange(index, "name", e.target.value)}
        />
        <TextareaAutosize
          placeholder={`Add Access API for Entitlement Type ${index + 1}`}
          minRows={3}
          style={{ width: "100%", marginBottom: "10px" }}
          value={entitlementFields[index].addAccess}
          onChange={(e) => handleEntitlementFieldChange(index, "addAccess", e.target.value)}
        />
        <TextareaAutosize
          placeholder={`Remove Access API for Entitlement Type ${index + 1}`}
          minRows={3}
          style={{ width: "100%", marginBottom: "20px" }}
          value={entitlementFields[index].removeAccess}
          onChange={(e) => handleEntitlementFieldChange(index, "removeAccess", e.target.value)}
        />
      </Box>
    ));

  return (
    <div className="main-div">
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ marginBottom: 3 ,fontFamily: "'Nunito', sans-serif",
        color: "#001f3d",
        fontWeight: "450",
        fontSize: "16px",}}>
        Application Form
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel className="label">{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ marginTop: 3 }}>
        {activeStep === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Application Name"
              name="appName"
              value={formValues.appName}
              onChange={handleInputChange}
              variant="outlined"
              sx={{ marginBottom: 2,fontSize:'16px',fontWeight:'400' }}
            />
           
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel>Select Connection Status</InputLabel>
                <Select
                  name="appConnectedDisconnected"
                  value={formValues.appConnectedDisconnected}
                  onChange={handleInputChange}
                  label="Select Connection Status"
                >
                  <MenuItem value="Connected">Connected</MenuItem>
                  <MenuItem value="Disconnected">Disconnected</MenuItem>
                </Select>
              </FormControl>
              {showAppType && (
                <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                  <InputLabel>Application Type</InputLabel>
                  <Select
                    name="appType"
                    value={formValues.appType}
                    onChange={handleInputChange}
                    label="Application Type"
                  >
                    <MenuItem value="REST">REST</MenuItem>
                    <MenuItem value="LDAP">LDAP</MenuItem>
                    <MenuItem value="JDBC-DB">JDBC-DB</MenuItem>
                    <MenuItem value="SAP">SAP</MenuItem>
                    <MenuItem value="SOAP">SOAP</MenuItem>
                  </Select>
                </FormControl>
              )}
              <Button variant="contained" onClick={handleNext} sx={{ marginRight: 2, backgroundColor: '#459af5' }}>
                Next
              </Button>
              <Button variant="contained" onClick={handleBack} sx={{ marginRight: 2, backgroundColor: '#459af5' }}>
                Cancel
              </Button>
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
                <InputLabel>Data Aggregation</InputLabel>
                <Select
                  name="dataAggregation"
                  value={formValues.dataAggregation}
                  onChange={handleInputChange}
                  label="Data Aggregation"
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </Select>
                {showAggregation && (
                  <Box sx={{ marginTop: 2 }}>
                    <TextField
                      fullWidth
                      label="UserAPI"
                      name="userAPI"
                      value={formValues.userAPI}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />
                    <TextField
                      fullWidth
                      label="Group API"
                      name="groupAPI"
                      value={formValues.groupAPI}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />
                    </Box>
)}
<Box sx={{ marginTop: 2 }}>
                    <TextField
                      fullWidth
                      label="Create Account"
                      name="createAccount"
                      value={formValues.createAccount}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />

                    <TextField
                      fullWidth
                      label="Update Account"
                      name="updateAccount"
                      value={formValues.updateAccount}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />

                    <TextField
                      fullWidth
                      label="Enable Account"
                      name="enableAccount"
                      value={formValues.enableAccount}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />

                    <TextField
                      fullWidth
                      label="Disable Account"
                      name="disableAccount"
                      value={formValues.disableAccount}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />

                    <TextField
                      fullWidth
                      label="Delete Account"
                      name="deleteAccount"
                      value={formValues.deletAccount}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />

                    <TextField
                      fullWidth
                      label="Add Access"
                      name="addAccess"
                      value={formValues.addAccess}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />

                    <TextField
                      fullWidth
                      label="Remove Access"
                      name="removeAccess"
                      value={formValues.removeAccess}
                      onChange={handleInputChange}
                      variant="outlined"
                      sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
                    />
                  </Box>
                
              </FormControl>
              <Button variant="contained" onClick={handleBack} sx={{ marginRight: 2, backgroundColor: '#459af5' }}>
                Back
              </Button>
              <Button variant="contained" onClick={handleNext} sx={{ marginRight: 2, backgroundColor: '#459af5' }}>
                Next
              </Button>
            </Box>
          )}
          {activeStep === 2 && (
            <Box>
              {renderApiFields()}
              <Button variant="contained" onClick={handleBack} sx={{ marginRight: 2, backgroundColor: '#459af5' }}>
                Back
              </Button>
              <Button
                variant="contained"

                onClick={handleSubmit}
                sx={{ backgroundColor: '#459af5' }}
              >
                Submit
              </Button>
            </Box>
          )}
        </Box>
      </Box>
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

export default ApplicationForm;
