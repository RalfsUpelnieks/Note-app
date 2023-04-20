import React from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/dashboard';
import AdminPage from './components/AdminPage';
import Layout from './components/Layout';
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
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [pages, setPages] = React.useState([]);

    function isAuthorized() {
        if (localStorage.getItem('token') !== null) {
            console.log(isAdmin);
            return true;
        }
        return false;
    }

    return (
        <Routes>
            <Route path="/" element= {isAuthorized() ? <Navigate to={isAdmin ? '/admin' : '/dashboard'} /> :  <Navigate to="/login" />} />

            <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />}/>
            
            <Route element={<Layout pages={pages} setPages={setPages} isAdmin={isAdmin} />}>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/page/:id" element={<GetPage pages={pages}/>}/>
                <Route path="/admin" element={<AdminPage/>}/>
            </Route>
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
    );
};

export default App;     
