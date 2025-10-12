import React, { useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Book } from '../types/book';
import BookCard from '../components/books/BookCard';
import Button from '../components/common/Button';
import { AuthContext } from '../context/AuthContext';
import './Page.css'; 
import './WishlistPage.css'; 

const WishlistPage: React.FC = () => {
  const [wishlist, setWishlist] = useLocalStorage<Book[]>('lib_wishlist', []);
  const { isAuthenticated } = useContext(AuthContext)!;

  const handleRemoveFromWishlist = (bookId: string | undefined) => {
    if (!bookId) return;
    setWishlist(prev => prev.filter(book => book.id !== bookId));
  };

  if (!isAuthenticated) {
    return (
      <div className="page-container wishlist-page">
        <p className="auth-required-message">Por favor, inicia sesión para ver tu lista de deseos.</p>
      </div>
    );
  }

  return (
    <div className="page-container wishlist-page">
      <h1>Mi Lista de Deseos</h1>
      {wishlist.length === 0 ? (
        <p className="empty-list-message">Tu lista de deseos está vacía. ¡Explora libros y añade algunos!</p>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(book => (
            <div key={book.id} className="wishlist-item">
              <BookCard book={book} showActions={false} />
              <Button
                onClick={() => handleRemoveFromWishlist(book.id)}
                variant="danger"
                size="small"
                className="remove-button"
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
