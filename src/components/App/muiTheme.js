import {createTheme} from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/blueGrey';


const theme = createTheme({

  palette: {
    primary: teal, // Purple and green play nicely together.
  },

  mixins: {
    toolbar: {
      minHeight: 48,
    }
  },

  typography: {
    subtitle2: {
      fontSize: '0.95rem',
    },
  },


  overrides: {
    MuiIconButton: {
      root: {
        padding: 11,
      }
    },
    MuiAppBar: {
      root: {
        boxShadow: 'none',
      }
    },
    // MuiToolbar: {
    //   root: {
    //     minHeight: 48,
    //   },
    // },
  },

});

export default theme;

