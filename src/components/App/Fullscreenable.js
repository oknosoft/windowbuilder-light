/**
 * Заголовок с кнопками полноэкранного режима
 *
 * @module Fullscreenable
 *
 * Created by Evgeniy Malyarov on 25.09.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
import Fullscreenable from 'react-fullscreenable';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {path} from './menu_items';

const useStyles = makeStyles(({spacing}) => ({
  root: {
    padding: spacing(1),
  },
  space: {
    flex: '1 1 auto',
  },
  flex: {
    display: 'flex',
  }
}));

function Wrapper({title = 'Быстрые окна', isFullscreen, toggleFullscreen, handleNavigate, children, CustomBtn}) {
  const classes = useStyles();

  return <div className={classes.root}>
    <div className={classes.flex}>
      <Typography variant="h6" color="primary" className={classes.space}>{title}</Typography>
      <IconButton
        title="Справка"
        onClick={() => handleNavigate(path('about'))}
        color="inherit"
      >
        <HelpIcon/>
      </IconButton>
      <IconButton
        title={isFullscreen ? 'Свернуть' : 'Развернуть'}
        onClick={toggleFullscreen}
        className={classes.menuButton}
        color="inherit"
      >
        {isFullscreen ? <FullscreenExitIcon/> : <FullscreenIcon/>}
      </IconButton>
      {CustomBtn}
    </div>
    {children}
  </div>;
}

Wrapper.propTypes = {
  title: PropTypes.string,
  isFullscreen: PropTypes.bool,
  toggleFullscreen: PropTypes.func,
  handleNavigate: PropTypes.func,
  CustomBtn: PropTypes.node,
  children: PropTypes.node,
};

export default Fullscreenable()(Wrapper);
