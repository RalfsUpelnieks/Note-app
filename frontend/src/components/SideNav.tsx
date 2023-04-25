import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../stylesheets/Layout.module.css';
import configData from '../config.json'
import objectId from "../utils/objectId";

async function AddPage(navigate: any, pages: any){
    var pageId = objectId();
    let bearer = 'Bearer ' + localStorage.getItem('token');

    await fetch('http://localhost:' + configData.APIPort + '/api/Note/AddPage', {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pageId: pageId, title: ""})
    })
    .then(response => {
        if (response.ok) {
            console.log("Page added");
            pages.push({pageId: pageId, title: ""});
            navigate(`/page/${pageId}`);
        } else {
            localStorage.removeItem('token');
            console.log("Unauthorized");
            navigate('/login');
        }
    });
}

async function RemovePage(navigate: any, pageId: any, pages : any, setPages : any, isSelected: boolean){
    let bearer = 'Bearer ' + localStorage.getItem('token');

    await fetch('http://localhost:' + configData.APIPort + `/api/Note/Remove/${pageId}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
    })
    .then(response => {
        if (response.ok) {
            console.log("Page removed");
            setPages(pages.filter((page: { pageId: string; }) => page.pageId !== pageId));
            if(isSelected){
                navigate('/dashboard');
            }

        } else {
            localStorage.removeItem('token');
            console.log("Unauthorized");
            navigate('/login');
        }
    });
}

function SideNav({pages, setPages, isAdmin} : any){
    const navigate = useNavigate()
    const openTab = useParams().id;

    async function handlePageSubmit() {
        await AddPage(navigate, pages);
    }

    return (
        <nav className={styles.sideNav}>
            <ul>
                {isAdmin ?
                <>
                    <li>
                        <Link to="/">
                            <i className='fa fa-home'></i>
                            <span className={styles.navText}>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile">
                            <i className='fa fa-user'></i>
                            <span className={styles.navText}>Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/users">
                            <i className="fa fa-users"></i>
                            <span className={styles.navText}>Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/">
                            <i className="fa fa-database"></i>
                            <span className={styles.navText}>Storage</span>
                        </Link>
                    </li>
                </>
                : 
                <>
                    <li>
                        <Link to="/">
                            <i className='fa fa-search'></i>
                            <span className={styles.navText}>Search</span>
                        </Link>
                    </li>
                    
                    <li>
                        <Link to="/">
                            <i className="fa fa-calendar-o"></i>
                            <span className={styles.navText}>Events</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/profile">
                            <i className='fa fa-user'></i>
                            <span className={styles.navText}>Profile</span>
                        </Link>
                    </li>
                    <span className={styles.pagesText}>Pages</span>
                    <div>
                        {pages.map((Object: { pageId: any; title: any; }) => {
                            var isSelected = Object.pageId == openTab;
                            return (
                                <li key={Object.pageId} className={`${styles.notePage} ${isSelected ? styles.selectedNote : null}`}>
                                    <Link to={`/page/${Object.pageId}`} className={styles.textLink}>
                                        <span>{Object.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || "Untitled"}</span>
                                    </Link>
                                    <a href="#!" onClick={() => RemovePage(navigate, Object.pageId, pages, setPages, isSelected)} className={styles.noteIcon}><i className="fa fa-trash"></i></a>
                                </li>
                            );
                        })}
                        <li className={styles.innerAddPage}>
                            <a href="#!" onClick={handlePageSubmit} className={styles.textLink}>
                                <i className="fa fa-plus"></i>
                                <span>Add page</span>
                            </a>
                        </li>
                    </div>
                    <a href="#!" onClick={handlePageSubmit} className={styles.addPage}>
                        <i className="fa fa-plus"></i>
                        <span className={styles.navText}>Add page</span>
                    </a>
                </>}
            </ul>
        </nav>
    );
}

export default SideNav;