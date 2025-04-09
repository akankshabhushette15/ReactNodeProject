const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI
const mongoURI = "mongodb+srv://admin:admin123@cluster0.pozns.mongodb.net/onboarding?retryWrites=true&w=majority";

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Define the User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Password will be saved as plain text for comparison
  role: { type: String, required: true, enum: ['user', 'admin'] },
  department: { type: String, required: true, enum: ['applicationTeam', 'iamAdmin'] },
});

// Create the User Model
const User = mongoose.model('User', userSchema, 'users');



const applicationSchema = new mongoose.Schema({
  appName: { type: String, required: true },
  appType: { type: String, required: true },
  appConnectedDisconnected: { type: String },
  dataAggregation: { type: String },
  entitlementCount: { type: Number },
  entitlements: { type: Array },
  beRequestable: { type: Boolean },
  // apiCount: { type: Number },
  // apiFields: { type: Array },
  userAPI: { type: String },
  groupAPI: { type: String },
  createAccount: { type: String },
  TransformedcreateAccout:{type:String},
  updateAccount: { type: String },
  TransformedupdateAccout:{type:String},
  enableAccount: { type: String },
  TransformedenableAccout:{type:String},
  disableAccount: { type: String },
  TransformedisableAccout:{type:String},
  deletAccount: { type: String },
  TransformedeleteAccout:{type:String},
  addAccess: { type: String },
  TransformedaddAccess:{type:String},
  removeAccess: { type: String },
  TransformedremoveAccess:{type:String},
  userId1:{type: String},
  id: { type: Number, required: true },
  applicationStatus:{ type: String },
});

// Create and export the model
const Application = mongoose.model('applicationData', applicationSchema, 'applicationData');



// Application type 
// application typs 
app.get("/api/application-types", async (req, res) => {
  try {
    // Query the database for application types and their counts
    const appTypes = await Application.aggregate([
      {
        $group: {
          _id: "$appType",  // Group by application type
          count: { $sum: 1 } // Count the number of occurrences of each type
        }
      }
    ]);

    // Format the data into a key-value object (e.g., { REST: 3, LDAP: 2 })
    const appTypeCounts = appTypes.reduce((acc, app) => {
      acc[app._id] = app.count;
      return acc;
    }, {});

    res.json(appTypeCounts); // Return the data to the frontend
  } catch (error) {
    console.error("Error fetching application types:", error);
    res.status(500).json({ message: "Failed to fetch application types" });
  }
});



// Basic route to check the server
app.get('/', (req, res) => {
  res.send('Hello from the backend');
});


///-----Rout  for  show profile details as well as for update the same  

// Middleware to verify JWT and fetch user ID
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "secret_key");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Get the logged-in user's data
app.get("/api/user", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

// Update the logged-in user's data
app.put("/api/user", authenticate, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user data" });
  }
});


/////--------------------------------------------------------------------


// POST route to register a new user
app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password, role, department } = req.body;

  // Validation: Check if all required fields are provided
  if (!firstName || !lastName || !email || !password || !role || !department) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists (based on email)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password before saving (we still hash during registration for security)
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,  // Save the hashed password
      role,
      department,
    });

    // Save the user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

// POST route to login a user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Validation: Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if user exists
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }


    // If password is stored in plain text, we just compare directly
    if (user.password !== password) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token (If login is successful)
    const token = jwt.sign(
      { userId: user._id, role: user.role }, // Payload: userId and role
      'secret_key', // Secret key for signing the token (use environment variables in real apps)
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Send success response with the token
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Failed to login user' });
  }
});

app.get("/api/applications", async (req, res) => {
  try {
    // Fetch all applications from the database
    const applications = await Application.find();
    console.log("applicationDetails",applications)
    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Error retrieving applications" });
  }
});



app.post('/api/createApplication', async (req, res) => {
  const data = req.body;
  console.log("data", data);

  // Check if the appName already exists
  const existingApplication = await Application.findOne({ appName: data.appName });

  if (existingApplication) {
    return res.status(400).json({
      message: 'Application with this appName already exists.',
    });
  }

  const randomId = Math.floor(10 + Math.random() * 90);

  // Create a new document based on the incoming data
  const newFile = new Application({
    appName: data.appName,
    appType: data.appType,
    appConnectedDisconnected: data.appConnectedDisconnected,
    dataAggregation: data.dataAggregation,
    entitlementCount: data.entitlementCount,
    entitlements: data.entitlements,
    beRequestable: data.beRequestable,
    userAPI: data.userAPI,
    groupAPI: data.groupAPI,
    createAccount: data.createAccount,
    updateAccount: data.updateAccount,
    enableAccount: data.enableAccount,
    disableAccount: data.disableAccount,
    deletAccount: data.disableAccount,
    addAccess: data.addAccess,
    removeAccess: data.removeAccess,
    userId1: data.userId,
    id: randomId,
    applicationStatus: data.applicationStatus,
  });

  // Save the new data to the MongoDB database
  newFile.save()
    .then((file) => {
      res.status(200).json({
        message: 'Data saved successfully in DB',
        file: file
      });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Error saving data', error: err });
    });
});

app.delete("/api/deleteApplication/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Application.findByIdAndDelete(id);

    if (result) {
      res.status(200).json({ message: "Application deleted successfully", result });
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (err) {
    console.error("Error deleting application:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.put('/api/applications/:appName', async (req, res) => {
  try {
      console.log('Query Parameters:', req.query);
      console.log('Request Body:', req.body);

      const { appName } = req.params;
      const { selectedAPI, output, applicationStatus } = req.body;

      console.log('Application Name:', appName);

      if (!selectedAPI || !output) {
          return res.status(400).json({
              error: 'Missing required fields: selectedAPI or output.',
          });
      }

      
      const application = await Application.findOne({ appName });

      if (!application) {
          return res.status(404).json({
              error: 'Application not found.',
          });
      }

      console.log('Existing Application Data:', application);

      switch (selectedAPI) {
          case 'Create Account':
              application.TransformedcreateAccout = output;
              break;
          case 'Update Account':
              application.TransformedupdateAccout = output;
              break;
          case 'Enable Account':
              application.TransformedenableAccout = output;
              break;
          case 'Disable Account':
              application.TransformedisableAccout = output;
              break;
          case 'Delete account':
              application.TransformedeleteAccout = output;
              break;
          case 'Add Access':
              application.TransformedaddAccess = output;
              break;
          case 'Remove Access':
              application.TransformedremoveAccess = output;
              break;
          default:
              return res.status(400).json({
                  error: `Unsupported selectedAPI: ${selectedAPI}`,
              });
      }

      
      const allFieldsHaveValues =
          application.TransformedcreateAccout &&
          application.TransformedupdateAccout &&
          application.TransformedenableAccout &&
          application.TransformedisableAccout &&
          application.TransformedeleteAccout &&
          application.TransformedaddAccess &&
          application.TransformedremoveAccess;

      
      application.applicationStatus = allFieldsHaveValues
          ? applicationStatus
          : 'In progress';

     
      const updatedApplication = await application.save();

      console.log('Updated Application Data:', updatedApplication);

  
      res.status(200).json({
          message: 'Application updated successfully!',
          updatedApplication,
      });
  } catch (error) {
      console.error('Error updating application:', error);
      res.status(500).json({
          error: 'An error occurred while updating the application.',
      });
  }
});


//datamapping

const dataMapping = new mongoose.Schema({
  source: {
    type: [String], // Array of strings
    required: true,
    unique: true // Ensures no duplicate entries for the same source/destination pair
  },
  type: {
    type: [String], // Array of strings (types for each source)
    required: true
  },
  destination: {
    type: [String], // Array of strings (destination values)
    required: true
  }
});

const dataMap = mongoose.model('dataMapping', dataMapping, 'dataMapping');

app.post('/api/dataMapping', async (req, res) => {
  const staticValues = {
    source: [
      'EMAIL', 'EMPLOYEETYPE', 'EMPLOYEECLASS', 'EMPLOYEEID', 'ENDDATE',
      'FIRSTNAME', 'JOBDESCRIPTION', 'LASTNAME', 'PHONENUMBER', 'SITEID',
      'STATE', 'STREET', 'TITLE', 'USERNAME'
    ],
    type: [
      'string', 'string', 'string', 'string', 'string',
      'string', 'string', 'string', 'string', 'string',
      'string', 'string', 'string', 'string'
    ],
    destination: [
      'user.email', 'user.employeetype', 'user.employeeclass', 'user.employeeid', 'user.enddate',
      'user.firstname', 'user.jobdescription', 'user.lastname', 'user.phonenumber', 'user.siteid',
      'user.state', 'user.street', 'user.title', 'user.username'
    ]
  };

  try {
    // Iterate over the static values array length
    for (let i = 0; i < staticValues.source.length; i++) {
      const source = staticValues.source[i];
      const type = staticValues.type[i];
      const destination = staticValues.destination[i];

      // Check if the record already exists in the database
      const existingDocument = await dataMap.findOne({
        source: source, // Check for the source value
        destination: destination, // Check for the destination value
        type: type // Check for the type value
      });

      if (existingDocument) {
        console.log(`Data for index ${i} already exists in the database. Skipping insert.`);
      } else {
        // If data does not exist, create a new document with the current source, type, and destination
        const newFile = {
          source: source,
          type: type,
          destination: destination
        };

        // Insert the new record into the database
        await dataMap.create(newFile);
        console.log(`Inserted new document for index ${i} into the database.`);
      }
    }

    res.status(200).json({ message: 'Data processed successfully.' });
  } catch (err) {
    console.error('Error processing data:', err);
    res.status(500).json({ message: 'Error processing data', error: err.message });
  }
});




app.get("/api/dataMapping", async (req, res) => {
  try {
   
    const applications = await dataMap.find(); 
    // console.log("applications",applications)
    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Error retrieving applications" });
  }
});


app.delete('/api/dataMapping/:destination', async (req, res) => {
  try {
    const { destination } = req.params;
    await dataMap.deleteOne({ destination });
    res.status(200).json({ message: "Data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data" });
  }
});


app.put('/api/dataMapping/:destination', async (req, res) => {
  const applicationId = req.params.destination;
  const data = req.body.data; // The array of data you're passing from the front end

  console.log("applicationId", applicationId);
  console.log("data1", data);

  try {
    // Ensure data is an array
    if (Array.isArray(data)) {
      // Iterate over the array of data
      for (const row of data) {
        // For each row, update the document based on its destination
        const updatedFile = await dataMap.findOneAndUpdate(
          { destination: applicationId }, // Match by the destination parameter
          {
            $set: {
              source: row.Source,  // Set the source value
              type: row.Type       // Set the type value
            }
          },
          { new: true } // Return the updated document
        );

        // Check if the document was found and updated
        if (updatedFile) {
          console.log(`Updated document for destination ${applicationId}`);
        } else {
          console.log(`No document found for destination ${applicationId}`);
        }
      }
      res.status(200).json({
        message: 'Data updated successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid data format. Expected an array.' });
    }
  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({ message: 'Error updating application', error: err.message });
  }
});


app.post("/api/customProperty", async (req, res) => {
  try {
    const { data } = req.body;

    console.log("custom", data);

    // Validate that data is an array of objects with required fields
    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Data must be an array" });
    }

    for (const item of data) {
      if (!item.Source || !item.Type || !item.Destination) {
        return res.status(400).json({
          error: "Each item must have Source, Type, and Destination",
        });
      }
    }

    // Transform each item from frontend data structure into the schema format
    const mappedData = data.map((item) => ({
      source: item.Source,
      type: item.Type,
      destination: item.Destination,
    }));

    // Save all data to the database
    await dataMap.insertMany(mappedData);

    res.status(201).json({ message: "Data saved successfully", data: mappedData });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/api/dataMapping1', async (req, res) => {
  try {
    const username = "USERNAME";

    console.log("Looking for user with source:", username);

    const user = await dataMap.find({ 
      "source": { $regex: new RegExp(`^${username}$`, 'i') }
    });

    console.log("user", user);

    if (user.length > 0) {
      const applications = await dataMap.find(); 
      // console.log("applications", applications);

      return res.json({
        applications
      });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


const DataSchema = new mongoose.Schema({
  accountIdPath: String,
  call: [
    {
      name: String,
      callOrder: String,
      connection: String,
      showResponse: Boolean,
      url: String,
      httpMethod: String,
      httpParams: { type: mongoose.Schema.Types.Mixed, required: true }, // Ensure httpParams is properly handled
      httpHeaders: { type: mongoose.Schema.Types.Mixed, required: true },
      httpContentType: String,
      successResponses: mongoose.Schema.Types.Mixed,
      unsuccessResponses: mongoose.Schema.Types.Mixed,
    }
  ]
});


// Create a model based on the schema
const Data = mongoose.model('transformData', DataSchema,'transformData');


// app.post('/datatransformation', async (req, res) => {
//   try {
//     let { output } = req.body; // Extracting 'output' from the request body

//     // Check if 'output' is a valid object and parse it if it's a string
//     if (typeof output === 'string') {
//       output = JSON.parse(output); // If it's a string, parse it as JSON
//     }

//     // Ensure httpParams is parsed if it's a stringified JSON
//     if (output.call && output.call.length > 0) {
//       output.call.forEach(call => {
//         if (call.httpParams && typeof call.httpParams === 'string') {
//           try {
//             call.httpParams = JSON.parse(call.httpParams); // Parse stringified JSON to an object
//           } catch (error) {
//             return res.status(400).json({ message: 'Invalid httpParams JSON format', error });
//           }
//         }
//       });
//     }

//     // Validate the structure of 'output' and ensure call array is present
//     if (!output || !Array.isArray(output.call)) {
//       return res.status(400).json({ message: 'Invalid data structure: "call" is required and must be an array' });
//     }

//     // Optional: check for accountIdPath if it exists
//     if (output.accountIdPath && typeof output.accountIdPath !== 'string') {
//       return res.status(400).json({ message: 'Invalid accountIdPath format' });
//     }

//     // Create a new document using the Data model
//     const newData = new Data(output);

//     // Save the document to the database
//     await newData.save();

//     // Send a success response
//     res.status(200).json({ message: 'Data saved successfully', data: newData });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).json({ message: 'Error saving data', error });
//   }
// });



// app.get('/datatransformation', async (req, res) => {
//   try {
//     const allData = await Data.find().lean();

//     // Format data
//     const formattedData = allData.map(item => {
//       return {
//         ...item,
//         call: item.call.map(callItem => JSON.parse(JSON.stringify(callItem))), // Ensuring proper serialization
//       };
//     });

//     // Pretty-printing data for debugging
//     console.log('Formatted Data:', JSON.stringify(formattedData, null, 2));

//     res.status(200).json({ message: 'Data retrieved successfully', data: formattedData });
//   } catch (error) {
//     console.error('Error retrieving data:', error);
//     res.status(500).json({ message: 'Error retrieving data', error });
//   }
// });

app.put('/applications/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the application ID from the URL parameter
    const data = req.body; // Get the updated data from the request body

    console.log("id",id);
    console.log("dats",data)

    // Find the application by its ID
    const application = await Application.findOne({ id });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Update the application fields with the new data
    application.appName = data.appName || application.appName;
    application.appType = data.appType || application.appType;
    application.appConnectedDisconnected = data.appConnectedDisconnected || application.appConnectedDisconnected;
    application.dataAggregation = data.dataAggregation || application.dataAggregation;
    application.entitlementCount = data.entitlementCount || application.entitlementCount;
    application.entitlements = data.entitlements || application.entitlements;
    application.beRequestable = data.beRequestable || application.beRequestable;
    application.userAPI = data.userAPI || application.userAPI;
    application.groupAPI = data.groupAPI || application.groupAPI;
    application.createAccount = data.createAccount || application.createAccount;
    application.updateAccount = data.updateAccount || application.updateAccount;
    application.enableAccount = data.enableAccount || application.enableAccount;
    application.disableAccount = data.disableAccount || application.disableAccount;
    application.deletAccount = data.deletAccount || application.deletAccount;
    application.addAccess = data.addAccess || application.addAccess;
    application.removeAccess = data.removeAccess || application.removeAccess;
   

    // Save the updated application back to the database
    await application.save();

    // Respond with the updated application data
    res.status(200).json({
      message: 'Application updated successfully!',
      updatedApplication: application
    });

  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'An error occurred while updating the application.' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
