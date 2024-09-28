import React from 'react';
import Autocomplete from '@oknosoft/ui/DataField/Autocomplete';

export default function InsetProfileGrp({obj, fld, onChange, fullWidth=true, enterTab, ...other}) {

  const value = obj[0].inset;
  const options = [value];

  return <Autocomplete
    disabled
    options={options}
    onChange={(event, newValue, reason, details) => {
      obj[fld] = newValue;
      onChange?.(newValue);
      //setValue(obj[fld]);
    }}
    value={value}
    label="Материал"
    fullWidth={fullWidth}
    disableClearable
    placeholder="Нет"
    {...other}
  />;
}
