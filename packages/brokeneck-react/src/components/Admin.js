import React from 'react'
import { Switch, Route, Redirect, useLocation } from 'react-router-dom'
import { Box, CircularProgress, makeStyles } from '@material-ui/core'
import { useQuery } from 'graphql-hooks'

import { LOAD_ROOT } from '../graphql'

import Users from './Users'
import Groups from './Groups'
import User from './User'
import Group from './Group'
import Navigation from './Navigation'
import RootContext from './RootContext'
import Footer from './Footer'

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
  const { pathname } = useLocation()
  const { data, loading } = useQuery(LOAD_ROOT)

  return (
    <Box display="flex" flexDirection="column" flex={1}>
      {loading ? (
        <CircularProgress />
      ) : (
        <RootContext.Provider value={data}>
          <Navigation />
          <Box mx={2}>
            <Switch>
              {/* trim trailing slashes */}
              <Redirect from="/:url*(/+)" to={pathname.slice(0, -1)} />
              <Redirect from="/" exact to="/users" />
              <Route path="/users" exact>
                <Users />
              </Route>
              <Route path="/users/:userId">
                {({ match }) => <User userId={match.params.userId} />}
              </Route>
              <Route path="/groups" exact>
                <Groups />
              </Route>
              <Route path="/groups/:groupId">
                {({ match }) => <Group groupId={match.params.groupId} />}
              </Route>
            </Switch>
          </Box>
        </RootContext.Provider>
      )}
      <Box mt="auto">
        <Footer />
      </Box>
    </Box>
  )
}
