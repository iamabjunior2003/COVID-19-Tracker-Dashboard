import React, { useRef, useState, useEffect } from "react";
import "../assets/css/login.css";
import DashBoard from "./DashBoard";
import { Link } from "react-router-dom";

export default function Login() {
    const [isLoggedIN, setIsLoggedIn] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [loginState, setLoginState] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const usernameRef = useRef();
    const passwordRef = useRef();
    let typingTimer = useRef(null);

    const handleInputChange = () => {
        setIsTyping(true);
        document.body.classList.add("typing");

        if (typingTimer.current) {
            clearTimeout(typingTimer.current);
        }

        typingTimer.current = setTimeout(() => {
            setIsTyping(false);
            document.body.classList.remove("typing");
        }, 1000);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        document.body.classList.remove("typing");

        setTimeout(() => {
            const storedUsers = JSON.parse(localStorage.getItem("UserData")) || [];

            const user = storedUsers.find(
                (u) =>
                    (u.username === usernameRef.current.value ||
                        u.email === usernameRef.current.value) &&
                    u.password === passwordRef.current.value
            );

            if (user) {
                setLoginState("success");
                document.body.classList.add("login-success");

                localStorage.setItem("currentUser", JSON.stringify(user));

                setTimeout(() => {
                    setIsLoggedIn(true);
                }, 1500);
            } else {
                setLoginState("error");
                document.body.classList.add("login-error");

                setTimeout(() => {
                    setLoginState("");
                    document.body.classList.remove("login-error");
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
            document.body.classList.remove(
                "typing",
                "login-error",
                "login-success"
            );
        };
    }, []);

    if (isLoggedIN) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        return <DashBoard user={currentUser} />;
    }

    return (
        <>
            <div className="login-wrapper">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="nav-container">
                        <div className="logo">🦠 COVID-19 HUB</div>
                        <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                            <div className="links-container">
                                <Link className="custom-link" to="/login">
                                    Login
                                </Link>
                                <Link className="custom-link" to="/signup">
                                    SignUp
                                </Link>
                                <Link className="custom-link" to="/dashboard">
                                    DashBoard
                                </Link>
                            </div>
                        </ul>
                        <div
                            className="menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </nav>

                {/* Virus particles */}
                <div className="virus-particle virus1"></div>
                <div className="virus-particle virus2"></div>
                <div className="virus-particle virus3"></div>
                <div className="virus-particle virus4"></div>
                <div className="virus-particle virus5"></div>

                {/* Login Form */}
                <div className="login-container">
                    <h1>Corona Login</h1>
                    <form onSubmit={onSubmit}>
                        <label>
                            Username / Email:
                            <input
                                ref={usernameRef}
                                type="text"
                                placeholder="Enter username or email"
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
                                cursor: isLoading ? "not-allowed" : "pointer",
                            }}
                        />
                    </form>

                    <div className="login-link">
                        <p>
                            Don't Have Account? <Link to="/signup">SignUp here</Link>
                        </p>
                    </div>

                    {loginState === "error" && (
                        <div
                            style={{
                                color: "#ff4444",
                                textAlign: "center",
                                marginTop: "15px",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                            }}
                        >
                            ❌ Invalid credentials! Viruses are angry!
                        </div>
                    )}

                    {loginState === "success" && (
                        <div
                            style={{
                                color: "#44ff44",
                                textAlign: "center",
                                marginTop: "15px",
                                fontSize: "0.9rem",
                                fontWeight: "500",
                            }}
                        >
                            ✅ Login successful! Viruses are happy!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
