import { useContext } from 'react';
import MenuProvider from '../contexts/menuProvider';

const useMenu = () => useContext(MenuProvider);

export default useMenu;