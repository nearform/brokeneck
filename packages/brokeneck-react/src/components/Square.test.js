import React from 'react'
import { screen, render } from '@testing-library/react'

import Square from './Square'

describe('Square', () => {
  it('should render with the given children', () => {
    render(
      <Square>
        <span data-testid="child">Child</span>
      </Square>
    )

    expect(screen.queryByTestId('child')).toBeInTheDocument()
  })
})
