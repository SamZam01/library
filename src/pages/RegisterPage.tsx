import React from 'react';
import RegisterForm from '../components/forms/RegisterForm';
import { Link } from 'react-router-dom';
import './Page.css'; 

const RegisterPage: React.FC = () => {
  return (
    <div className="page-container auth-page">
      <RegisterForm />
      <p className="auth-link-text">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
