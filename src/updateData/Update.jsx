import React, { useState, useEffect } from "react";
import {  useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";
import axios from 'axios';
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
  Box,
  Snackbar,
  Alert
} from "@mui/material";

const Update = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [apiCount, setApiCount] = useState(0);  // Ensure apiCount is initialized to 0
  const [apiFields, setApiFields] = useState([]);

  // To access the current URL


  const location = useLocation();

  // Extracting query parameters
  const queryParams = new URLSearchParams(location.search);
  const paramsObject = {};

  queryParams.forEach((value, key) => {
    paramsObject[key] = value;
  });

  const [showAppType, setShowAppType] = useState(false);
  const [showAggregation, setShowAggregation] = useState(false);
  const [showEntitlement, setShowEntitlement] = useState(false);
  const [entitlementFields, setEntitlementFields] = useState([]); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const steps = ["Application Question", "Application Details", "Entitlement Detail"];




  const [formValues, setFormValues] = useState({
    appName: paramsObject.appName || "",
    appConnectedDisconnected: paramsObject.appConnectedDisconnected || "",
    appType: paramsObject.appType || "",
    dataAggregation: paramsObject.dataAggregation || "",
    entitlementCount: paramsObject.entitlementCount ? parseInt(paramsObject.entitlementCount) : 1,
    entitlements: paramsObject.entitlements ? JSON.parse(paramsObject.entitlements) : [],
    beRequestable: paramsObject.beRequestable || "no", // Default value for 'Is the Application Requestable?'
    userAPI: paramsObject.userAPI || "",
    groupAPI: paramsObject.groupAPI || "",
    createAccount: paramsObject.createAccount || "",
    updateAccount: paramsObject.updateAccount || "",
    enableAccount: paramsObject.enableAccount || "",
    disableAccount: paramsObject.disableAccount || "",
    deletAccount: paramsObject.deletAccount || "",
    addAccess: paramsObject.addAccess || "",
    removeAccess: paramsObject.removeAccess || "",
  });


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
      setShowEntitlement(value === "No");
    }

    if (name === "apiCount") {
      const count = Number(value);
      setApiCount(count);
      setApiFields(Array.from({ length: count }, () => ({ name: "", description: "" })));
    }

     if (name === "dataAggregation") {
      setShowAggregation(value === "yes");
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


  console.log("Extracted Parameters:", paramsObject);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      ...formValues,
      apiFields,
      entitlementFields,

    };

    try {
      const response = await fetch(`http://localhost:5000/applications/${paramsObject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.json();
      setSnackbarMessage("Data updated successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/applicationlist");
      }, 3000);

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form.");
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
        <Typography variant="h4" sx={{ marginBottom: 3 }}>
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
                sx={{ marginBottom: 2, fontSize: '16px', fontWeight: '400' }}
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
                  </Box>)}
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
            Update
          </Button>
        </Box>
      )}
    </Box>
    </Box >

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
    </div >
  );
};

export default Update;
