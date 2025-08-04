import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import SendIcon from '@mui/icons-material/Send';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import {alert} from '../../aggregate/Toolbars/ObjToolbar';

const {CatAbonents} = $p;

export default function SendBtn ({obj, setBackdrop}) {
  const {posted, branch, obj_delivery_state, is_read_only} = obj;
  if(branch instanceof CatAbonents) {
    return null;
  }
  let icon = <SendIcon />, text = 'Отправить', disabled = false;
  if(posted || obj_delivery_state.is('Подтвержден')) {
    icon = <ThumbUpOffAltIcon />;
    text = 'Согласован';
    disabled = true;
  }
  if(obj_delivery_state.is('Отправлен')) {
    if(is_read_only) {
      icon = <CancelScheduleSendIcon />;
      text = 'Отозвать';
    }
    else {
      icon = <ScheduleSendIcon />;
      text = 'Взять на проверку';
    }
  }
  else if(obj_delivery_state.is('Проверяется')) {
    if(is_read_only) {
      icon = <HourglassBottomIcon />;
      text = 'На проверке';
      disabled = true;
    }
    else {
      icon = <CancelScheduleSendIcon />;
      text = 'Вернуть автору на доработку';
    }
  }

  const execute = () => {
    Promise.resolve().then(() => {
      setBackdrop(true);
      if (obj_delivery_state.is('Отправлен')) {
        return ((obj._modified && is_read_only) ? obj.load().then(() => obj.load_production(true)) : Promise.resolve())
          .then(() => obj.obj_delivery_state = is_read_only ? 'Отозван' : 'Проверяется');
      }
      if (obj_delivery_state.is('Проверяется')) {
        obj.obj_delivery_state = 'Отклонен';
      }
      else {
        obj.set_route();
      }
    })
      .then(() => obj.save())
      .then(() => setBackdrop(false))
      .catch((err) => {
        setBackdrop(false);
        alert(err);
      });
  }

  return <MenuItem disabled={disabled} onClick={execute}>
    <ListItemIcon>{icon}</ListItemIcon>
    <ListItemText>{text}</ListItemText>
  </MenuItem>;
}
