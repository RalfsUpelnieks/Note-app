import React, { useState }  from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import Users from './components/users';
import AdminPage from './components/adminPage';
import Layout from './components/layout';
import User from './interfaces/userInterface'
import Events from './components/events';
import StoragePage from './components/storage';
import PageManager from './components/pageManager';
function App() {
    const [pages, setPages] = useState([]);
    const [user, setUser] = useState<User>();

    return (
        <Routes>
            <Route path="/login" element={<Login setUser={setUser}/>}/>
            
            <Route element={<Layout pages={pages} setPages={setPages} user={user} setUser={setUser}/>}>
                <Route path="/events" element={<Events />}/>
                <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
                <Route path="/page/:id" element={<PageManager pages={pages}/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
                <Route path="/users" element={<Users/>}/>
                <Route path="/storage" element={<StoragePage/>}/>
            </Route>
            <Route path="*" element={localStorage.getItem('token') ? <Navigate to={user?.role == "1" ? '/profile' : '/profile'} /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;     
