import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserHeader from '../components/header/userHeader';
import SideNav from '../components/sideNav/sideNav';
import useAuth from '../hooks/useAuth';
import Layout from './layout';
import { BookProvider } from '../contexts/bookProvider';

function UserLayout() {
    const { LogOut } : any = useAuth()
    const [pages, setPages] = useState([]);

    return (
        <BookProvider>
            <Layout topNavChildren={<UserHeader pages={pages}/>} sideNavChildren={<SideNav/>}>
                <Outlet context={[pages, setPages]} /> 
            </Layout>
        </BookProvider>
    );
};

export default UserLayout;