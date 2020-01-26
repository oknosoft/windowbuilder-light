/**
 * ### Клавиши  ←→↑↓ в рисовалке
 * Чтобы на мобильном устройстве элементы двигать
 *
 * @module Arrows
 *
 * Created by Evgeniy Malyarov on 26.01.2020.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Fab from '@material-ui/core/Fab';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  left: {
    position: 'absolute',
    bottom: theme.spacing(),
    left: theme.spacing(),
  },
  right: {
    position: 'absolute',
    bottom: theme.spacing(),
    right: theme.spacing(6),
  },
  up: {
    position: 'absolute',
    top: theme.spacing(),
    right: theme.spacing(2),
  },
  down: {
    position: 'absolute',
    bottom: theme.spacing(6),
    right: theme.spacing(2),
  },
  // fabGreen: {
  //   color: theme.palette.common.white,
  //   backgroundColor: green[500],
  //   '&:hover': {
  //     backgroundColor: green[600],
  //   },
  // },
}));

const btns = [['left', ArrowBackIcon], ['right', ArrowForwardIcon], ['up', ArrowUpwardIcon], ['down', ArrowDownwardIcon]];

export default function Arrows({handleClick}) {
  const classes = useStyles();
  return btns.map(([name, Icon]) => <Fab key={name} size="small" className={classes[name]} onClick={handleClick(name)}><Icon/></Fab>);
}

Arrows.propTypes = {
  handleClick: PropTypes.func.isRequired,
};
