import React, { useState, useEffect } from 'react';
import '../Auth/login.css'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

const Login = () => {
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth(); 

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true }); 
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submitted");
        try {
            const response = await fetch('http://masauto.jobeazy.in/api/auth/signIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Username: username, Password: password }),
            });

            if (!response.ok) {
                throw new Error('Failed to connect to the server!');
            }

            const data = await response.json();
            console.log("API Response:", data); 

            if (data.ResponseCode !== 200) {
                console.log("Login failed with ResponseCode:", data.ResponseCode); 
                throw new Error(data.Message || 'Login failed!');
            }

            localStorage.setItem('user', JSON.stringify(data.Response)); 
            console.log("User data stored in local storage:", JSON.stringify(data.Response)); 

            login(data.Response);

            navigate('/dashboard', { replace: true }); 
        } catch (error) {
            setError(error.message);
            console.error("Login Error:", error.message); 
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='login-button' type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
