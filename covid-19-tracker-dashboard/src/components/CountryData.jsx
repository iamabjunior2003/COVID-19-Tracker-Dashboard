import React, { useState,useEffect } from 'react'
import axios from 'axios'

export default function CountryData() {
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

        </div>
    )
}
