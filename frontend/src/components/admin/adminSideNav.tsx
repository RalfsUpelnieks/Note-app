import { Link } from 'react-router-dom';
import { IconDashboard, IconUsers, IconFiles } from '../../icons';
import ROUTES from '../../utils/routePaths';

function AdminSideNav() {
    const NAVIGATION_LIST = [
        {
            Name: "Dashboard",
            To: ROUTES.Dashboard,
            Icon: <IconDashboard/>
        },
        {
            Name: "Users",
            To: ROUTES.AllUsers,
            Icon: <IconUsers/>
        },
        {
            Name: "Files",
            To: ROUTES.AllFiles,
            Icon: <IconFiles/>
        }
    ];

    return (
        <nav className='max-w-[15rem] w-full select-none bg-SideMenuBackground border-0 border-r border-solid border-gray-200'>
            <ul className='ps-0 m-0 list-none text-neutral-300'>
                {NAVIGATION_LIST.map((list: {Name: string, To: string, Icon: JSX.Element}) => {
                    return (
                    <li key={list.Name} className={(window.location.pathname == list.To ? ' bg-SideMenuSelected' : 'hover:bg-SideMenuHover')}>
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