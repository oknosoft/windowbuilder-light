import React from 'react';
import IconButton from '@mui/material/IconButton';
import ContentPasteGoIcon from '@mui/icons-material/ContentPasteGo';
import {styled} from '@mui/material/styles';
import {HtmlTooltip} from '../../components/App/styled';
import Dialog from 'metadata-ui/App/Dialog';

const Textarea = styled('textarea')(() => ({
  fontFamily: 'monospace',
  width: 500,
  height: 400,
}));

export default function ClipBoard({execute}) {

  const [open, rawSetOpen] = React.useState(false);
  const setOpen = () => rawSetOpen(true);
  const setClose = () => rawSetOpen(false);
  const textRef = React.createRef();
  const onKeyDown = (event) => {
    const {key} = event;
    if(key === 'Backspace' || key === 'Delete') {
      //event.preventDefault();
      //event.stopPropagation();
    }
    if(key === 'Tab') {
      if (!event.shiftKey) {
        event.preventDefault();
        const value = textRef.current.value;
        const selectionStart = textRef.current.selectionStart;
        const selectionEnd = textRef.current.selectionEnd;
        textRef.current.value = value.substring(0, selectionStart) + '⟶' + value.substring(selectionEnd);
        textRef.current.selectionStart = selectionEnd + 1 - (selectionEnd - selectionStart);
        textRef.current.selectionEnd = selectionEnd + 1 - (selectionEnd - selectionStart);
      }
    }
  };
  const onPaste = async (event) => {
    const {clipboardData} = event;
    event.preventDefault();
    try {
      textRef.current.value = clipboardData.getData('text/plain').replace(/\t/g, '⟶');
    }
    catch (e) {}
  };
  const onOk = () => {
    execute(textRef.current.value.replace(/⟶/g, '\t'));
    setClose();
  }

  return <>
    <Dialog open={open} onClose={setClose} onOk={onOk} maxWidth="lg" title="Загрузить из буфера обмена">
      <Textarea
        ref={textRef}
        placeholder="Вставьте содержимое буфера обмена или введите текст..."
        onPaste={onPaste}
        onKeyDown={onKeyDown}
      />
    </Dialog>
    <HtmlTooltip title="Вставить из буфера обмена">
      <IconButton onClick={setOpen}><ContentPasteGoIcon/></IconButton>
    </HtmlTooltip>
  </>;
}
