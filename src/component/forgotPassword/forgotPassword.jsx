import React, { useState } from 'react';

import { Link, useNavigate } from "react-router-dom";  // Replace useHistory with useNavigate
import axios from 'axios';  // Import axios for HTTP requests

import './forgotpassword.css'


function Forgot() {
  const [newPassword, setnewPassword] = useState('');
  const [confirmPassword, setconfirmPasswor] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  // Login function
  const forgotPassword = async (event) => {
    event.preventDefault();

    if ( newPassword && confirmPassword) {
      try {
      
        console.log('newPassword:', newPassword);
        console.log('confirmPassword:', confirmPassword);

        
        const response = await axios.post('http://localhost:5000/api/forgotPassword', { newPassword, confirmPassword});

        
        const { token } = response.data;
        localStorage.setItem('authToken', token); 
       
        setMessage('Login successful!');

        // Redirect to the dashboard or home page after successful login
        navigate('/'); // Redirect using navigate()

      } catch (error) {
        // Handle error (invalid credentials or server issues)
        if (error.response && error.response.data) {
          setMessage(error.response.data.message); // Show error message from backend
        } else {
          setMessage('An error occurred. Please try again.');
        }
      }
    } else {
      setMessage('Please fill in all fields.');
    }
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <div className="logo">
          <img
            src="https://trevonix.com/wp-content/uploads/2022/07/Trevonix-Logo.svg"
            alt="Trevonix Logo"
            style={{
              width: '150px',
              height: '50px',
              marginRight: '10px',
              filter: 'brightness(1.3)',
              backgroundColor: 'azure',
            }}
          />
        </div>
        <h2>Manage Your Application Onboarding :</h2>
        <ul>
          <li>
            <span>✔</span> All In One Tool
            <p>Streamline application onboarding in less time.</p>
          </li>
          <li>
            <span>✔</span> Easily Add And Manage Your Services
            <p>It Brings Together Your Invoice Clients And Leads</p>
          </li>
        </ul>
      </div>
      <div className="right-section">
        <h2 style={{ fontSize:"22px"}}>Forgot Passsword</h2>
        <form onSubmit={forgotPassword}>
        <div className="form-group">
            <label htmlFor="password">New Password:</label> 
            <input
              id="password"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password"> Confirm Password:</label>
            <input
              id="password"
              value={confirmPassword}
              onChange={(e) => setconfirmPasswor(e.target.value)}
              type="password"
              required
            />
          </div>
         
          <button type="submit" className="login-btn" style={{marginTop:"10px"}} >
            Submit
          </button>
        </form>
       
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Forgot;
