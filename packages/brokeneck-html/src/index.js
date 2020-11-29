import React from 'react'
import ReactDOM from 'react-dom'
import Brokeneck from 'brokeneck-react'

window.Brokeneck = {
  init(config) {
    ReactDOM.render(
      <React.StrictMode>
        <Brokeneck {...config} />
      </React.StrictMode>,
      document.getElementById('root')
    )
  }
}
