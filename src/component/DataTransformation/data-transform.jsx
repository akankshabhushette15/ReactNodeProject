import React, { useState, useEffect } from 'react';
import './data-transform.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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



// Reusable InputField component
const InputField = ({ value, onChange, placeholder }) => (
  <div className="input-field">
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="form-control"
      placeholder={placeholder}
    />
  </div>
);

// Reusable SelectDropdown component
const SelectDropdown = ({ value, onChange, options, label }) => (
  <div className="input-group">
    <select value={value} onChange={onChange} className="form-control">
      <option value="" disabled>
        {label}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);


const DataTransformation = () => {
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedAPI, setSelectedAPI] = useState('');
  const [jsonInput, setJsonInput] = useState('');
  const [output, setOutput] = useState('');
  const [output1, setOutput1] = useState('');
  const [url, setUrl] = useState('');
  const [httpMethod, setHttpMethod] = useState('');
  const [connection, setConnection] = useState('');
  const [successResponse, setSuccessResponse] = useState('');
  const [httpContentType, setHttpContentType] = useState('');
  const [applications, setApplications] = useState([]); // State to store applications
  const [applications1, setApplications1] = useState([]);
  const [backendData, setbackendData] = useState([]);
  const [loading, setLoading] = useState(true);


  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");


  const [error, setError] = useState(null)
  const [apiOptions, setApiOptions] = useState([
    'User API',
    'Group API',
    'Create Account',
    'Update Account',
    'Enable Account',
    'Disable Account',
    'Delete account',
    'Add Access',
    'Remove Access'
  ]);

  const [selectedAPIData, setSelectedAPIData] = useState(null); // State to store selected API data
  const [parsedAPIData, setParsedAPIData] = useState(null);
  const [TransformData1, setTransformData1] = useState([]); // State to store parsed API data

  const navigate = useNavigate();

  const handleMappingsClick = () => {
    navigate('/data-mapping'); // Programmatically navigate to /mappings
  };


  useEffect(() => {
    const fetchApplications1 = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications'); // Correct URL for the API
        const data = await response.json();
        console.log('Fetched Data:', data); // Log to verify the response structure

        if (data && data) {
          setTransformData1(data); // Set full application objects to TransformData1 state
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications1();
  }, []);
  console.log("fetcheddata", TransformData1)




  // Fetch applications on component mount
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/applications'); // Correct URL for the API
        const data = await response.json();
        console.log(data.applications);
        if (data.applications) {
          setApplications(data.applications); // Set full application objects to applications state
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  console.log("fetchdata2", applications)
  // This effect runs when selectedApplication or selectedAPI changes
  useEffect(() => {
    // Reset fields when application or API changes
    setUrl('');
    setHttpMethod('');
    setConnection('');
    setSuccessResponse('');
    setHttpContentType('');
    setJsonInput(''); // Clear the JSON input as well
    setSelectedAPIData(null); // Reset the selected API data
    setOutput(null)

    if (selectedApplication) {
      const selectedApp = applications.find(app => app.appName === selectedApplication);
      if (selectedApp) {
        // Set the selected API data based on the selected API and application
        let apiData = null;

        if (selectedAPI === 'User API' && selectedApp.userAPI) {
          apiData = selectedApp.userAPI;
        } else if (selectedAPI === 'Group API' && selectedApp.groupAPI) {
          apiData = selectedApp.groupAPI;
        } else if (selectedAPI === 'Create Account' && selectedApp.createAccount) {
          apiData = selectedApp.createAccount;
        } else if (selectedAPI === 'Update Account' && selectedApp.updateAccount) {
          apiData = selectedApp.updateAccount;
        } else if (selectedAPI === 'Enable Account' && selectedApp.enableAccount) {
          apiData = selectedApp.enableAccount;
        } else if (selectedAPI === 'Disable Account' && selectedApp.disableAccount) {
          apiData = selectedApp.disableAccount;
        } else if (selectedAPI === 'Delete account' && selectedApp.deletAccount) {
          apiData = selectedApp.deletAccount;
        } else if (selectedAPI === 'Add Access' && selectedApp.addAccess) {
          apiData = selectedApp.addAccess;
        } else if (selectedAPI === 'Remove Access' && selectedApp.removeAccess) {
          apiData = selectedApp.removeAccess;
        }


        if (apiData) {
          setSelectedAPIData(apiData); // Store the API data in selectedAPIData
          setJsonInput(JSON.stringify(apiData, null, 2)); // Set the JSON input based on the API data
        }
        console.log("selectedAPI", selectedAPI)
      }
    }
  }, [selectedApplication, selectedAPI, applications]);


  useEffect(() => {
    if (selectedApplication) {
      const selectedApp = applications.find(app => app.appName === selectedApplication);

      if (selectedApp) {
        // Check application status
        if (selectedApp.applicationStatus === "approved" || selectedApp.applicationStatus === "In progress") {
          let apiData = null;

          // Set API data based on selected API and application
          if (selectedAPI === 'Create Account' && selectedApp.TransformedcreateAccout) {
            apiData = selectedApp.TransformedcreateAccout;
          } else if (selectedAPI === 'Update Account' && selectedApp.TransformedupdateAccout) {
            apiData = selectedApp.TransformedupdateAccout;
          } else if (selectedAPI === 'Enable Account' && selectedApp.TransformedenableAccout) {
            apiData = selectedApp.TransformedenableAccout;
          } else if (selectedAPI === 'Disable Account' && selectedApp.TransformedisableAccout) {
            apiData = selectedApp.TransformedisableAccout;
          } else if (selectedAPI === 'Delete account' && selectedApp.TransformedeleteAccout) {
            apiData = selectedApp.TransformedeleteAccout;
          } else if (selectedAPI === 'Add Access' && selectedApp.TransformedaddAccess) {
            apiData = selectedApp.TransformedaddAccess;
          } else if (selectedAPI === 'Remove Access' && selectedApp.TransformedremoveAccess) {
            apiData = selectedApp.TransformedremoveAccess;
          }

          // Parse `apiData` if it's a string
          if (typeof apiData === 'string') {
            try {
              apiData = JSON.parse(apiData.replace(/\\n/g, ''));
            } catch (error) {
              console.error("Failed to parse apiData:", error);
              apiData = null; // Handle error gracefully
            }
          }

          // Check if `apiData` is valid and extract required fields
          if (apiData) {
            const firstCall = apiData.call?.[0];
            if (firstCall) {
              const extractedUrl = firstCall.url || null;
              const extractedHttpMethod = firstCall.httpMethod || null;
              const extractedConnection = firstCall.connection || null;
              const extractedSuccessResponses = firstCall.successResponses?.statusCode || [];
              const extractedHttpContentType = firstCall.httpContentType || null;

              if (extractedUrl) setUrl(extractedUrl);
              if (extractedHttpMethod) setHttpMethod(extractedHttpMethod);
              if (extractedConnection) setConnection(extractedConnection);
              if (extractedSuccessResponses.length > 0) setSuccessResponse(extractedSuccessResponses);
              if (extractedHttpContentType) setHttpContentType(extractedHttpContentType);
            }


            setOutput1(JSON.stringify(apiData, null, 2));
          }
        }
      }
    }
  }, [selectedApplication, selectedAPI, applications]);




  // Parse the JSON string in selectedAPIData
  useEffect(() => {
    if (selectedAPIData) {
      try {
        const parsedData = JSON.parse(selectedAPIData);
        setParsedAPIData(parsedData); // Store parsed data
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  }, [selectedAPIData]); // This will run whenever selectedAPIData changes

  useEffect(() => {
    if (parsedAPIData) {
      console.log('Parsed API Data:', parsedAPIData?.data?.[0]?.Username); // Log the parsed data
    }
  }, [parsedAPIData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dataMapping");
        setApplications1(response.data.applications); // Update state with fetched data
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        setError("Error fetching data"); // Set error if there's an issue
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  console.log("datamapping", applications1)

  const fetchBackendData = async () => {
    const response = await axios.get('http://localhost:5000/api/dataMapping1');
    return response.data;
  };

  const getDestinationValue = (backendData, key) => {
    const normalizedKey = key.toLowerCase().replace(/\s+/g, '');
    for (const app of backendData.applications) {
      if (app.source && app.source[0].toLowerCase().replace(/\s+/g, '').includes(normalizedKey)) {
        return app.destination[0];
      }
    }
    return null;
  };

  const getDestinationValue4 = (backendData, key) => {
    for (const app of backendData.applications) {
      if (app.source && app.source[0] === key) {
        return app.destination[0];
      }
    }
    return null;
  };


  const getDestinationValue1 = (backendData, key) => {
    const normalizedKey = key.toLowerCase();
    for (const app of backendData.applications) {
      if (app.destination && app.destination[0].toLowerCase() === normalizedKey) {
        return app.source[0];
      }
    }
    return null;
  };

  const transformUserData = async (parsedAPIData, attributeMap, selectedAPI) => {
    const backendData = await fetchBackendData();
    let httpParams = {
      headers: { "Type": parsedAPIData.headers.Type },
      data: []
    };

    const excludeAccountIdPathAndUnsuccessResponses = ['Enable Account', 'Disable Account', 'Delete account', "Add Access", 'Remove Access'].includes(selectedAPI);

    attributeMap.forEach((attribute) => {
      let backendValue = getDestinationValue(backendData, attribute);
      if (backendValue) {
        // Convert the attribute to lowercase if needed
        const normalizedAttribute = attribute.toLocaleLowerCase();

        if (normalizedAttribute === "modification type" && backendValue.includes(',')) {
          const values = backendValue.split(',');
          if (selectedAPI === 'Disable Account' || selectedAPI === 'Delete account') {
            httpParams.data.push({ "Modification Type": values[3] });
          } else if (selectedAPI === 'Enable Account') {
            httpParams.data.push({ "Modification Type": values[0] });
          }
        } else {

          if (normalizedAttribute === "username1" && ['Enable Account', 'Disable Account', 'Delete account', 'Create Account', 'Add Access', 'Remove Access', 'Update Account'].includes(selectedAPI)) {
            httpParams.data.push({ "Username": `\${${backendValue}}` });
          }

          else if (normalizedAttribute === "role name1" && ['Add Access', 'Remove Access'].includes(selectedAPI)) {
            httpParams.data.push({ "Role Name": `\${${backendValue}}` });
          } else {
            httpParams.data.push({ [attribute]: `\${${backendValue}}` });
          }
        }
      }
    });


    const formattedHttpParams = JSON.stringify({
      headers: { "Type": parsedAPIData.headers.Type },
      data: [Object.assign({}, ...httpParams.data)]
    })
      .replace(/"([a-zA-Z0-9 ]+)":/g, '"$1" :')
      .replace(/\${([^}]+)}/g, '${$1}')
      .replace(/,\s*\}/g, " }")
      .replace(/\s*\[/g, "[")
      .replace(/\\n/g, "");



    const result = {
      "accountIdPath": excludeAccountIdPathAndUnsuccessResponses ? undefined : getDestinationValue(backendData, 'accountIdPath'),
      "call": [
        {
          "name": getDestinationValue(backendData, "name1"),
          "callOrder": excludeAccountIdPathAndUnsuccessResponses ? undefined : getDestinationValue(backendData, "callOrder"),
          "connection": connection,
          "showResponse": excludeAccountIdPathAndUnsuccessResponses ? undefined : true,
          "url": url,
          "httpMethod": httpMethod,
          "httpParams": formattedHttpParams,
          "httpHeaders": {
            "Authorization": getDestinationValue(backendData, "authorization"),
            "Content-Type": excludeAccountIdPathAndUnsuccessResponses ? undefined : getDestinationValue(backendData, "Content-Type"),
            "Accept": getDestinationValue(backendData, "Accept")
          },
          "httpContentType": httpContentType,
          "successResponses": {

            "statusCode": (typeof successResponse === 'string' && successResponse.trim() !== '')
              ? JSON.parse(successResponse)
              : []
          },
          "unsuccessResponses": excludeAccountIdPathAndUnsuccessResponses
            ? undefined
            : {
              "statusCode": JSON.parse(getDestinationValue1(backendData, "unsuccessResponses"))
            }
        }
      ]
    };

    return result;
  };



  const transformUserData1 = async () => {
    const backendData = await fetchBackendData();


    const result = {
      accountParams: {
        connection: getDestinationValue(backendData, "connection"),
        processingType: getDestinationValue(backendData, 'processingType'),
        statusAndThresholdConfig: {
          inactivateAccountsNotInFile: JSON.parse(getDestinationValue(backendData, 'inactivateAccountsNotInFile')),
          accountThresholdValue: JSON.parse(getDestinationValue(backendData, 'accountThresholdValue'))
        },
        doNotChangeIfFailed: JSON.parse(getDestinationValue(backendData, 'doNotChangeIfFailed')),
        call: {
          call1: {
            callOrder: Number(getDestinationValue(backendData, 'callOrder')),
            stageNumber: Number(getDestinationValue(backendData, 'stageNumber')),
            http: {
              url: url,
              httpHeaders: {
                Accept: getDestinationValue(backendData, "Accept"),
                Authorization: getDestinationValue(backendData, "authorization")
              },
              httpMethod: httpMethod,
              httpContentType: httpContentType
            },
            listField: JSON.parse(JSON.parse(jsonInput)),
            keyField: getDestinationValue(backendData, " keyField"),

            colsToPropsMap: {
              accountID: getDestinationValue(backendData, "sample"),
              name: getDestinationValue4(backendData, "name"),
              displayName: getDestinationValue(backendData, "displayName"),
              status: getDestinationValue(backendData, "status"),
              customproperty31: getDestinationValue(backendData, "customproperty31")
            }
          }
        }
      },
      acctEntParams: {
        entTypes: {
          Role: {
            call: {
              call1: {
                processingType: getDestinationValue4(backendData, "processingType1"),
                connection: getDestinationValue(backendData, "connection"),
                listField: JSON.parse(JSON.parse(jsonInput)),
                acctKeyField: getDestinationValue(backendData, "acctKeyField"),
                entKeyField: getDestinationValue(backendData, " entKeyField"),
                acctIdPath: getDestinationValue(backendData, "acctIdPath"),
                entIdPath: getDestinationValue(backendData, "entIdPath"),
                http: {
                  url: url,
                  httpMethod: httpMethod,
                  httpContentType: httpContentType,
                  httpHeaders: {
                    Accept: getDestinationValue(backendData, "Accept")
                  }
                }
              }
            }
          }
        }
      }
    };




    return result;
  };



  const transformData = async () => {
    if (selectedAPI && parsedAPIData) {
      try {
        let transformedData = null;

        switch (selectedAPI) {
          case 'Create Account':
            transformedData = await transformUserData(parsedAPIData, [
              "Username1", "Employee ID", "First Name", "Last Name", "Email", "Phone Number", "Country", "City", "Role Name", "Default Legal Entity"
            ], selectedAPI);
            break;

          case 'Enable Account':
          case 'Disable Account':
          case 'Delete account':
            transformedData = await transformUserData(parsedAPIData, [
              "Modification Type", "Username1"
            ], selectedAPI);
            break;

          case 'Update Account':
            transformedData = await transformUserData(parsedAPIData, [
              "Username1", "First Name", "Last Name", "Email", "Phone Number", "Country"
            ], selectedAPI);
            break;

          case 'Add Access':
          case 'Remove Access':
            transformedData = await transformUserData(parsedAPIData, [
              "Username1", "Role Name1"
            ], selectedAPI);
            break;

          case 'User API':
            transformedData = await transformUserData1();
            console.log("transformedData", transformedData)
            break;


          default:
            console.log('Unknown API action');
            return;
        }

        setOutput(JSON.stringify(transformedData, null, 2));
      } catch (error) {
        console.error('Error processing data:', error);
      }
    } else {
      console.log('No parsed data or API selected');
    }
  };











  // Validate JSON
  const validateJSON = () => {
    try {
      JSON.parse(jsonInput);  // Attempt to parse the JSON input
      alert('Valid JSON!');    // If valid, show a success message
    } catch (error) {
      alert('Invalid JSON');   // If invalid, show an error message
    }
  };

  const saveOutput = async () => {
    console.log('Saving Output:', output);

    try {
      if (selectedApplication) {
        // Find the selected application
        const selectedApp = applications.find(app => app.appName === selectedApplication);

        if (!selectedApp) {
          alert('Selected application not found.');
          return;
        }

        console.log("selectedApp1", selectedApp.appName);

        // Update the application status to "approved"
        const updatedApplication = {
          selectedAPI,
          applicationStatus: 'approved',
          output
        };
        console.log("updatedApplication", updatedApplication);

        // Send the updated data to the backend
        const response = await fetch(`http://localhost:5000/api/applications/${selectedApp.appName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedApplication),
        });

        const data = await response.json();
        console.log("response data", data);

        if (response.ok) {
          setSnackbarMessage("Data updated successfully!");
          setSnackbarSeverity("success");
          setOpenSnackbar(true);
          setOutput('')

        } else {
          setSnackbarMessage("Failed to update data!");
          setSnackbarSeverity("error");
          setOpenSnackbar(true);
        }

      }
    } catch (error) {
      setSnackbarMessage("An error occurred while submitting data!");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };





  return (
    <div className="container">


      <div className="section-container">
        <div>
          <h3>Data Transformation</h3>
        </div>

        <div className="header">

          <SelectDropdown
            value={selectedApplication}
            onChange={(e) => {
              setSelectedApplication(e.target.value);
              setSelectedAPI(''); // Reset the API dropdown when the application changes
            }}
            options={applications.map(app => app.appName)}  // Use the application names for dropdown
            label="Select your application"
          />

          {selectedApplication && (
            <div className="header-api">
              <SelectDropdown
                value={selectedAPI}
                onChange={(e) => setSelectedAPI(e.target.value)}
                options={apiOptions}
                label="Select API"
              />
              <button className="btn" onClick={handleMappingsClick}>
                Mappings
              </button>
            </div>
          )}

        </div>

        <div className="row">
          <div className="col">
            <div className="section-card">
              <h4>Application JSON</h4>
              <textarea
                value={selectedAPIData}
                onChange={(e) => setJsonInput(e.target.value)}
                className="json-textarea"
              />
              <button className="btn" onClick={validateJSON}>
                Validate
              </button>
            </div>
          </div>

          <div className="col">
            <div className="section-card">
              <h4>Admin Input</h4>
              <div className="input-fields-container">
                <InputField value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
                <InputField value={httpMethod} onChange={(e) => setHttpMethod(e.target.value)} placeholder="HTTP Method" />
                <InputField value={connection} onChange={(e) => setConnection(e.target.value)} placeholder="Connection" />
                <InputField value={successResponse} onChange={(e) => setSuccessResponse(e.target.value)} placeholder="Success Response" />
                <InputField value={httpContentType} onChange={(e) => setHttpContentType(e.target.value)} placeholder="HTTP Content Type" />
              </div>
              <button className="btn" onClick={transformData}>
                Transform
              </button>
            </div>
          </div>

          <div className="col">
            <div className="section-card">
              <h4>Output JSON</h4>
              <textarea
                value={output || output1 ? `${output ? output : ''}\n\n${output1 ? output1 : ''}`.trim() : 'No data available'}
                readOnly
                className="json-textarea"
              />

              <button className="btn" onClick={saveOutput}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
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

export default DataTransformation;
