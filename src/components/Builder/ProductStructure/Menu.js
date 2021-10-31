import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

export default function TreeMenu({item, anchorEl, handleClick, handleClose}) {

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem dense onClick={handleClick}>act 1</MenuItem>
      <MenuItem dense onClick={handleClick}>act 2</MenuItem>
    </Menu>
  );
}

TreeMenu.propTypes = {
  item: PropTypes.object.isRequired,
  anchorEl: PropTypes.object,
  handleClick: PropTypes.func,
  handleClose: PropTypes.func,
};
