import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from "react-router-dom";  // Replace useHistory with useNavigate
import axios from 'axios';  // Import axios for HTTP requests

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Replace useHistory with useNavigate

  // Login function
  const login = async (event) => {
    event.preventDefault();

    if (email && password) {
      try {
        // Log email and password being sent to backend
        console.log('Email:', email);
        console.log('Password:', password);

        // Send login request to the backend
        const response = await axios.post('http://localhost:5000/api/login', { email, password });

        // If successful, store the token in localStorage or sessionStorage
        const { token } = response.data;
        localStorage.setItem('authToken', token); // Store the token

        setMessage('Login successful!');

        // Redirect to the dashboard or home page after successful login
        navigate('/dashboard'); // Redirect using navigate()

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
        <h2>Sign In</h2>
        <form onSubmit={login}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Update email state
              type="email"  // Using 'email' type for better validation
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </div>
          <div className="form-footer">
            <label>
              <input type="checkbox" /> Remember Me
            </label>
            <a href="forgotPassword" className="forgot-password">Forgot Password</a>
          </div>
          <button type="submit" className="login-btn" disabled={!email || !password}>
            Login
          </button>
        </form>
        {/* <p className="register">
          Or <Link to="/register">Register</Link>
         
        </p> */}
        <p className="register">
  Or <Link to="/register" className="hover-underline">Register</Link>
</p>

        <p>{message}</p>
      </div>
    </div>
  );
}

export default App;
