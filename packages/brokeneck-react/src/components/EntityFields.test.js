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
          Username: 'Bobby',
          Enabled: false,
          UserStatus: 'Sample User Status',
          UserCreateDate: new Date(2020, 11, 25),
          UserLastModifiedDate: new Date(2020, 11, 31)
        }}
      />,
      {
        wrapper: RootContextWrapper
      }
    )

    expect(screen.getByText(/Bobby/i)).toBeInTheDocument()
    expect(screen.getByText(/Sample User Status/i)).toBeInTheDocument()
    expect(screen.getByText(/2020-12-25, 12:00:00 a.m./i)).toBeInTheDocument()
    expect(screen.getByText(/2020-12-31, 12:00:00 a.m./i)).toBeInTheDocument()

    expect(screen.getAllByRole('listitem').length).toEqual(5)
  })
})
