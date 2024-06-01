import { Outlet } from 'react-router-dom';
import UserHeader from '../components/header/userHeader';
import SideNav from '../components/sideNav/sideNav';
import Layout from './layout';
import { BookProvider } from '../contexts/bookProvider';
import { MenuProvider } from '../contexts/menuProvider';

function UserLayout() {
    return (
        <BookProvider>
            <MenuProvider>
                <Layout topNavChildren={<UserHeader/>} sideNavChildren={<SideNav/>}>
                    <Outlet /> 
                </Layout>
            </MenuProvider>
        </BookProvider>
    );
};

export default UserLayout;