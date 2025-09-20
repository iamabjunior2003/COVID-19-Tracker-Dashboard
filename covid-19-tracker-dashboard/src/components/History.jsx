import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';
import { Activity, TrendingUp, AlertTriangle, Calendar, BarChart3, Clock } from 'lucide-react';
import '../assets/css/alltimedata.css';

export default function History() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const historyData = async () => {
            try {
                const res = await axios.get("https://disease.sh/v3/covid-19/historical/all?lastdays=all");
                setHistory(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch historical data");
                setLoading(false);
            }
        };

        historyData();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Loading historical COVID-19 data...</p>
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

    // Process the historical data
    const processHistoricalData = () => {
        if (!history.cases || !history.deaths || !history.recovered) return [];

        const dates = Object.keys(history.cases);
        return dates.map(date => {
            const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: '2-digit'
            });
            
            return {
                date: formattedDate,
                fullDate: date,
                cases: history.cases[date],
                deaths: history.deaths[date],
                recovered: history.recovered[date],
                active: history.cases[date] - history.deaths[date] - history.recovered[date]
            };
        });
    };

    // Get recent data (last 30 days)
    const getRecentData = () => {
        const allData = processHistoricalData();
        return allData.slice(-30);
    };

    // Get monthly summary data
    const getMonthlyData = () => {
        const allData = processHistoricalData();
        const monthlyData = {};
        
        allData.forEach(item => {
            const monthYear = new Date(item.fullDate).toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            });
            
            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {
                    month: monthYear,
                    cases: 0,
                    deaths: 0,
                    recovered: 0
                };
            }
            
            monthlyData[monthYear].cases = item.cases;
            monthlyData[monthYear].deaths = item.deaths;
            monthlyData[monthYear].recovered = item.recovered;
        });
        
        return Object.values(monthlyData).slice(-12); // Last 12 months
    };

    // Get daily new cases data (last 60 days)
    const getDailyNewCases = () => {
        const allData = processHistoricalData();
        const recent = allData.slice(-60);
        
        return recent.map((item, index) => {
            if (index === 0) return { ...item, newCases: 0, newDeaths: 0, newRecovered: 0 };
            
            const prev = recent[index - 1];
            return {
                ...item,
                newCases: Math.max(0, item.cases - prev.cases),
                newDeaths: Math.max(0, item.deaths - prev.deaths),
                newRecovered: Math.max(0, item.recovered - prev.recovered)
            };
        }).slice(1); // Remove first item with 0 values
    };

    const allData = processHistoricalData();
    const recentData = getRecentData();
    const monthlyData = getMonthlyData();
    const dailyNewData = getDailyNewCases();

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };

    const formatTooltipValue = (value, name) => {
        const formattedValue = formatNumber(value);
        const nameMap = {
            cases: 'Total Cases',
            deaths: 'Total Deaths',
            recovered: 'Total Recovered',
            active: 'Active Cases',
            newCases: 'New Cases',
            newDeaths: 'New Deaths',
            newRecovered: 'New Recovered'
        };
        return [formattedValue, nameMap[name] || name];
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

    // Calculate summary stats
    const latestData = allData[allData.length - 1];
    const previousData = allData[allData.length - 2];
    
    const summaryStats = [
        {
            label: 'Current Total Cases',
            value: latestData?.cases || 0,
            change: latestData && previousData ? latestData.cases - previousData.cases : 0,
            color: 'var(--info-primary)'
        },
        {
            label: 'Current Deaths',
            value: latestData?.deaths || 0,
            change: latestData && previousData ? latestData.deaths - previousData.deaths : 0,
            color: 'var(--danger-primary)'
        },
        {
            label: 'Current Recovered',
            value: latestData?.recovered || 0,
            change: latestData && previousData ? latestData.recovered - previousData.recovered : 0,
            color: 'var(--success-primary)'
        },
        {
            label: 'Current Active',
            value: latestData?.active || 0,
            change: latestData && previousData ? latestData.active - previousData.active : 0,
            color: 'var(--warning-primary)'
        }
    ];

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                {/* Header */}
                <div className="header">
                    <div className="header-title-container">
                        <Clock className="header-icon" />
                        <h1 className="header-title">COVID-19 Historical Data</h1>
                    </div>
                    <p className="header-subtitle">Complete timeline of global coronavirus statistics</p>
                    <div className="header-updated">
                        <Calendar className="header-updated-icon" />
                        <span>Data Period: {allData.length > 0 ? `${allData[0]?.date} to ${latestData?.date}` : 'Loading...'}</span>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="stats-grid">
                    {summaryStats.map((stat, index) => (
                        <Card key={index} className={`stat-card-${['blue', 'red', 'green', 'amber'][index]}`}>
                            <div className="stat-card-content">
                                <div className="stat-card-info">
                                    <p className="stat-card-label">{stat.label}</p>
                                    <p className="stat-card-value">{formatNumber(stat.value)}</p>
                                    <p className="stat-card-label">
                                        Daily Change: {stat.change >= 0 ? '+' : ''}{formatNumber(stat.change)}
                                    </p>
                                </div>
                                {index === 0 && <Activity className="stat-card-icon" />}
                                {index === 1 && <AlertTriangle className="stat-card-icon" />}
                                {index === 2 && <TrendingUp className="stat-card-icon" />}
                                {index === 3 && <BarChart3 className="stat-card-icon" />}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="charts-grid">
                    {/* Complete Historical Timeline */}
                    <Card title="Complete Historical Timeline (All Time)" icon={Clock}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={allData.filter((_, index) => index % Math.ceil(allData.length / 100) === 0)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 10 }} 
                                    interval="preserveStartEnd"
                                />
                                <YAxis 
                                    tickFormatter={(value) => formatNumber(value)} 
                                    tick={{ fontSize: 10 }} 
                                />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    labelStyle={{ color: 'var(--text-primary)' }}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="cases" 
                                    stroke="var(--chart-blue)" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="cases"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="deaths" 
                                    stroke="var(--chart-red)" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="deaths"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="recovered" 
                                    stroke="var(--chart-green)" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="recovered"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Recent Trend (Last 30 Days) */}
                    <Card title="Recent Trends (Last 30 Days)" icon={TrendingUp}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={recentData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 10 }} />
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
                                    dataKey="active" 
                                    stackId="1"
                                    stroke="var(--chart-amber)" 
                                    fill="var(--chart-amber)" 
                                    fillOpacity={0.6}
                                    name="active"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="recovered" 
                                    stackId="2"
                                    stroke="var(--chart-green)" 
                                    fill="var(--chart-green)" 
                                    fillOpacity={0.6}
                                    name="recovered"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <div className="charts-grid">
                    {/* Daily New Cases */}
                    <Card title="Daily New Cases (Last 60 Days)" icon={Activity}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailyNewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 10 }} />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Bar dataKey="newCases" fill="var(--chart-blue)" name="newCases" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Monthly Summary */}
                    <Card title="Monthly Summary (Last 12 Months)" icon={Calendar}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 10 }} />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="cases" 
                                    stroke="var(--chart-blue)" 
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--chart-blue)', r: 4 }}
                                    name="cases"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="deaths" 
                                    stroke="var(--chart-red)" 
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--chart-red)', r: 4 }}
                                    name="deaths"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="recovered" 
                                    stroke="var(--chart-green)" 
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--chart-green)', r: 4 }}
                                    name="recovered"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                <div className="charts-grid">
                    {/* Daily Deaths and Recoveries */}
                    <Card title="Daily New Deaths vs Recoveries" icon={AlertTriangle}>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={dailyNewData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis tickFormatter={(value) => formatNumber(value)} tick={{ fontSize: 10 }} />
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
                                    dataKey="newDeaths" 
                                    stroke="var(--chart-red)" 
                                    fill="var(--chart-red)" 
                                    fillOpacity={0.7}
                                    name="newDeaths"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="newRecovered" 
                                    stroke="var(--chart-green)" 
                                    fill="var(--chart-green)" 
                                    fillOpacity={0.5}
                                    name="newRecovered"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Growth Rate Analysis */}
                    <Card title="Cumulative Growth Comparison" icon={BarChart3}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={allData.filter((_, index) => index % Math.ceil(allData.length / 50) === 0)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" />
                                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                                <YAxis 
                                    scale="log" 
                                    domain={['dataMin', 'dataMax']}
                                    tickFormatter={(value) => formatNumber(value)} 
                                    tick={{ fontSize: 10 }} 
                                />
                                <Tooltip 
                                    formatter={formatTooltipValue}
                                    contentStyle={{ 
                                        backgroundColor: 'var(--bg-primary)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: '8px' 
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="cases" 
                                    stroke="var(--chart-blue)" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="cases"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="deaths" 
                                    stroke="var(--chart-red)" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="deaths"
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="recovered" 
                                    stroke="var(--chart-green)" 
                                    strokeWidth={2}
                                    dot={false}
                                    name="recovered"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Footer */}
                <div className="footer">
                    <p>Historical data from disease.sh API | Total data points: {allData.length} | Period: {allData.length > 0 ? `${allData[0]?.date} to ${latestData?.date}` : 'Loading...'}</p>
                </div>
            </div>
        </div>
    );
}