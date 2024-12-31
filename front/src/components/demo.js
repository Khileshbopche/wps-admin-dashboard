// Dashboard.jsx
import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <button className="toggle-button" onClick={toggleSidebar}>
                    {isSidebarOpen ? '⟨' : '⟩'}
                </button>
                <nav className="nav-menu">
                    <ul>
                        <li>Dashboard</li>
                        <li>Profile</li>
                        <li>Settings</li>
                        <li>Logout</li>
                    </ul>
                </nav>
            </div>

            <div className="main-content">
                <h1>Welcome to the Admin Dashboard</h1>
                <p>Here is your main content.</p>
            </div>
        </div>
    );
};

export default Dashboard;

