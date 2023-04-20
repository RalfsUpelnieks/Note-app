import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import style from '../stylesheets/Layout.module.css';
import configData from '../config.json'

export default function Layout({pages, setPages, isAdmin} : any) {
  const navigate = useNavigate()

  useEffect(() => {
    const updatePages = async () => {
        let bearer = 'Bearer ' + localStorage.getItem('token');

        await fetch('http://localhost:' + configData.APIPort + '/api/Note', {
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
      <SideNav pages={pages} isAdmin={isAdmin}/>
      <main className={style.content}>
        <Outlet context={[pages, setPages]} />  
      </main>
    </div>
  );
};