import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaPlus } from 'react-icons/fa'; 
import './Dashboard.css';
import AddNewDialog from './AddNewDialog';

const Dashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleLogout = () => {
        logout();
        localStorage.removeItem('user');
        navigate('/');
    };

    const goToHome = () => {
        navigate('/dashboard');
    };

    const handleAddNew = () => {
        setOpen(true); 
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSidebarToggle = () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('show');
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 480);
        };

        checkMobile(); 
        window.addEventListener('resize', checkMobile); 

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="dashboard">
            <aside className={`sidebar ${isMobile ? '' : 'show'}`}>
                {isMobile && (
                    <button className="toggle-sidebar" onClick={handleSidebarToggle}>☰</button> 
                )}
                <button className="home-button" onClick={goToHome}>Home</button>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </aside>
            <main className="content">
                <div className="header">
                    <h1>Welcome to the Service Management System</h1>
                    <button className="add-new-button" onClick={handleAddNew}>
                        <FaPlus /> Add New
                    </button>
                </div>
                <AddNewDialog open={open} onClose={handleClose} />
            </main>
        </div>
    );
};

export default Dashboard;
