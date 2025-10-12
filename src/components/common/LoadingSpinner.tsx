import React from 'react';
import './LoadingSpinner.css'; 

const LoadingSpinner: React.FC = () => {
  return (
    <div className="spinner-container" data-testid="spinner-container">
      <div className="spinner" data-testid="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
