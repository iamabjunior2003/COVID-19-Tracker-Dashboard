import React, { useState } from 'react';
import '../assets/css/login.css';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Form data state
    const [signupData, setSignupData] = useState({
        fullname: '',
        email: '',
        username: '',
        age: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    // Validation error state
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData({
            ...signupData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!signupData.fullname.trim()) newErrors.fullname = 'Full name is required';
        if (!/\S+@\S+\.\S+/.test(signupData.email)) newErrors.email = 'Invalid email address';
        if (!signupData.username.trim()) newErrors.username = 'Username is required';
        if (!signupData.age || signupData.age < 18) newErrors.age = 'You must be at least 18 years old';
        if (!/^\d{10}$/.test(signupData.phone)) newErrors.phone = 'Phone number must be 10 digits';
        if (signupData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form Data:', signupData); // you can send it to API here
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">
                    <div className="logo">🦠 COVID-19 HUB</div>
                    <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
                        <div className="links-container">
                            <Link className="custom-link" to="/login">Login</Link>
                            <Link className="custom-link" to="/signup">SignUp</Link>
                            <Link className="custom-link" to="/login">DashBoard</Link>
                        </div>
                    </ul>
                    <div className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
            {/* virus particles */}
            <div className="virus-particle virus1"></div>
            <div className="virus-particle virus2"></div>
            <div className="virus-particle virus3"></div>
            <div className="virus-particle virus4"></div>
            <div className="virus-particle virus5"></div>
        
            {/* form */}
            <div className="login-container">
                <h1>Corona Registration</h1>
                <form onSubmit={handleSubmit} noValidate>
                    <label>Full Name:</label>
                    <input
                        type="text"
                        name="fullname"
                        value={signupData.fullname}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.fullname && <span className="error">{errors.fullname}</span>}

                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={signupData.email}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.email && <span className="error">{errors.email}</span>}

                    <label>Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={signupData.username}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.username && <span className="error">{errors.username}</span>}

                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        value={signupData.age}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.age && <span className="error">{errors.age}</span>}

                    <label>Phone No:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={signupData.phone}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.phone && <span className="error">{errors.phone}</span>}

                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={signupData.password}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.password && <span className="error">{errors.password}</span>}

                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={signupData.confirmPassword}
                        onChange={handleInputChange}
                        required
                    />
                    {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

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
