import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookList from '../components/books/BookList';
import Pagination from '../components/common/Pagination';
import { useBooks } from '../hooks/useBooks'; 
import Button from '../components/common/Button';
import './Page.css'; 

const ITEMS_PER_PAGE = 10;

const HomePage: React.FC = () => {
  const { books, isLoading, error, search } = useBooks(); 
  const [initialLoad, setInitialLoad] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (initialLoad) {
      search('popular', undefined, ITEMS_PER_PAGE, 0); 
      setInitialLoad(false);
    }
  }, [search, initialLoad]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const offset = (page - 1) * ITEMS_PER_PAGE;
    search('popular', undefined, ITEMS_PER_PAGE, offset);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = books.length === ITEMS_PER_PAGE ? currentPage + 10 : currentPage;

  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <h1>Bienvenido a Library</h1>
        <p>Explora un vasto catálogo de libros, gestiona tus préstamos y crea tu lista de deseos.</p>
        <Link to="/books">
          <Button variant="primary" size="large">Explorar Libros Ahora</Button>
        </Link>
      </section>

      <section className="featured-books-section">
        <h2>Libros Destacados</h2>
        <BookList books={books} isLoading={isLoading} error={error} showActions={false} />
        
        {books.length > 0 && (
          <>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
            <div className="view-all-button">
              <Link to="/books">
                <Button variant="secondary">Ver todos los libros</Button>
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default HomePage;