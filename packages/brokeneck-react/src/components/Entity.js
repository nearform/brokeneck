import {
  Box,
  Breadcrumbs,
  Chip,
  CircularProgress,
  Link,
  makeStyles,
  Typography
} from '@material-ui/core'
import T from 'prop-types'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import EntityFields from './EntityFields'
import Square from './Square'

const useStyles = makeStyles(theme => ({
  spacing: {
    '& > * + *': {
      marginLeft: theme.spacing(2)
    }
  }
}))

export default function Entity({
  children,
  description,
  entityData,
  entityMutationButtons,
  loading,
  name,
  pluralName,
  SecondaryComponent
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
                <Link
                  component={RouterLink}
                  color="inherit"
                  to=".."
                  relative="path"
                >
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
  children: T.node,
  description: T.string,
  entityData: T.object,
  entityMutationButtons: T.node,
  loading: T.bool,
  name: T.string.isRequired,
  pluralName: T.string.isRequired,
  SecondaryComponent: T.elementType
}
