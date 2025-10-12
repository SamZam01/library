import React from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../../types/book';
import { getCoverImageUrl } from '../../api/openLibrary';
import Button from '../common/Button';
import './BookCard.css'; 

interface BookCardProps {
  book: Book;
  onAddToWishlist?: (book: Book) => void;
  onBorrowBook?: (book: Book) => void;
  showActions?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onAddToWishlist, onBorrowBook, showActions = true }) => {
  const coverUrl = getCoverImageUrl(book.coverId, 'M');

  return (
    <div className="book-card">
      <Link to={`/books/${book.id?.split('/').pop()}`} className="book-card-link">
        <img src={coverUrl} alt={`Portada de ${book.title}`} className="book-card-cover" />
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.authors?.join(', ')}</p>
        {book.firstPublishYear && <p className="book-card-year">({book.firstPublishYear})</p>}
      </Link>
      {showActions && (
        <div className="book-card-actions">
          {onAddToWishlist && (
            <Button onClick={() => onAddToWishlist(book)} variant="secondary" size="small">
              Añadir a Wishlist
            </Button>
          )}
          {onBorrowBook && (
            <Button onClick={() => onBorrowBook(book)} variant="primary" size="small">
              Prestar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookCard;
