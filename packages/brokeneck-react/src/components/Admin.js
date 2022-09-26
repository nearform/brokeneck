import { Box, CircularProgress, makeStyles } from '@material-ui/core'
import { useQuery } from 'graphql-hooks'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { LOAD_ROOT } from '../graphql'

import Footer from './Footer'
import Group from './Group'
import Groups from './Groups'
import Navigation from './Navigation'
import { RemoveTrailingSlash } from './RemoveTrailingSlash'
import RootContext from './RootContext'
import User from './User'
import Users from './Users'

const useGlobalStyles = makeStyles({
  '@global': {
    body: {
      margin: 0
    },
    '#root': {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }
  }
})

export default function Admin() {
  useGlobalStyles()
  const { data, loading } = useQuery(LOAD_ROOT)

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      {loading ? (
        <CircularProgress />
      ) : (
        <RootContext.Provider value={data}>
          <Navigation />
          <Box mx={2}>
            <RemoveTrailingSlash />
            <Routes>
              <Route path="/" element={<Navigate replace to="/users" />} />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:userId" element={<User />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:groupId" element={<Group />} />
            </Routes>
          </Box>
        </RootContext.Provider>
      )}
      <Box mt="auto">
        <Footer />
      </Box>
    </Box>
  )
}
