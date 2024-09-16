import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Products from './Products';

beforeEach(() => {
  // Mock the fetch function
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          products: [
            {
              id: 1,
              title: 'Essence Mascara Lash Princess',
              description: 'Mascara description',
              price: 9.99,
              thumbnail: 'https://example.com/thumbnail1.png',
            },
            {
              id: 2,
              title: 'Eyeshadow Palette with Mirror',
              description: 'Eyeshadow palette description',
              price: 19.99,
              thumbnail: 'https://example.com/thumbnail2.png',
            },
          ],
        }),
    })
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders the product list header', () => {
  render(<Products />);
  expect(screen.getByText(/product list/i)).toBeInTheDocument();
});

test('fetches and displays products', async () => {
  render(<Products />);

  // Wait for the first product to Productsear
  await waitFor(() => {
    expect(screen.getByText(/essence mascara lash princess/i)).toBeInTheDocument();
  });

  // Wait for the second product to Productsear
  await waitFor(() => {
    expect(screen.getByText(/eyeshadow palette with mirror/i)).toBeInTheDocument();
  });
});

test('filters products based on search input', async () => {
  render(<Products />);

  // Wait for initial products to be rendered
  await waitFor(() => {
    expect(screen.getByText(/essence mascara lash princess/i)).toBeInTheDocument();
  });

  // Type in the search input
  fireEvent.change(screen.getByPlaceholderText(/search products by title/i), {
    target: { value: 'eyeshadow' },
  });

  // Wait for the filtered products
  await waitFor(() => {
    expect(screen.queryByText(/essence mascara lash princess/i)).not.toBeInTheDocument();
  });

  await waitFor(() => {
    expect(screen.getByText(/eyeshadow palette with mirror/i)).toBeInTheDocument();
  });
});

test('shows "No products found" message when search term does not match', async () => {
  render(<Products />);

  // Wait for the initial products to be rendered
  await waitFor(() => {
    expect(screen.getByText(/essence mascara lash princess/i)).toBeInTheDocument();
  });

  // Type in a search term that does not match any product
  fireEvent.change(screen.getByPlaceholderText(/search products by title/i), {
    target: { value: 'nonexistent product' },
  });

  // Wait for "No products found" message
  await waitFor(() => {
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });
});
