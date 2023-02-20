import {createTheme} from '@mui/material';
import primary from '@mui/material/colors/blueGrey';

const theme = createTheme({

  // Purple and green play nicely together.
  palette: {
    primary,
  },

  mixins: {
    toolbar: {
      minHeight: 50,
    }
  },

  typography: {
    fontSize: 12,
    h4: {
      fontSize: '1.8rem',
      '@media (min-width:1200px)': {
        fontSize: '2rem',
      },
    }
  },

  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to apply
        disableRipple: true, // No more ripple, on the whole application
      },
    },

    MuiFormControl: {
      styleOverrides: {
        // Name of the slot
        root: ({ ownerState, theme }) => ({
          minWidth: 300,
          paddingRight: theme.spacing(),
          borderBottom: '1px solid #e8e8e8',
        }),
      }
    },

    MuiInputLabel: {
      styleOverrides: {
        shrink: {
          transform: 'translate(0, 8px)',
        },
        formControl: {
          top: 0,
          left: 0,
          position: 'absolute',
          transform: 'translate(0, 8px)',
          width: '40%',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          '&:hover': {
            whiteSpace: 'normal',
            //background: 'white',
            transform: 'translate(0, 7px)',
          },
        },
      },
    },

    MuiInput: {
      styleOverrides: {
        root: {
          marginLeft: '40%',
          'label + &': {
            marginTop: 0,
          }
        },
      }
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
        },
      }
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          paddingTop: 4,
          paddingBottom: 4,
        },
      }
    },

  },

});

export default theme;

