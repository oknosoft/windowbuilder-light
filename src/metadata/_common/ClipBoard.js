import React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import DialogContentText from '@mui/material/DialogContentText';
import {HtmlTooltip} from '../../components/App/styled';
import Dialog from '../../packages/ui/App/Dialog';

export default function ClipBoard({tabRef, obj}) {

  const [open, rawSetOpen] = React.useState(false);
  const setOpen = () => rawSetOpen(true);
  const setClose = () => rawSetOpen(false);

  return <>
    <Dialog open={open} onClose={setClose} title="Загрузить из буфера обмена">
      <DialogContentText>
        To subscribe to this website, please enter your email address here. We
        will send updates occasionally.
      </DialogContentText>
    </Dialog>
    <HtmlTooltip title="Вставить из буфера обмена">
      <IconButton onClick={setOpen}><ContentPasteGoIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
