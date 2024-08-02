import React from 'react';
import {useNavigate} from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import FactoryIcon from '@mui/icons-material/Factory';
import CachedIcon from '@mui/icons-material/Cached';
import {HtmlTooltip} from '../../components/App/styled';


function IconMenu({anchorEl, open, handleClose, post, unpost, toCorrent, posted, isNew, changeTask}) {
  const onClick = posted ?
    () => {
      handleClose();
      unpost();
    } :
    () => {
      handleClose();
      post()
        .then(changeTask)
        .catch(() => null);
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
    <MenuItem onClick={toCorrent}>
      <ListItemIcon><FactoryIcon /></ListItemIcon>
      <ListItemText>Перейти в задание</ListItemText>
    </MenuItem>
    <MenuItem onClick={changeTask} disabled={isNew}>
      <ListItemIcon><CachedIcon /></ListItemIcon>
      <ListItemText>Сменить задание</ListItemText>
    </MenuItem>
  </Menu>;
}

export default function PostBtn({obj, changeTask}) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const open = Boolean(anchorEl);
  const tooltipClose = () => setTooltipOpen(false);


  const [post, unpost, handleOpen, handleClose, toCorrent] = React.useMemo(() => {
    const post = () => {
      if(obj.set.count()) {
        return obj.save(true);
      }
      $p.ui.dialogs.alert({title: 'Проведение задания', text: 'Табчасть планирования - пуста. В проведении задания нет смысла'});
      return Promise.reject();
    };
    const unpost = () => obj.save(false);
    const handleOpen = (event) => {
      tooltipClose();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);
    const toCorrent = () => navigate(`/doc/work_centers_task/${obj?.ref}?return=/rmd&modified=false`);
    return [post, unpost, handleOpen, handleClose, toCorrent];
  }, [obj]);

  const changeAndClose = () => {
    handleClose();
    changeTask();
  };

  const {posted} = obj;
  return <HtmlTooltip open={tooltipOpen} title= {obj.presentation} disableInteractive leaveDelay={200}>
    <IconButton onClick={handleOpen} onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={tooltipClose}>
      {posted ? <BookmarkAddedIcon/> : <BookmarkBorderIcon/>}
    </IconButton>
    {IconMenu({anchorEl, open, handleClose, post, unpost, toCorrent, posted, isNew: obj.is_new(), changeTask: changeAndClose})}
  </HtmlTooltip>;
}
