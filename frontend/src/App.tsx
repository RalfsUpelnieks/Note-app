import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import AdminPage from './components/AdminPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';



function App() {
    //test function
    function isAuthorized() {
        if (localStorage.getItem('token') !== null) {
            return true;
        }
        return false;
    }

    const [isAdmin, setIsAdmin] = React.useState(false);

    return (
        <Routes>
            <Route path="/" element= {isAuthorized() ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> :  <Navigate to="/login" />} />

            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>

            <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default App;     
