import { Navigate } from 'react-router-dom';

function Events() {
    return (
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <div>
            <h2>Events</h2>
        </div>
    );
}

export default Events;