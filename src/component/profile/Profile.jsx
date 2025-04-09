import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";

const Profile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    department: "",
  });
  const [updatedEmployee, setUpdatedEmployee] = useState(employee);

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Get JWT token from local storage

    if (!token) {
      console.error("User is not logged in");
      return;
    }

    axios
      .get("http://localhost:5000/api/user", {
        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the Authorization header
      })
      .then((response) => {
        const userData = response.data;
        setEmployee(userData);
        setUpdatedEmployee(userData);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  const toggleEdit = () => setIsEditMode(!isEditMode);

  const cancelEdit = () => {
    setIsEditMode(false);
    setUpdatedEmployee(employee);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = () => {
    const token = localStorage.getItem("authToken"); // Get JWT token from local storage

    if (!token) {
      console.error("User is not logged in");
      return;
    }

    axios
      .put("http://localhost:5000/api/user", updatedEmployee, {
        headers: { Authorization: `Bearer ${token}` }, // Pass the token in the Authorization header
      })
      .then((response) => {
        console.log("Updated user data:", response.data);
        setEmployee(updatedEmployee);
        setIsEditMode(false);
      })
      .catch((error) => console.error("Error updating user data:", error));
  };

  return (
    <div className="m">
    <div className="main">
      <div className="profile-page">
        <div className="profile-container">
          {/* Profile Information - Left Side */}
          <div className="profile-sidebar">
            <div className="img-thumbnail">
              {employee.firstName[0]}
              {employee.lastName[0]}
            </div>
            <h4>
              {employee.firstName} {employee.lastName}
            </h4>
            <p> {employee.role}</p>
            
           
            <ul className="list-unstyled">
              <li>Email: <a href={`mailto:${employee.email}`}>{employee.email}</a></li>
            </ul>
          </div>

          {/* Personal Details - Right Side */}
          <div className="details-box">
           
<h4 className="section-title">
  Personal Details
  <button
    type="button"
    className="btn btn-link edit-button"
    onClick={toggleEdit}
  >
    Edit <i className="bi bi-pencil-square ms-1"></i>
  </button>
</h4>
            <form>
              {/* Row 1 */}
              <div className="details-row">
                <div className="details-col">
                  <label>First Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      value={updatedEmployee.firstName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{employee.firstName}</p>
                  )}
                </div>
                <div className="details-col">
                  <label>Last Name</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      value={updatedEmployee.lastName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{employee.lastName}</p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="details-row">
                <div className="details-col">
                  <label>Role</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="role"
                      className="form-control"
                      value={updatedEmployee.role}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{employee.role}</p>
                  )}
                </div>
                <div className="details-col">
                  <label>Department</label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="department"
                      className="form-control"
                      value={updatedEmployee.department}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{employee.department}</p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              {isEditMode && (
                <div className="text-right mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                  >
                    CANCEL
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitEdit}
                  >
                    SUBMIT
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Profile;
