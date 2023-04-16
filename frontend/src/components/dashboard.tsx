import {Navigate } from 'react-router-dom';

export default function Dashboard() {
    return (
        !localStorage.getItem('token') ? <Navigate to="/"/> :<div>
            <h2>dashboard</h2>
        </div>
    );
}