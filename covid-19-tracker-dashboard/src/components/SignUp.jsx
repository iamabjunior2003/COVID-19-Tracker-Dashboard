import React, { useState } from 'react';
import '../assets/css/login.css';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();
    const [sighupData, setSignupData] = useState([]);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/dashboard'); 
    };

    return (
        <div className="login-wrapper">
            {/* virus particles */}
            <div className="virus-particle virus1"></div>
            <div className="virus-particle virus2"></div>
            <div className="virus-particle virus3"></div>
            <div className="virus-particle virus4"></div>
            <div className="virus-particle virus5"></div>

            {/* form */}
            <div className="login-container">
                <h1>Corona Registration</h1>
                <form onSubmit={handleSubmit}>
                    <label>Full Name:</label>
                    <input type="text" name="fullname" required />
                    <label>Email:</label>
                    <input type="email" name="email" required />
                    <label>Username:</label>
                    <input type="text" name="username" required />
                    <label>Age:</label>
                    <input type="number" name="age" required />
                    <label>Phone No:</label>
                    <input type="tel" name="phone" required />
                    <label>Password:</label>
                    <input type="password" name="password" required />
                    <label>Confirm Password:</label>
                    <input type="password" name="confirm-password" required />
                    <button type="submit">Sign Up</button>
                </form>

                <div className="login-link">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}