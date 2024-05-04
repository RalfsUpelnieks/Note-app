import { useContext } from 'react';
import ConfirmationProvider from '../contexts/confirmationProvider';

const useConfirmation = () => useContext(ConfirmationProvider);

export default useConfirmation;