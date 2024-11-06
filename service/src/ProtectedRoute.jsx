import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        console.log("User is not authenticated"); 
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
