import { withStyles } from '@material-ui/core/styles';

const styles = ({transitions, palette, spacing}) => ({
  hovered: {
    transition: transitions.create('background-color', {
      duration: transitions.duration.shortest
    }),
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: palette.action.hover,
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        backgroundColor: 'transparent'
      }
    },
    paddingBottom: spacing(2),
  },
  left: {
    textAlign: 'left',
    alignItems: 'stretch',
  },
  height: {
    height: '100%',
  },
  margin: {
    margin: spacing(),
  },
  padding: {
    paddingLeft: spacing(),
    paddingRight: spacing(),
  },
  extendedIcon: {
    marginRight: spacing(),
  },
});

export default withStyles(styles);
