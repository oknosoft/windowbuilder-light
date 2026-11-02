import React from 'react';
import IconButton from '@mui/material/IconButton';
import CalculateIcon from '@mui/icons-material/Calculate';
import {HtmlTooltip} from '../../aggregate/App/styled';

export function checkContract(obj) {
  if(obj.contract.empty()) {
    return $p.ui.dialogs.alert({
      text: 'Не указан договор с покупателем (возможно, выбрана не та организация)',
      title: obj.presentation,
    });
  }
}

export default function RecalcBtn({obj, setBackdrop}) {

  const recalc = () => {
    const contractEmpty = checkContract(obj);
    if(contractEmpty) {
      return contractEmpty;
    }
    setBackdrop(true);
    obj.recalc()
      .then(() => {
        obj._data.chrows?.clear?.();
        setBackdrop(false);
      })
      .catch((err) => {
        console.error(err);
        setBackdrop(false);
      });
  };

  return <HtmlTooltip title="Пересчитать">
    <IconButton onClick={recalc}><CalculateIcon/></IconButton>
  </HtmlTooltip>;

}
