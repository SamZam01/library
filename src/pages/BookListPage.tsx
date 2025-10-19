import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BooksContext } from '../context/BooksContext';
import { AuthContext } from '../context/AuthContext';
import BookList from '../components/books/BookList';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import type { Book } from '../types/book';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Loan } from '../types/loan';
import { addLoan } from '../services/loanService';
import './Page.css';
import './BookListPage.css';
import FiltersPanel from '../components/books/FiltersPanel';
import type { Filters } from '../types/filters';

const ITEMS_PER_PAGE = 10;

const BookListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { books, isLoading, error, search } = useContext(BooksContext)!;
  const { currentUser, isAuthenticated } = useContext(AuthContext)!;

  const [currentQuery, setCurrentQuery] = useState('');
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [wishlist, setWishlist] = useLocalStorage<Book[]>('lib_wishlist', []);
  const [loans, setLoans] = useLocalStorage<Loan[]>('lib_loans', []);
  const [showNotification, setShowNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);
  
  
  const [currentPage, setCurrentPage] = useState(1);
 

  useEffect(() => {
    const queryFromUrl = searchParams.get('q') || '';
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    
    setCurrentQuery(queryFromUrl);
    setLocalSearchTerm(queryFromUrl);
    setCurrentPage(pageFromUrl);

    if (queryFromUrl.trim()) {
      const offset = (pageFromUrl - 1) * ITEMS_PER_PAGE;
      search(queryFromUrl, filters, ITEMS_PER_PAGE, offset);
    }
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchTerm.trim()) {
      setCurrentPage(1);
      setSearchParams({ q: localSearchTerm.trim(), page: '1' });
      search(localSearchTerm.trim(), filters, ITEMS_PER_PAGE, 0);
      setCurrentQuery(localSearchTerm.trim());
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    
    if (currentQuery) {
      setSearchParams({ q: currentQuery, page: page.toString() });
      search(currentQuery, filters, ITEMS_PER_PAGE, offset);
    }
    
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToWishlist = (book: Book) => {
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

  const handleBorrowBook = (book: Book) => {
    if (!isAuthenticated || !currentUser) {
      setShowNotification({ message: 'Debes iniciar sesión para prestar un libro.', type: 'error' });
      return;
    }
    if (loans.some(loan => loan.bookId === book.id && loan.userId === currentUser.id && loan.status === 'active')) {
      setShowNotification({ message: `Ya tienes prestado ${book.title}.`, type: 'error' });
      return;
    }

    const newLoan = addLoan(book.id!, currentUser.id);
    if (newLoan) {
      setLoans(prev => [...prev, newLoan]);
      setShowNotification({ message: `${book.title} ha sido prestado.`, type: 'success' });
    } else {
      setShowNotification({ message: `No se pudo prestar ${book.title}.`, type: 'error' });
    }
  };

  const totalPages = Math.ceil((books.length === ITEMS_PER_PAGE ? currentPage + 10 : currentPage));

  return (
    <div className="page-container book-list-page">
      <h1>Explorar Libros</h1>

      <form onSubmit={handleSearchSubmit} className="book-search-form">
        <Input
          id="search"
          name="search"
          type="text"
          placeholder="Buscar por título, autor o palabra clave..."
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          aria-label="Buscar libros"
        />
        <Button type="submit" variant="primary">Buscar</Button>
      </form>

      {showFilters ? (
        <>
          <FiltersPanel
            onFilterChange={(newFilters: Filters) => {
              setFilters(newFilters);
              setCurrentPage(1);
              if (currentQuery) {
                search(currentQuery, newFilters, ITEMS_PER_PAGE, 0);
              }
            }}
          />
          <Button
            onClick={() => setShowFilters(false)}
            variant="secondary"
            size="small"
          >
            Ocultar Filtros
          </Button>
        </>
      ) : (
        <Button
          onClick={() => setShowFilters(true)}
          variant="secondary"
          size="small"
        >
          Mostrar Filtros
        </Button>
      )}

      {showNotification && (
        <div className={`notification ${showNotification.type}`}>
          {showNotification.message}
          <Button onClick={() => setShowNotification(null)} size="small" variant="secondary">X</Button>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <BookList
            books={books}
            error={error}
            onAddToWishlist={handleAddToWishlist}
            onBorrowBook={handleBorrowBook}
          />
          
          {books.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookListPage;