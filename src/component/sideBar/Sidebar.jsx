import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';
import './sidebar.css';
import axios from 'axios';

const Sidebar = () => {
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin role

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        console.error('User is not logged in');
        return;
      }

      try {
        // Fetch logged-in user data
        const userResponse = await axios.get('http://localhost:5000/api/user', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loggedInUser = userResponse.data;

        console.log('loggedInUser', loggedInUser);
        localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        // Check if the user has an admin role
        setIsAdmin(loggedInUser.role === 'admin');
        localStorage.setItem('role', loggedInUser.role); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
      <img
          src="https://trevonix.com/wp-content/uploads/2022/07/Trevonix-Logo.svg"
          alt="Trevonix Logo"
          className="logo"
        />
      </div>
      <ul className="sidebar-menu">
        {/* Dashboard Link */}
        <li className="menu-item">
          <Link to="/dashboard" className="menu-link">
            <div className="menu-content">
              <i className="fas fa-home"></i>
            <p style={{marginLeft:"20px", marginTop:"14px", width:"100px" }}>Dashboard</p>
            </div>
          </Link>
        </li>
 
        {/* Application List Link */}
        <li className="menu-item">
          <Link to="/home" className="menu-link">
            <div className="menu-content">
              <i className="fas fa-list-alt"></i>
              <p style={{marginLeft:"20px",marginTop:"14px"}}>Application List</p>
            </div>
          </Link>
        </li>
 
        {/* Profile Link */}
        <li className="menu-item">
          <Link to="/profile" className="menu-link">
            <div className="menu-content">
              <i className="fas fa-user"></i>
              <p style={{marginLeft:"25px",marginTop:"14px"}}>Profile</p>
            </div>
          </Link>
        </li>
 
       {/* Settings Button */}
        {isAdmin && (
          <li className="menu-item">
            <Link to="/setting" className="menu-link">
              <div className="menu-content">
                <i className="fas fa-cogs"></i>
                <p style={{ marginLeft: '18px', marginTop: '14px' }}>Settings</p>
              </div>
            </Link>
          </li>
        )}

              {/* Data Transformation Button */}
        {isAdmin && (
          <li className="menu-item">
            <Link to="/data-transform" className="menu-link">
              <div className="menu-content">
                <i className="fas fa-random"></i>
                <p style={{ marginLeft: '22px', marginTop: '14px' }}>Data Transformation</p>
              </div>
            </Link>
          </li>
        )}
 
        {/* Logout Link */}
        <li className="menu-item">
          <Link to="/Logout" className="menu-link">
            <div className="menu-content">
              <i className="fas fa-sign-out-alt"></i>
              <p style={{marginLeft:"22px",marginTop:"14px"}}>Logout</p>
            </div>
          </Link>
        </li>
 
        <div className="down-logo" >
        <img
          src="data:image/png;base64,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"
          alt="Logo"
          className="logo"
        />
      </div>
      </ul>
    </div>
  );
};
export default Sidebar;