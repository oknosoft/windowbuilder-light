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

const Text = React.forwardRef((props, ref) => <Textarea  ref={ref} {...props} />);

export default function ClipBoard({execute}) {

  const [open, rawSetOpen] = React.useState(false);
  const setOpen = () => rawSetOpen(true);
  const setClose = () => rawSetOpen(false);
  const ref = React.createRef();
  const onKeyDown = (event) => {
    const {key} = event;
    if(key === 'Backspace' || key === 'Delete') {
      //event.preventDefault();
      //event.stopPropagation();
    }
    if(key === 'Tab') {
      if (!event.shiftKey) {
        event.preventDefault();
        const value = ref.current.value;
        const selectionStart = ref.current.selectionStart;
        const selectionEnd = ref.current.selectionEnd;
        ref.current.value = value.substring(0, selectionStart) + '⟶' + value.substring(selectionEnd);
        ref.current.selectionStart = selectionEnd + 1 - (selectionEnd - selectionStart);
        ref.current.selectionEnd = selectionEnd + 1 - (selectionEnd - selectionStart);
      }
    }
  };
  const onPaste = async (event) => {
    const {clipboardData} = event;
    event.preventDefault();
    try {
      ref.current.value = clipboardData.getData('text/plain').replace(/\t/g, '⟶');
    }
    catch (e) {}
  };
  const onOk = () => {
    execute(ref.current.value.replace(/⟶/g, '\t'));
    setClose();
  }

  return <>
    <Dialog open={open} onClose={setClose} onOk={onOk} maxWidth="lg" title="Загрузить из буфера обмена">
      <Text
        ref={ref}
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
