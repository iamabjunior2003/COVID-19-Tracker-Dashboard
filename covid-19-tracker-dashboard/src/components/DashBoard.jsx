import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet } from "react-router-dom";
import "../assets/css/dashboard.css";

export default function DashBoard({ user }) {
  const [alldata, setAllData] = useState({});
  const [countryData, setCountryData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);

  // Global data
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setAllData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  // Countries data
  useEffect(() => {
    const countryDataFetch = async () => {
      try {
        const res = await axios.get("https://disease.sh/v3/covid-19/countries");
        setCountryData(res.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    countryDataFetch();
  }, []);

  // Filter countries by search
  const filteredCountries = countryData.filter((country) =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">🦠 COVID-19 HUB</div>
          <ul className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="links-container">
              <Link className="custom-link" to="/alldata">
                All Time Data
              </Link>
              <Link className="custom-link" to="/history">
                History
              </Link>
              <Link className="custom-link" to="/countrydata">
                Country Data
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
          {user && (
            <div className="user-avatar">
              {user.fullname.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </nav>

      {/* Global Data */}
      <section className="cards-container">
        <div className="data-card global-card">
          <h3>🌍 Global Cases</h3>
          <p>Total Cases: {alldata.cases?.toLocaleString()}</p>
          <p>Recovered: {alldata.recovered?.toLocaleString()}</p>
          <p>Deaths: {alldata.deaths?.toLocaleString()}</p>
        </div>
      </section>

      {/* Search */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Country Cards */}
      <section className="cards-container">
        {selectedCountry ? (
          <div className="data-card selected-card">
            <h3>🗺️ {selectedCountry.country}</h3>
            <p>Active Cases: {selectedCountry.active.toLocaleString()}</p>
            <button onClick={() => setSelectedCountry(null)}>Back</button>
          </div>
        ) : (
          filteredCountries.map((country) => (
            <div
              key={country.countryInfo._id}
              className="data-card"
              onClick={() => setSelectedCountry(country)}
            >
              <img
                src={country.countryInfo.flag}
                alt={country.country}
                className="country-flag"
              />
              <h4>{country.country}</h4>
              <p>Total Cases: {country.cases.toLocaleString()}</p>
              <p>Recovered: {country.recovered.toLocaleString()}</p>
              <p>Deaths: {country.deaths.toLocaleString()}</p>
            </div>
          ))
        )}
      </section>

      <Outlet />
    </div>
  );
}
