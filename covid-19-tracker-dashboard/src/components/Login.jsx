import React from 'react'
import { useRef, useState, useEffect } from 'react';
import '../assets/css/login.css'
import DashBoard from './DashBoard'

export default function Login() {
    const [isLoggedIN, setIsLoggedIn] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [loginState, setLoginState] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const usernameRef = useRef();
    const passwordRef = useRef();
    let typingTimer = useRef(null);


    const handleInputChange = () => {
        setIsTyping(true);
        document.body.classList.add('typing');

        if (typingTimer.current) {
            clearTimeout(typingTimer.current);
        }

        typingTimer.current = setTimeout(() => {
            setIsTyping(false);
            document.body.classList.remove('typing');
        }, 1000);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        document.body.classList.remove('typing');

        setTimeout(() => {
            if (usernameRef.current.value === "admin" && passwordRef.current.value === "password") {
                setLoginState('success');
                document.body.classList.add('login-success');

                setTimeout(() => {
                    setIsLoggedIn(true);
                }, 1500);
            } else {
                setLoginState('error');
                document.body.classList.add('login-error');

                setTimeout(() => {
                    setLoginState('');
                    document.body.classList.remove('login-error');
                    setIsLoading(false);
                }, 3000);
            }
        }, 1000);
    };


    useEffect(() => {
        return () => {
            if (typingTimer.current) {
                clearTimeout(typingTimer.current);
            }

            document.body.classList.remove('typing', 'login-error', 'login-success');
        };
    }, []);

    if (isLoggedIN) {
        return <DashBoard />
    }

    return (
        <>
            <div className="login-wrapper">
                <div className="virus-particle virus1"></div>
                <div className="virus-particle virus2"></div>
                <div className="virus-particle virus3"></div>
                <div className="virus-particle virus4"></div>
                <div className="virus-particle virus5"></div>

                <div className="login-container">
                    <h1>Corona Login</h1>
                    <form onSubmit={onSubmit}>
                        <label>
                            Username:
                            <input
                                ref={usernameRef}
                                type="text"
                                placeholder="Enter username"
                                onChange={handleInputChange}
                                onFocus={handleInputChange}
                                disabled={isLoading}
                            />
                        </label>
                        <label>
                            Password:
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Enter password"
                                onChange={handleInputChange}
                                onFocus={handleInputChange}
                                disabled={isLoading}
                            />
                        </label>
                        <input
                            type="submit"
                            value={isLoading ? "Authenticating..." : "LOGIN"}
                            disabled={isLoading}
                            style={{
                                opacity: isLoading ? 0.7 : 1,
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        />
                    </form>

                    {loginState === 'error' && (
                        <div style={{
                            color: '#ff4444',
                            textAlign: 'center',
                            marginTop: '15px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            ❌ Invalid credentials! Viruses are angry!
                        </div>
                    )}

                    {loginState === 'success' && (
                        <div style={{
                            color: '#44ff44',
                            textAlign: 'center',
                            marginTop: '15px',
                            fontSize: '0.9rem',
                            fontWeight: '500'
                        }}>
                            ✅ Login successful! Viruses are happy!
                        </div>
                    )}

                </div>
            </div>
            </>
            );
}