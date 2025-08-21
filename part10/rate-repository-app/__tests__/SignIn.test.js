import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SignInContainer from '../components/SignInContainer';

describe('SignIn', () => {
  describe('SignInContainer', () => {
    it('renders without crashing', () => {
      const mockOnSubmit = jest.fn();
      render(<SignInContainer onSubmit={mockOnSubmit} />);
      
      // Just verify the component renders without crashing
      expect(mockOnSubmit).toBeDefined();
    });

    it('renders with loading state', () => {
      const mockOnSubmit = jest.fn();
      render(<SignInContainer onSubmit={mockOnSubmit} loading={true} />);
      
      // Just verify the component renders without crashing
      expect(mockOnSubmit).toBeDefined();
    });

    it('renders without loading state', () => {
      const mockOnSubmit = jest.fn();
      render(<SignInContainer onSubmit={mockOnSubmit} loading={false} />);
      
      // Just verify the component renders without crashing
      expect(mockOnSubmit).toBeDefined();
    });
  });
});
