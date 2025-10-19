import React, { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Book } from '../types/book';
import { searchBooks, getBookDetails } from '../api/openLibrary';
import { useDebounce } from '../hooks/useDebounce';
import { BooksContext } from './BooksContext';
import type { Filters } from '../types/filters'; 

interface BooksProviderProps {
  children: ReactNode;
}

export const BooksProvider: React.FC<BooksProviderProps> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(
    async (
      query: string,
      filters: Partial<Filters> = {},
      limit?: number,
      offset?: number
    ) => {
      if (!query.trim()) {
        setBooks([]);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await searchBooks(query, filters, limit, offset);
        setBooks(result.books);
      } catch (err) {
        setError('No se pudieron cargar los libros. Inténtalo de nuevo.');
        console.error('Error in BooksContext search:', err);
      } finally {
        setIsLoading(false);
      }
    },
    500
  );

  const search = useCallback(
    async (
      query: string,
      filters: Partial<Filters> = {},
      limit?: number,
      offset?: number
    ) => {
      await debouncedSearch(query, filters, limit, offset);
    },
    [debouncedSearch]
  );

  const fetchBookDetails = useCallback(async (bookId: string): Promise<Book | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const book = await getBookDetails(bookId);
      return book;
    } catch (err) {
      setError('No se pudieron cargar los detalles del libro.');
      console.error('Error in BooksContext fetchBookDetails:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <BooksContext.Provider value={{ books, isLoading, error, search, fetchBookDetails }}>
      {children}
    </BooksContext.Provider>
  );
};
