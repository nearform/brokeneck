import React from 'react'
import T from 'prop-types'
import {
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Link,
  makeStyles,
  Typography
} from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'

import Square from './Square'
import EntityFields from './EntityFields'

const useStyles = makeStyles(theme => ({
  spacing: {
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

export default function Entity({
  name,
  pluralName,
  description,
  entityData,
  entityMutationButtons,
  SecondaryComponent,
  loading,
  children
}) {
  const classes = useStyles()

  if (loading) {
    return <CircularProgress />
  }

  return (
    <>
      <Box mb={3}>
        <Breadcrumbs aria-label="breadcrumb">
          <Chip
            label={
              <Typography>
                <Link component={RouterLink} color="inherit" to=".">
                  {pluralName}
                </Link>
              </Typography>
            }
          ></Chip>
          <Chip
            label={<Typography color="textPrimary">{description}</Typography>}
          ></Chip>
        </Breadcrumbs>
      </Box>
      <Box mb={3} className={classes.spacing}>
        {entityMutationButtons}
      </Box>
      <Square mb={3}>
        <Typography variant="h6">{name}</Typography>
        <EntityFields typeName={name} data={entityData} />
      </Square>
      <Square mb={3}>
        <SecondaryComponent classes={classes} />
      </Square>
      {children}
    </>
  )
}

Entity.propTypes = {
  name: T.string.isRequired,
  pluralName: T.string.isRequired,
  description: T.string,
  loading: T.bool,
  entityData: T.object,
  entityMutationButtons: T.node,
  SecondaryComponent: T.elementType,
  children: T.node
}
