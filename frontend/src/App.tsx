import React, { useState }  from 'react';
import configData from './config.json'
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import Users from './components/users';
import AdminPage from './components/adminPage';
import Layout from './components/layout';
import User from './interfaces/userInterface'
import Search from './components/search';
import Events from './components/events';
import StoragePage from './components/storage';
import NotePage from './components/NotePage'

function App() {
    const navigate = useNavigate();
    const [pages, setPages] = useState([]);
    const [user, setUser] = useState<User>();

    React.useEffect(() => {
        async function updateUserData() {
            let bearer = 'Bearer ' + localStorage.getItem('token');
    
            await fetch('http://localhost:' + configData.APIPort + '/api/User', {
                method: 'GET',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
            }}).then(response => {
                if (response.ok) {
                    response.json().then(data => { 
                        console.log("Get user data from server");
                        setUser(data);
                    });
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        };
        updateUserData();
    }, []);

    return (
        <Routes>
            <Route path="/login" element={<Login setUser={setUser}/>}/>
            
            <Route element={<Layout pages={pages} setPages={setPages} user={user}/>}>
                <Route path="/search" element={<Search/>}/>
                <Route path="/events" element={<Events />}/>
                <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
                <Route path="/page/:id" element={<NotePage pages={pages} navigate={navigate}/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/users" element={<Users />}/>
                <Route path="/storage" element={<StoragePage />}/>
            </Route>
            <Route path="*" element={localStorage.getItem('token') ? <Navigate to={user?.role == "1" ? '/admin' : '/search'} /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;     
