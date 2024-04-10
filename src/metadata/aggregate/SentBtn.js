import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import {HtmlTooltip} from '../../components/App/styled';


function IconMenu({anchorEl, open, handleClose, post, unpost, posted}) {
  const onClick = posted ?
    () => {
      handleClose();
      unpost();
    } :
    () => {
      handleClose();
      post();
    };
  return <Menu
    anchorEl={anchorEl}
    open={open}
    onClose={handleClose}
  >
    <MenuItem onClick={onClick}>
      <ListItemIcon>
        {posted ? <BookmarkRemoveIcon /> : <BookmarkAddedIcon />}
      </ListItemIcon>
      <ListItemText>{posted ? 'Отменить проведение' : 'Провести'}</ListItemText>
    </MenuItem>
  </Menu>;
}

export default function SentBtn({obj}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const tooltipClose = () => setTooltipOpen(false);


  const [postable, post, unpost, handleOpen, handleClose] = React.useMemo(() => {
    const postable = obj._metadata('posted') !== undefined;
    const post = () => obj.save(true);
    const unpost = () => obj.save(false);
    const handleOpen = (event) => {
      tooltipClose();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);
    return [postable, post, unpost, handleOpen, handleClose];
  }, [obj]);

  if(!postable) {
    return null;
  }

  const {posted} = obj;
  return <HtmlTooltip open={tooltipOpen} title= {posted ? 'Проведён' : 'Не проведён'} disableInteractive leaveDelay={200}>
    <IconButton onClick={handleOpen} onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={tooltipClose}>
      {posted ? <BookmarkAddedIcon/> : <BookmarkBorderIcon/>}
    </IconButton>
    {IconMenu({anchorEl, open, handleClose, post, unpost, posted})}
  </HtmlTooltip>;
}
