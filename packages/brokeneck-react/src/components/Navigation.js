import React, { useContext } from 'react'
import { NavLink, useRouteMatch } from 'react-router-dom'
import {
  AppBar,
  Box,
  IconButton,
  makeStyles,
  Tab,
  Tabs
} from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import GroupIcon from '@material-ui/icons/Group'
import UserIcon from '@material-ui/icons/Person'

import MoonIcon from '../icons/moon'
import SunIcon from '../icons/sun'

import { ThemeSwitcherContext } from './ThemeSwitcherProvider'
import Provider from './Provider'

const useStyles = makeStyles(theme => ({
  appBar: {
    alignItems: 'center',
    backgroundColor: theme.palette.headerBackground.main,
    color: theme.palette.bodyText.main,
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4)
  },
  provider: {
    marginLeft: 'auto'
  },
  switcher: {
    borderLeft: `1px solid ${theme.palette.separator.main}`,
    borderRight: `1px solid transparent`, // Needed for symetry
    height: '42px',
    marginLeft: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    width: '42px'
  }
}))

export default function Navigation() {
  const classes = useStyles()
  const {
    palette: { type: themeType }
  } = useTheme()
  const toggleThemeType = useContext(ThemeSwitcherContext)
  const isGroups = useRouteMatch('/groups')

  const currentTab = isGroups ? 'groups' : 'users'

  return (
    <AppBar position="static" className={classes.appBar}>
      <Tabs value={currentTab}>
        <Tab
          component={NavLink}
          to="/users"
          label={
            <div>
              <UserIcon style={{ verticalAlign: 'middle' }} /> Users
            </div>
          }
          value="users"
        />
        <Tab
          component={NavLink}
          to="/groups"
          label={
            <div>
              <GroupIcon style={{ verticalAlign: 'middle' }} /> Groups
            </div>
          }
          value="groups"
        />
      </Tabs>
      <Box className={classes.provider}>
        <Provider />
      </Box>
      <IconButton
        title="toggle theme type"
        onClick={toggleThemeType}
        className={classes.switcher}
      >
        <span role="img" aria-label="switch color mode">
          {themeType === 'dark' ? <SunIcon /> : <MoonIcon />}
        </span>
      </IconButton>
    </AppBar>
  )
}
