import { Navigate } from 'react-router-dom';

function Dashboard() {
    return (
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <div>
            <h2>dashboard</h2>
        </div>
    );
}

export default Dashboard