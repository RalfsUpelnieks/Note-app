import styles from '../stylesheets/Layout.module.css'

function Header(){
    function logOutUser(){
        localStorage.removeItem('token');
        window.location.reload();
    }
    return (
        <header className={styles.header}>
            <h1>Note app</h1>
            <button  onClick={logOutUser}>Log out</button>
        </header>
    )
}

export default Header;