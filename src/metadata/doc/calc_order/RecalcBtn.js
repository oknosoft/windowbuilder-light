import React from 'react';
import IconButton from '@mui/material/IconButton';
import CalculateIcon from '@mui/icons-material/Calculate';
import {HtmlTooltip} from '../../../components/App/styled';

export default function RecalcBtn({obj, setBackdrop}) {

  const recalc = () => {
    if(obj.contract.empty()) {
      $p.ui.dialogs.alert({
        text: 'Не указан договор с покупателем (возможно, выбрана не та организация)',
        title: obj.presentation,
      });
      return;
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
