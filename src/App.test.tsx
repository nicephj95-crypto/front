import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders book store', () => {
  render(<App />);
  const storeTexts = screen.getAllByText(/book store/i);
  expect(storeTexts.length).toBeGreaterThan(0);
});
