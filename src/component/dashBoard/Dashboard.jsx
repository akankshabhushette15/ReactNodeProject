import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './dashboard.css';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [appTypeCounts, setAppTypeCounts] = useState({}); // State to store application type data
 


  useEffect(() => {
    const fetchData = async () => {
      try {
        const loguser = localStorage.getItem("loggedInUser");
        let loggedInUser = null;

        if (loguser) {
          loggedInUser = JSON.parse(loguser);
          console.log("Logged in user:", loggedInUser);
        } else {
          console.log("No user data found in localStorage.");
        }

        // Fetch application data
        const appResponse = await axios.get("http://localhost:5000/api/applications");
        const appData = appResponse.data.applications;

        // Filter applications by user role
        const userApplications =
          loggedInUser?.role === "admin"
            ? appData // Admin sees all applications
            : appData.filter((app) => app.userId1 === loggedInUser?._id); // Normal user sees their applications only

        const appTypeCounts = userApplications.reduce((acc, app) => {
          const type = app.appType;
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

        console.log(appTypeCounts);
        setAppTypeCounts(appTypeCounts);


      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the Bar Chart
  const chartData = {
    labels: Object.keys(appTypeCounts),
    datasets: [
      {
        label: 'Application Type Count',
        data: Object.values(appTypeCounts),
        // backgroundColor: ['#ff5733', '#33c1ff', '#7dff33', '#ff33ab'], // Custom bar colors
        backgroundColor: ['#f4a261', '#2a9d8f', '#e9c46a', '#264653']


        ,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hide legend
      title: { display: true, text: "Application Types" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="dashboard-container">
      <div className="content-wrapper">
        {/* Application Types Section */}
        <div className="section application-types">
          <h3>Application Types</h3>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} /> {/* Bar Graph */}
          </div>
        </div>

        {/* Existing sections (Summary, Details, Progress Table, etc.) */}
        <div className="section summary-info">
          <div className="summary-box" style={{ backgroundColor: '#4caf50', color: '#fff' }}>
            <h2>10</h2>
            <p>Applications Approved</p>
            <span>⬆ 33% vs. last week</span>
          </div>
          <div className="summary-box" style={{ backgroundColor: '#ff9800', color: '#fff' }}>
            <h2>5</h2>
            <p>Applications Submitted</p>
            <span>⬇ 25% vs. last week</span>
          </div>
        </div>

        {/* Other sections remain unchanged */}

        {/* Application Details */}
        <div className="section employees-per-office">
          <h3>Application Details</h3>
          <div className="pie-chart-wrapper">
            <div className="pie-chart"></div>
            <div className="stats">
              <p><strong>Total Applications Submitted:</strong> 120</p>
              <p><strong>Applications Submitted by Type:</strong> 50 Forms, 70 Online</p>
              <p><strong>Applications Approved:</strong> 95</p>
              <p><strong>Total API Submissions:</strong> 110</p>
              <p><strong>Successful API Transformations:</strong> 105</p>
            </div>
          </div>
        </div>

        {/* Onboarding in Progress */}
        <div className="section onboarding-progress">
          <h3>Onboarding in Progress</h3>
          <table className="progress-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Day</th>
                <th>Department</th>
                <th>Completion Status (%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Henna</td>
                <td>28-Aug-2022</td>
                <td>Sales</td>
                <td style={{ color: '#4caf50' }}>95%</td>
              </tr>
              <tr>
                <td>Susan</td>
                <td>02-Sep-2022</td>
                <td>Finance</td>
                <td style={{ color: '#2196f3' }}>90%</td>
              </tr>
              <tr>
                <td>Tessa</td>
                <td>06-Sep-2022</td>
                <td>Marketing</td>
                <td style={{ color: '#ff9800' }}>80%</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;