import { Route, Routes, Navigate  } from 'react-router-dom';
import { GetStoredAuthToken } from './utils/authToken';
import useAuth from './hooks/useAuth';
import Roles from './utils/roles';
import ROUTES from './utils/routePaths';

import RequireAuth from './components/authentication/requireAuth';
import UserLayout from './layout/userLayout';

import Login from './components/authentication/login';
import Register from './components/authentication/register';
import ForgotPassword from './components/authentication/forgotPassword';
import Dashboard from './components/admin/dashboard';
import Users from './components/admin/users';
import Files from './components/admin/files';
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
            <Route path={ROUTES.Login} element={<Login/>}/>
            <Route path={ROUTES.Register} element={<Register/>}/>
            <Route path={ROUTES.ForgotPassword}  element={<ForgotPassword/>}/>
            <Route path={`${ROUTES.ResetPassword}/:email/:token`} element={<ResetPassword/>}/>
            <Route element={<RequireAuth allowedRoles={[Roles.User]}/>}>
                <Route element={<UserLayout/>}>
                    <Route path={ROUTES.AllBooks} element={<AllBooks/>}/>
                    <Route path={`${ROUTES.Book}/:id`} element={<NoteBook/>}/>
                    <Route path={`${ROUTES.Page}/:id`} element={<NotePage/>}/>
                </Route>
            </Route>
            <Route element={<RequireAuth allowedRoles={[Roles.Admin]}/>}>
                <Route element={<AdminLayout/>}>
                    <Route path={ROUTES.Dashboard} element={<Dashboard/>}/>
                    <Route path={ROUTES.AllUsers} element={<Users/>}/>
                    <Route path={ROUTES.AllFiles} element={<Files/>}/>
                </Route>
            </Route>
            <Route path="*" element={GetStoredAuthToken() ? <Navigate to={ auth?.user?.role === Roles.Admin ? ROUTES.Dashboard : ROUTES.AllBooks} /> : <Navigate to={ROUTES.Login} />} />
        </Routes>
    );
};

export default App;
