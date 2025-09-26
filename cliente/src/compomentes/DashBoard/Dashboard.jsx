import React from 'react';
import reactLogo from '../../assets/react.svg';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <img src={reactLogo} alt="React Logo" className="dashboard-logo" />
      <h1 className="dashboard-title">Mi Dashboard</h1>
    </div>
  );
};

export default Dashboard;

