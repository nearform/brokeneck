import React from 'react'
import { Typography } from '@material-ui/core'

import Square from './Square'

export default function Footer() {
  return (
    <Square p={2}>
      <Typography variant="body2" align="center">
        © NearForm {new Date().getFullYear()}
      </Typography>
    </Square>
  )
}
