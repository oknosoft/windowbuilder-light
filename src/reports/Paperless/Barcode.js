import React from 'react';
import MUITextField from '@mui/material/TextField';
import {styled} from '@mui/material/styles';
import {barcodeState} from './data';

export const TextField = styled(MUITextField)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  minWidth: 200,
  width: 200,
}));

export default function Barcode({handleIfaceState, setBackdrop}) {

  const [barcode, setBarcode] = React.useState('');

  const {onFocus, onBlur, onPaste} = React.useMemo(() => {
    return {
      onFocus(evt) {
        barcodeState.input = evt.target;
      },

      onBlur() {
        barcodeState.blur(setBarcode);
      },

      onPaste(evt) {
        const str = evt.clipboardData.getData('text/plain');
        str && barcodeState.control(str, handleIfaceState, setBackdrop);
        evt.target.blur();
      },
    };
  }, []);

  React.useEffect(() => {
    const bodyKeyDown = (evt) => barcodeState.keydown(evt, setBarcode, handleIfaceState, setBackdrop);
    document.body.addEventListener('keydown', bodyKeyDown, false);

    return () => {
      document.body.removeEventListener('keydown', bodyKeyDown);
      barcodeState.blur(setBarcode);
    }
  }, []);

  return <TextField
    value={barcode}
    onFocus={onFocus}
    onBlur={onBlur}
    onPaste={onPaste}
    slotProps={{htmlInput: {placeholder: 'Штрихкод', style: {padding: 8}}}}
  />;
}
