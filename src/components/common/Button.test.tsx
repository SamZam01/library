
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders button with children', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  test('applies primary variant and small size classes', () => {
    render(<Button variant="primary" size="small">Primary Small</Button>);
    const buttonElement = screen.getByRole('button', { name: /primary small/i });
    expect(buttonElement).toHaveClass('button', 'primary', 'small');
  });

  test('shows loading text when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    const buttonElement = screen.getByRole('button', { name: /cargando.../i });
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveTextContent('Cargando...');
  });

  test('calls onClick when clicked and not disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
  });
});
