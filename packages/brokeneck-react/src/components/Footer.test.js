import React from 'react'
import { screen, render } from '@testing-library/react'

import Footer from './Footer'

describe('Footer', () => {
  it('should render Footer component', () => {
    render(<Footer />)

    expect(screen.getByText(/nearform/i)).toBeInTheDocument()
  })
})
