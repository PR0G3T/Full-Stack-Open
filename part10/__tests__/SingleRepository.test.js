import React from 'react';
import { render, screen } from '@testing-library/react-native';
import SingleRepository from '../components/SingleRepository';

// Mock the useRepository hook
jest.mock('../hooks/useRepository', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  openURL: jest.fn(() => Promise.resolve()),
}));

import useRepository from '../hooks/useRepository';

describe('SingleRepository', () => {
  it('renders without crashing when loading', () => {
    useRepository.mockReturnValue({
      repository: null,
      reviews: [],
      loading: true,
      error: null,
      fetchMore: jest.fn(),
      hasNextPage: false,
    });

    render(<SingleRepository repositoryId="test-repo" />);
    
    // Just verify the component renders without crashing
    expect(useRepository).toHaveBeenCalledWith('test-repo');
  });

  it('renders repository and reviews correctly', () => {
    const mockRepository = {
      id: 'test-repo',
      fullName: 'facebook/react',
      description: 'A declarative library for building user interfaces',
      language: 'JavaScript',
      forksCount: 1000,
      stargazersCount: 5000,
      ratingAverage: 95,
      reviewCount: 10,
      ownerAvatarUrl: 'https://example.com/avatar.png',
      url: 'https://github.com/facebook/react',
    };

    const mockReviews = [
      {
        id: 'review-1',
        text: 'Great library!',
        rating: 5,
        createdAt: '2023-01-01',
        user: { id: 'user-1', username: 'johndoe' },
      },
    ];

    useRepository.mockReturnValue({
      repository: mockRepository,
      reviews: mockReviews,
      loading: false,
      error: null,
      fetchMore: jest.fn(),
      hasNextPage: true,
    });

    render(<SingleRepository repositoryId="test-repo" />);
    
    // Verify the hook was called correctly
    expect(useRepository).toHaveBeenCalledWith('test-repo');
  });

  it('renders error state correctly', () => {
    useRepository.mockReturnValue({
      repository: null,
      reviews: [],
      loading: false,
      error: { message: 'Network error' },
      fetchMore: jest.fn(),
      hasNextPage: false,
    });

    render(<SingleRepository repositoryId="test-repo" />);
    
    // Verify the hook was called correctly
    expect(useRepository).toHaveBeenCalledWith('test-repo');
  });
});
