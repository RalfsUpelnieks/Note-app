import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './header';
import SideNav from './sideNav';
import styles from '../stylesheets/Layout.module.css';
import configData from '../config.json'

function Layout({pages, setPages, user} : any) {
    const navigate = useNavigate()

    useEffect(() => {
        async function updatePages() {
            let bearer = 'Bearer ' + localStorage.getItem('token');

            await fetch('http://localhost:' + configData.APIPort + '/api/Note/GetTitles', {
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
                        console.log("Get page data from server");
                        setPages(data);
                        return data;
                    });
                } else if (response.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            })
        };
        updatePages();
    }, []);

    return (
        <div>
            <Header />
            <SideNav pages={pages} setPages={setPages} isAdmin={user.role == "1"}/>
            <main className={styles.content}>
                <Outlet context={[pages, setPages]} />  
            </main>
        </div>
    );
};

export default Layout;