import { Navigate } from 'react-router-dom';

function StoragePage() {
    return (
        !localStorage.getItem('token') ? <Navigate to="/"/> :<div>
            <h2>Storage</h2>
        </div>
    );
}

export default StoragePage;