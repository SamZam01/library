import React from 'react';
import LoginForm from '../components/forms/LoginForm';
import { Link } from 'react-router-dom';
import './Page.css'; 

const LoginPage: React.FC = () => {
  return (
    <div className="page-container auth-page">
      <LoginForm />
      <p className="auth-link-text">
        ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

export default LoginPage;
