import { Navigate } from 'react-router-dom';

function AdminPage() {
    return (
        !localStorage.getItem('token') ? <Navigate to="/"/> :<div>
            <h2>Admin page</h2>
        </div>
    );
}

export default AdminPage;