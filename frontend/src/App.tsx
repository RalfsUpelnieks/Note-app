import React from 'react';
import { Route, Routes, Navigate, useParams, useLocation, useNavigate } from 'react-router-dom';
import Login from './components/login';
import Profile from './components/profile';
import Users from './components/users';
import Dashboard from './components/dashboard';
import AdminPage from './components/adminPage';
import Layout from './components/layout';
import EditablePage from './components/editablePage';
import configData from './config.json'



function GetPage({pages}: any) {
    const params = useParams();
    const blocks = [{ _id: "1", tag: "p", html: "test test test", imageUrl: "", position: 1 }, {  _id: "2", tag: "p", html: "This is text", imageUrl: "", position: 2 }];
    // const blocks = [];
    if(pages.length === 0){
        return (
            <div>
              <h3>Something went wrong!</h3>
              <p>Have you tried to restart the app at '/' ?</p>
            </div>
          );
    } else {
        return <EditablePage id={params.id} fetchedBlocks={blocks} err={""} />;
    }
}

function App() {
    const navigate = useNavigate();
    const [pages, setPages] = React.useState([]);
    const [user, setUser] = React.useState({
        role: "",
        email: "",
        username: "",
        name: "",
        surname: "",
    });

    React.useEffect(() => {
        const updatePages = async () => {
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
                        setUser({
                            role: data.role,
                            email: data.emailAddress,
                            username: data.username,
                            name: data.name,
                            surname: data.surname,
                        });
                    });
                } else {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        };
        updatePages();
    }, []);



    return (
        <Routes>
            <Route path="/login" element={<Login setUser={setUser}/>}/>
            
            <Route element={<Layout pages={pages} setPages={setPages} user={user}/>}>
                <Route path="/dashboard" element={<Dashboard/>}/>
                <Route path="/profile" element={<Profile user={user} setUser={setUser}/>}/>
                <Route path="/users" element={<Users/>}/>
                <Route path="/page/:id" element={<GetPage pages={pages}/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Route>
            <Route path="*" element={localStorage.getItem('token') ? <Navigate to={user.role == "1" ? '/admin' : '/dashboard'} /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;     
