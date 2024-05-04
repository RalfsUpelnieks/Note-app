import { Outlet } from 'react-router-dom';
import AdminSideNav from '../components/admin/adminSideNav';
import Layout from './layout';
import AdminHeader from '../components/header/adminHeader';

function AdminLayout() {
    return (
        <Layout topNavChildren={<AdminHeader/>} sideNavChildren={<AdminSideNav/>}>
            <Outlet /> 
        </Layout>
    );
};

export default AdminLayout;