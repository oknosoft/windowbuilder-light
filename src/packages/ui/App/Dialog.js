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

export default function DraggableDialog({open, onClose, onOk, title, children, actions}) {

  return <Dialog
    open={open}
    onClose={onClose}
    PaperComponent={PaperComponent}
    aria-labelledby="draggable-dialog-title"
  >
    {title ? <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">{title}</DialogTitle> : null}
    <DialogContent>
      {children}
    </DialogContent>
    <DialogActions>
      {actions || <>
        <Button autoFocus onClick={onClose}>
          Отмена
        </Button>
        <Button onClick={onOk || onClose}>Ок</Button>
      </>}
    </DialogActions>
  </Dialog>;
}
