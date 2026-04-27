import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import {useBackdropContext} from '../App';
import {HtmlTooltip} from '../App/styled';

function IconMenu({anchorEl, open, handleClose, post, unpost, markDeleted, posted, _deleted, menuItems, hideDelete, readOnly}) {
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
    <MenuItem disabled={_deleted || readOnly} onClick={onClick}>
      <ListItemIcon>
        {posted ? <BookmarkRemoveIcon /> : <BookmarkAddedIcon />}
      </ListItemIcon>
      <ListItemText>{posted ? 'Отменить проведение' : 'Провести'}</ListItemText>
    </MenuItem>
    {menuItems}
    {hideDelete ? null : <MenuItem disabled={posted || _deleted || readOnly} onClick={markDeleted}>
      <ListItemIcon>
        <DeleteOutlineIcon />
      </ListItemIcon>
      <ListItemText>Пометить на удаление</ListItemText>
    </MenuItem>}
  </Menu>;
}

const {wsql, utils, ui, adapters: {pouch}} = $p;

async function waitProcessing(doc) {
  const {id} = doc._metadata();
  if(!id) {
    return Promise.resolve();
  }
  const actionKey = 'posted';
  const register = 'areg_dates';
  const _id = `${id}|${doc.ref}|p`;
  let {attempts} = waitProcessing;
  while (attempts > 0) {
    await utils.sleep(1200);
    const res = await waitProcessing.request({_id, _rev: doc._rev, actionKey, register});
    if(res?.error) {
      throw res.error;
    }
    if(res) {
      return res;
    }
    attempts--;
  }
  throw new Error(`Таймаут при ${posted ? 'проведении' : 'отмене проведения'} документа '${doc.presentation}'`);
}
waitProcessing.attempts = 20;
waitProcessing.request = function ({_id, _rev, actionKey, register}) {
  return pouch.remote.log.get(_id)
    .catch((err) => {
      if(err.status !== 404) throw err;
      return {_id, events: []};
    })
    .then((logDoc) => {
      return logDoc.events.find(v => v._rev === _rev && v.hasOwnProperty(actionKey) && v.register === register);
    });
};

export default function PostBtn({obj, menuItems=null, onProcessed, onError, hideDelete, readOnly}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const backdrop = useBackdropContext();
  const open = Boolean(anchorEl);
  const tooltipClose = () => setTooltipOpen(false);


  const [postable, post, unpost, markDeleted, handleOpen, handleClose] = React.useMemo(() => {
    const postable = obj._metadata('posted') !== undefined;
    const handleError = (err) => {
      backdrop.setBackdrop(false);
      onError?.(err);
    };
    const handleOk = (res) => {
      backdrop.setBackdrop(false);
      onProcessed?.(res);
    };
    const post = () => {
      backdrop.setBackdrop(true);
      (obj.beforePost ? obj.beforePost() : Promise.resolve())
        .then(() => obj.save(true))
        .then(waitProcessing)
        .then(handleOk)
        .catch(handleError);
    };
    const unpost = () => {
      backdrop.setBackdrop(true);
      (obj.beforeUnPost ? obj.beforeUnPost() : Promise.resolve())
        .then(() => obj.save(false))
        .then(waitProcessing)
        .then(handleOk)
        .catch(handleError);
    };
    const markDeleted = () => {
      handleClose();
      ui.dialogs.alert({
        title: 'Пометить на удаление',
        text: 'Подтвердите удаление документа',
        timeout: 10000,
      })
        .then((e) => {
          if(!e) {
            backdrop.setBackdrop(true);
            return obj.mark_deleted(true);
          }
        })
        .then(handleOk)
        .catch(handleError);
    };
    const handleOpen = (event) => {
      tooltipClose();
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => setAnchorEl(null);
    return [postable, post, unpost, markDeleted, handleOpen, handleClose];
  }, [obj]);


  if(!postable) {
    return null;
  }

  const {posted, _deleted} = obj;
  const title= posted ? 'Проведён' : (_deleted ? 'Удалён' : 'Не проведён');
  const icon = posted ? <BookmarkAddedIcon/> : (_deleted ? <DeleteOutlineIcon/> : <BookmarkBorderIcon/>);
  return <HtmlTooltip open={tooltipOpen} title={title} disableInteractive leaveDelay={200}>
    <IconButton onClick={handleOpen} onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={tooltipClose}>
      {icon}
    </IconButton>
    {IconMenu({anchorEl, open, handleClose, post, unpost, markDeleted, posted, _deleted, menuItems, hideDelete, readOnly})}
  </HtmlTooltip>;
}
