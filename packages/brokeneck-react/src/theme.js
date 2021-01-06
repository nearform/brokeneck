const palette = {
  blue: '#2165e2',
  lightenedBlue: '#588be9',
  midnightBlue: '#194ca9',
  grey5: '#3d3d38',
  grey4: '#6d6d68',
  grey3: '#a8a9a1',
  grey2: '#d2d2cc',
  grey1: '#f1f1ef',
  grey0: '#f5f5f5',
  white: '#ffffff',
  salmon: '#fa775e',
  flamingo: '#fa7a9b',
  bubblegum: '#f5b9b7'
}

const typography = {
  fontFamily: '"Didact Gothic",Arial,Helvetica,sans-serif',
  fontStyle: 'normal',
  fontWeight: '700',
  letterSpacing: '0px',
  h1: { fontSize: '2.4rem' },
  h2: { fontSize: '2rem' },
  h3: { fontSize: '1.75rem' },
  h4: { fontSize: '1.5rem' },
  h5: { fontSize: '1.3rem' },
  h6: { fontSize: '1.15rem' }
}

const palettes = {
  light: {
    primary: {
      main: palette.blue
    },
    secondary: {
      main: palette.lightenedBlue
    },
    bodyText: {
      main: palette.grey5
    },
    headerBackground: {
      main: palette.grey1
    },
    separator: {
      main: palette.grey2
    },
    tableRowHighlight: {
      main: palette.grey0
    }
  },
  dark: {
    primary: {
      main: palette.blue
    },
    secondary: {
      main: palette.lightenedBlue
    },
    bodyText: {
      main: palette.white
    },
    headerBackground: {
      main: palette.grey4
    },
    separator: {
      main: palette.grey3
    },
    tableRowHighlight: {
      main: palette.grey5
    }
  }
}

const overrides = themeType => ({
  MuiLink: {
    root: {
      '&:visited': {
        color: palettes[themeType].secondary.main
      }
    }
  },
  MuiTab: {
    root: {
      '&:visited': {
        color: palettes[themeType].bodyText.main
      }
    }
  },
  MuiTableRow: {
    head: {
      '& th': {
        backgroundColor: palettes[themeType].headerBackground.main,
        borderBottom: 0,
        fontWeight: 'bold'
      },
      '& th:first-child': {
        borderRadius: '10px 0 0 10px'
      },
      '& th:last-child': {
        borderRadius: '0 10px 10px 0'
      }
    },
    root: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: palettes[themeType].tableRowHighlight.main
      }
    }
  }
})

export default {
  palettes,
  typography,
  overrides
}
