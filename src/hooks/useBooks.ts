import { useContext } from 'react';
import { BooksContext } from '../context/BooksContext';

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooks debe ser usado dentro de un BooksProvider');
  }
  return context;
};
    