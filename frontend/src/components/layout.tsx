import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import SideNav from './sideNav';
import styles from '../stylesheets/Layout.module.css';
import useAuth from '../hooks/useAuth';
import api from '../utils/api';

function Layout() {
    const { auth, LogOut } : any = useAuth()
    const [pages, setPages] = useState([]);
    
    useEffect(() => {
        api.get("/api/Note/GetTitles").then(response => {
            if (response?.ok) {
                response?.json().then(data => { 
                    console.log("Get page data from server");
                    setPages(data);
                });
            } else if (response?.status === 401) {
                LogOut();
            }
        })
    }, []);

    return (
        <>
            <Header user={auth.user} pages={pages}/>
            <SideNav pages={pages} setPages={setPages} isAdmin={auth?.user?.role == "1"}/>
            <main className={styles.content}>
                <Outlet context={[pages, setPages]} />  
            </main>
        </>
    );
};

export default Layout;