import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } : any = useAuth();

    return (
        allowedRoles?.includes(auth?.user?.role)
            ? <Outlet/>
            : <Navigate to="/"/> 
    );
}

export default RequireAuth;