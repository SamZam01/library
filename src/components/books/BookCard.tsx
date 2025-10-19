import React, { useState } from 'react';
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
  const [imgError, setImgError] = useState(false);

  return (
    <div className="book-card">
      <Link to={`/books/${book.id?.split('/').pop()}`} className="book-card-link">
        <img 
          src={imgError ? '/placeholder-book.svg' : coverUrl}
          alt={`Portada de ${book.title}`} 
          className="book-card-cover"
          onError={() => setImgError(true)}
        />
        <h3 className="book-card-title">{book.title}</h3>
        <p className="book-card-author">{book.authors?.join(', ')}</p>
        {book.firstPublishYear && <p className="book-card-year">({book.firstPublishYear})</p>}
        {}
        {book.subjects && book.subjects.length > 0 && (
          <p className="book-card-subjects">Temas: {book.subjects.slice(0, 3).join(', ')}{book.subjects.length > 3 ? '...' : ''}</p>
        )}
        {}
        {book.language && book.language.length > 0 && (
          <p className="book-card-language">
            Idioma: {book.language.slice(0, 3).join(', ')}{book.language.length > 3 ? '...' : ''}
          </p>
        )}
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