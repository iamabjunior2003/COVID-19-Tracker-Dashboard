import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { Link, Outlet } from 'react-router-dom'
import "../assets/css/dashboard.css"

export default function DashBoard({ user }) {
    const [alldata, setAllData] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then(res => res.json())
            .then(data => setAllData(data))
            .catch(error => console.error('Error:', error))

    }, [])

    const [history, setHistory] = useState([]);
    useEffect(() => {
        const historyData = async () => {
            try {
                const res = await axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=all");
                setHistory(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        historyData();
    }, []);

    const [countryData, setCountryData] = useState([]);
    useEffect(() => {
        const countryData = async () => {
            try {
                const res = await axios.get("https://disease.sh/v3/covid-19/countries");
                setCountryData(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
            countryData();
        }
    }, [])

    return (
        <div className="login-wrapper">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-container">

                    <div className="logo">🦠 COVID-19 HUB</div>

                    <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
                        <div className="links-container">
                            <Link className="custom-link" to="/alldata">All Time Data</Link>
                            <Link className="custom-link" to="/history">History</Link>
                            <Link className="custom-link" to="/countrydata">Country Data</Link>
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
                    {/* User Avatar */}
                    {user && (
                        <div className="user-avatar">
                            {user.fullname.charAt(0).toUpperCase()}
                        </div>
                    )}

                </div>
            </nav>

            <Outlet />
        </div>
    )
}
