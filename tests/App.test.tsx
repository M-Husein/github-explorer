// import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { App } from '../src/App';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom';

test('searches and displays users and repos', async () => {
  render(<App />)

  const input = screen.getByPlaceholderText(/Search GitHub users/i)
  fireEvent.change(input, { target: { value: 'ali' } })
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
  // click search button
  fireEvent.click(screen.getByRole('button', { name: /search/i }))

  // wait for search results
  await waitFor(() => expect(screen.getByText('alice')).toBeInTheDocument())
  // click user
  fireEvent.click(screen.getByRole('button', { name: /Show repositories for alice/i }))

  // wait for repos to appear
  await waitFor(() => expect(screen.getByText('alice-repo-1')).toBeInTheDocument())
})
