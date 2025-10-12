import React from 'react';
import './Input.css'; 

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
  const inputId = id || props.name; 

  return (
    <div className="input-group">
      {label && <label htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={`input-field ${error ? 'input-error' : ''}`} {...props} />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default Input;
