const palette = {
  blue: '#2165e2',
  bodyText: '#333333',
  lightenedBlue: '#588be9',
  midnightBlue: '#194ca9',
  grey4: '#6d6d68',
  grey3: '#a8a9a1',
  grey2: '#d2d2cc',
  grey1: '#f1f1ef',
  white: '#ffffff',
  salmon: '#fa775e',
  flamingo: '#fa7a9b',
  bubblegum: '#f5b9b7'
}

const typography = {
  fontFamily: '"Didact Gothic",Arial,Helvetica,sans-serif',
  fontWeight: '700',
  letterSpacing: '0px',
  fontStyle: 'normal'
}

export default {
  light: {
    palette: {
      primary: {
        main: palette.blue
      },
      secondary: {
        main: palette.lightenedBlue
      },
      bodyText: {
        main: palette.bodyText
      },
      headerBackground: {
        main: palette.grey1
      },
      separator: {
        main: palette.grey2
      }
    },
    typography
  },
  dark: {
    palette: {
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
      }
    },
    typography
  }
}
