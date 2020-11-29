import React from 'react'
import T from 'prop-types'
import { Box, Typography } from '@material-ui/core'

export default class ErrorBoundary extends React.Component {
  static propTypes = {
    children: T.node
  }

  constructor(props) {
    super(props)
    this.state = { error: null, errorInfo: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  render() {
    if (this.state.error) {
      return (
        <div>
          <Typography variant="h5" gutterBottom>
            Something went wrong.
          </Typography>
          <Box component="details" whiteSpace="pre-wrap">
            <Box component="summary" mb={2}>
              <Typography component="span">More details</Typography>
            </Box>
            <Typography color="error">{this.state.error.toString()}</Typography>
            <Typography>{this.state.errorInfo?.componentStack}</Typography>
          </Box>
        </div>
      )
    }
    return this.props.children
  }
}
