import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

const options = [
  {ref: 'none', name: 'Нет'},
  {ref: 'angle', name: 'Угол'},
  {ref: 'grid', name: 'Сетка'},
];
const find = (ref) => options.find(v => v.ref === ref)

export default function UseSnap({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  const [value, setValue] = React.useState(find(obj[fld]));

  return <Autocomplete
    options={options}
    onChange={(event, newValue, reason, details) => {
      obj[fld] = newValue.ref;
      onChange?.(newValue);
      setValue(find(obj[fld]));
    }}
    value={value}
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    {...other}
  />;
}
