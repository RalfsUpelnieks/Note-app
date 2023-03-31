import Styles from '../stylesheets/Layout.module.css';

function SideNav(){
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
                    <a href="/">
                       <i className="fa fa-plus"></i>
                        <span className={Styles.navText}>Add page</span>
                    </a>
                </li>
                <li>
                    <a href="/" className={Styles.notePage}>
                        <span>
                            Personal notes
                        </span>
                    </a>
                </li>
                <li>
                    <a href="/" className={Styles.notePage}>
                        <span>
                           When life gives you lemons
                        </span>
                    </a>
                </li>
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