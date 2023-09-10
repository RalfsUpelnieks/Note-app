import React, { useState}  from 'react';
import { Route, Routes, Navigate, useParams, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import Users from './components/users';
import Dashboard from './components/dashboard';
import AdminPage from './components/adminPage';
import Layout from './components/layout';
import EditablePage from './components/editablePage';
import configData from './config.json'
import User from './interfaces/userInterface'



function GetPage({pages, navigate}: any) {
    const params = useParams();
    const [blocks, setBlocks] = useState([]);

    React.useEffect(() => {
        async function updateBlocks() {
            let bearer = 'Bearer ' + localStorage.getItem('token');
    
            await fetch('http://localhost:' + configData.APIPort + `/api/Note/GetBlockData/${params.id}`, {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Authorization': bearer,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    response.json().then(data => { 
                        console.log("Get block data from server");
                        setBlocks(data);
                    });
                } else if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        };
        updateBlocks();
    }, [params.id]);

    if(pages.length === 0){
        return (
            <div></div>
        );
    } else {
        return <EditablePage pageId={params.id} fetchedBlocks={blocks} err={""} />;
    }
}

function App() {
    const navigate = useNavigate();
    const [pages, setPages] = React.useState([]);
    const [user, setUser] = React.useState<User>();

    React.useEffect(() => {
        async function updateUserData() {
            let bearer = 'Bearer ' + localStorage.getItem('token');
    
            await fetch('http://localhost:' + configData.APIPort + '/api/User', {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
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
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
                <Route path="/users" element={<Users />}/>
                <Route path="/page/:id" element={<GetPage pages={pages} navigate={navigate}/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Route>
            <Route path="*" element={localStorage.getItem('token') ? <Navigate to={user?.role === "1" ? '/admin' : '/dashboard'} /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;     
