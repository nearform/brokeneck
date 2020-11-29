import React from 'react'
import T from 'prop-types'
import { Box, Paper } from '@material-ui/core'

export default function Square({ children, ...props }) {
  return (
    <Box component={Paper} padding={3} square elevation={4} {...props}>
      {children}
    </Box>
  )
}

Square.propTypes = {
  children: T.node
}
