import React from 'react';
import Autocomplete from './Autocomplete';
import {CellInput} from './StyledInput';
import {getOptions} from './RefField';

export default function RefCell({row, column, options, onRowChange, onClose}) {
  const obj = row instanceof $p.classes.TabularSectionRow ? row : row.row;
  const fld = column.key;
  const meta = obj._metadata(fld);
  if(!options) {
    options = React.useMemo(getOptions(obj, fld, meta), [obj]);
  }
  let [value, setValue] = React.useState(obj[fld]);

  return <Autocomplete
    options={options}
    onChange={(event, newValue, reason, details) => {
      obj[fld] = newValue;
      setValue(obj[fld]);
    }}
    value={value}
    disableClearable={Boolean(meta.mandatory)}
    renderInput={(params) => <CellInput {...params} fullWidth/>}
  />;
}
