/**
 * ### AppBar, Drawer с навигацией и UserButtons
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import HeaderButtons from './HeaderButtons';
import HeaderMenu from './HeaderMenu';

import withStyles from './toolbar';

export class Header extends Component {

  render() {

    const {props} = this;
    const {classes, title, NavDrawer} = this.props;

    return (
      <AppBar position="static" color="default">
        <Toolbar disableGutters >
          <HeaderMenu {...props} classes={classes} open={Boolean(NavDrawer && NavDrawer.open)} />
          <Typography variant="h6" color="textSecondary" className={classes.flex}>{title}</Typography>
          <HeaderButtons {...props} barColor="default"/>
        </Toolbar>
      </AppBar>
    );
  }
}
Header.propTypes = {
  title: PropTypes.string.isRequired, // заголовок AppBar
  items: PropTypes.array.isRequired,   // массив элементов меню
  classes: PropTypes.object.isRequired,   // css
  handleNavigate: PropTypes.func.isRequired,
  handleIfaceState: PropTypes.func.isRequired,
};

export default withStyles(Header);
