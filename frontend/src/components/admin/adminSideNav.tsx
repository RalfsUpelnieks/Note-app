import { Link } from 'react-router-dom';

function AdminSideNav() {
    const NAVIGATION_LIST = [
        {
            Name: "Users",
            To: "/users",
            Icon: "fa-users"
        },{
            Name: "Storage",
            To: "/storage",
            Icon: "fa-database"
        }
    ];

    return (
        <nav className='fixed top-0 bottom-0 left-0 w-64 select-none bg-SideMenuBackground border-0 border-r border-solid border-gray-200'>
            <ul className='pt-[57px] ps-0 m-0 list-none text-neutral-300'>
                {NAVIGATION_LIST.map((list: {Name: string, To: string, Icon: string}) => {
                    return (
                    <li className={(window.location.pathname == list.To ? ' bg-SideMenuSelected' : 'hover:bg-SideMenuHover')}>
                        <Link to={list.To} className='px-1 py-2 flex box-border text-gray-300 no-underline w-full'>
                            <i className={"text-center w-8 text-[20px] my-auto fa " + list.Icon}></i>
                            <span className='font-Arial'>{list.Name}</span>
                        </Link>
                    </li>
                    );
                })}
            </ul>
        </nav>
    );
}

export default AdminSideNav;