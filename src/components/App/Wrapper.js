/**
 * Заголовок с кнопками полноэкранного режима
 *
 * @module Fullscreenable
 *
 * Created by Evgeniy Malyarov on 25.09.2019.
 */

import React from 'react';
import PropTypes from 'prop-types';
//import FullscreenIcon from '@material-ui/icons/Fullscreen';
//import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import HelpIcon from '@material-ui/icons/Help';
import IconButton from '@material-ui/core/IconButton';
//import Fullscreenable from 'react-fullscreenable';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {path} from './menu_items';

const useStyles = makeStyles(({spacing}) => ({
  space: {
    flex: '1 1 auto',
    padding: spacing(),
  },
  flex: {
    display: 'flex',
  }
}));

export default function Wrapper({title = 'Быстрые окна', handlers, children, CustomBtn, className}) {

  if($p.wsql.get_user_param('iface_kind') !== 'quick') {
    return children;
  }

  const classes = useStyles();

  return <div>
    <div className={classes.flex}>
      <Typography variant="subtitle2" color="primary" className={classes.space}>{title}</Typography>
      <IconButton
        title="Справка"
        onClick={() => handlers.handleNavigate(path('about'))}
        color="inherit"
      >
        <HelpIcon/>
      </IconButton>
      {CustomBtn}
    </div>
    {className ? <div className={className}>{children}</div> : children}
  </div>;
}

Wrapper.propTypes = {
  title: PropTypes.string,
  handlers: PropTypes.object,
  CustomBtn: PropTypes.node,
  children: PropTypes.node,
};

