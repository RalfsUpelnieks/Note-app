import styles from '../stylesheets/Layout.module.css'

function Header(){
    return (
        <header className={styles.header}>
            <h1>Note app</h1>
            <button className="header__button">Log out</button>
        </header>
    )
}

export default Header;