import React from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './component/sideBar/Sidebar.jsx';
import ApplicationList from './component/applicationList/Applicationlist.jsx';
import Login from './component/Login/login';
import Register from './component/Register/register';
import Setting from './component/settings/Setting.jsx';
import Dashboard from './component/dashBoard/Dashboard.jsx';
import Forgot from './component/forgotPassword/forgotPassword.jsx';
import DataTransformation from './component/DataTransformation/data-transform';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Profile from './component/profile/Profile.jsx';
import AddApplication from './component/AddApplication/AddApplication.js';
import DataMapping from './component/dataMapping/DataMapping.jsx';
import Update from './updateData/Update.jsx';
import ErrorPage from './component/error/error.js';
import SubMapping from './component/subMapping/Submapping.jsx';
import Updatedatamapping from './component/updateDatamapping/Updatedatamapping.jsx';
import Customproperty from './component/customProperty/Customproperty.jsx';

import { useEffect } from 'react';



const App = () => {
  const location = useLocation(); // Get the current location/path
  const userRole = localStorage.getItem('role'); 
  const isAdmin = userRole === 'admin'; // Validate against 'admin' role

  // Debugging line to check the role
  console.log('User role:', userRole, 'Is admin:', isAdmin);


  useEffect(() => {
    const notifyBackendToHandleUserCreation = async () => {
      try {
        // Replace with your backend API URL
        const response = await fetch('http://localhost:5000/api/dataMapping', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log('Backend successfully handled user creation:', data);
        } else {
          console.error('Unexpected response from backend:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error notifying backend:', error);
      }
    };
  
    notifyBackendToHandleUserCreation();
  }, []);
  
  

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Conditionally render Sidebar based on the current path */}
      {location.pathname !== '/' &&
        location.pathname !== '/login' &&
        location.pathname !== '/register' &&
        location.pathname !== '/forgotPassword' &&
        location.pathname !== '/Logout' && (
          <Sidebar />
        )}

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/home" element={<ApplicationList />} />
          <Route
            path="/data-transform"
            element={isAdmin ? <DataTransformation /> : <Navigate to="/error" replace />}
          />
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/AddApplication" element={<AddApplication />} />
          <Route path="/forgotPassword" element={<Forgot />} />
          <Route
            path="/data-mapping"
            element={isAdmin ? <DataMapping /> : <Navigate to="/error" replace />}
          />
          <Route path="/Logout" element={<Login />} />
          <Route path="/update" element={<Update />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/mapping" element={<SubMapping/>} />
          <Route path="/updatedatamapping" element={<Updatedatamapping/>} />
          <Route path="/Applicationlist" element={<ApplicationList/>} />
          <Route path="/customproperty" element={<Customproperty/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
