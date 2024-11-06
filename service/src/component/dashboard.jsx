import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
const Dashboard = () => {
    const navigate = useNavigate();
    const {logout}= useAuth()

    const handleLogout = () => {
        logout()
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
