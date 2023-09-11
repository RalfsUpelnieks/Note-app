import { useNavigate } from 'react-router-dom';
import styles from '../stylesheets/Layout.module.css'

function Header({isAdmin} : any) {
    const navigate = useNavigate();

    function logOutUser(){
        localStorage.removeItem('token');
        navigate("/login")
    }
    
    return (
        <header className={styles.header}>
            <h1>Note app</h1>
            {isAdmin ? <h4>admin page</h4>: null}
            <button onClick={logOutUser}>Log out</button>
        </header>
    )
}

export default Header;