import React, { useContext } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import {
  AppBar,
  Box,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  Typography
} from '@material-ui/core'

import { ThemeSwitcherContext } from './ThemeSwitcherProvider'
import Provider from './Provider'

const useStyles = makeStyles(theme => ({
  appBar: {
    marginBottom: theme.spacing(3),
    flexDirection: 'row'
  },
  actions: {
    marginLeft: 'auto',
    '& > * + *': {
      marginLeft: theme.spacing(1)
    }
  }
}))

export default function Navigation() {
  const classes = useStyles()
  const toggleThemeType = useContext(ThemeSwitcherContext)
  const isGroups = useRouteMatch('/groups')

  const currentTab = isGroups ? 'groups' : 'users'

  return (
    <AppBar position="static" color="primary" className={classes.appBar}>
      <Tabs value={currentTab}>
        <Tab component={NavLink} to="/users" label="Users" value="users" />
        <Tab component={NavLink} to="/groups" label="Groups" value="groups" />
      </Tabs>
      <Box className={classes.actions}>
        <Provider />
        <IconButton title="toggle theme type" onClick={toggleThemeType}>
          <Typography>
            <span role="img" aria-label="switch color mode">
              🔆
            </span>
          </Typography>
        </IconButton>
      </Box>
    </AppBar>
  )
}
