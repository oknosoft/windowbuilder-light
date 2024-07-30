import React from 'react';
import RefField from 'metadata-ui/DataField/RefField';
import Text from 'metadata-ui/DataField/Text';
import {NumberField} from 'metadata-ui/DataField/Number';
import Checkbox from '@mui/material/Checkbox';

/**
 * @summary Поле-редактор быстрого отбора
 * @desc Получает на вход, строку табчасти selection справочника компоновки
 * @param row
 * @return {JSX.Element}
 */
export default function QuickSelection({row}) {
  const [checked, setChecked] = React.useState(row.use);

  const handleChange = (event) => {
    row.use = event.target.checked;
    setChecked(row.use);
  };
  return <div>
    <Checkbox checked={checked} onChange={handleChange}/>
  </div>;
}
