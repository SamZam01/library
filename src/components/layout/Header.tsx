import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import './Header.css'; 

const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  if (!authContext) {
    
    return null;
  }

  const { isAuthenticated, currentUser, logout } = authContext;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm(''); 
    }
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="app-logo">
          Biblioteca SPA
        </Link>
        <nav className="main-nav">
          <Link to="/books">Explorar Libros</Link>
          {isAuthenticated && (
            <>
              <Link to="/wishlist">Mi Wishlist</Link>
              <Link to="/loans">Mis Préstamos</Link>
            </>
          )}
        </nav>
      </div>
      <div className="header-right">
        <form onSubmit={handleSearch} className="search-form">
          <Input
            type="text"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar libros"
          />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>
        {isAuthenticated ? (
          <div className="user-info">
            <span>Hola, {currentUser?.username || 'Usuario'}</span>
            <Button onClick={logout} variant="danger" size="small">Cerrar Sesión</Button>
            <Link to="/profile" className="profile-link">Perfil</Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login">
              <Button variant="primary" size="small">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" size="small">Registrarse</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
