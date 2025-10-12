import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders spinner container and element', () => {
    render(<LoadingSpinner />);
    const container = screen.getByTestId('spinner-container'); 
    const spinner = screen.getByTestId('spinner'); 
    expect(container).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner');
  });

  test('applies correct CSS classes', () => {
    render(<LoadingSpinner />);
    const container = screen.getByTestId('spinner-container');
    expect(container).toHaveClass('spinner-container');
  });
});
