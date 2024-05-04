import { Route, Routes, Navigate  } from 'react-router-dom';
import { GetStoredAuthToken } from './utils/authToken';
import useAuth from './hooks/useAuth';
import Roles from './utils/roles';

import RequireAuth from './components/authentication/requireAuth';
import UserLayout from './layout/userLayout';

import Login from './components/authentication/login';
import Register from './components/authentication/register';
import Users from './components/users';
import AdminPage from './components/adminPage';
import StoragePage from './components/storage';
import NotePage from './components/notePages/notePage';
import './stylesheets/site.css'
import AdminLayout from './layout/adminLayout';
import NoteBook from './components/notePages/noteBook';
import AllBooks from './components/allBooks';

function App() {
    const { auth } : any = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<RequireAuth allowedRoles={[Roles.User]}/>}>
                <Route element={<UserLayout/>}>
                    <Route path="/Book/view" element={<AllBooks/>}/>
                    <Route path="/book/:id" element={<NoteBook/>}/>
                    <Route path="/page/:id" element={<NotePage/>}/>
                </Route>
            </Route>
            <Route element={<RequireAuth allowedRoles={[Roles.Admin]}/>}>
                <Route element={<AdminLayout/>}>
                    <Route path="/admin" element={<AdminPage/>}/>
                    <Route path="/users" element={<Users/>}/>
                    <Route path="/storage" element={<StoragePage/>}/>
                </Route>
            </Route>
            <Route path="*" element={GetStoredAuthToken() ? <Navigate to={ auth?.user?.role === Roles.Admin ? '/users' : '/Book/view'} /> : <Navigate to="/login" />} />
        </Routes>
    );
};

export default App;
