import { Navigate } from 'react-router-dom';

function Search() {
    return (
        !localStorage.getItem('token') ? <Navigate to="/login"/> :
        <div>
            <h2>Search</h2>
            <input type="text" placeholder="Search..."/>
        </div>
    );
}

export default Search;