import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog({open, onClose, onOk, title, raw, children, actions, ...other}) {

  return <Dialog
    open={open}
    onClose={onClose}
    PaperComponent={PaperComponent}
    aria-labelledby="draggable-dialog-title"
    {...other}
  >
    {title ? <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">{title}</DialogTitle> : null}
    {raw ? children : null}
    {!raw ? <DialogContent>{children}</DialogContent> : null}
    {!raw ? <DialogActions>
      {actions || <>
        <Button autoFocus onClick={onClose}>Отмена</Button>
        <Button onClick={onOk || onClose}>Ок</Button>
      </>}
    </DialogActions> : null}
  </Dialog>;
}
