import { Route, Routes, Navigate  } from 'react-router-dom';
import { GetStoredAuthToken } from './utils/authToken';
import useAuth from './hooks/useAuth';
import Roles from './utils/roles';

import RequireAuth from './components/authentication/requireAuth';
import UserLayout from './layout/userLayout';

import Login from './components/authentication/login';
import Register from './components/authentication/register';
import ForgotPassword from './components/authentication/forgotPassword';
import Users from './components/admin/users';
import AdminPage from './components/admin/adminPage';
import StoragePage from './components/admin/storage';
import NotePage from './components/notes/notePage';
import './stylesheets/site.css'
import AdminLayout from './layout/adminLayout';
import NoteBook from './components/notes/noteBook';
import AllBooks from './components/notes/allBooks';
import ResetPassword from './components/authentication/resetPassword';

function App() {
    const { auth } : any = useAuth()

    return (
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgotPassword" element={<ForgotPassword/>}/>
            <Route path="/resetpassword/:email/:token" element={<ResetPassword/>}/>
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
