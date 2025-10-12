import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BooksContext } from '../context/BooksContext';
import { AuthContext } from '../context/AuthContext';
import { getCoverImageUrl } from '../api/openLibrary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import type { Book } from '../types/book';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Loan } from '../types/loan';
import { addLoan } from '../services/loanService';
import './Page.css'; 
import './BookDetailPage.css'; 

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchBookDetails, isLoading, error } = useContext(BooksContext)!;
  const { currentUser, isAuthenticated } = useContext(AuthContext)!;

  const [book, setBook] = useState<Book | null>(null);
  const [wishlist, setWishlist] = useLocalStorage<Book[]>('lib_wishlist', []);
  const [loans, setLoans] = useLocalStorage<Loan[]>('lib_loans', []);
  const [showNotification, setShowNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (id) {
      
      const fullBookId = `/works/${id}`;
      fetchBookDetails(fullBookId).then(fetchedBook => {
        if (fetchedBook) {
          setBook(fetchedBook);
        } else {
          navigate('/404'); 
        }
      });
    }
  }, [id, fetchBookDetails, navigate]);

  const handleAddToWishlist = () => {
    if (!book) return;
    if (!isAuthenticated || !currentUser) {
      setShowNotification({ message: 'Debes iniciar sesión para añadir a la wishlist.', type: 'error' });
      return;
    }
    if (!wishlist.some(item => item.id === book.id)) {
      setWishlist(prev => [...prev, book]);
      setShowNotification({ message: `${book.title} añadido a tu wishlist.`, type: 'success' });
    } else {
      setShowNotification({ message: `${book.title} ya está en tu wishlist.`, type: 'error' });
    }
  };

  const handleBorrowBook = () => {
    if (!book || !book.id) return;
    if (!isAuthenticated || !currentUser) {
      setShowNotification({ message: 'Debes iniciar sesión para prestar un libro.', type: 'error' });
      return;
    }
    if (loans.some(loan => loan.bookId === book.id && loan.userId === currentUser.id && loan.status === 'active')) {
      setShowNotification({ message: `Ya tienes prestado ${book.title}.`, type: 'error' });
      return;
    }

    const newLoan = addLoan(book.id, currentUser.id);
    if (newLoan) {
      setLoans(prev => [...prev, newLoan]);
      setShowNotification({ message: `${book.title} ha sido prestado.`, type: 'success' });
    } else {
      setShowNotification({ message: `No se pudo prestar ${book.title}.`, type: 'error' });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  if (!book) {
    return <p className="no-results">Libro no encontrado.</p>;
  }

  const coverUrl = getCoverImageUrl(book.coverId, 'L');

  return (
    <div className="page-container book-detail-page">
      {showNotification && (
        <div className={`notification ${showNotification.type}`}>
          {showNotification.message}
          <Button onClick={() => setShowNotification(null)} size="small" variant="secondary">X</Button>
        </div>
      )}

      <div className="book-detail-content">
        <div className="book-detail-cover">
          <img src={coverUrl} alt={`Portada de ${book.title}`} />
        </div>
        <div className="book-detail-info">
          <h1>{book.title}</h1>
          <p className="book-detail-authors">
            **Autor(es):** {book.authors?.join(', ') || 'Desconocido'}
          </p>
          {book.firstPublishYear && (
            <p className="book-detail-year">
              **Año de Publicación:** {book.firstPublishYear}
            </p>
          )}
          {book.description && (
            <div className="book-detail-description">
              <h3>Descripción:</h3>
              <p>{book.description}</p>
            </div>
          )}
          {/* Aquí se podrían añadir más detalles como categorías, ISBN, etc. */}

          <div className="book-detail-actions">
            <Button onClick={handleAddToWishlist} variant="secondary">
              Añadir a Wishlist
            </Button>
            <Button onClick={handleBorrowBook} variant="primary">
              Prestar Libro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
