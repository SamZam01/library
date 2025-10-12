import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Page.css'; 
import './ProfilePage.css'; 

const ProfilePage: React.FC = () => {
  const { currentUser, isAuthenticated } = useContext(AuthContext)!;

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="page-container profile-page">
        <p className="auth-required-message">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="page-container profile-page">
      <h1>Perfil de Usuario</h1>
      <div className="profile-details">
        <p>
          **ID de Usuario:** <span>{currentUser.id}</span>
        </p>
        <p>
          **Nombre de Usuario:** <span>{currentUser.username}</span>
        </p>
        {}
        {}
      </div>
      {}
    </div>
  );
};

export default ProfilePage;
