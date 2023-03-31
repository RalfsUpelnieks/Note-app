import React, { useState, useEffect} from 'react';
import DataRequests from '../services/DataRequests';

export default function Dashboard() {
    const [weather, setWeather] = useState([]);

    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 1000);
        setWeather(DataRequests.requestFromAPI("/WeatherForecast", "GET"));
        return () => {
            clearInterval(interval)
        };
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Time: {time}</p>
            <p>Weather: {weather[1] }</p>
        </div>
    );
}

