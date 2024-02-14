import { Route, Routes, Navigate  } from 'react-router-dom';
import { GetStoredAuthToken } from './utils/authToken';
import useAuth from './hooks/useAuth';
import Roles from './utils/Roles';

import RequireAuth from './components/RequireAuth';
import Login from './components/login';
import Users from './components/users';
import AdminPage from './components/adminPage';
import Layout from './components/layout';
import StoragePage from './components/storage';
import PageManager from './components/pageManager';

function App() {
    const { auth } : any = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route element={<Layout/>}>
                <Route element={<RequireAuth allowedRoles={[Roles.User]}/>}>
                    <Route path="/page" element={<PageManager/>}/>
                    <Route path="/page/:id" element={<PageManager/>}/>
                </Route>
                <Route element={<RequireAuth allowedRoles={[Roles.Admin]}/>}>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/storage" element={<StoragePage/>}/>
                </Route>
            </Route>
            <Route path="*" element={GetStoredAuthToken() ? <Navigate to={ auth?.user?.role === Roles.Admin ? '/users' : '/page'} /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;     
