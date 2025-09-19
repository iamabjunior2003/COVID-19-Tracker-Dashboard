import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/homepage.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentStats] = useState({
    cases: '700M+',
    deaths: '7M+',
    recovered: '680M+',
    vaccinated: '5.5B+'
  });

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className="particle"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 20}s`,
        animationDuration: `${15 + Math.random() * 10}s`
      }}
    />
  ));

  const preventionTips = [
    {
      icon: '🧼',
      title: 'Wash Hands',
      description: 'Wash your hands frequently with soap and water for at least 20 seconds'
    },
    {
      icon: '😷',
      title: 'Wear Mask',
      description: 'Wear a face mask in public spaces and around people outside your household'
    },
    {
      icon: '↔️',
      title: 'Social Distance',
      description: 'Maintain at least 6 feet distance from others when possible'
    },
    {
      icon: '💉',
      title: 'Get Vaccinated',
      description: 'Get vaccinated and boosted to protect yourself and others'
    }
  ];

  const symptoms = [
    { name: 'Fever', severity: 'high', icon: '🌡️' },
    { name: 'Dry Cough', severity: 'high', icon: '😷' },
    { name: 'Shortness of Breath', severity: 'high', icon: '🫁' },
    { name: 'Fatigue', severity: 'medium', icon: '😴' },
    { name: 'Body Aches', severity: 'medium', icon: '💪' },
    { name: 'Headache', severity: 'medium', icon: '🤕' },
    { name: 'Loss of Taste/Smell', severity: 'medium', icon: '👃' },
    { name: 'Sore Throat', severity: 'low', icon: '🗣️' }
  ];

  return (
    <>
      {/* Background Particles */}
      <div className="bg-particles">{particles}</div>

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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-virus" style={{ top: '20%', right: '10%' }}></div>
        <div className="hero-virus" style={{ bottom: '20%', left: '15%', animationDelay: '-5s' }}></div>
        <div className="hero-content">
          <h1>COVID-19 INFORMATION HUB</h1>
          <p>
            Stay informed with the latest COVID-19 updates, prevention guidelines,
            and health resources. Together we can fight the pandemic with knowledge and care.
          </p>
          <button className="cta-button" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
            Explore Information
          </button>
        </div>
      </section>

      {/* Global Stats Section */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">🌍 Global COVID-19 Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{currentStats.cases}</div>
              <div className="stat-label">Total Cases</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentStats.deaths}</div>
              <div className="stat-label">Deaths</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentStats.recovered}</div>
              <div className="stat-label">Recovered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentStats.vaccinated}</div>
              <div className="stat-label">Vaccinated</div>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention Section */}
      <section className="prevention-section">
        <div className="container">
          <h2 className="section-title">🛡️ Prevention Guidelines</h2>
          <div className="prevention-grid">
            {preventionTips.map((tip, index) => (
              <div key={index} className="prevention-card">
                <span className="prevention-icon">{tip.icon}</span>
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="symptoms-section">
        <div className="container">
          <h2 className="section-title">🩺 Common Symptoms</h2>
          <div className="symptoms-grid">
            {symptoms.map((symptom, index) => (
              <div key={index} className={`symptom-card ${symptom.severity}`}>
                <span className="symptom-icon">{symptom.icon}</span>
                <h4>{symptom.name}</h4>
                <span className={`severity-badge ${symptom.severity}`}>{symptom.severity}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="stats-section">
        <div className="container">
          <h2 className="section-title">🚨 Emergency Information</h2>
          <div className="prevention-grid">
            <div className="prevention-card">
              <span className="prevention-icon">📞</span>
              <h3>Emergency Hotline</h3>
              <p>Call 1075 for COVID-19 helpline in India or your local emergency number for immediate assistance</p>
            </div>
            <div className="prevention-card">
              <span className="prevention-icon">🏥</span>
              <h3>Find Hospitals</h3>
              <p>Locate nearby hospitals with COVID-19 treatment facilities and check bed availability</p>
            </div>
            <div className="prevention-card">
              <span className="prevention-icon">🧪</span>
              <h3>Testing Centers</h3>
              <p>Find authorized COVID-19 testing centers near you for RT-PCR and rapid antigen tests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2024 COVID-19 Information Hub. Stay Safe, Stay Informed.</p>
          <p>Data sources: WHO, CDC, Ministry of Health</p>
          <div className="footer-links">
            <a href="#about" className="footer-link">About</a>
            <a href="#privacy" className="footer-link">Privacy</a>
            <a href="#contact" className="footer-link">Contact</a>
            <a href="#resources" className="footer-link">Resources</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
