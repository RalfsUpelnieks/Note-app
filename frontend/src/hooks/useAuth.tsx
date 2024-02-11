import { useContext } from 'react';
import AuthProvider from '../contexts/authProvider';

const useAuth = () => useContext(AuthProvider);

export default useAuth;