import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import './register.css';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    department: '', // Default department is empty
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();  // Initialize the useNavigate hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous error or success messages
    setError(null);
    setSuccess(null);

    // Set the role based on department
    const role = formData.department === 'applicationTeam' ? 'user' : 'admin';

    // Prepare the data to be sent to the backend
    const dataToSend = { ...formData, role };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend), // Sending form data as JSON
      });

      const result = await response.json();

      if (response.status === 201) {
        setSuccess(result.message); // Show success message
        setTimeout(() => {
          navigate('/');  // Redirect to login after successful registration
        }, 2000); // Wait for 2 seconds before redirecting
      } else {
        setError(result.message); // Show error message
      }
    } catch (err) {
      setError('Something went wrong, please try again later.');
    }
  };

  return (
    <div className="register-container">
      {/* Left Section */}
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

      {/* Right Section */}
      <div className="right-section">
        <h2>Register</h2>

        {/* Show success/error message */}
        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="registration-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* Department Select Field */}
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">Select</option>
              <option value="applicationTeam">Application Team</option>
              <option value="iamAdmin">IAM Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          {/* <button type="submit" className="btn btn-primary">
            Register
          </button> */}
          <button type="submit" className="btn-common submit-btn">
  Register
</button>

        </form>

        {/* Add Sign In Link */}
        {/* <p className="sign-in-link">
          Already have an account? <a href="/">Sign In</a>
        </p> */}

<p className="sign-in-link">
  Already have an account? <a href="/" className="hover-underline">Sign In</a>
</p>

      </div>
    </div>
  );
}

export default Register;
