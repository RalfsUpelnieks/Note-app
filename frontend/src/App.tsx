import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import styles from './App.module.css'
import Login from './components/Login';


function App() {
    const [token, setToken] = useState() 

    if(!token){
        return <Login setToken={setToken} />
    }

    return (
        <div className={styles.wrapper}>
            <h1>Application</h1>
            <BrowserRouter>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
};

export default App;     
