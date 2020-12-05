import React from 'react'
import ReactDOM from 'react-dom'
import Brokeneck from '@nearform/brokeneck-react'

window.Brokeneck = {
  init(config) {
    ReactDOM.render(<Brokeneck {...config} />, document.getElementById('root'))
  }
}
