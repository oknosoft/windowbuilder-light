import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import SettingsIcon from '@mui/icons-material/DisplaySettings';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import {HtmlTooltip} from '../App/styled';
import {AttachmentsDialog} from './Attachments';

const locker = {
  locked: false,
  lock() {
    locker.locked = true;
    setTimeout(locker.unlock, 8000);
  },
  unlock() {
    locker.locked = false;
  }
}

export function MenuExt({setSettingOpen, reload, obj}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => setAnchorEl(null);

  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [attOpen, setAttOpen] = React.useState(false);

  return <HtmlTooltip
    title="Дополнительно..."
    describeChild
    open={tooltipOpen}
    onClose={() => setTooltipOpen(false)}
    onOpen={() => !locker.locked && setTooltipOpen(true)}
  >
    <IconButton onClick={(e) => {
      locker.lock();
      setTooltipOpen(false);
      setAnchorEl(e.currentTarget);
    }}><MoreVertIcon/></IconButton>
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      onClose={handleClose}>

      <MenuItem disabled onClick={() => {
        handleClose();
        setSettingOpen(true);
      }}>
        <ListItemIcon><SettingsIcon/></ListItemIcon>
        Настроить форму
      </MenuItem>

      <MenuItem onClick={() => {
        handleClose();
        reload(true);
      }}>
        <ListItemIcon><RotateLeftIcon/></ListItemIcon>
        Перечитать с сервера
      </MenuItem>

      <MenuItem onClick={() => {
        handleClose();
        setAttOpen(true);
      }}>
        <ListItemIcon><AttachFileIcon/></ListItemIcon>
        Вложения
      </MenuItem>

    </Menu>
    <AttachmentsDialog open={attOpen} setClose={() => setAttOpen(false)} obj={obj}/>
  </HtmlTooltip>

}
