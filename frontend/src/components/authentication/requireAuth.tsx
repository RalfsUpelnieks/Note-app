import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ROUTES from "../../utils/routePaths";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } : any = useAuth();

    return (
        allowedRoles?.includes(auth?.user?.role)
            ? <Outlet/>
            : <Navigate to={ROUTES.Home}/> 
    );
}

export default RequireAuth;