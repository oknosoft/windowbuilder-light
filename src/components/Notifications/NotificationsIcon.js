/**
 *
 *
 * @module NotificationsIcon
 *
 * Created by Evgeniy Malyarov on 17.09.2018.
 */

import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsIconActive from '@material-ui/icons/NotificationsActive';
import NotificationsIconNone from '@material-ui/icons/NotificationsNone';
import Badge from '@material-ui/core/Badge';
import {withStyles} from '@material-ui/styles';

const styles = ({palette, spacing}) => ({
  badge: {
    right: -15,
    // The border color match the background color.
    border: `1px solid ${
      palette.type === 'light' ? palette.grey[200] : palette.grey[900]
      }`,
  },
  root: {
    marginRight: spacing(),
  },
  indicator: {
    width: 48,
    bottom: 4,
    height: 2,
    position: 'absolute',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    backgroundColor: palette.text.secondary,// palette.grey[400],
  }
});

function Icon({title, onClick, count, open, classes}) {
  return <IconButton title={title} onClick={onClick} classes={{root: classes.root}}>
    {
      count ?
        <Badge badgeContent={count > 99 ? 99 : count} color="primary" classes={{badge: classes.badge}}>
          <NotificationsIconActive color="error"/>
        </Badge>
        :
        <NotificationsIconNone color="inherit"/>
    }
    {open && <span className={classes.indicator}/>}
  </IconButton>;
}

Icon.propTypes = {
  title: PropTypes.string,
  count: PropTypes.number,
  onClick: PropTypes.func,
};

export default withStyles(styles)(Icon);
