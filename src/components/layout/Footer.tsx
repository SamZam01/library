import React from 'react';
import './Footer.css'; 

const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Biblioteca SPA. Todos los derechos reservados.</p>
      <p>Desarrollado con React y TypeScript.</p>
    </footer>
  );
};

export default Footer;
