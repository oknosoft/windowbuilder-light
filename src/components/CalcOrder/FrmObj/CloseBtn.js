import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function (props) {
  return <IconButton title="Закрыть форму" onClick={props.handleClose}><CloseIcon/></IconButton>;
}
