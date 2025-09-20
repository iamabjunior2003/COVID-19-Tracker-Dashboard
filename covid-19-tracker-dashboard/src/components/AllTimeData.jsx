import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { Activity, Users, AlertTriangle, TrendingUp, Globe, Calendar } from 'lucide-react';
import '../assets/css/alltimedata.css';

export default function AllTimeData() {
    const [alldata, setAllData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/all')
            .then(res => res.json())
            .then(data => {
                setAllData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error:', error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading COVID-19 data...</p>
                </div>
            </div>
        );
    }

    if (!alldata) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <AlertTriangle className="error-icon" />
                    <p className="error-text">Failed to load data</p>
                </div>
            </div>
        );
    }

    // Prepare data for different charts
    const overviewData = [
        { name: 'Total Cases', value: alldata.cases, color: '#3B82F6' },
        { name: 'Recovered', value: alldata.recovered, color: '#10B981' },
        { name: 'Deaths', value: alldata.deaths, color: '#EF4444' },
        { name: 'Active', value: alldata.active, color: '#F59E0B' }
    ];

    const dailyData = [
        { name: 'Today Cases', value: alldata.todayCases, color: '#3B82F6' },
        { name: 'Today Deaths', value: alldata.todayDeaths, color: '#EF4444' },
        { name: 'Today Recovered', value: alldata.todayRecovered, color: '#10B981' }
    ];

    const testData = [
        { name: 'Tests', value: alldata.tests },
        { name: 'Population', value: alldata.population }
    ];

    const criticalData = [
        { name: 'Critical', value: alldata.critical, color: '#DC2626' },
        { name: 'Active', value: alldata.active, color: '#F59E0B' }
    ];

    const pieData = [
        { name: 'Recovered', value: alldata.recovered, color: '#10B981' },
        { name: 'Deaths', value: alldata.deaths, color: '#EF4444' },
        { name: 'Active', value: alldata.active, color: '#F59E0B' }
    ];

    const timelineData = [
        { name: 'Cases', value: alldata.cases },
        { name: 'Deaths', value: alldata.deaths },
        { name: 'Recovered', value: alldata.recovered },
        { name: 'Active', value: alldata.active },
        { name: 'Critical', value: alldata.critical }
    ];

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
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

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Header */}
                <div className="header">
                    <div className="header-title-container">
                        <Globe className="header-icon" />
                        <h1 className="header-title">
                            Global COVID-19 Dashboard
                        </h1>
                    </div>
                    <p className="header-subtitle">Real-time worldwide coronavirus statistics</p>
                    <div className="header-updated">
                        <Calendar className="header-updated-icon" />
                        <span>Updated: {new Date(alldata.updated).toLocaleString()}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <Card className="stat-card-blue">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Total Cases</p>
                                <p className="stat-card-value">{formatNumber(alldata.cases)}</p>
                            </div>
                            <Users className="stat-card-icon" />
                        </div>
                    </Card>
                    <Card className="stat-card-green">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Recovered</p>
                                <p className="stat-card-value">{formatNumber(alldata.recovered)}</p>
                            </div>
                            <TrendingUp className="stat-card-icon" />
                        </div>
                    </Card>
                    <Card className="stat-card-red">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Deaths</p>
                                <p className="stat-card-value">{formatNumber(alldata.deaths)}</p>
                            </div>
                            <AlertTriangle className="stat-card-icon" />
                        </div>
                    </Card>
                    <Card className="stat-card-amber">
                        <div className="stat-card-content">
                            <div className="stat-card-info">
                                <p className="stat-card-label">Active Cases</p>
                                <p className="stat-card-value">{formatNumber(alldata.active)}</p>
                            </div>
                            <Activity className="stat-card-icon" />
                        </div>
                    </Card>
                </div>

                {/* Charts Grid - All rows with 2 charts each */}
                <div className="charts-grid">
                    {/* Overview Bar Chart */}
                    <Card title="Global Overview" icon={BarChart}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={overviewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => [formatNumber(value), 'Count']}
                                    labelStyle={{ color: '#374151' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                                    {overviewData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Cases Distribution Pie Chart */}
                    <Card title="Cases Distribution" icon={PieChart}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                                    labelLine={false}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatNumber(value)} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <div className="charts-grid">
                    {/* Daily Statistics */}
                    <Card title="Today's Statistics" icon={Calendar}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => [formatNumber(value), 'Count']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#6366F1" 
                                    fill="url(#colorGradient)" 
                                />
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Critical vs Active */}
                    <Card title="Critical vs Active Cases" icon={AlertTriangle}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={criticalData} layout="horizontal">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis type="number" tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 12 }} />
                                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => [formatNumber(value), 'Count']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                                    {criticalData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <div className="charts-grid">
                    {/* Testing Data */}
                    <Card title="Testing vs Population" icon={Users}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={testData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => [formatNumber(value), 'Count']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#10B981" 
                                    fill="url(#testGradient)" 
                                />
                                <defs>
                                    <linearGradient id="testGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.2}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Global Timeline Overview */}
                    <Card title="Global COVID-19 Timeline" icon={TrendingUp}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={timelineData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 12 }} />
                                <Tooltip 
                                    formatter={(value) => [formatNumber(value), 'Total Count']}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#6366F1" 
                                    strokeWidth={3}
                                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8, stroke: '#6366F1', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Footer */}
                <div className="footer">
                    <p>Data source: disease.sh API | Last updated: {new Date(alldata.updated).toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}