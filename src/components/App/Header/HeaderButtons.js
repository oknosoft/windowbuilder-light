/**
 * ### Кнопки в правом верхнем углу AppBar
 * войти-выйти, имя пользователя, состояние репликации, индикатор оповещений
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';

import CloudQueue from '@material-ui/icons/CloudQueue';
import CloudOff from '@material-ui/icons/CloudOff';

import SyncIcon from '@material-ui/icons/Sync';
import SyncIconDisabled from '@material-ui/icons/SyncDisabled';
import PersonOutline from '@material-ui/icons/PersonOutline';
import AccountOff from './AccountOff';

import Notifications from '../../Notifications/Button';

import classnames from 'classnames';
import withStyles from './toolbar';
import withWidth, {isWidthUp} from '@material-ui/core/withWidth';

function HeaderButtons({
    sync_started, classes, fetch, offline, user, handleNavigate, handleIfaceState, width, compact, barColor, CustomBtn}) {

  const offline_tooltip = offline ? 'Сервер недоступен' : 'Подключение установлено';
  const sync_tooltip = `Синхронизация ${user.logged_in && sync_started ? 'выполняется' : 'отключена'}`;
  const login_tooltip = `${user.name}${user.logged_in ? '\n(подключен к серверу)' : '\n(автономный режим)'}`;
  const base = typeof $p === 'object' ? $p.job_prm.base : '';

  return [

    // показываем допкнопки, если задано в props
    CustomBtn && <CustomBtn key="custom_btn" user={user}/>,

    // индикатор доступности облака показываем только на экране шире 'sm'
    !compact && isWidthUp('sm', width) &&
    <IconButton key="offline" title={offline_tooltip}>
      {offline ? <CloudOff color="inherit"/> : <CloudQueue color="inherit"/>}
    </IconButton>,

    !compact &&
    <IconButton key="sync_started" title={sync_tooltip}>
      {user.logged_in && sync_started ?
        <SyncIcon color="inherit" className={classnames({[classes.rotation]: fetch || user.try_log_in})} />
        :
        <SyncIconDisabled color="inherit"/>
      }
    </IconButton>,

    <IconButton key="logged_in" title={login_tooltip} onClick={() => handleNavigate(`${base || ''}/login`)}>
      {user.logged_in ? <PersonOutline color="inherit"/> : <AccountOff color="inherit"/>}
    </IconButton>,

    <Notifications key="noti"/>

  ];
}

// HeaderButtons.defaultProps = {
//   barColor: 'primary'
// }

HeaderButtons.propTypes = {
  sync_started: PropTypes.bool, // выполняется синхронизация
  fetch: PropTypes.bool,        // обмен данными
  offline: PropTypes.bool,      // сервер недоступен
  user: PropTypes.object,       // пользователь
  handleNavigate: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  compact: PropTypes.bool,      // скрывает кнопки облака
  barColor: PropTypes.string,
  custom_btn: PropTypes.object, // дополнительные кнопки, подключаемые через state
};

export default withStyles(withWidth()(HeaderButtons));
