import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Styles from '../stylesheets/Layout.module.css';
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
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            console.log("Unauthorized");
            navigate('/login');
        } else {
            console.log(response);
            console.log("Problem adding page");
        }
    });
}

async function RemovePage(navigate: any, pageId: any){
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
        } else if (response.status === 401) {
            localStorage.removeItem('token');
            console.log("Unauthorized");
            navigate('/login');
        } else {
            console.log(response);
            console.log("Problem adding page");
        }
    });
}

function SideNav({pages} : any, setPages: any){
    //const initialPages = pages || [];
    // const [pageTabs, setPages] = useState(initialPages.map((data: { page: any; }) => data.page));
    // const [pages, setPages] = useState([]);
    const navigate = useNavigate()
    const openTab = useParams().id;

    const handlePageSubmit = async () => {
        await AddPage(navigate, pages);
    }

    return (
        <nav className={Styles.sideNav}>
            <ul>
                <li>
                    <a href="/">
                        <i className='fa fa-home'></i>
                        <span className={Styles.navText}>Dashboard</span>
                    </a>
                </li>
                <li>
                    <a href="/">
                        <i className="fa fa-calendar-o"></i>
                        <span className={Styles.navText}>Calendar</span>
                    </a>
                </li>
                <li>
                    <a href="/">
                       <i className="fa fa-thumb-tack"></i>
                        <span className={Styles.navText}>Events</span>
                    </a>
                </li>
                <li>
                    <a onClick={handlePageSubmit}>
                       <i className="fa fa-plus"></i>
                        <span className={Styles.navText}>Add page</span>
                    </a>
                </li>
                {pages.map((Object: { pageId: any; title: any; }) => {
                    var isSelected = Object.pageId == openTab;
                    return (
                        <li className={`${Styles.notePage} ${isSelected ? Styles.selectedNote : null}`}>
                            <a href={`/page/${Object.pageId}`} className={Styles.textLink}>
                                <span>{Object.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || "Untitled"}</span>
                            </a>
                            <a href='' onClick={() => RemovePage(navigate, Object.pageId)} className={Styles.noteIcon}><i className="fa fa-trash"></i></a>
                        </li>
                    );
                })}
            </ul>
            <ul className={Styles.settings}>
                <li>
                   <a href="/">
                        <i className="fa fa-cogs"></i>
                        <span className={Styles.navText}>Settings</span>
                    </a>
                </li>  
            </ul>
        </nav>
    );
}

export default SideNav;