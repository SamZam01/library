import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BookList from '../components/books/BookList';
import { useBooks } from '../hooks/useBooks'; 
import Button from '../components/common/Button';
import './Page.css'; 

const HomePage: React.FC = () => {
  const { books, isLoading, error, search } = useBooks(); 
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    
    if (initialLoad) {
      search('popular', undefined, 10); 
      setInitialLoad(false);
    }
  }, [search, initialLoad]);

  return (
    <div className="page-container home-page">
      <section className="hero-section">
        <h1>Bienvenido a la Biblioteca SPA</h1>
        <p>Explora un vasto catálogo de libros, gestiona tus préstamos y crea tu lista de deseos.</p>
        <Link to="/books">
          <Button variant="primary" size="large">Explorar Libros Ahora</Button>
        </Link>
      </section>

      <section className="featured-books-section">
        <h2>Libros Destacados</h2>
        <BookList books={books} isLoading={isLoading} error={error} showActions={false} />
        {books.length > 0 && (
          <div className="view-all-button">
            <Link to="/books">
              <Button variant="secondary">Ver todos los libros</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
