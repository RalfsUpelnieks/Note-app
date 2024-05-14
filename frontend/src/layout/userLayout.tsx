import { Outlet } from 'react-router-dom';
import UserHeader from '../components/header/userHeader';
import SideNav from '../components/sideNav/sideNav';
import Layout from './layout';
import { BookProvider } from '../contexts/bookProvider';

function UserLayout() {
    return (
        <BookProvider>
            <Layout topNavChildren={<UserHeader/>} sideNavChildren={<SideNav/>}>
                <Outlet /> 
            </Layout>
        </BookProvider>
    );
};

export default UserLayout;