import React from 'react'
import T from 'prop-types'
import { screen, render } from '@testing-library/react'

import mockRootContext from '../test-utils/mockRootContext'

import RootContext from './RootContext'
import EntityFields from './EntityFields'

const RootContextWrapper = ({ children }) => {
  return (
    <RootContext.Provider value={mockRootContext}>
      {children}
    </RootContext.Provider>
  )
}

RootContextWrapper.propTypes = {
  children: T.node
}

describe('EntityFields', () => {
  it('should render EntityFields component', () => {
    render(
      <EntityFields
        typeName="User"
        data={{
          objectId: '1234-5678',
          displayName: 'Bobby'
        }}
      />,
      {
        wrapper: RootContextWrapper
      }
    )

    expect(screen.getByText(/1234/i)).toBeInTheDocument()
    expect(screen.getByText(/1234-5678/i)).toBeInTheDocument()

    expect(screen.getAllByRole('listitem').length).toEqual(5)
  })
})
