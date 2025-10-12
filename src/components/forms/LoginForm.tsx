import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import { AuthContext } from '../../context/AuthContext';
import './Form.css'; 

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    return <p>Error: AuthContext no disponible.</p>;
  }

  const { login } = authContext;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/'); 
      } else {
        setError('Nombre de usuario o contraseña incorrectos.');
      }
    } catch (err) {
      setError('Ocurrió un error al intentar iniciar sesión.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="app-form">
      <h2>Iniciar Sesión</h2>
      {error && <p className="form-error-message">{error}</p>}
      <Input
        label="Nombre de Usuario"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
      />
      <Input
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button type="submit" isLoading={isLoading}>
        Iniciar Sesión
      </Button>
    </form>
  );
};

export default LoginForm;
