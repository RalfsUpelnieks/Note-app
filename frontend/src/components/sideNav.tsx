import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from '../stylesheets/Layout.module.css';
import objectId from "../utils/objectId";
import useAuth from '../hooks/useAuth';
import ConfirmModal from './ConfirmModal';
import api from '../utils/api';

interface SideNavProps {
    pages: never[]
    setPages: React.Dispatch<React.SetStateAction<never[]>>
    isAdmin: boolean
}

const confirmDeletionInitialState : any = {
    isOpen: false,
    action: null,
    itemName: ''
};

function SideNav({pages, setPages, isAdmin} : SideNavProps) {
    const [confirmDeletion, setConfirmDeletion] = useState(confirmDeletionInitialState);
    const { LogOut } : any = useAuth()
    const navigate = useNavigate()
    const openTab = useParams().id;

    async function AddPage(pages: any){
        var pageId = objectId();
    
        api.post("/api/Note/AddPage", JSON.stringify({pageId: pageId, title: ""})).then(response => {
            if (response?.ok) {
                console.log("Page added");
                pages.push({pageId: pageId, title: ""});
                navigate(`/page/${pageId}`);
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    async function RemovePage(pageId: string, pages : any, setPages : any, isSelected: boolean){
        api.delete(`/api/Note/RemovePage/${pageId}`).then(response => {
            if (response?.ok) {
                console.log("Page removed");
                setPages(pages.filter((page: { pageId: string; }) => page.pageId !== pageId));
                if(isSelected){
                    navigate('/dashboard');
                }
            } else if (response?.status == 401) {
                LogOut();
            }
        });
    }

    async function handlePageSubmit() {
        await AddPage(pages);
    }

    function handlePageDeletionCheck(page, isSelected) {
        setConfirmDeletion({
            isOpen: true,
            action: () => RemovePage(page.pageId, pages, setPages, isSelected),
            itemName: `book "${page.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || "Untitled"}"`
        })
    }

    return (
        <>
            {confirmDeletion.isOpen && <ConfirmModal closePanel={() => setConfirmDeletion({ ...confirmDeletion, isOpen: false })} action={confirmDeletion.action} itemName={confirmDeletion.itemName} />}
            <nav className={styles.sideNav}>
                <ul>
                    {isAdmin ?
                    <>
                        <li className={window.location.pathname == "/profile" ? styles.selectedNote : ""}>
                            <Link to="/profile">
                                <i className='fa fa-user'></i>
                                <span className={styles.navText}>Profile</span>
                            </Link>
                        </li>
                        <li className={window.location.pathname == "/users" ? styles.selectedNote : ""}>
                            <Link to="/users">
                                <i className="fa fa-users"></i>
                                <span className={styles.navText}>Users</span>
                            </Link>
                        </li>
                        <li className={window.location.pathname == "/storage" ? styles.selectedNote : ""}>
                            <Link to="/storage">
                                <i className="fa fa-database"></i>
                                <span className={styles.navText}>Storage</span>
                            </Link>
                        </li>
                    </>
                    : 
                    <>
                        <span className={styles.pagesText}>Books</span>
                        <div>
                            {pages.map((Object: { pageId: string; title: string; }) => {
                                var isSelected = Object.pageId == openTab;
                                return (
                                    <li key={Object.pageId} className={`${styles.notePage} ${isSelected ? styles.selectedNote : null}`}>
                                        <Link to={`/page/${Object.pageId}`} className={styles.textLink}>
                                            <span>{Object.title.replaceAll("&nbsp;", " ").replaceAll("<br>", " ") || "Untitled"}</span>
                                        </Link>
                                        <a href="#!" onClick={() => handlePageDeletionCheck(Object, isSelected)} className={styles.noteIcon}><i className="fa fa-trash"></i></a>
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
        </>
    );
}

export default SideNav;