import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { Globe, Users, AlertTriangle, TrendingUp, MapPin, Search, Filter } from 'lucide-react';
import '../assets/css/alltimedata.css';
import { Link } from 'react-router-dom'


export default function CountryData() {
    const [countryData, setCountryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('cases');
    const [showTop, setShowTop] = useState(20);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem('currentUser')) || { name: "Guest" };


    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                const res = await axios.get("https://disease.sh/v3/covid-19/countries");
                setCountryData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch country data");
                setLoading(false);
            }
        };

        fetchCountryData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading country COVID-19 data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <AlertTriangle className="error-icon" />
                    <p className="error-text">{error}</p>
                </div>
            </div>
        );
    }

    // Filter and sort countries
    const filteredCountries = countryData
        .filter(country => 
            country.country.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => b[sortBy] - a[sortBy]);

    // Get top countries for different metrics
    const getTopCountries = (metric, limit = 10) => {
        return countryData
            .sort((a, b) => b[metric] - a[metric])
            .slice(0, limit)
            .map(country => ({
                name: country.country.length > 12 ? country.country.substring(0, 12) + '...' : country.country,
                fullName: country.country,
                value: country[metric],
                cases: country.cases,
                deaths: country.deaths,
                recovered: country.recovered,
                population: country.population,
                tests: country.tests,
                casesPerOneMillion: country.casesPerOneMillion,
                deathsPerOneMillion: country.deathsPerOneMillion
            }));
    };

    // Get continents data
    const getContinentData = () => {
        const continentStats = {};
        
        countryData.forEach(country => {
            const continent = country.continent || 'Unknown';
            if (!continentStats[continent]) {
                continentStats[continent] = {
                    name: continent,
                    cases: 0,
                    deaths: 0,
                    recovered: 0,
                    countries: 0
                };
            }
            
            continentStats[continent].cases += country.cases;
            continentStats[continent].deaths += country.deaths;
            continentStats[continent].recovered += country.recovered;
            continentStats[continent].countries += 1;
        });
        
        return Object.values(continentStats);
    };

    // Get testing vs cases correlation data
    const getTestingCorrelation = () => {
        return countryData
            .filter(country => country.tests > 0 && country.population > 1000000) // Filter countries with testing data and significant population
            .slice(0, 50) // Top 50 countries to avoid overcrowding
            .map(country => ({
                name: country.country,
                testsPerMillion: Math.round(country.tests / country.population * 1000000),
                casesPerMillion: Math.round(country.casesPerOneMillion),
                population: country.population
            }));
    };

    // Calculate global stats
    const globalStats = countryData.reduce((acc, country) => {
        acc.totalCases += country.cases;
        acc.totalDeaths += country.deaths;
        acc.totalRecovered += country.recovered;
        acc.totalTests += country.tests;
        return acc;
    }, { totalCases: 0, totalDeaths: 0, totalRecovered: 0, totalTests: 0 });

    const topCaseCountries = getTopCountries('cases', 15);
    const topDeathCountries = getTopCountries('deaths', 15);
    const topPerMillionCases = getTopCountries('casesPerOneMillion', 15);
    const topPerMillionDeaths = getTopCountries('deathsPerOneMillion', 15);
    const continentData = getContinentData();
    const testingData = getTestingCorrelation();

    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return new Intl.NumberFormat().format(num);
    };

    const formatTooltipValue = (value, name) => {
        const formattedValue = typeof value === 'number' ? new Intl.NumberFormat().format(value) : value;
        return [formattedValue, name];
    };

    const Card = ({ children, className = "", title, icon: Icon }) => (
        <div className={`card ${className}`}>
            <div className="card-inner">
                {title && (
                    <div className="card-header">
                        <div className="card-header-content">
                            {Icon && <Icon className="card-header-icon" />}
                            <h3 className="card-header-title">{title}</h3>
                        </div>
                    </div>
                )}
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

    return (
        <div className="dashboard-container">
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
            <div className="dashboard-content">
                {/* Header */}
                <div className="header">
                    <div className="header-title-container">
                        <Globe className="header-icon" />
                        <h1 className="header-title">COVID-19 Country Data</h1>
                    </div>
                    <p className="header-subtitle">Comprehensive analysis of coronavirus statistics by country</p>
                    <div className="header-updated">
                        <MapPin className="header-updated-icon" />
                        <span>Total Countries: {countryData.length} | Global Cases: {formatNumber(globalStats.totalCases)}</span>
                    </div>
                </div>

                {/* Global Summary Stats */}
                <div className="stats-grid">
                    <Card className="stat-card-blue">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Global Cases</p>
                                <p className="stat-card-value">{formatNumber(globalStats.totalCases)}</p>
                            </div>
                            <Users className="stat-card-icon" />
                        </div>
                    </Card>
                    <Card className="stat-card-green">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Global Recovered</p>
                                <p className="stat-card-value">{formatNumber(globalStats.totalRecovered)}</p>
                            </div>
                            <TrendingUp className="stat-card-icon" />
                        </div>
                    </Card>
                    <Card className="stat-card-red">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Global Deaths</p>
                                <p className="stat-card-value">{formatNumber(globalStats.totalDeaths)}</p>
                            </div>
                            <AlertTriangle className="stat-card-icon" />
                        </div>
                    </Card>
                    <Card className="stat-card-amber">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Countries Affected</p>
                                <p className="stat-card-value">{countryData.length}</p>
                            </div>
                            <Globe className="stat-card-icon" />
                        </div>
                    </Card>
                </div>

                {/* Search and Filter Controls */}
                <Card className="mb-6">
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <Search style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    minWidth: '200px'
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                            <Filter style={{ width: '20px', height: '20px', color: 'var(--text-secondary)' }} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: 'var(--spacing-sm) var(--spacing-md)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <option value="cases">Sort by Cases</option>
                                <option value="deaths">Sort by Deaths</option>
                                <option value="recovered">Sort by Recovered</option>
                                <option value="casesPerOneMillion">Cases per Million</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Charts Grid */}
                <div className="charts-grid">
                    {/* Top Countries by Cases */}
                    <Card title="Top 15 Countries by Total Cases" icon={BarChart}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topCaseCountries} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis type="number" tickFormatter={formatNumber} tick={{ fontSize: 10 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Bar dataKey="value" fill="var(--chart-blue)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Continental Distribution */}
                    <Card title="Cases by Continent" icon={Globe}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={continentData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="cases"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                                    labelLine={false}
                                >
                                    {continentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <div className="charts-grid">
                    {/* Top Deaths */}
                    <Card title="Top 15 Countries by Deaths" icon={AlertTriangle}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topDeathCountries}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10 }} />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Bar dataKey="value" fill="var(--chart-red)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Cases Per Million */}
                    <Card title="Top 15 Countries by Cases per Million" icon={Users}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={topPerMillionCases}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10 }} />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="var(--chart-purple)" 
                                    fill="var(--chart-purple)" 
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <div className="charts-grid">
                    {/* Testing vs Cases Correlation */}
                    <Card title="Testing Rate vs Cases per Million" icon={TrendingUp}>
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart data={testingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis 
                                    type="number" 
                                    dataKey="testsPerMillion" 
                                    name="Tests per Million"
                                    tickFormatter={formatNumber} 
                                    tick={{ fontSize: 10 }}
                                />
                                <YAxis 
                                    type="number" 
                                    dataKey="casesPerMillion" 
                                    name="Cases per Million"
                                    tickFormatter={formatNumber} 
                                    tick={{ fontSize: 10 }}
                                />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }}
                                    formatter={(value, name) => [formatNumber(value), name === 'casesPerMillion' ? 'Cases per Million' : 'Tests per Million']}
                                    labelFormatter={(label) => `Country: ${testingData.find(d => d.casesPerMillion === label)?.name || 'Unknown'}`}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Scatter dataKey="casesPerMillion" fill="var(--chart-blue)" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Continental Summary */}
                    <Card title="Continental Statistics Summary" icon={MapPin}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={continentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10 }} />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Bar dataKey="cases" fill="var(--chart-blue)" name="Cases" />
                                <Bar dataKey="deaths" fill="var(--chart-red)" name="Deaths" />
                                <Bar dataKey="recovered" fill="var(--chart-green)" name="Recovered" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Filtered Countries Table */}
                {searchTerm && (
                    <Card title={`Search Results for "${searchTerm}"`} icon={Search}>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                                        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--text-secondary)' }}>Country</th>
                                        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--text-secondary)' }}>Cases</th>
                                        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--text-secondary)' }}>Deaths</th>
                                        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--text-secondary)' }}>Recovered</th>
                                        <th style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--text-secondary)' }}>Cases/1M</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCountries.slice(0, showTop).map((country, index) => (
                                        <tr key={country.country} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                            <td style={{ padding: 'var(--spacing-sm)', fontWeight: '500' }}>{country.country}</td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right' }}>{formatNumber(country.cases)}</td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--danger-primary)' }}>{formatNumber(country.deaths)}</td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right', color: 'var(--success-primary)' }}>{formatNumber(country.recovered)}</td>
                                            <td style={{ padding: 'var(--spacing-sm)', textAlign: 'right' }}>{formatNumber(country.casesPerOneMillion)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* Footer */}
                <div className="footer">
                    <p>Country data from disease.sh API | Total countries: {countryData.length} | Last updated: {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}