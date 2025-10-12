import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Username" name="username" />);
    const labelElement = screen.getByLabelText(/username/i);
    const inputElement = screen.getByRole('textbox');
    expect(labelElement).toBeInTheDocument();
    expect(inputElement).toBeInTheDocument();
  });

  test('applies error class and shows error message', () => {
    render(<Input label="Password" error="Invalid password" name="password" type="password" />);
    const inputElement = screen.getByLabelText(/password/i);
    const errorElement = screen.getByText(/invalid password/i);
    expect(inputElement).toHaveClass('input-error');
    expect(errorElement).toBeInTheDocument();
  });

  test('updates value on change', () => {
    const handleChange = jest.fn();
    render(<Input label="Email" name="email" onChange={handleChange} />);
    const inputElement = screen.getByLabelText(/email/i);
    fireEvent.change(inputElement, { target: { value: 'test@example.com' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(inputElement).toHaveValue('test@example.com');
  });

  test('renders with placeholder and correct type', () => {
    render(<Input label="Search" type="search" placeholder="Search books" name="search" />);
    const inputElement = screen.getByPlaceholderText(/search books/i);
    expect(inputElement).toHaveAttribute('type', 'search');
  });
});
