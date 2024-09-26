import React from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import {useBackdropContext} from '../../components/App';
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

const {wsql, utils, adapters: {pouch}} = $p;

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

export default function PostBtn({obj}) {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const backdrop = useBackdropContext();
  const open = Boolean(anchorEl);
  const tooltipClose = () => setTooltipOpen(false);


  const [postable, post, unpost, handleOpen, handleClose] = React.useMemo(() => {
    const postable = obj._metadata('posted') !== undefined;
    const onError = (err) => {
      backdrop.setBackdrop(false);
    };
    const onProcessed = (res) => {
      backdrop.setBackdrop(false);
    };
    const post = () => {
      backdrop.setBackdrop(true);
      obj.save(true)
        .then(waitProcessing)
        .then(onProcessed)
        .catch(onError);
    };
    const unpost = () => {
      backdrop.setBackdrop(true);
      obj.save(false)
        .then(waitProcessing)
        .then(onProcessed)
        .catch(onError);
    };
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
