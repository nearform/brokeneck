import React from 'react'
import { makeStyles } from '@material-ui/core'

import Auth0Icon from '../icons/providers/auth0'
import AzureIcon from '../icons/providers/azure'
import CognitoIcon from '../icons/providers/cognito'
import useProvider from '../hooks/useProvider'

const useStyles = makeStyles(theme => ({
  icon: {
    marginLeft: theme.spacing(1)
  },
  text: {
    marginLeft: theme.spacing(1),
    textTransform: 'capitalize'
  },
  wrapper: {
    alignItems: 'center',
    display: 'flex'
  }
}))

const icons = {
  auth0: Auth0Icon,
  azure: AzureIcon,
  cognito: CognitoIcon
}

export default function Provider() {
  const { name } = useProvider()
  const classes = useStyles()

  const Icon = icons[name]

  return (
    <div className={classes.wrapper}>
      Provider:
      {Icon && <Icon className={classes.icon} data-testid="provider-icon" />}
      <span className={classes.text}>{name}</span>
    </div>
  )
}
