import React, { useCallback, useMemo, useState } from 'react'
import T from 'prop-types'
import {
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery
} from '@material-ui/core'

import themeObject from '../theme'

export const ThemeSwitcherContext = React.createContext()

export default function ThemeSwitcherProvider({ children }) {
  const fromMediaQuery = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light'
  const fromUserPreferences = localStorage.getItem('themeType')

  const [themeType, setThemeType] = useState(
    fromUserPreferences || fromMediaQuery
  )

  const toggleThemeType = useCallback(
    () =>
      setThemeType(t => {
        const type = t === 'dark' ? 'light' : 'dark'

        localStorage.setItem('themeType', type)

        return type
      }),
    []
  )

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: themeType,
          ...themeObject.palettes[themeType]
        },
        typography: themeObject.typography,
        overrides: themeObject.overrides(themeType)
      }),
    [themeType]
  )

  const providerValue = useMemo(() => ({ toggleThemeType, themeType, theme }), [
    toggleThemeType,
    themeType,
    theme
  ])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ThemeSwitcherContext.Provider value={providerValue}>
        {children}
      </ThemeSwitcherContext.Provider>
    </ThemeProvider>
  )
}

ThemeSwitcherProvider.propTypes = {
  children: T.node
}
