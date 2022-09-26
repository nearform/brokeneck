import {
  AppBar,
  Box,
  IconButton,
  makeStyles,
  Tab,
  Tabs
} from '@material-ui/core'
import { Group as GroupIcon, Person as UserIcon } from '@material-ui/icons'
import React, { useContext } from 'react'
import { NavLink, useMatch } from 'react-router-dom'

import MoonIcon from '../icons/moon'
import SunIcon from '../icons/sun'

import Provider from './Provider'
import { ThemeSwitcherContext } from './ThemeSwitcherProvider'

const useStyles = makeStyles(theme => ({
  appBar: {
    alignItems: 'center',
    backgroundColor: theme.palette.headerBackground.main,
    color: theme.palette.bodyText.main,
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    paddingLeft: theme.spacing(2),
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
    padding: theme.spacing(2),
    width: '42px'
  },
  switcherIcon: {
    height: 18,
    width: 18
  },
  tabRoot: {
    minWidth: 120
  }
}))

export default function Navigation() {
  const classes = useStyles()
  const { toggleThemeType, themeType } = useContext(ThemeSwitcherContext)
  const isGroups = useMatch('/groups/*')

  const currentTab = isGroups ? 'groups' : 'users'

  return (
    <AppBar
      position="static"
      className={classes.appBar}
      data-testid="navigation"
    >
      <Tabs value={currentTab}>
        <Tab
          classes={{ root: classes.tabRoot }}
          component={NavLink}
          to="/users"
          label={
            <>
              <UserIcon /> Users
            </>
          }
          value="users"
        />
        <Tab
          classes={{ root: classes.tabRoot }}
          component={NavLink}
          to="/groups"
          label={
            <>
              <GroupIcon /> Groups
            </>
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
        {themeType === 'dark' ? (
          <SunIcon
            className={classes.switcherIcon}
            data-testid="switch-to-light-theme"
          />
        ) : (
          <MoonIcon
            className={classes.switcherIcon}
            data-testid="switch-to-dark-theme"
          />
        )}
      </IconButton>
    </AppBar>
  )
}
