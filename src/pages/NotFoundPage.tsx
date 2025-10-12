import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import './Page.css';
import './NotFoundPage.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className="page-container not-found-page">
      <h1>404 - Página No Encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <Link to="/">
        <Button variant="primary">Volver a la página de inicio</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
