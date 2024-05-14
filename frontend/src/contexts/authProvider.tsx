import { createContext, useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { GetStoredAuthToken, RemoveStoredAuthToken } from '../utils/authToken';
import api from '../utils/api';
import ROLES from "../utils/roles";
import ROUTES from "../utils/routePaths";

const AuthContext = createContext({});

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null
};

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(initialState);
    const navigate = useNavigate()
    const initialized = useRef(false);

    const initialize = async () => {
        // Prevent from calling twice in development mode with React.StrictMode enabled
        if (initialized.current) {
          return;
        }
    
        initialized.current = true;
    
        if(GetStoredAuthToken()) {
            api.get("/api/User").then(response => {
                if (response?.ok) {
                    response?.json().then(data => { 
                        console.log("Get user data from server");
                        setAuth({
                            isAuthenticated: true,
                            isLoading: false,
                            user: data
                        })
                    });
                } else if (response?.status === 401){
                    LogOut();
                } else {
                    setAuth({
                        ...auth,
                        isLoading: false,
                    })
                }
            });
        } else {
            setAuth({
                ...auth,
                isLoading: false,
            })
        }
    }
    
    useEffect(() => {
        initialize();
    }, []);

    function LogIn(Username: string, Password: string, setErrMsg: React.Dispatch<React.SetStateAction<string>>) {
        api.post("/api/Auth/login", JSON.stringify({Username, Password})).then(response => {
            if (response?.ok) {
                response?.json().then(data => { 
                    localStorage.setItem('token', data.token);

                    setAuth({
                        isAuthenticated: true,
                        isLoading: false,
                        user: data
                    });

                    navigate(data.role == ROLES.Admin ? ROUTES.Dashboard : ROUTES.Page );
                });
            } else {
                response?.json().then(data => {
                    setErrMsg(data.error);
                    console.log(data);
                });
            }
        });
    }

    function LogOut() {
        setAuth({
            isAuthenticated: false,
            isLoading: false,
            user: null
        });
        RemoveStoredAuthToken();
        navigate(ROUTES.Login);
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth, LogIn, LogOut }}>
            {
                !auth.isLoading 
                    && children
            }
        </AuthContext.Provider>
    )
}

export default AuthContext;