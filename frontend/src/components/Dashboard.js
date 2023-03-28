import React from 'react';

async function getWheather() {
    return fetch('http://localhost:5000/api/WeatherForecast')
    .then(response => {
        if (response.ok) {
          return response.json();

        } else {
          console.error(response.text());
          return null;
        }
    })
}

export default function Dashboard() {
    return (
        <div>
            <h2>Dashboard</h2>
            {/* <h4>{getWheather()}</h4> */}
        </div>
    );
}

