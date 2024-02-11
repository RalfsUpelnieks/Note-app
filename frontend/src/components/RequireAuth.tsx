import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
    const { auth } : any = useAuth();
    const [pages, setPages] : any = useOutletContext();

    return (
        allowedRoles?.includes(auth?.user?.role)
            ? <Outlet context={[pages, setPages]} />
            : <Navigate to="/"/> 
    );
}

export default RequireAuth;