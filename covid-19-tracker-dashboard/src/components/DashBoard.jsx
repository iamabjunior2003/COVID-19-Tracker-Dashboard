import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

export default function DashBoard() {

    const [alldata, setAllData] = useState([]);
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
        <div>
            <h1>Hey:) This is Dashboard</h1>
            <div>
                <h2>User Details: </h2>
                <div>Cases : {alldata.cases}</div>
                <div>Deaths: {alldata.deaths}</div>
                <div>Recovered: {alldata.recovered}</div>
                <div>Active: {alldata.active}</div>
                <div>Critical: {alldata.critical}</div>
                <div>Tests: {alldata.tests}</div>
                <div>Population: {alldata.population}</div>
                <div>Updated: {new Date(alldata.updated).toLocaleString()}</div>
            </div>
        </div>
    )
}
