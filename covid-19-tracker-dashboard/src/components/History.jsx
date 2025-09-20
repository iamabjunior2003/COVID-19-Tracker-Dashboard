import React, { useState,useEffect } from 'react'
import axios from 'axios'

export default function History() {
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
    return (
        <div>

        </div>
    )
}
