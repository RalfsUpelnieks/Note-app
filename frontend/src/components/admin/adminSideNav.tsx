import { Link } from 'react-router-dom';
import { IconDashboard, IconUsers } from '../../icons';

function AdminSideNav() {
    const NAVIGATION_LIST = [
        {
            Name: "Dashboard",
            To: "/storage",
            Icon: <IconUsers/>
        },
        {
            Name: "Users",
            To: "/users",
            Icon: <IconDashboard/>
        }
    ];

    return (
        <nav className='fixed top-0 bottom-0 left-0 w-64 select-none bg-SideMenuBackground border-0 border-r border-solid border-gray-200'>
            <ul className='pt-[57px] ps-0 m-0 list-none text-neutral-300'>
                {NAVIGATION_LIST.map((list: {Name: string, To: string, Icon: JSX.Element}) => {
                    return (
                    <li className={(window.location.pathname == list.To ? ' bg-SideMenuSelected' : 'hover:bg-SideMenuHover')}>
                        <Link to={list.To} className='flex py-1 items-center  box-border text-gray-300 no-underline w-full'>
                            <div className='mx-2'>
                                {list.Icon}
                            </div>
                            <span className='flex h-4 leading-3'>{list.Name}</span>
                        </Link>
                    </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default AdminSideNav;