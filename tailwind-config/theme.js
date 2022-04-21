module.exports = {
  extend: {
    screens: {
      'sm': '576px',
      'sm-down': { 'max': '575px' },
      'md': '768px',
      'md-down': { 'max': '767px' },
      'lg': '1025px',
      'lg-down': { 'max': '1024px' },
      'xl': '1240px',
    },
    colors: {

      'base-blue': '#3ea7e3',
      'medium-blue': '#b4e1fd',
      'light-blue': '#c9eafe',
      'lighter-blue': '#eef9ff',

      'base-orange': '#ff8828',

      'base-gray': '#cccccc',
      'light-gray': '#f0f0f0',

      transparent: 'transparent',
      current: 'currentColor',

      black: '#000',
      white: '#fff',

      // https://brandcolors.net/
      facebook: '#3b5998',
      twitter: '#1da1f2',
      linkedin: '#0077b5',

      dark: '#2e2e2e',

      primary: {
        light: '#015ca0',
        base: '#024A7F',
        hover: '#003861',
        dark: '#012946',
      },

      secondary: {
        lighter: '#fdc292',
        light: '#fd9848',
        base: '#E87B1E',
        hover: '#c4620e',
      },

      tertiary: {
        lighter: '#fcc195',
        light: '#faaf73',
        base: '#f5a05c',
        hover: '#ea8b3f',
      },

      gray: {
        50: '#efefef',
        100: '#e3e3e3',
        200: '#c6c6c6',
        300: '#aaaaaa',
        400: '#8d8d8d',
        500: '#717171',
        600: '#5a5a5a',
        700: '#444444',
        800: '#2d2d2d',
        900: '#171717',
      },

    },
    maxWidth: (theme) => ({
      ...theme('spacing'),
      fullContainer: '1440px',
      xl: '1280px',
      container: '1192px',
      864: '864px',
      md: '768px',
      646: '646px',
      sm: '575px',
      xs: '320px',
      full: '100%',
    }),
    width: (theme) => ({
      ...theme('spacing'),
      ...theme('maxWidth'),
    }),
    minHeight: {
      'half': '50vh',
    },
    spacing: {
      '14': '3.5rem',
    },
    inset: (theme) => ( {
      ...theme('spacing'),
      50: '50%',
      100: '100%',
    } ),
    fontFamily: {
      core: [
        'Epilogue',
      ],
      heading: [
        'Epilogue',
        'Arial',
      ],
      highlight: [
        'RobotoMono',
        'Arial',
      ],
      icon: [
        'Icomoon',
      ],
    },
    fontSize: {
      '3xl': '1.75rem',
      '4xl': '2rem',
      '5xl': '2.5rem',
      '6xl': '2.75rem',
    },
    lineHeight: {
      light: '1.1'
    },
    zIndex: {
      '-1': -1,
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      header: 1100,
      fixed: 1200,
      popup: 1300,
      max: 9999,
    },
    cursor: {
      'zoom-in': 'zoom-in',
    },
  }
}
