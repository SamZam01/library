import { createContext } from 'react';
import type { Book } from '../types/book';

interface BooksContextType {
  books: Book[];
  isLoading: boolean;
  error: string | null;
  search: (query: string, filters?: {
    subject?: string;
    author?: string;
    title?: string;
    language?: string;
    firstPublishYear?: number | string;
    sort?: 'new' | 'old' | 'title' | 'author';
  }, limit?: number, offset?: number) => Promise<void>;
  fetchBookDetails: (bookId: string) => Promise<Book | null>;
}


export const BooksContext = createContext<BooksContextType | undefined>(undefined);
