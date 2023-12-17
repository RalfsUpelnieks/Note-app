import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './header';
import SideNav from './sideNav';
import styles from '../stylesheets/Layout.module.css';
import configData from '../config.json'
import User from '../interfaces/userInterface'

interface LayoutProps {
    pages: never[]
    setPages: React.Dispatch<React.SetStateAction<never[]>>
    user?: User
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

function Layout({pages, setPages, user, setUser} : LayoutProps) {
    const navigate = useNavigate()
    

    useEffect(() => {
        let bearer = 'Bearer ' + localStorage.getItem('token');

        fetch('http://localhost:' + configData.APIPort + '/api/User', {
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
                return;
            }
        })

        fetch('http://localhost:' + configData.APIPort + '/api/Note/GetTitles', {
            method: 'GET',
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
        }}).then(response => {
            if (response.ok) {
                response.json().then(data => { 
                    console.log("Get page data from server");
                    setPages(data);
                });
            } else if (response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        })
    }, []);

    return (
        <div>
            <Header isAdmin={user?.role == "1"} pages={pages}/>
            <SideNav pages={pages} setPages={setPages} isAdmin={user?.role == "1"}/>
            <main className={styles.content}>
                <Outlet context={[pages, setPages]} />  
            </main>
        </div>
    );
};

export default Layout;