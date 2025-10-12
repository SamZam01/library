import React from 'react';
import type { Book } from '../../types/book';
import BookCard from './BookCard';
import LoadingSpinner from '../common/LoadingSpinner';
import './BookList.css'; 

interface BookListProps {
  books: Book[];
  isLoading?: boolean;
  error?: string | null;
  onAddToWishlist?: (book: Book) => void;
  onBorrowBook?: (book: Book) => void;
  showActions?: boolean;
}

const BookList: React.FC<BookListProps> = ({
  books,
  isLoading,
  error,
  onAddToWishlist,
  onBorrowBook,
  showActions = true,
}) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!books || books.length === 0) {
    return <p className="no-results">No se encontraron libros.</p>;
  }

  return (
    <div className="book-list-grid">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onAddToWishlist={onAddToWishlist}
          onBorrowBook={onBorrowBook}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default BookList;
