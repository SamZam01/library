import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './Page.css'; 
import './ProfilePage.css'; 

const ProfilePage: React.FC = () => {
  const { currentUser, isAuthenticated, changePassword } = useContext(AuthContext)!;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="page-container profile-page">
        <p className="auth-required-message">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setNotification({ message: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setNotification({ message: 'La contraseña debe tener al menos 6 caracteres', type: 'error' });
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    setNotification({ message: result.message, type: result.success ? 'success' : 'error' });

    if (result.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowChangePassword(false);
    }
  };

  const handleCancelChange = () => {
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setNotification(null);
  };

  return (
    <div className="page-container profile-page">
      <h1>Perfil de Usuario</h1>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button onClick={() => setNotification(null)}>×</button>
        </div>
      )}

      <div className="profile-details">
        <p>
          <strong>ID de Usuario:</strong> <span>{currentUser.id}</span>
        </p>
        <p>
          <strong>Nombre de Usuario:</strong> <span>{currentUser.username}</span>
        </p>
      </div>

      <div className="profile-actions">
        {!showChangePassword ? (
          <Button onClick={() => setShowChangePassword(true)} variant="primary">
            Cambiar Contraseña
          </Button>
        ) : (
          <div className="change-password-form">
            <h2>Cambiar Contraseña</h2>
            <form onSubmit={handleChangePassword}>
              <Input
                label="Contraseña Actual"
                type="password"
                name="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <Input
                label="Nueva Contraseña"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirmar Nueva Contraseña"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <div className="form-actions">
                <Button type="submit" variant="primary">
                  Guardar Cambios
                </Button>
                <Button type="button" variant="secondary" onClick={handleCancelChange}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;