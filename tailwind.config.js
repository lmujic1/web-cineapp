/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Urbanist'],
        // Add more custom font families as needed
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 40s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }
    },

    spacing: {
      '0': '0rem',
      '2': '0.125rem',
      '4': '0.25rem',
      '8': '0.5rem',
      '12': '0.75rem',
      '16': '1rem',
      '24': '1.5rem',
      '32': '2rem',
      '40': '2.5rem',
      '48': '3rem',
      '64': '4rem',
      '80': '5rem',
      '96': '6rem',
      '128': '8rem',
      '160': '10rem'
    },

    fontSize: {
      'heading-h1': ['4rem', {
        lineHeight: '4.75rem',
        letterSpacing: '-0.01em',
        fontWeight: '700',
      }],
      'heading-h2': ['3rem', {
        lineHeight: '3.5rem',
        letterSpacing: '-0.00em',
        fontWeight: '700',
      }],
      'heading-h3': ['2.5rem', {
        lineHeight: '3rem',
        letterSpacing: '-0.004em',
        fontWeight: '700',
      }],
      'heading-h4': ['2rem', {
        lineHeight: '2.5rem',
        letterSpacing: '-0.0025em',
        fontWeight: '700',
      }],
      'heading-h5': ['1.5rem', {
        lineHeight: '2rem',
        letterSpacing: '-0.0015em',
        fontWeight: '700',
      }],
      'heading-h6': ['1.25rem', {
        lineHeight: '1.5rem',
        letterSpacing: '-0.0015em',
        fontWeight: '700',
      }],
      'heading-content': ['0.75rem', {
        lineHeight: '1rem',
        letterSpacing: '0.05em',
        fontWeight: '700',
      }],
      'body-l': ['1rem', {
        lineHeight: '1.5rem',
        letterSpacing: '0.005rem'
      }],
      'body-m': ['0.875rem', {
        lineHeight: '1.25rem',
        letterSpacing: '0.0025rem',
      }],
      'body-s': ['0.75rem', {
        lineHeight: '1rem',
        letterSpacing: '0.0015rem',
      }]
    },

    fontWeight: {
      normal: '400',
      semibold: '600',
      bold: '700'
    },

    borderRadius: {
      0: '0',
      4: '0.25rem',
      8: '0.5rem',
      12: '0.75rem',
      16: '1rem',
      24: '1.5rem',
      full: '9999px'
    },

    boxShadow: {
      'light-25': '0 1px 2px 0 rgba(52, 64, 84, 0.04)',
      'light-50': '0 1px 2px -2px rgba(52, 64, 84, 0.08), 0 1px 3px -1px rgba(52, 64, 84, 0.08)',
      'light-100': '0 2px 4px -2px rgba(52, 64, 84, 0.08), 0 4px 6px -1px rgba(52, 64, 84, 0.08)',
      'light-200': '0 4px 6px -5px rgba(52, 64, 84, 0.08), 0 10px 15px -4px rgba(52, 64, 84, 0.08)',
      'light-300': '0 8px 10px -8px rgba(52, 64, 84, 0.08), 0 20px 25px -7px rgba(52, 64, 84, 0.08)',
      'light-400': '0 25px 50px -16px rgba(52, 64, 84, 0.16)'
    },

    colors: {
      neutral: {
        0: '#FFFFFF',
        25: '#FCFCFD',
        50: '#F9FAFB',
        100: '#EFF1F5',
        200: '#E4E7EC',
        300: '#D0D5DD',
        400: '#98A2B3',
        500: '#667085',
        600: '#475467',
        700: '#344054',
        800: '#1D2939',
        900: '#101828'
      },
      primary: {
        25: '#FEF2F2',
        50: '#FDE3E3',
        100: '#FCCCCC',
        200: '#F9A8A8',
        300: '#F37676',
        400: '#E84B4B',
        500: '#D52D2D',
        600: '#B22222',
        700: '#942929',
        800: '#7B2121',
        900: '#430C0C'
      },
      error: {
        25: '#FFFBFA',
        50: '#FEF3F2',
        100: '#FEE4E2',
        200: '#FECDCA',
        300: '#FDA29B',
        400: '#F97066',
        500: '#F04438',
        600: '#D92D20',
        700: '#B42318',
        800: '#912018',
        900: '#7A271A'
      },
      warning: {
        25: '#FFFCF5',
        50: '#FFFAEB',
        100: '#FEF0C7',
        200: '#FEDF89',
        300: '#FEC84B',
        400: '#FDB022',
        500: '#F79009',
        600: '#DC6803',
        700: '#B54708',
        800: '#93370D',
        900: '#7A2E0E'
      },
      success: {
        25: '#F6FEF9',
        50: '#ECFDF3',
        100: '#D1FADF',
        200: '#A6F4C5',
        300: '#6CE9A6',
        400: '#32D583',
        500: '#12B76A',
        600: '#039855',
        700: '#027A48',
        800: '#05603A',
        900: '#054F31'
      },
      supporting: {
        blue: {
          25: '#F5F9FE',
          50: '#E7F0FD',
          100: '#D5E4FC',
          200: '#BDD4FA',
          300: '#97BCF7',
          400: '#6FA3F7',
          500: '#4387F5',
          600: '#166AF3',
          700: '#1257C8',
          800: '#0E449D',
          900: '#093273'
        },
        purple: {
          25: '#FCFAFF',
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9',
          700: '#6941C6',
          800: '#53389E',
          900: '#42307D'
        },
        special: {
          'start': 'rgba(26, 26, 26, 0.8)',
          'stop': 'rgba(178, 34, 34, 0.8)'
        }
      }
    }
  },
  plugins: [],
}

