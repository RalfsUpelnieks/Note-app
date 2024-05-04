import { useContext } from 'react';
import BookProvider from '../contexts/bookProvider';

const useBooks = () => useContext(BookProvider);

export default useBooks;