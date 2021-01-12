import React from 'react'
import { screen, render } from '@testing-library/react'

import ErrorBoundary from './ErrorBoundary'

const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Custom error message')
  } else {
    return null
  }
}

beforeEach(() => {
  // eslint-disable-next-line no-console
  console.error = jest.fn()
})

describe('ErrorBoundary', () => {
  it('should render ErrorBoundary component when child throws error', () => {
    const { rerender } = render(<ThrowError />, { wrapper: ErrorBoundary })

    rerender(<ThrowError shouldThrow={true} />)

    expect(screen.getByText(/Something went wrong./i)).toBeInTheDocument()
    expect(screen.getByText(/Custom error message/i)).toBeInTheDocument()
  })

  it('should not render ErrorBoundary component when child renders without error', () => {
    const { rerender } = render(<ThrowError />, { wrapper: ErrorBoundary })

    rerender(<ThrowError />)

    expect(screen.queryByText(/Something went wrong./i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Custom error message/i)).not.toBeInTheDocument()
  })
})
